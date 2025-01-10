const {Service} = require("moleculer");

const axios = require('axios');
const fs = require('node:fs')
const readline = require('node:readline')
const {Address4} = require('ip-address');
const {EnumVPN} = require('../consts/vpns')

const SPAM_BOT_URL = 'https://raw.githubusercontent.com/stamparm/ipsum/refs/heads/master/ipsum.txt';
const VPN_URL = 'https://raw.githubusercontent.com/X4BNet/lists_vpn/refs/heads/main/output/vpn/ipv4.txt';
const DATACENTER_URL = 'https://raw.githubusercontent.com/X4BNet/lists_vpn/refs/heads/main/output/datacenter/ipv4.txt';
const GOOGLEBOT_URL = 'https://developers.google.com/search/apis/ipranges/googlebot.json';
const GOOGLEBOT_CRAWLER_URL = 'https://developers.google.com/search/apis/ipranges/special-crawlers.json';
const AMAZON_URL = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
const VPN_NAME_URL = 'https://raw.githubusercontent.com/az0/vpn_ip/refs/heads/main/data/output/ip.txt';

const COLLECTION_PATH = __dirname + '/database/';

const TMP_FILE_SPAM_BOT = COLLECTION_PATH + 'tmp-spambot-iplist.txt';
const TMP_FILE_DATACENTER = COLLECTION_PATH + 'tmp-datacenter-iplist.txt';
const TMP_FILE_VPN = COLLECTION_PATH + 'tmp-vpn-iplist.txt';
const TMP_FILE_VPN_NAME = COLLECTION_PATH + 'tmp-vpn-name-iplist.txt';

const FILE_LAST_UPDATE = COLLECTION_PATH + 'lastupdate-vpn.json';

const FILE_VPN = COLLECTION_PATH + 'vpn_collection.json';
const FILE_SPAM_BOT = COLLECTION_PATH + 'spambot_collection.json';


const createStreamLine = (file) => {
	const fileStream = fs.createReadStream(file);
	return readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});
}

const getVpnName = (line) => {
	const vpnPatterns = {
		'protonvpn|proton.me': EnumVPN.PROTONVPN,
		'nordvpn': EnumVPN.NORDVPN,
		'1clickvpn': EnumVPN.ONECLICKVPN,
		'hola|holax': EnumVPN.HOLAVPN,
		'windscribe|whiskergalaxy': EnumVPN.WINDSCRIBE,
		'\\.ninja':  EnumVPN.NINJA,
		'telleport': EnumVPN.TELLEPORT,
		'setupvpn': EnumVPN.SETUPVPN,
		'protect-my-ip|my-safe-net': EnumVPN.HIDEMYIP
	};

	for (const [pattern, id] of Object.entries(vpnPatterns)) {
		if (new RegExp(pattern).test(line)) {
			return id;
		}
	}
	return '1';
};

const grabRangeNameList = async (file) => {
	const rl = createStreamLine(file);
	const data = {};
	for await (const line of rl) {
		if (line !== '' && !line.includes('1.2.3.4')) {
			const ip = line.split(' ', 1);
			const name = getVpnName(line);
			if (data[name] === void 0) {
				data[name] = [];
			}
			data[name].push(ip[0] + '-' + ip[0]);
		}
	}
	rl.close();
	return data;
}

const generateRange = (list) => {
	const data = [];
	for(let line of list){
		const ip = new Address4(line);
		const start = ip.startAddress().address;
		const end = ip.endAddress().address;
		data.push(start + '-' + end);
	}
	return data;
};

const grabRangeList = async (file) => {
	const rl = createStreamLine(file);
	const data = [];
	for await (const line of rl) {
		if (line !== '') {
			data.push(line);
		}
	}
	rl.close();
	return generateRange(data);
}

const IP_SEPARATOR = '\n';

class UpdateDatabaseService extends Service {

	stageProcessUpdate = false;

	constructor(broker) {
		super(broker);
		this.parseServiceSchema({
			name: 'update-database',
			created: this.createdService,
			events: {
				async updateIp() {
					this.processUpdate();
				},
			},
		});
	}

	createdService() {

	}

	async processUpdate() {
		if (this.stageProcessUpdate) {
			return;
		}
		this.stageProcessUpdate = true;
		if (this.#readStageUpdate()) {
			await this.#downloads();
			await this.#writeStageUpdate();
		}
		this.stageProcessUpdate = false;
	}

	async #downloads() {
		this.broker.logger.info('database download started')
		const opts = {responseType: 'blob'};
		const promises = [
			axios.get(SPAM_BOT_URL, opts).then((res) => fs.writeFileSync(TMP_FILE_SPAM_BOT, res.data)),
			axios.get(VPN_URL, opts).then((res) => fs.writeFileSync(TMP_FILE_VPN, res.data)),
			axios.get(DATACENTER_URL, opts).then((res) => fs.writeFileSync(TMP_FILE_DATACENTER, res.data)),
			axios.get(VPN_NAME_URL, opts).then((res) => fs.writeFileSync(TMP_FILE_VPN_NAME, res.data)),
		];
		await Promise.all(promises);
		this.broker.logger.info('database download completed')
	}

	async #prepareSpanIpList() {
		this.broker.logger.info('prepare/save vpn list started');
		const rl = createStreamLine(TMP_FILE_SPAM_BOT);
		const data = {};
		for await (const line of rl) {
			if (/^#/.test(line)) {
				continue;
			}
			const ipData = line.split('\t').filter(val => val !== '');
			if (ipData.length === 2) {
				const ip = ipData[0];
				const risk = ipData[1];
				if (data[risk] === void 0) {
					data[risk] = [];
				}
				data[risk].push(ip + '-' + ip);
			}
		}

		for (let risk in data) {
			data[risk] = data[risk].join(IP_SEPARATOR);
		}
		rl.close();
		fs.writeFileSync( FILE_SPAM_BOT, JSON.stringify(data));
		console.log('prepare/save spambot list complete');
	}

	async #prepareVpnIpList() {
		this.broker.logger.info('prepare/save vpn list started');
		const vpn = await grabRangeList(TMP_FILE_VPN);
		const datacenter = await grabRangeList(TMP_FILE_DATACENTER);

		const vpnName = await grabRangeNameList(TMP_FILE_VPN_NAME)
		if (vpnName['1'] && vpnName['1'].length) {
			vpn.concat(vpnName['1'])
		}

		const data = {
			"0": datacenter.join(IP_SEPARATOR),  // hosing and datacenter
			"1": vpn.join(IP_SEPARATOR),         // all vpn unknown name
		};

		for(let id in vpnName) {
			if (id === '1') {
				continue;
			}
			data[id] = [].concat(vpnName[id]).join(IP_SEPARATOR);
		}
		fs.writeFileSync(FILE_VPN, JSON.stringify(data));
		this.broker.logger.info('prepare/save vpn list complete');
	}


	#readStageUpdate() {
		if (!fs.existsSync(FILE_LAST_UPDATE)) {
			return true;
		}
		const currentDate = new Date();
		const stageUpdateData = JSON.parse(fs.readFileSync(FILE_LAST_UPDATE, {encoding: 'utf8'}));
		const lastUpdateDate = new Date(stageUpdateData.lastUpdate);
		return currentDate.getDay() !== lastUpdateDate.getDay();
	}

	#writeStageUpdate() {
		const data = { lastUpdate: (new Date()).toISOString()};
		fs.writeFileSync(FILE_LAST_UPDATE, JSON.stringify(data));
	}

}

module.exports = UpdateDatabaseService;