const {AbstractController} = require('node-moleculer-web')

class DetectController extends AbstractController {

	#parseHeaders(headers) {
		// is headers json from js
		if (headers && headers.indexOf('{') !== -1) {
			try  {
				return JSON.parse(headers)
			} catch (e) {
				console.error(e)
				return {};
			}
		}
		// is header json client-hints string
		let customHeaders = {};
		headers.split("\n").forEach((item) => {
			let partStr = item.split(":", 2);
			customHeaders[partStr[0]] = partStr[1];
		});
		return customHeaders;
	}

	/**
	 * detect device information
	 * @ajax
	 * @return {Promise<string>}
	 */
	async device() {
		this.initRequest();
		const jsonData = JSON.parse(await this.readBody())

		const deviceData = await this.broker.call('device-detector.detect', {
			useragent: jsonData.useragent,
			headers: this.#parseHeaders(jsonData.headers),
			meta: jsonData.meta ?JSON.parse(jsonData.meta) : {},
			info: jsonData.aboutDevice ?? false,
			alias: jsonData.enableAlias ?? false,
			trusted: jsonData.enableTrusted ?? false,
		})

		return this.asJson(deviceData, 200);
	}



	/**
	 * detect ip information
	 * @ajax
	 * @return {Promise<string>}
	 */
	async ip() {
		this.initRequest();

		const jsonData = JSON.parse(await this.readBody());
		const ip = jsonData.ip ?? this.requestData.ip;
		const ipData = await this.broker.call('ip-detector.detect', {ip});

		return this.asJson({ip, ipData}, 200);
	}

	/**
	 * get me current ip and headers
	 * @ajax
	 * @return {Promise<string>}
	 */
	async info() {
		this.initRequest();
		const ip = this.requestData.ip;
		const headers = this.requestData.headers;
		return this.asJson({ip, headers}, 200);
	}


}

module.exports = DetectController;