const {AbstractController} = require("node-moleculer-web");
const ejs = require('ejs');
const fs = require('node:fs');

const detectorVersion = require("node-device-detector/package.json").version;

const TEMPLATES = {
	device: fs.readFileSync(__dirname + '/../views/device.ejs', {encoding: 'utf-8'}),
	ip: fs.readFileSync(__dirname + '/../views/ip.ejs', {encoding: 'utf-8'}),
};


class ContainerController extends AbstractController {

	async device() {
		this.initRequest();
		this.setClientHintsHeaders()

		const headers = [];
		for (let headerName in this.requestData.headers) {
			let value = this.requestData.headers[headerName];
			if (
				headerName.indexOf("sec-ch-") !== -1 ||
				headerName.indexOf("x-requested-with") !== -1
			) {
				headers.push(headerName + ":" + value);
			}
		}

		const data = { version: detectorVersion, headers: headers.join('\n') };

		return this.render({template: ejs.render(TEMPLATES.device, data)})
	}

	async ip() {
		this.initRequest();

		return this.render({
			template: ejs.render(TEMPLATES.ip, {}),
			// params: {},
		})
	}

}

module.exports = ContainerController;