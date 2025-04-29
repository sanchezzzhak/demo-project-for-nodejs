const { UwsServer } = require("node-moleculer-web");
const { Service } = require("moleculer");
const path = require("node:path");

const DetectController = require('../controllers/detect')
const ContainerController = require('../controllers/container')


/**
 * @method getServerUws()
 */
class AppService extends Service {
  constructor(broker) {
    super(broker);
    this.parseServiceSchema({
      name: "app",
      settings: {
        port: process.env.APP_PORT,
        ip: process.env.APP_IP,
        portSchema: process.env.APP_PORT_SCHEMA,
        publicDir: path.resolve(__dirname + "/../public"),
        publicIndex: 'index.html',
        controllers: {},
      },
      mixins: [UwsServer],
      created: this.createdService,
      stopped: this.stoppedService,
    });
  }

  initControllers() {
    this.settings.controllers = {
      detect: DetectController,
      container: ContainerController,
    };
  }

  initRouters() {

    this.createRoute('get /api/ip-update #s:update-database.update')
    this.createRoute('get /api/ip-stage #s:update-database.stage')

    this.createRoute('get /api/container/device #c:container.device')
    this.createRoute('get /api/container/ip #c:container.ip')

    this.createRoute('post /api/device #c:detect.device')
    this.createRoute('post /api/ip #c:detect.ip')

    this.bindRoutes();
  }

  createdService() {
    this.initControllers();
    this.initRouters();

    this.logger.info(
      "Server started",
      [this.settings.ip, this.settings.port].join(":")
    );
  }
}

module.exports = AppService;
