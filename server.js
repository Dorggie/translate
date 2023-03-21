const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const chineseConv = require("chinese-conv");

const { setMaxIdleHTTPParsers } = require("http");
const { time } = require("console");
const app = express();
const portNum = 3000;
app.use(bodyParser.json());

async function getDeeplTranslation(query) {
  query = query.replace(/\//g, "%5C%2F");
  query = query.replace(/ /g, "%20");
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto(`https://www.deepl.com/translator#en/zh/${query}`);
  await page.screenshot({ path: "deepl.png" });
  await page.waitForSelector(".lmt__translations_as_text__text_btn");

  const result = await page.$eval(
    ".lmt__translations_as_text__text_btn",
    (el) => el.innerText
  );
  console.log("Get result from deepl success");
  await browser.close();
  return result;
}

// [1] 設定模板引擎
app.engine("html", hbs.__express);
// [2] 設定模板 template位置
app.set("views", path.join(__dirname, "application", "html"));
// [3] 設定靜態檔位置
app.use(express.static(path.join(__dirname, "application")));

app.get("/", (req, res) => {
  // [4]
  res.render("index.html");
});

app.post("/api", (req, res) => {
  const textToTranslate = req.body.content;
  console.log("Get content from browser success.");
  // 爬取 Deepl 翻譯結果
  getDeeplTranslation(textToTranslate)
    .then((result) => {
      console.log("translate:", chineseConv.tify(result));
      res.json({ message: chineseConv.tify(result) });
    })
    .catch((error) => {
      console.log("I am API error:", error);
    });
});

app.listen(portNum, () => {
  console.log(`Server is running at localhost:${portNum}`);
});
