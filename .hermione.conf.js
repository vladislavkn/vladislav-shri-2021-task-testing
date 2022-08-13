const path = require("path");
const PORT = Number(process.env.PORT) || 3000;

module.exports = {
  baseUrl: `http://localhost:${PORT}/hw/store`,
  sets: {
    all: {
      files: "test/hermione",
    },
  },
  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: "chrome",
      },
    },
  },
  plugins: {
    "hermione-auto-start-project": {
      startCommand: "npm run start",
      buildCommand: "npm run build",
      buildFolder: path.join(".", "dist"),
      port: PORT,
      path: "/hw/store",
      maxTime: 20000,
      pollInterval: 500,
    },
    "hermione-auto-start-selenium": {
      maxTime: 10000,
      pollInterval: 1000,
    },
  },
};
