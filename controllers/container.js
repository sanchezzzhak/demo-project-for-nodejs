const {AbstractController} = require("node-moleculer-web");
const ejs = require('ejs');
const fs = require('node:fs');

const TEMPLATES = {
	device: fs.readFileSync(__dirname + '/../views/device.ejs', {encoding: 'utf-8'}),
	ip: fs.readFileSync(__dirname + '/../views/ip.ejs', {encoding: 'utf-8'}),
};


class ContainerController extends AbstractController {

	async device() {
		this.initRequest();

		return this.render({
			template: ejs.render(TEMPLATES.device, {}),
			// params: {},
		})
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