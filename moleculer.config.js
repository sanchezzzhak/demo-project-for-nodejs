require("dotenv").config({ override: true });

module.exports = {
  nodeID: "DEMO",
  transporter: "TCP",
  registry: {
    strategy: "RoundRobin",
    preferLocal: true,
  },
  logger: console,
  metrics: {
    enabled: false,
    reporter: ["Console"],
  },
};
