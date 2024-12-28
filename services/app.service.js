const { UwsServer } = require("node-moleculer-web");
const { Service } = require("moleculer");
const path = require("node:path");
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
        controllers: {},
      },
      mixins: [UwsServer],
      created: this.createdService,
      stopped: this.stoppedService,
    });
  }

  initControllers() {
    this.settings.controllers = {};
  }

  initRouters() {
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
