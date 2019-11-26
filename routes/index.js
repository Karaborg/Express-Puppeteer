const express = require('express');
const router = express.Router();

const screenshotService = require("../services/screenshot.service.js");

const fs = require('fs');
const AdmZip = require('adm-zip');

var rimraf = require("rimraf");

var os = require('os')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/hey',async function (req, res) {
  var data = req.body;
  console.log(data.url)
  try {
    if (data.url) {
      console.log("URL: " + data.url + " with " + data.delay + " seconds delay.")
      await screenshotService.takeScreenshot(data.url, data.delay)
    }
    res.send(true)
  } catch (error) {
    console.log("Error hey: " + error)
    res.send(false)
  }
});

router.post('/heyy', function (req, res) {
  try {
    var zip = new AdmZip();
    zip.addLocalFolder('screenshots');
    zip.writeZip("../ScreenShots.zip");
    //zip.writeZip(os.homedir);
    res.send(true)
  } catch (error) {
    console.log("Error - " + error)
    res.send(false)
  }
  //deleteFile();
});

router.post('/heyyy',async function (req, res) {
  var data = req.body;
  //console.log(data.param)
  await screenshotService.takeSitemapScreenshot('http://spod.madde22.com/sitemap.xml', 0)
});

function deleteFile(){
  try {
    if (fs.existsSync('screenshots')){
      rimraf.sync("screenshots");
    }
  } catch (error) {
    console.log("silemedim: " + error)
  }
}

module.exports = router;
