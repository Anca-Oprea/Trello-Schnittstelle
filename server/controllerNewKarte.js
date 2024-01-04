var fs = require("fs");
const archiver = require("archiver");
const JSZip = require("jszip");
const path = require("path");
const Papa = require("papaparse");
const benutzer = require("./benutzer");
const folderDestination = "G:\\WEBWARE\\ArchivierteDatei";
const markdownify = require("markdownify");
const markdown = require("markdown-it");
// var controller = require('./controller')
const Trello = require("trello-node-api");

async function createNewCard(idValueList, APIKey, APIToken, data) {
  let urln = new URL(
    "https://api.trello.com/1/cards?idList=idValueList&key=APIKey&token=APIToken"
  );
  let urlString = urln.toString();
  let replace = urlString
    .replace("idValueList", idValueList)
    .replace("APIKey", APIKey)
    .replace("APIToken", APIToken);
  let arr = await fetch(replace, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));

  return arr;
}

async function addAktionToTrello(idValue, textValue, APIKey, APIToken) {
  let urln = new URL(
    "https://api.trello.com/1/cards/idValue/actions/comments?text=textValue&key=APIKey&token=APIToken"
  );
  let urlString = urln.toString();
  let replace = urlString
    .replace("idValue", idValue)
    .replace("textValue", textValue)
    .replace("APIKey", APIKey)
    .replace("APIToken", APIToken);
  let arr = await fetch(replace, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));

  return arr;
}

async function getListsOnBoard(idBoardValue, APIKey, APIToken) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/boards/idBoardValue/lists?key=APIKey&token=APIToken"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("idBoardValue", idBoardValue)
      .replace("APIKey", APIKey)
      .replace("APIToken", APIToken);
    let response = await fetch(replace, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch lists");
    }
    let arr = await response.text();
    return arr;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

async function getIdList(idBoardValue, APIKey, APIToken) {
  let data = await getListsOnBoard(idBoardValue, APIKey, APIToken);
  console.log(data);
  let idList = data.map((item) => {
    return item.id;
  });
  return idList;
}

async function getNameList(idBoardValue, APIKey, APIToken) {
  let data = await getListsOnBoard(idBoardValue, APIKey, APIToken);
  let nameList = data.map((idValue) => {
    return idValue.name;
  });
  return nameList;
}

async function updateStatusCard(idCardValue, idListValue, APIKey, APIToken) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/card/idCardValue/?key=APIKey&token=APIToken"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("idCardValue", idCardValue)
      .replace("APIKey", APIKey)
      .replace("APIToken", APIToken);
    let arr = await fetch(replace, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(idListValue),
    })
      .then((response) => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.text();
      })
      .then((text) => console.log(text))
      .catch((err) => console.error(err));

    return arr;
  } catch (err) {
    console.log(err);
  }
}

async function addMemberToCard(idCardValue, APIKey, APIToken, idMember) {
  let urla = new URL(
    "https://api.trello.com/1/cards/idCardValue/idMembers?key=APIKey&token=APIToken&value=MemberId"
  );
  let urlString = urla.toString();
  let replace = urlString
    .replace("idCardValue", idCardValue)
    .replace("APIKey", APIKey)
    .replace("APIToken", APIToken)
    .replace("MemberId", idMember);
  let arr = await fetch(replace, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));

  return arr;
}

async function removeMemberFromCard(idCardValue, idMember, APIKey, APIToken) {
  let urla = new URL(
    "https://api.trello.com/1/cards/idCardValue/idMembers/MemberId?key=APIKey&token=APIToken"
  );
  let urlString = urla.toString();
  let replace = urlString
    .replace("idCardValue", idCardValue)
    .replace("MemberId", idMember)
    .replace("APIKey", APIKey)
    .replace("APIToken", APIToken);
  let arr = await fetch(replace, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));

  return arr;
}

