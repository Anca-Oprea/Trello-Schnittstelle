var fs = require("fs");
var fields2 = [];
var newLine = "\r\n";
let LogBegin = new Date(Date.now()).toLocaleString() + " ";

async function Bord(idValue, APIKey, APIToken) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/boards/idValue?,APIKey,APIToken"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("idValue", idValue)
      .replace("APIKey", APIKey)
      .replace("APIToken", APIToken);
    let response = await fetch(replace, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("function Bord Failed to fetch lists");
    }
    let arr = await response.json();
    return arr;
  } catch (err) {
    console.log(LogBegin + " function Bord CATCH " + err);
    return undefined;
  }
}

async function MemberCreatorBord(idValue, APIKey, APIToken) {
  let data = await Bord(idValue, APIKey, APIToken);
  let memberCreatorBord = data.idOrganization;
  return memberCreatorBord;
}

async function ActionCard(idValue, APIKey, APIToken) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/cards/idValue/actions?key=APIKey&token=APIToken"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("idValue", idValue)
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
    let arr = await response.json();
    return arr;
  } catch (err) {
    console.log(LogBegin + " ActionCard( CATCH " + err);
    return undefined;
  }
}

async function MembersActionCard(idValue, APIKey, APIToken) {
  try {
    let data = await ActionCard(idValue, APIKey, APIToken);
    let membersActionCard = data.map((item) => {
      return item.idMemberCreator;
    });
    return membersActionCard;
  } catch (err) {
    console.log(LogBegin + " MembersActionCard CATCH " + err);
  }
}

async function ListCard(idValue, APIKey, APIToken) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/cards/idValue/list?key=APIKey&token=APIToken"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("idValue", idValue)
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
    let arr = await response.json();
    return arr;
  } catch (err) {
    console.log(LogBegin + "ListCard CATCH " + err);
    return undefined;
  }
}

async function StatusCard(idValue, APIKey, APIToken) {
  try {
    let data = await ListCard(idValue, APIKey, APIToken);
    let status = data.name;
    console.log(status);
    return status;
  } catch (err) {
    console.log(LogBegin + " StatusCard CATCH " + err);
  }
}

async function IdStatusCard(idValue, APIKey, APIToken) {
  try {
    let data = await ListCard(idValue, APIKey, APIToken);
    let statusId = data.id;

    return statusId;
  } catch (err) {
    console.log(LogBegin + " StatusCard CATCH " + err);
  }
}

async function MemberCreatorCard(idValueBoard, idValueCard, APIKey, APIToken) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/boards/idValueBoard/actions?key=APIKey&token=APIToken&filter=createCard&fields=idMemberCreator&idModels=idValueCard"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("idValueBoard", idValueBoard)
      .replace("idValueCard", idValueCard)
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
    let arr = await response.json();
    return arr;
  } catch (err) {
    console.log(LogBegin + " MemberCreatorCard CATCH " + err);
    return undefined;
  }
}

async function memberCreatorCard(idValueBoard, idValueCard, APIKey, APIToken) {
  let data = await MemberCreatorCard(
    idValueBoard,
    idValueCard,
    APIKey,
    APIToken
  );
  try {
    let memberCreator = data.map((item) => {
      return item.idMemberCreator;
    });
    return memberCreator;
  } catch (err) {
    console.log(LogBegin + " memberCreatorCard CATCH " + err);
  }
}

async function nameMemberCreatorCard(
  idValueBoard,
  idValueCard,
  APIKey,
  APIToken
) {
  let data = await MemberCreatorCard(
    idValueBoard,
    idValueCard,
    APIKey,
    APIToken
  );
  try {
    let nameMemberCreatorCard = data.map((item) => {
      return item.memberCreator.fullName;
    });
    return nameMemberCreatorCard;
  } catch (err) {
    console.log(LogBegin + " nameMemberCreatorCard CATCH " + err);
  }
}

async function tokensMember(APIKey, APIToken) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/tokens/APIToken/member?key=APIKey&token=APIToken"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("APIKey", APIKey)
      .replace("APIToken", APIToken)
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
    let arr = await response.json();

    let tokenMember = arr.idBoards.map((item) => {
      return item;
    });
    return tokenMember;
  } catch (err) {
    console.log(LogBegin + " tokensMember CATCH " + err);
    return undefined;
  }
}

async function MembersBoard(idValue, APIKey, APIToken) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/boards/idValue/members?key=APIKey&token=APIToken"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("idValue", idValue)
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
    let arr = await response.json();
    let Member = arr.map((item) => {
      return item.id;
    });
    return Member;
  } catch (err) {
    console.log(LogBegin + " MembersBoard CATCH " + err);
    return undefined;
  }
}

async function TicketNummer(idValue, APIKey, APIToken) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/cards/idValue/?fields=name&customFieldItems=true&key=APIKey&token=APIToken"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("idValue", idValue)
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
    let arr = await response.json();

    let ticketNummer = arr.customFieldItems.map((item) => {
      return item.value.number;
    });
    return ticketNummer;
  } catch (err) {
    console.log(LogBegin + " TicketNummer CATCH " + err);
    return undefined;
  }
}

