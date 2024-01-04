var express = require("express");
var cors = require("cors");
var http = require("http");
var fs = require("fs");
const fsSec = require("fs");
var path = require("path");
var csvParser = require("csv-parser");
const fastcsv = require("fast-csv");
require("dotenv").config();
var newLine = "\r\n";
let BoardsArr = [];
let MemberArr = [];
let boards;
let MemberCard = [];
const csvFile2 = "output2.csv";
var controller = require("./controller");
var controller_neue_karte = require("./controller_neue_karte");
let tmpJson =
  "H:\\OneDrive - World-of-edv GmbH\\Firmendaten - Dokumente\\Trello_schnitstelle_\\server\\tmp.json";
// let backupJson = require('./backupTmpJson.json')
let backupTmpJson =
  "H:\\OneDrive - World-of-edv GmbH\\Firmendaten - Dokumente\\Trello_schnitstelle_\\server\\backupTmpJson.json";

let serverUpdateDates = [0];

var envSecret = require("./env.js");
const { jar } = require("request");
var routes = require("express").Router();
var router = require("express").Router();
var routers = require("express").Router();
let folderUpdateCard =
  "H:\\OneDrive - World-of-edv GmbH\\Firmendaten - Dokumente\\Trello_schnitstelle_\\server\\update_karte";
let LogBegin = new Date();
let lastDate = null;
// function addDateToArrayAndTrackLastDate(date, dateArray) {
//   lastDate= new Date()
//   lastDate.setHours(lastDate.getHours -1)
//  dateArray[0]=lastDate
//    let newDate = new Date(Date.now());
//   dateArray.push(newDate)

//   return dateArray
// }