async function addValueToBenutzerdefinierteFelder(
  idCardValue,
  idBenutzerdefinierteFeld,
  APIKey,
  APIToken,
  data
) {
  let urla = new URL(
    "https://api.trello.com/1/cards/idCardValue/customField/idBenutzerdefinierteFeld/item?key=APIKey&token=APIToken"
  );
  let urlString = urla.toString();
  let replace = urlString
    .replace("idCardValue", idCardValue)
    .replace("idBenutzerdefinierteFeld", idBenutzerdefinierteFeld)
    .replace("APIKey", APIKey)
    .replace("APIToken", APIToken);
  try {
    let arr = await fetch(replace, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then((text) => console.log(text))
      .catch((err) => console.error(err));

    return arr;
  } catch (err) {
    console.log(err);
  }
}

async function getBenutzerdefinierteFelder(idBoards, APIKey, APIToken) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/boards/idBoards/customFields?&key=APIKey&token=APIToken"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("idBoards", idBoards)
      .replace("APIKey", APIKey)
      .replace("APIToken", APIToken);
    let response = await fetch(replace, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    let arr = await response.json();

    return arr;
  } catch (err) {
    console.log("function getBenutzerdefinierteFelder " + err);
    return undefined;
  }
}

async function getIdBenuzerDefinierteFelder(idBoards, APIKey, APIToken) {
  try {
    let renames = await getBenutzerdefinierteFelder(idBoards, APIKey, APIToken);

    console.log("getIdBenuzerDefinierteFelder idBoards " + idBoards);
    let myJsonTmp = {
      idBoard: idBoards,
      children: renames,
    };
    return myJsonTmp;
  } catch (error) {
    console.log("function getIdBenuzerDefinierteFelder( " + error);
  }
}

async function getNameBenuzerDefinierteFelder(idBoards, APIKey, APIToken) {
  try {
    let data = await getBenutzerdefinierteFelder(idBoards, APIKey, APIToken);
    let name = data.map((item) => {
      return item.name;
    });
    return name;
  } catch (error) {
    console.log(error);
  }
}

async function getBoardNachURL(url, APIKey, APIToken) {
  let urla =
    "https://api.trello.com/1/board/url/?fields=id%2Cname&key=APIKey&token=APIToken";
  let urlString = urla.toString();
  let replace = urlString
    .replace("url", url)
    .replace("APIKey", APIKey)
    .replace("APIToken", APIToken);
  let arr = await fetch(replace, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .catch((err) => console.error(err));
  return arr;
}

async function getIdBoardNachURL(url, APIKey, APIToken) {
  let data = await getBoardNachURL(url, APIKey, APIToken);
  let idBoard = data.id;
  return idBoard;
}

async function readAndProcessCSV(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
    console.log(fileContent);
    const parsedData = Papa.parse(fileContent, {
      delimiter: ";",
      header: true,
    }).data;
    console.log(parsedData);
    return parsedData;
  } catch (err) {
    console.error("Error reading or parsing the CSV file:", err);
    return null;
  }
}

async function processFilesInFolderNewCard(filePath) {
  try {
    // const fileNames = fs.readdirSync(folderPath);

    // const csvFilePaths = fileNames
    //   .map(fileName => path.join(folderPath, fileName));

    // for (const filePath of csvFilePaths) {
    const csvData = await readAndProcessCSV(filePath);

    for (const csv of csvData) {
      console.log(csv);
      let idBoard = csv.Id_Board;
      let idList = csv.idList;
      let APIKey = csv.API_Key;
      let ApiToken = csv.API_Token;
      let name = csv.name;
      let IdMembers = csv.IdMembers;
      let desc = csv.desc;

      const data = {
        name: name,
        idMembers: IdMembers,
        desc: desc,
      };
      createNewCard(idList, APIKey, ApiToken, data);
    }
    // }
    moveEachPathToAnotherFolder(filePath, folderDestination);
  } catch (err) {
    console.error("Error processing files:", err);
  }
}