async function CardsBoard(idValue, APIKey, APIToken, targetLastUpdate) {
  try {
    let urla = new URL(
      "https://api.trello.com/1/boards/idValue/cards?&key=APIKey&token=APIToken"
    );
    let urlString = urla.toString();
    let replace = urlString
      .replace("idValue", idValue)
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
    let arr = await response.json();

    console.log(LogBegin + " CardsBoard response.json " + JSON.stringify(arr));
    arr.sort((a, b) => {
      const dateB = new Date(b.dateLastActivity);
      const dateA = new Date(a.dateLastActivity);
      if (isNaN(dateA) || isNaN(dateB)) return 0;
      return dateA - dateB;
    });
    console.log(
      LogBegin +
        " CardsBoard arr.dateLastActivity " +
        JSON.stringify(arr.dateLastActivity)
    );

    let limitedCards = arr.filter((card) => {
      let actualCardDate = new Date(card.dateLastActivity);

      let Today = new Date(Date.now());
      // let targetLastUpdate = new Date("2023-10-31")
      let targetLastUpdate = new Date(Today.getTime() - 1 * 60 * 60 * 1000);
      return actualCardDate >= targetLastUpdate && actualCardDate <= Today;
    });

    console.log(LogBegin + " CardsBoard limitedCards " + limitedCards);
    limitedCards.map((card) => {
      console.log(
        LogBegin +
          " cardid " +
          card.id +
          " actualCardDate " +
          new Date(card.dateLastActivity)
      );
    });
    return limitedCards;
    return arr;
  } catch (err) {
    console.log(LogBegin + " CardsBoard CATCH " + err);
    return undefined;
  }
}

async function idCard(idValue, APIKey, APIToken, targetLastUpdate) {
  let data = await CardsBoard(idValue, APIKey, APIToken, targetLastUpdate);
  try {
    let idCards = data.map((item) => {
      return item.id;
    });
    return idCards;
  } catch (err) {
    console.log(LogBegin + "idCard CATCH " + err);
  }
}

async function nameCard(idValue, APIKey, APIToken, targetLastUpdate) {
  let data = await CardsBoard(idValue, APIKey, APIToken, targetLastUpdate);
  try {
    let nameCard = data.map((item) => {
      return item.name;
    });
    return nameCard;
  } catch (err) {
    console.log(LogBegin + "nameCard CATCH " + err);
  }
}

async function descriptionCard(idValue, APIKey, APIToken, targetLastUpdate) {
  let data = await CardsBoard(idValue, APIKey, APIToken, targetLastUpdate);
  let descCard = data.map((item) => {
    return item.desc.replace(/(\r\n|\n|\r)/gm, "");
  });
  return descCard;
}

async function urlCard(idValue, APIKey, APIToken, targetLastUpdate) {
  let data = await CardsBoard(idValue, APIKey, APIToken, targetLastUpdate);
  let urlCard = data.map((item) => {
    return item.url;
  });
  return urlCard;
}

async function MembersIterationReturnBoardsArr(idValue, APIKey, APIToken) {
  try {
    let urln = new URL(
      "https://api.trello.com/1/members/idValue/boards?key=APIKey&token=APIToken"
    );
    let urlString = urln.toString();
    let replace = urlString
      .replace("idValue", idValue)
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
    let arr = await response.json();
    let idBoards = arr.map((idValue) => {
      return idValue.id;
    });
    return idBoards;
  } catch (err) {
    console.log(LogBegin + " MembersIterationReturnBoardsArr CATCH " + err);
    return undefined;
  }
}

async function CreateCsvFile(inputPath) {
  fields2 = [
    "A0" +
      ";" +
      "A1" +
      ";" +
      "A2" +
      ";" +
      "A3" +
      ";" +
      "A4" +
      ";" +
      "A5" +
      ";" +
      "A6" +
      ";" +
      "A7" +
      ";" +
      "A8" +
      ";" +
      "A9" +
      ";" +
      "A10" +
      ";" +
      "A11",
  ];
  fields2 = fields2 + newLine;
  fs.writeFile(inputPath, fields2, function (err) {
    if (err) return console.log(err);
    console.log(LogBegin + "The file was saved!");
  });
}

function AppendToCsvFile(inputPath, msg) {
  msg.replace(" ", "");
  fs.appendFileSync(inputPath, msg, function (err) {
    if (err) throw err;
    console.log(LogBegin + 'The "data to append" was appended to file!');
  });
  console.log(LogBegin + "Append new text to " + inputPath);
}

function AppendToJsonFileAndStringify(inputPath, msg) {
  if (!fs.existsSync(inputPath))
    fs.writeFile(inputPath, "[", function (err) {
      if (err) return console.log(err);
      console.log(LogBegin + "The file was created!");
    });
  else
    fs.appendFile(inputPath, msg, (err) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(LogBegin + `The ${inputPath} has been saved!`);
    });
}

async function ReadAlllines(inputPath) {
  let linesArr = [];
  if (fs.existsSync(inputPath)) {
    linesArr = fs.readFileSync(inputPath);
  }
  return linesArr;
}

function getDataCreateCard(idValue) {
  return new Date(1000 * parseInt(idValue.substring(0, 8), 16));
}

function Sleep(time) {
  var stop = new Date().getTime();
  while (new Date().getTime() < stop + time) {}
}

module.exports = {
  Sleep,
  CreateCsvFile,
  ReadAlllines,
  AppendToCsvFile,
  AppendToJsonFileAndStringify: AppendToJsonFileAndStringify,
  MembersIterationReturnBoardsArr,
  CardsBoard,
  idCard,
  nameCard,
  descriptionCard,
  tokensMember,
  MembersBoard,
  MembersActionCard,
  StatusCard,
  TicketNummer,
  memberCreatorCard,
  MemberCreatorBord,
  getDataCreateCard,
  nameMemberCreatorCard,
  urlCard,
  IdStatusCard,
};
