const { Service } = require('moleculer');

const DeviceDetector = require('node-device-detector');
const ClientHints = require('node-device-detector/client-hints');
const DeviceHelper = require('node-device-detector/helper');

class DeviceDetectorService extends Service {
  /** @type DeviceDetector */
  detector;
  /** @type ClientHints */
  clientHints;

  constructor(broker) {
    super(broker);
    this.parseServiceSchema({
      name: 'device-detector',
      created: this.createdService,
      actions: {
        async detect(cxt) {
          const {useragent, headers, meta, index, info, alias, trusted} = cxt.params;
          return this.parse(useragent, headers, meta, index, info, alias, trusted);
        },
      },
    });
  }

  createdService() {
    this.detector = new DeviceDetector({
      deviceIndexes: true,
      clientIndexes: true,
    });
    this.clientHints = new ClientHints();
  }


  parse(useragent, headers, meta, index, info, alias, trusted) {
    this.detector.deviceIndexes = Boolean(index);
    this.detector.clientIndexes = Boolean(index);
    this.detector.deviceAliasCode = Boolean(alias);
    this.detector.deviceTrusted = Boolean(trusted);

    let time0 = new Date().getTime();

    const hints = this.clientHints.parse(headers, meta);
    const result = this.detector.detect(useragent, hints);
    let time1 = new Date().getTime();
    let botResult = this.detector.parseBot(useragent);
    let time2 = new Date().getTime();

    let deviceInfo = null;
    if (info && result.device) {
      deviceInfo = this.detector.getParseInfoDevice().info(result.device.brand, result.device.model);
    }
    let isDesktop = DeviceHelper.isDesktop(result);
    if (!isDesktop && result.device && result.device.type === '') {
      isDesktop = true;
    }

    return {
      useragent,
      deviceTime: time1 - time0 + " ms.",
      device: result,
      bot: botResult,
      botTime: time2 - time1 + " ms.",
      deviceInfo: deviceInfo,
      deviceHelper: {
        /* check device type feature phone (push-button telephones) */
        isFeaturePhone: DeviceHelper.isFeaturePhone(result),
        /* check device type smartphone  */
        isSmartphone: DeviceHelper.isSmartphone(result),
        /* check device type phablet  */
        isPhablet: DeviceHelper.isPhablet(result),
        /* check device type boxes, blu-ray players */
        isPortableMediaPlayer: DeviceHelper.isPortableMediaPlayer(result),
        /* check device type watches, headsets */
        isWearable: DeviceHelper.isWearable(result),
        /* check device type (feature phone, smartphone or phablet) */
        isGlobalMobile: DeviceHelper.isMobile(result),
        /* check device type is tablet  */
        isTablet: DeviceHelper.isTablet(result),
        /* check device type car (side panel in car)  */
        isCar: DeviceHelper.isCar(result),
        /* check device type only screen panel or laptop */
        isSmartDisplay: DeviceHelper.isSmartDisplay(result),
        /* portable terminal, portable projector */
        isPeripheral: DeviceHelper.isPeripheral(result),
        /* check device type is desktop */
        isDesktop: isDesktop,
        /* check device type portable camera */
        isCamera: DeviceHelper.isCamera(result),
        /* check device type SmartTV/TV box */
        isTv: DeviceHelper.isTv(result),
        /* check device type smart speaker (Alisa, Alexa, HomePod etc) */
        isSmartSpeaker: DeviceHelper.isSmartSpeaker(result),
        /* check device type game console (xBox, PlayStation, Nintendo etc)  */
        isConsole: DeviceHelper.isConsole(result),
        isAndroid: DeviceHelper.isAndroid(result),
        isMobile: DeviceHelper.isMobile(result),
        isIOS: DeviceHelper.isIOS(result),
      },
    };
  }
}

module.exports = DeviceDetectorService;