async function moveEachPathToAnotherFolder(fileName, folderDestination) {
  try {
    // Check if the source file exists
    var f = path.basename(fileName);
    const folderDestinationPath = path.join(folderDestination, f);

    fs.copyFile(fileName, folderDestinationPath, (err) => {
      if (err) {
        console.error("Fehler beim Kopieren der Datei:", err);
      } else {
        console.log(`Datei von ${fileName} nach ${folderDestination} kopiert.`);

        setTimeout(() => {
          fs.unlink(fileName, (err) => {
            if (err) {
              if (err.code === "ENOENT") {
                console.log("Datei existiert nicht.");
              } else {
                console.error("Fehler beim Löschen der Datei:", err);
              }
            } else {
              console.log("Datei erfolgreich gelöscht.");
            }
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function getBenutzerDefinierteId(idBoard, JsonPfad) {
  let getChildren;
  let n;
  for (let i = 0; i < JsonPfad.length; i++) {
    if (JsonPfad[i].idBoard === idBoard) {
      console.log("ich will " + JsonPfad[i].idBoard);
      getChildren = JsonPfad[i].children;
      console.log(getChildren);
      for (let j = 0; j < getChildren.length; j++) {
        if (getChildren[j].name === "Ticket") {
          return (n = getChildren[j].id);
        }
      }
    }
  }
}

function extractAktionTextVonCsv(filePath) {
  try {
    const data = fs.readFileSync(filePath, { encoding: "utf8" });
    const parsedData = Papa.parse(data, { delimiter: ";", header: true }).data;

    // const a = parsedData.map((item)=>{ return item.AktionText})
    const a = parsedData
      .map((item) => {
        return item.AktionText;
      })
      .join("\n");
    // '  const a = new markdown(aba)'

    // const a = parsedData.map((item)=>{ return `<p>` +  item.AktionText + `</p>`})

    // console.log(typeof(textString))``
    // const newTestArray = a.map((item)=>{return item.replace(',', '\n')}

    // const l =data.split(';;;;;;;;')
    // const li= l.join("\n")

    // const l= lines.slice(2)
    // const lines = data.split('\n');
    // const l= lines.slice(2).join("\n")
    // const r= l.replace(/;;;;;;;;/g,'\r')

    // const parsedData = Papa.parse(data, { delimiter: ';', header: true }).data

    // const AktionText= parsedData.AktionText.slice(1)

    // console.log(r)
    // const all = AktionText.map(item=>{item.AktionText}).join()
    // console.log(all)
    return a;

    // const AktionText= parsedData[0].AktionText
    // return AktionText
  } catch (err) {
    console.log(err);
  }
}

async function createMultilineComment(cardId, commentText, APIKey, APIToken) {
  const trello = new Trello(APIKey, APIToken);
  try {
    const comment = await trello.createCardComment(cardId, commentText[0]);
    comment.text = commentText.join("<br>");
    await trello.updateCardComment(cardId, comment);
  } catch (err) {
    console.log(err);
  }
}
async function processFilesInFolderUpdateCard(folderPath, jsonPfad) {
  try {
    // const fileNames = fs.readdirSync(folderPath);
    // const csvFilePaths = fileNames.map(fileName => path.join(folderPath, fileName));

    // for (const filePath of csvFilePaths) {

    const csvData = await readAndProcessCSV(folderPath);
    for (const csv of csvData) {
      let idBoard = csv.IdBoard;
      let idCard = csv.IdCard;
      let idListValue = csv.idListValue;
      let APIKey = csv.APIKey;
      let ApiToken = csv.ApiToken;
      let IdMemberHinzufügen = csv.idMemberHinzufuegen;
      let IdMemberLöschen = csv.idMemberLoeschen;
      let idTicket = csv.idTicket;
      let idBenutzerDefinierteFelder = getBenutzerDefinierteId(
        idBoard,
        jsonPfad
      );

      let data = {
        value: { number: idTicket },
      };

      let AktionText = extractAktionTextVonCsv(folderPath);

      console.log(
        idBoard,
        idCard,
        idListValue,
        AktionText,
        APIKey,
        ApiToken,
        IdMemberHinzufügen,
        IdMemberLöschen,
        idTicket,
        idBenutzerDefinierteFelder
      );

      if (
        idBoard !== "" &&
        idBoard !== undefined &&
        idCard !== "" &&
        idCard !== undefined &&
        APIKey !== "" &&
        APIKey !== undefined &&
        ApiToken !== "" &&
        ApiToken !== undefined &&
        idListValue !== "" &&
        idListValue !== undefined
      ) {
        const idList = { idList: idListValue };
        await updateStatusCard(idCard, idList, APIKey, ApiToken);
      }

      if (
        idBoard !== "" &&
        idBoard !== undefined &&
        idCard !== "" &&
        idCard !== undefined &&
        APIKey != "" &&
        APIKey !== undefined &&
        ApiToken != "" &&
        ApiToken !== undefined &&
        AktionText != "" &&
        AktionText !== undefined
      ) {
        await addAktionToTrello(idCard, AktionText, APIKey, ApiToken);
        // await createMultilineComment(idCard, AktionText, APIKey, ApiToken)
        console.log("addAktion card wird aufgerufen");
      }
      if (
        idBoard !== "" &&
        idBoard !== undefined &&
        idCard !== "" &&
        idCard !== undefined &&
        APIKey !== "" &&
        APIKey !== undefined &&
        ApiToken !== "" &&
        ApiToken !== undefined &&
        IdMemberHinzufügen !== "" &&
        IdMemberHinzufügen !== undefined
      ) {
        await addMemberToCard(idCard, APIKey, ApiToken, IdMemberHinzufügen);

        console.log("addMember card wird aufgerufen");
      }

      if (
        idBoard !== "" &&
        idBoard !== undefined &&
        idCard !== "" &&
        idCard !== undefined &&
        APIKey !== "" &&
        APIKey !== undefined &&
        ApiToken !== "" &&
        ApiToken !== undefined &&
        IdMemberLöschen !== "" &&
        IdMemberLöschen !== undefined
      ) {
        await removeMemberFromCard(idCard, IdMemberLöschen, APIKey, ApiToken);

        console.log("remove card wird aufgerufen");
      }

      if (
        idBoard !== "" &&
        idBoard !== undefined &&
        idCard !== "" &&
        idCard !== undefined &&
        APIKey !== "" &&
        APIKey !== undefined &&
        ApiToken !== "" &&
        ApiToken !== undefined &&
        idTicket !== "" &&
        idTicket !== undefined
      ) {
        await addValueToBenutzerdefinierteFelder(
          idCard,
          idBenutzerDefinierteFelder,
          APIKey,
          ApiToken,
          data
        );

        console.log("TicketNummer  wird gesetzt");
      }
    }

    moveEachPathToAnotherFolder(folderPath, folderDestination);

    // }
  } catch (err) {
    console.log(err);
  }
}
async function deleteOldFiles(folderDestination, deleteAfterDays) {
  try {
    const files = fs.readdirSync(folderDestination);

    const currentTime = new Date().getTime();
    const deletionThreshold =
      currentTime - deleteAfterDays * 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(folderDestination, file);
      const fileStat = await fs.promises.stat(filePath);

      if (fileStat.isFile() && fileStat.mtimeMs <= deletionThreshold) {
        await fs.promises.unlink(filePath);
        console.log(`Deleted: ${file}`);
      }
    }
  } catch (error) {
    console.error("Error deleting old files:", error);
  }
}
async function startInterval(folderDestination, deleteAfterDays) {
  await deleteOldFiles(folderDestination, deleteAfterDays); // Initial execution
  setInterval(async () => {
    await deleteOldFiles(); // Subsequent executions
  }, 24 * 60 * 60 * 1000); // Run every 24 hours
}
function copyJson(sourceFile, destinationFile) {
  try {
    const sourceData = fs.readFileSync(sourceFile, "utf8");
    const JsonData = JSON.parse(sourceData);
    const jsonString = JSON.stringify(JsonData, null, 2);
    fs.writeFileSync(destinationFile, jsonString, "utf8");
    console.log(`Json Data copied from {sourceFile} to {destinationFile}`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createNewCard,
  addAktionToTrello,
  getIdList,
  getNameList,
  addMemberToCard,
  removeMemberFromCard,
  getIdBoardNachURL,
  getBoardNachURL,
  updateStatusCard,
  addValueToBenutzerdefinierteFelder,
  getBenutzerdefinierteFelder,
  getListsOnBoard,
  processFilesInFolderNewCard,
  readAndProcessCSV,
  processFilesInFolderUpdateCard,
  moveEachPathToAnotherFolder,
  getIdBenuzerDefinierteFelder,
  getNameBenuzerDefinierteFelder,
  deleteOldFiles,
  startInterval,
  copyJson,
};
