
const ID = {
	DATACENTER: '0',
	VPN: '1',
	PROTONVPN: '2',
	NORDVPN: '3',
	ONECLICKVPN: '4',
	HOLAVPN: '5',
	WINDSCRIBE: '6',
	NINJA: '7',
	TELLEPORT: '8',
	SETUPVPN: '9',
	HIDEMYIP: '10'
};

let EnumVPN;
(function (EnumVPN) {
	for (const id in ID) {
		EnumVPN[(EnumVPN[id] = ID[id])] = id;
	}
})(EnumVPN || (EnumVPN = {}));

module.exports = {EnumVPN, ID};