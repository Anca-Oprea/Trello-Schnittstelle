const fs = require("fs");
var cors = require("cors");
var express = require("express");
var controller_neue_karte = require("./controller_neue_karte");
var controller = require("./controller");
var opn = require("opn");
const chokidar = require("chokidar");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const app = express();
const routes = require("./routes");
const csvParser = require("csv-parser");
const { SourceTextModule } = require("vm");
const { basename } = require("path");
const port = process.env.PORT || 5000;
const path = require("path");
const url = "http://localhost:5000";
let LogBegin = new Date();
let folderCreateNewCard =
  "H:\\OneDrive - World-of-edv GmbH\\Firmendaten - Dokumente\\Trello_schnitstelle_\\server\\create_new_Karte";
let folderUpdateCard =
  "H:\\OneDrive - World-of-edv GmbH\\Firmendaten - Dokumente\\Trello_schnitstelle_\\server\\update_karte";
const folderDestination = "G:\\WEBWARE\\ArchivierteDatei";
let backupTmpJson = require("./backupTmpJson.json");
//  let backupTmpJson = 'H:\\OneDrive - World-of-edv GmbH\\Firmendaten - Dokumente\\Trello_schnitstelle_\\server\\backupTmpJson.json';

const deleteAfterDays = 30;

app.listen(port, function () {
  console.log(LogBegin + " myapp listening on port " + port);
});
app.use(cors());

// cron.schedule('52 */2 * * *', async () => {
app.use("/", routes.routes);
runPuppeteer(url);
// });

async function runPuppeteer(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await browser.close();
  } catch (err) {
    console.log("runPuppeteer " + err);
  }
}

const watcher = chokidar.watch(folderUpdateCard, {
  persistent: true,
});
watcher.on("add", (path) => {
  console.log(`File ${path} has been added`);
  if (fs.statSync(path).isFile()) {
    controller_neue_karte.processFilesInFolderUpdateCard(path, backupTmpJson);
  }
});

// watcher.on('unlink',(path)=>console.log(`File ${path} has been removed`))
// watcher.close()
// fs.watch(folderUpdateCard, (eventType, filename) => {
//   if (eventType === 'rename' && filename) {
//     // A file has been added or removed
//     const filePath = path.join(folderUpdateCard, filename);
//     controller_neue_karte.processFilesInFolderUpdateCard(filePath, backupTmpJson);
//   } else if (eventType === 'change' && filename) {
//     // A file has been changed
//     const filePath = path.join(folderUpdateCard, filename);
//     controller_neue_karte.processFilesInFolderUpdateCard(filePath, backupTmpJson);
//   }
// });

// fs.watch(folderUpdateCard, { encoding: 'buffer' } , (eventType, filename) => {

// }

// )

// // fs.readdir(folderUpdateCard, async (err, dateien) => {
// //   if (err) {
// //     console.error(`Fehler beim Lesen des Verzeichnisses: ${err}`);
// //     return;
// //   }
// //   if (dateien.length === 0) {
// //     console.log('Das Verzeichnis ist leer.');
// //   } else {
// //     console.log('Das Verzeichnis ist nicht leer. Führe die Aktion aus.');

// //   }
// //   controller_neue_karte.processFilesInFolderUpdateCard(folderUpdateCard, backupTmpJson)
// // });
const watcher2 = chokidar.watch(folderCreateNewCard, {
  persistent: true,
});
watcher2.on("add", (path) => {
  console.log(`File ${path} has been added`);
  if (fs.statSync(path).isFile()) {
    controller_neue_karte.processFilesInFolderNewCard(path);
  }
});

// fs.watch(folderCreateNewCard, { encoding: 'buffer' }, (eventType, filename) => {

// controller_neue_karte.processFilesInFolderNewCard(folderCreateNewCard)

//  controller_neue_karte.moveEachPathToAnotherFolder(folderCreateNewCard, folderDestination)

// })

// Run every 24 hours

controller_neue_karte.startInterval(folderDestination, deleteAfterDays);

app.use("newEntry", routes.router);

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});
