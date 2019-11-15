const express = require('express');
const router = express.Router();

const screenshotService = require("../services/screenshot.service.js");

const fs = require('fs');
const AdmZip = require('adm-zip');

var rimraf = require("rimraf");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/hey',async function (req, res) {
  var data = req.body;
  console.log(data)
  try {
    for (let i = 0; i < data.lenght; i++) {
      if (data['url_' + i] != "") {
        console.log("URL #" + (i + 1) + ": " + data['url_' + i])
        await screenshotService.takeScreenshot(data['url_' + i]);
      }
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
    res.send(true)
  } catch (error) {
    console.log("Error - " + error)
    res.send(false)
  }
  deleteFile();
  console.log("end rar")
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
