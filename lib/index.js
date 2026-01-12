"use strict";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var path = require("path"),
  clc = require("cli-color"),
  cheerio = require("cheerio"),
  resources = [
    {
      title: "BYR/USD: ",
      url: "nbrb.by",
      secure: true,
      find: ".l-overall #p4.js-stats-item table tr:nth-child(3) td:nth-child(2)",
      color: "green",
    },
    {
      title: "BTC/USD: ",
      url: "dzengi.com/ru/btc-to-usd",
      secure: true,
      find: ".product-instrument .spread-widget .js-price-buy",
      color: "red",
    },
    {
      title: "Weather: ",
      url: "meteo.by",
      secure: true,
      find: ".weather .t strong",
      color: "cyanBright",
    },
  ];

function run() {
  resources.forEach(async function (res) {
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
        clc[res.color](
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
  });
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
