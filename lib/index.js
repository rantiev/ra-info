"use strict";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const colorYellow = 227;
const colorRed = 125;
const colorPink = 162;
const colorGray = 245;
const colorGreen = 35;
const colorBlue = 69;

var path = require("path"),
  clc = require("cli-color"),
  cheerio = require("cheerio"),
  resources = [
    {
      title: "BYR/USD: ",
      url: "nbrb.by",
      secure: true,
      find: ".l-overall #p4.js-stats-item table tr:nth-child(3) td:nth-child(2)",
      color: colorGreen,
    },
    {
      title: "BTC/USD: ",
      url: "dzengi.com/ru/btc-to-usd",
      secure: true,
      find: ".c-trade-widget__price.js-price-buy",
      color: colorGreen,
    },
    {
      title: "BRENT/USD: ",
      url: "dzengi.com/ru/tokenized-brent-crude-oil-price",
      secure: true,
      find: ".c-trade-widget__price.js-price-buy",
      color: colorGray,
    },
    {
      title: "USD/GOLD: ",
      url: "dzengi.com/ru/tokenized-gold-price",
      secure: true,
      find: ".c-trade-widget__price.js-price-buy",
      color: colorYellow,
    },
    {
      title: "Weather: ",
      url: "meteo.by",
      secure: true,
      find: ".weather .t strong",
      color: colorBlue,
    },
  ];

async function run() {
  for (var i = 0; i < resources.length; i++) {
    var res = resources[i];
    var normUrl = !/^http(s)?:\/\//.test(res.url)
      ? `http${res.secure ? "s" : ""}://` + res.url
      : res.url;

    try {
      const response = await fetch(normUrl, {
        headers: {
          Host: "127.0.0.1",
        },
      });
      const text = await response.text();

      if (response.status !== 200) {
        showError(res);
        return;
      }

      var $ = cheerio.load(text);
      console.log(
        clc.xterm(res.color)(
          res.title +
            $(res.find)
              .text()
              .replace(/[^a-z0-9.,]/gi, "")
              .trim(),
        ),
      );
    } catch (e) {
      showError(e);
    }
  }
}

function showError(res, e) {
  console.log(
    "There were problems with loading " +
      (res ? res.url : "") +
      " resource! Try another day!",
    e,
  );
}

module.exports = {
  run: run,
};
