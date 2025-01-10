const {AbstractController} = require('node-moleculer-web')


/**
 *
 */
class DetectController extends AbstractController {

	/**
	 * detect device information
	 * @ajax
	 * @return {Promise<string>}
	 */
	async device() {
		this.initRequest();

		let jsonData = JSON.parse(await this.readBody())
		let headers = 	jsonData.headers;
		let customHeaders = {};

    if (headers && headers.indexOf('{') !== -1) {
      try  {
        customHeaders = JSON.parse(headers)
      } catch (e) {
        console.error(e)
      }
    } else {
      headers.split("\n").forEach((item) => {
        let partStr = item.split(":", 2);
        customHeaders[partStr[0]] = partStr[1];
      });
    }

		const deviceData = await this.broker.call('device-detector.detect', {
			useragent: jsonData.useragent,
			headers: customHeaders,
			meta: jsonData.meta ?? {},
			aboutDevice: jsonData.aboutDevice ?? false,
			enableIndex: jsonData.enableIndex ?? false,
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