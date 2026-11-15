"use strict";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const colorYellow = 227;
const colorRed = 125;
const colorPink = 162;
const colorGrayLight = 2555555;
const colorGray = 245;
const colorGrayDark = 240;
const colorGreen = 35;
const colorBlue = 69;

const path = require("path");
const clc = require("cli-color");
const cheerio = require("cheerio");
const resources = [
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
  {
    title: "News: ",
    url: "rbc.ru",
    secure: true,
    find: ".news-line-link:lt(10)",
    color: colorGray,
  },
];

async function run() {
  for (let i = 0; i < resources.length; i++) {
    const res = resources[i];
    const normUrl = !/^http(s)?:\/\//.test(res.url)
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

      const $ = cheerio.load(text);

      if (res.title === "News: ") {
        const news = $(res.find);
        console.log(clc.xterm(res.color)(res.title));

        news.each(function () {
          console.log(
            clc.xterm(colorGray)(
              hyperlink($(this).attr("data-metronome-href"), $(this).text()),
            ),
          );
        });
      } else {
        console.log(
          clc.xterm(res.color)(
            res.title +
              $(res.find)
                .text()
                .replace(/[^a-z0-9.,]/gi, "")
                .trim(),
          ),
        );
      }
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

function hyperlink(url, text) {
  return "\x1b]8;;" + url + "\x1b\\" + text + "\x1b]8;;\x1b\\";
}

module.exports = {
  run: run,
};
