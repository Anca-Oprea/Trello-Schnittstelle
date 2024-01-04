require("dotenv").config();
module.exports = {
  Praktikant: {
    api_key: process.env.TRELLO_KEY_PRAKTIKANT,
    oauth_secret: process.env.TRELLO_OAUTH_SECRET_PRAKTIKANT,
    token: process.env.TRELLO_ACCESS_TOKEN_PRAKTIKANT,
  },
  Yama: {
    api_key: process.env.TRELLO_KEY_YAMA,
    token: process.env.TRELLO_ACCESS_TOKEN_YAMA,
  },
};
