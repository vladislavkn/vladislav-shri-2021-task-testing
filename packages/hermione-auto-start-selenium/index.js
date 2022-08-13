const { spawn } = require("child_process");
const fs = require("fs/promises");
const { startPolling, ping } = require("ping-server");

const formatMs = (ms) => (ms / 1000).toFixed(2);
const log = (text) => console.log(`[auto-start-selenium]: ${text}`);

module.exports = (hermione, opts) => {
  const pingUrl = "http://localhost:4444/wd/hub/status";
  const { pollInterval = 500, maxTime = 5000 } = opts;

  const stopSeleniumServer = () => {
    opts.seleniumSubprocess.kill();
    opts.logsFile.close();
  };

  hermione.on(hermione.events.RUNNER_START, async () => {
    if (await ping(pingUrl)) {
      console.log("Selenium server is already running");
      return;
    }

    log("Starting selenium server...");
    log(
      `Wait ${formatMs(maxTime)}s for a Selenium server to listen at ${pingUrl}`
    );
    log("Logs: ./selenium.log");
    opts.logsFile = await fs.open("selenium.log", "w");
    opts.seleniumSubprocess = spawn("selenium-standalone", ["start"], {
      stdio: ["ignore", opts.logsFile, opts.logsFile],
    });

    opts.seleniumSubprocess.on("error", (e) => {
      log(`Selenium server stopped with error: ${e}`);
      stopSeleniumServer();
      process.exit(1);
    });

    try {
      const serverSetupTime = await startPolling({
        pingUrl,
        pollInterval,
        maxTime,
      });
      log(`Selenium server set up in ${formatMs(serverSetupTime)} seconds`);
    } catch (e) {
      if (e) console.log(e);
      log(`Selenium server did not start in ${formatMs(maxTime)} seconds.`);
      stopSeleniumServer();
      process.exit(1);
    }
  });

  hermione.on(hermione.events.RUNNER_END, () => {
    if (opts.seleniumSubprocess) {
      return new Promise((resolve) => {
        opts.seleniumSubprocess.on("exit", resolve);
        stopSeleniumServer();
      });
    }
  });
};
