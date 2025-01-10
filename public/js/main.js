(async function (doc){
	const {button, div, pre} = van.tags

	let parserDom;
	/**
	 * @param html
	 * @return {HTMLElement}
	 */
	const html = (html) => {
		if (!parserDom) {
			parserDom = new DOMParser();
		}
		return parserDom.parseFromString(html, 'text/html').body;
	}

	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))


	const randmoUserAgentList = [
		'Mozilla/5.0 (Linux; Android 8.1.0; ZC553KL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36 OPR/57.1.2830.52643',
		'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/605.1 NAVER(inapp; search; 700; 10.20.0; 11PROMAX)',
		'Mozilla/5.0 (Linux; Android 6.0.1; 1509-A00 Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.145 Mobile Safari/537.36',
		'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36 Google Favicon',
		'Mozilla/5.0 (Linux; Android 5.0.2; LG-D405 Build/LRX22G.A1454843669; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/59.0.3071.125 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/137.0.0.24.91;]',
		'Mozilla/5.0 (Linux; Android 5.1.1; D2403 Build/18.6.A.0.182; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/65.0.3325.109 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/168.0.0.40.90;]',
		'Mozilla/5.0 (Linux; Android 5.0.2; SM-A5000 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
		'Dalvik/2.1.0 (Linux; U; Android 8.0.0; W_C800 Build/OPR1.170623.032)',
		'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92 [FBAN/FBIOS;FBAV/155.0.0.36.93;FBBV/87992437;FBDV/iPhone9,3;FBMD/iPhone;FBSN/iOS;FBSV/10.2;FBSS/2;FBCR/NOS;FBID/phone;FBLC/pt_PT;FBOP/5;FBRV/89016292]',
		'Mozilla/5.0 (Linux; Android 7.1.1; VFD 710 Build/NMF26F; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/63.0.3239.111 Mobile Safari/537.36 [FB_IAB/Orca-Android;FBAV/148.0.0.20.381;]',
		'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)',
		'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0; KTXN B658934647A118780T1297416P1) like Gecko',
		'Mozilla/5.0 (Linux; Android 7.0; SM-G950F Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.29 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 6.0; Venus_R7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 10; V1936AL Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 10; V1986A Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.96 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; U; Android 4.0.3; pl-pl; LG-P880 Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
		'Mozilla/5.0 (Linux; Android 10; Core-X4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 9; SM-A105FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.50 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 7.1.2; Redmi 4X Build/N2G47H; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Mobile Safari/537.36 FS/60',
		'Mozilla/5.0 (Linux; Android 7.0; XT1580) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 5.1.1; SM-J111M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 6.0; FRD-L19) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; arm_64; Android 8.0.0; SM-A520F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 YaApp_Android/21.81.1 YaSearchBrowser/21.81.1 BroPP/1.0 SA/3 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 10; S88Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 7.0; ADMIRE_SENSE+) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36',
	];


	/**
	 * load container and bind events
	 * @return {Promise<void>}
	 */
	const initContainerDevice = async () => {
		const DEVICE_CONTAINER = '#content-device';
		const URL = '/api/container/device'
		const container = doc.querySelector(DEVICE_CONTAINER);
		container.innerHTML = 'loading ...'
		const response = await axios({method: 'get', url: URL, responseType: 'text'})
		container.innerHTML = '';
		van.add(container, html(response.data))

		let $random = doc.querySelector("#random-ua");
		let $currentUa = doc.querySelector('#current-ua');
		let $btnDetect = doc.querySelector("#detect");
		let $swithAboutDevice = doc.querySelector('#about-device');
		let $swithIndexDevice = doc.querySelector('#index-device');
		let $input = doc.querySelector("#useragent-input");
		let $timebot = doc.querySelector("#time-bot-result");
		let $timedevice = doc.querySelector("#time-device-result");
		let $cleanHeaders = doc.querySelector('#clean-headers');
		let $requestHeaders = doc.querySelector('#request-headers');
		let $headers = doc.querySelector('#headers-input');

		let useragent = navigator.userAgent;
		let useragentHash = decodeURIComponent(window.location.hash.substr(1));
		if (useragentHash.trim() !== ''){
			useragent = useragentHash;
			$headers.value = '';
		}
		$input.value = useragent;


		const renderDetect = async () => {
			let useragent = $input.value;
			let headers = $input.value;
			let aboutDevice = $swithAboutDevice.checked
			let enableIndex = $swithIndexDevice.checked;
			window.location.hash = useragent;

			const response = await axios({
				method: 'post',
				url: "/api/device",
				responseType: 'json',
				data: JSON.stringify({
					useragent,
					aboutDevice,
					enableIndex,
					headers
				})
			})
			const jsonData = response.data;

			$timebot.innerHTML = jsonData.botTime;
			$timedevice.innerHTML = jsonData.deviceTime;

			console.log(jsonData);

			new JsonViewer({
				theme: 'dark',
				value: {
					useragent: jsonData.useragent,
					bot: jsonData.bot,
					device: jsonData.device,
					deviceInfo: jsonData.deviceInfo,
					deviceHelper: jsonData.deviceHelper,
				}
			}).render("#output")


		};

		$btnDetect.addEventListener("click", (e) => {
			e.preventDefault();
			renderDetect();
		});

		$input.addEventListener("change", (e) => {
			renderDetect();
		});

		$random.addEventListener('click', (e) => {
			e.preventDefault();
			$input.value = randmoUserAgentList[Math.floor(Math.random() * randmoUserAgentList.length)];
		});

		$cleanHeaders.addEventListener('click', (e) => {
			e.preventDefault();
			$headers.value = '';
		});

		$requestHeaders.addEventListener('click', (e) => {
			e.preventDefault();
			$headers.value = '';
			if (navigator.userAgentData) {
				const requestHints = [
					'brands',
					'mobile',
					'platform',
					'platformVersion',
					'architecture',
					'bitness',
					'wow64',
					'model',
					'uaFullVersion',
					'fullVersionList'];

				navigator.userAgentData.getHighEntropyValues(requestHints).then((result) => {
					$headers.value = JSON.stringify(result);
				})
			}
		});

		$currentUa.addEventListener('click', (e) => {
			e.preventDefault();
			$input.value = window.navigator.userAgent;
		});

	};

	/**
	 * load container and bind events
	 * @return {Promise<void>}
	 */
	const  initContainerIp = async () => {
		const IP_CONTAINER = '#content-ip';
		const URL = '/api/container/ip'
		const container = doc.querySelector(IP_CONTAINER);
		container.innerHTML = 'loading ...'
		const response = await axios({method: 'get', url: URL, responseType: 'text'})
		container.innerHTML = '';
		van.add(container, html(response.data))
	};

	/**
	 * run all promise initialisations
	 */
	await Promise.all([
		initContainerDevice(),
		initContainerIp(),
	])


})(document)