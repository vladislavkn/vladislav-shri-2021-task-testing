const { spawn } = require("child_process");
const path = require("path");
const createWaiter = require("./createWaiter");
const { startPolling, ping } = require("ping-server");
const fs = require("fs/promises");
const { existsSync } = require("fs");

const formatMs = (ms) => (ms / 1000).toFixed(2);
const log = (text) => console.log(`[auto-start-project]: ${text}`);

module.exports = (hermione, opts) => {
  const {
    startCommand = "npm run start",
    buildCommand = "npm run build",
    buildFolder = path.join(".", "dist"),
    port = 3000,
    path: webPath = "",
    maxTime = 10000,
    pollInterval = 500,
  } = opts;

  const devServerUrl = `http://localhost:${port}${webPath}`;

  const stopDevServer = () => {
    if (opts.startSubprocess) opts.startSubprocess.kill();
    if (opts.startLogsFile) opts.startLogsFile.close();
  };

  hermione.on(hermione.events.RUNNER_START, async () => {
    if (await ping(devServerUrl)) {
      log("Dev server is already running");
      return;
    }

    if (!existsSync(buildFolder)) {
      const startTime = Date.now();
      log(`Build folder does not exists. Running "${buildCommand}"...`);
      log("Builds log file: ./dev.build.log");

      opts.buildLogsFile = await fs.open("dev.build.log", "w");
      const [executor, ...args] = buildCommand.split(" ");
      opts.buildSubproccess = spawn(executor, args, {
        stdio: ["ignore", opts.buildLogsFile, opts.buildLogsFile],
      });

      const { waiter, resolve } = createWaiter();
      opts.buildSubproccess.on("exit", resolve);
      await waiter;
      opts.buildLogsFile.close();
      log(`Build proccess finished in ${formatMs(Date.now() - startTime)}`);
    }

    log("Starting dev server...");
    log(
      `Wait ${formatMs(maxTime)}s for a dev server to listen at ${devServerUrl}`
    );
    log("Dev server log file: ./dev.start.log");
    opts.startLogsFile = await fs.open("dev.start.log", "w");
    const [executor, ...args] = startCommand.split(" ");
    opts.startSubprocess = spawn(executor, [...args, `PORT=${port}`], {
      stdio: ["ignore", opts.startLogsFile, opts.startLogsFile],
    });

    opts.startSubprocess.on("error", (e) => {
      log(`Dev server stopped with error: ${e}`);
      stopDevServer();
      process.exit(1);
    });

    try {
      const serverSetupTime = await startPolling({
        pingUrl: devServerUrl,
        pollInterval,
        maxTime,
      });
      log(`Dev server set up in ${formatMs(serverSetupTime)} seconds`);
    } catch (e) {
      if (e) console.log(e);
      log(`Dev server did not start in ${formatMs(maxTime)} seconds.`);
      stopDevServer();
      process.exit(1);
    }
  });

  hermione.on(hermione.events.RUNNER_END, () => {
    if (opts.startSubprocess) {
      return new Promise((resolve) => {
        opts.startSubprocess.on("exit", resolve);
        stopDevServer();
      });
    }
  });
};
