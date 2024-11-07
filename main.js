const path = require("path");
const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const { startPostgres } = require("./utils/startBackEnd"); // Adjust path if needed
require("dotenv").config();
const fs = require("fs");

let serverProcess;
let mainWindow; // Ensure mainWindow is defined globally

const isDev = process.env.NODE_ENV !== "production";
const port = process.env.VITE_PORT || 5173;

const filePath = isDev
  ? `http://localhost:5173`
  : `file://${path.join(__dirname, "resources", "app", "dist", "index.html")}`;

console.log("Loading file from:", filePath);

function startBackend(callback) {
  serverProcess = spawn("node", ["server/index.js"], {
    stdio: "inherit",
    shell: false,
    detached: true,
    windowsHide: true,
  });

  serverProcess.on("error", (error) => {
    console.error("Error starting backend server:", error);
    callback(error);
  });

  serverProcess.on("exit", (code) => {
    console.log(`Server exited with code ${code}`);
  });

  callback(null); // Proceed regardless for now
}

function createWindow() {
  console.log("Creating window...");
  mainWindow = new BrowserWindow({
    // Use global mainWindow, not redeclare it here
    width: 1920,
    height: 1080,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
    },
  });

  mainWindow
    .loadURL(filePath)
    .then(() => {
      console.log("Window loaded successfully.");
      mainWindow.show();
    })
    .catch((err) => {
      console.error("Failed to load URL:", err);
      app.quit();
    });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.executeJavaScript(
      'console.log("Finished loading");'
    );
  });

  mainWindow.webContents.on("crashed", () => {
    console.error("Renderer process crashed");
  });

  mainWindow.on("closed", () => {
    console.log("Window was closed");
    mainWindow = null;
  });

  // Open DevTools only in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.disableHardwareAcceleration();

  process.on("uncaughtException", (error) => {
    fs.writeFileSync(
      "error.log",
      `Uncaught Exception: ${error.message}\n${error.stack}`
    );
    app.quit();
  });

  app.on("ready", () => {
    console.log("App is ready in production mode");
    startPostgres((err) => {
      if (err) {
        console.error("Error starting PostgreSQL:", err);
        app.quit();
        return;
      }
      console.log("PostgreSQL started successfully.");

      startBackend((err) => {
        if (err) {
          console.error("Error starting backend:", err);
          app.quit();
          return;
        }
        console.log("Backend server started successfully.");
        createWindow();
      });
    });
  });
}

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/* const path = require("path");
const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const { startPostgres } = require("./utils/startBackEnd"); // Adjust path if needed
require("dotenv").config();

const isDev = process.env.NODE_ENV !== "production";
const port = process.env.VITE_PORT || 5173;

const filePath = isDev
  ? `http://localhost:${port}`
  : `file://${path.join(__dirname, "dist/index.html")}`;

console.log("Loading file from:", filePath);

function startBackend(callback) {
  serverProcess = spawn("node", ["server/index.js"], { stdio: "inherit" });

  serverProcess.on("error", (error) => {
    console.error("Error starting backend server:", error);
    callback(error);
  });

  serverProcess.on("close", (code) => {
    if (code !== 0) {
      console.log(`Server exited with code ${code}, restarting...`);
      setTimeout(() => startBackend(callback), 3000); // Retry after 3 seconds
    }
  });

  callback(null); // Success
}

function createWindow() {
  console.log("Creating window...");
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    // fullscreen: true,
    show: false,
    webPreferences: {
      nodeIntegration: true, // Allow use of Node.js in your renderer process
      contextIsolation: false, // For testing; this can be set to true for security in production
      enableRemoteModule: true, // Allows remote module use if necessary
      webSecurity: false, // Disable web security for testing purposes
    },
  });

  //this will open dev tol in development
  if (!isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow
    .loadURL(filePath)
    .then(() => {
      console.log("Window loaded successfully.");
      mainWindow.show();
    })
    .catch((err) => {
      fs.writeFileSync("error.log", Error`loading file: ${err}\n`);
      console.error("Failed to load URL:", err);
      app.quit();
    });

  // Show the window once it's ready to avoid issues with blank screens
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.executeJavaScript(
      'console.log("Finished loading");'
    );
  });

  mainWindow.webContents.on("crashed", () => {
    console.error("Renderer process crashed");
  });

  mainWindow.on("closed", () => {
    console.log("Window was closed");
  });
}

// Prevent multiple instances of the application
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
}

// Disable hardware acceleration for better compatibility
app.disableHardwareAcceleration();

app.disableHardwareAcceleration();

// Global error handling
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  app.quit();
});

// App ready event
app.on("ready", () => {
  startPostgres((err) => {
    if (err) {
      console.error("Error starting PostgreSQL:", err);
      app.quit(); // Quit the app on service start failure
      return;
    }
    console.log("PostgreSQL started successfully."); // Log success

    startBackend((err) => {
      if (err) {
        console.error("Error starting backend:", err);
        app.quit();
        return;
      }
      console.log("Backend server started successfully.");
      createWindow();
    });
  });
});

// create menu template

app.on("window-all-closed", () => {
  console.log("All windows closed, quitting app.");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  console.log("App activated, creating window if none exist.");
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
 */