routes.get("/", async function (req, res) {
  res.json("Hello World");
  const apiKey = envSecret.Yama.api_key;
  const accessToken = envSecret.Yama.token;

  try {
    if (!fs.existsSync(csvFile2)) {
      controller.CreateCsvFile(csvFile2);
    }
    if (!fsSec.existsSync(backupTmpJson)) fsSec.writeFile(backupTmpJson);
    if (fsSec.existsSync(tmpJson)) fsSec.unlinkSync(tmpJson);

    if (!fsSec.existsSync(tmpJson))
      fsSec.writeFile(tmpJson, "[", function (err) {
        if (err) return console.log(err);
        console.log(LogBegin + "The file " + tmpJson + " was created!");
      });

    if (!fs.existsSync(csvFile2)) {
      controller.CreateCsvFile(csvFile2);
    }
    let allLines = await controller.ReadAlllines(csvFile2);

    //Iterarea pentru membri
    boards = await controller.tokensMember(apiKey, accessToken);
    //  console.log(boards)

    for (let index = 0; index < boards.length; index++) {
      let idMemberArr = await controller.MembersBoard(
        boards[index],
        apiKey,
        accessToken
      );
      var tmp = MemberArr.concat(idMemberArr);
      MemberArr = tmp.filter((item, pos) => tmp.indexOf(item) === pos);
    }
    console.log(MemberArr);
    for (let index = 0; index < MemberArr.length; index++) {
      let idBoardsArr = await controller.MembersIterationReturnBoardsArr(
        MemberArr[index],
        apiKey,
        accessToken
      );
      var tmp = BoardsArr.concat(idBoardsArr);
      BoardsArr = tmp.filter((item, pos) => tmp.indexOf(item) === pos);
    }
    console.log(BoardsArr);

    for (let index = 0; index < BoardsArr.length; index++) {
      let actualIdBoard = BoardsArr[index];
      console.log(BoardsArr[index]);

      // if(BoardsArr[index]=='5fe0c4850ef306039afbb01e'){
      let idBenutzerDefinierteFeld =
        await controller_neue_karte.getIdBenuzerDefinierteFelder(
          BoardsArr[index],
          apiKey,
          accessToken
        );

      let actualIdCardArr = await controller.idCard(
        BoardsArr[index],
        apiKey,
        accessToken
      );
      let actualNameCard = await controller.nameCard(
        BoardsArr[index],
        apiKey,
        accessToken
      );
      let actualDescriptionCard = await controller.descriptionCard(
        BoardsArr[index],
        apiKey,
        accessToken
      );
      let actualURLCard = await controller.urlCard(
        BoardsArr[index],
        apiKey,
        accessToken
      );
      // let actualMemberCreatorBord = await controller.MemberCreatorBord(BoardsArr[index],apiKey,accessToken)

      for (let counter = 0; counter < actualIdCardArr.length; counter++) {
        // let actualActionTextCard = await controller.ActionTextCard(actualIdCardArr[counter],apiKey,accessToken)
        let actualStatusCard = await controller.StatusCard(
          actualIdCardArr[counter],
          apiKey,
          accessToken
        );
        let actualIdStatusCard = await controller.IdStatusCard(
          actualIdCardArr[counter],
          apiKey,
          accessToken
        );
        let actualMemberActionCard = await controller.MembersActionCard(
          actualIdCardArr[counter],
          apiKey,
          accessToken
        );
        let actualTicketNummer = await controller.TicketNummer(
          actualIdCardArr[counter],
          apiKey,
          accessToken
        );
        let dateCreateCard = controller.getDataCreateCard(
          actualIdCardArr[counter],
          apiKey,
          accessToken
        );
        try {
          actualMemberActionCard = actualMemberActionCard.filter(
            (item, pos) => actualMemberActionCard.indexOf(item) === pos
          );
        } catch (err) {
          console.log(err);
        }
        let actualMemberCreatorCard = await controller.memberCreatorCard(
          BoardsArr[index],
          actualIdCardArr[counter],
          apiKey,
          accessToken
        );
        let actualNameCreatorCard = await controller.nameMemberCreatorCard(
          BoardsArr[index],
          actualIdCardArr[counter],
          apiKey,
          accessToken
        );

        let msg =
          dateCreateCard +
          ";" +
          actualIdBoard +
          ";" +
          actualIdCardArr[counter] +
          ";" +
          actualNameCard[counter] +
          ";" +
          actualMemberCreatorCard +
          ";" +
          actualNameCreatorCard +
          ";" +
          actualTicketNummer +
          ";" +
          actualStatusCard +
          ";" +
          actualMemberActionCard +
          ";" +
          actualDescriptionCard[counter] +
          ";" +
          actualURLCard[counter] +
          ";" +
          actualIdStatusCard +
          newLine;
        if (!allLines.includes(msg)) {
          controller.AppendToCsvFile(csvFile2, msg);
        }
      }

      console.log(
        "After for = idBenutzerDefinierteFeld " +
          JSON.stringify(idBenutzerDefinierteFeld)
      );
      if (index === 0)
        controller.AppendToJsonFileAndStringify(
          tmpJson,
          JSON.stringify(idBenutzerDefinierteFeld)
        );
      else
        controller.AppendToJsonFileAndStringify(
          tmpJson,
          "," + JSON.stringify(idBenutzerDefinierteFeld)
        );

      // controller.AppendToJsonFileAndStringify(tmpJson, JSON.stringify(idBenutzerDefinierteFeld));
      console.log("After append");
      // }
    }
    setTimeout(() => {
      controller.AppendToCsvFile(tmpJson, "]");
    }, 1000);
    console.log("Get Request End!");
  } catch (err) {
    console.log("Error fetch" + err);
  }

  setTimeout(() => {
    controller_neue_karte.copyJson(tmpJson, backupTmpJson);
  }, 1000);
});

router.get("/newEntry", (req, res) => {
  console.log(LogBegin + "routes.get('/newEntry'");
  const results = [];
  fs.createReadStream(csvFile2)
    .pipe(csvParser({ separator: ";", from_line: 2 }))
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", () => {
      res.json(results);
    });
});
module.exports = {
  routes,
  router,
  routers,
};
