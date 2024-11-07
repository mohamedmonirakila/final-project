const { exec, spawn } = require("child_process");
const path = require("path");

function startPostgres(callback) {
  exec(
    `"C:\\Program Files\\PostgreSQL\\15\\bin\\pg_ctl" -D "C:\\Program Files\\PostgreSQL\\15\\data" status`,
    (err, stdout, stderr) => {
      if (stdout.includes("running")) {
        console.log("PostgreSQL is already running.");
        return callback(); // Proceed if already running
      }

      exec(
        `"C:\\Program Files\\PostgreSQL\\15\\bin\\pg_ctl" -D "C:\\Program Files\\PostgreSQL\\15\\data" start`,
        (err, stdout, stderr) => {
          if (err) {
            console.error("Failed to start PostgreSQL:", stderr);
            callback(err);
            return;
          }
          console.log("PostgreSQL started:", stdout);
          callback();
        }
      );
    }
  );
}

/* function startBackend(callback) {
  console.log("Starting backend server...");
  const backendScriptPath = path.join(__dirname, "../server/index.js");

  const backendProcess = spawn("node", [backendScriptPath], {
    stdio: "inherit", // This will pipe stdout and stderr directly to the parent process
    shell: true,
  });

  backendProcess.on("error", (err) => {
    console.error("Failed to start backend server:", err);
    return callback(err);
  });

  backendProcess.on("close", (code) => {
    console.log(`Backend server exited with code ${code}`);
    callback(); // Call callback when the process closes
  }); */

// Remove the following optional logging since stdio is set to inherit
// backendProcess.stdout.on("data", (data) => {
//   console.log(`Backend server output: ${data}`);
// });

// backendProcess.stderr.on("data", (data) => {
//   console.error(`Backend server error output: ${data}`);
// });
/* }

function startAllServices(callback) {
  console.log("Starting all services...");
  startPostgres((err) => {
    if (err) return callback(err);

    startBackend(callback);
  });
} */

module.exports = { startPostgres };

/* const { exec } = require("child_process");
const { app } = require("electron");

const path = require("path");

function startPostgres(callback) {
  exec(
    `"C:\\Program Files\\PostgreSQL\\15\\bin\\pg_ctl" -D "C:\\Program Files\\PostgreSQL\\15\\data" status`,
    (err, stdout, stderr) => {
      if (stdout.includes("running")) {
        console.log("PostgreSQL is already running.");
        return callback(); // Proceed if already running
      }

      exec(
        `"C:\\Program Files\\PostgreSQL\\15\\bin\\pg_ctl" -D "C:\\Program Files\\PostgreSQL\\15\\data" start`,
        (err, stdout, stderr) => {
          if (err) {
            console.error("Failed to start PostgreSQL:", stderr);
            callback(err);
            return;
          }
          console.log("PostgreSQL started:", stdout);
          callback();
        }
      );
    }
  );
}



function startBackend(callback) {
  console.log("Starting backend server...");
  const backendScriptPath = path.join(__dirname, "../server/index.js");

  exec(`node ${backendScriptPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("Failed to start backend server:", stderr);
      return callback(err);
    }
    if (stdout) console.log("Backend server output:", stdout); // Log stdout
    if (stderr) console.error("Backend server error output:", stderr); // Log stderr
    callback();
  });
}

function startAllServices(callback) {
  console.log("Starting all services...");
  startPostgres((err) => {
    if (err) return callback(err);

    startBackend(callback);
  });
}

module.exports = { startPostgres, startBackend, startAllServices };
 */
