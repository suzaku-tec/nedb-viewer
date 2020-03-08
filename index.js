const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const dialog = electron.dialog;
const Database = require("nedb");

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", (_e, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    mainWindow = new BrowserWindow({
      width: 400,
      height: 300
    });
  }
});

let currentWorkingDirectory = process.cwd();
console.log(currentWorkingDirectory);

// アプリケーションメニュー設定
var menu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      {
        label: "load nedb file",
        click: () => {
          openFile();
        }
      }
    ]
  },
  {
    label: "Debug",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: "Alt+Command+I",
        click: function() {
          BrowserWindow.getFocusedWindow().toggleDevTools();
        }
      }
    ]
  }
]);
Menu.setApplicationMenu(menu);

// ファイル選択ダイアログを開く
function openFile() {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ["openFile"]
    })
    .then(result => {
      if (result.canceled) {
        return;
      }

      console.log("result:", result);
      const db = new Database({ filename: result.filePaths[0] });
      db.loadDatabase(error => {
        if (error !== null) {
          console.error(error);
        }

        db.find({}, (error, docs) => {
          console.log(docs);
          mainWindow.webContents.send("open_file", docs);
        });
      });
    })
    .catch(err => {
      dialog.showMessageBox(mainWindow, { type: "error", message: err });
    });
}
