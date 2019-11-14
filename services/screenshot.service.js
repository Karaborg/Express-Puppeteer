const puppeteer = require('puppeteer');
var fs = require('fs')

var Screen_Y = [360, 768, 1024, 1280, 1366, 1920];
var Screen_X = [640, 1024, 768, 754, 768 ,1080];

const takeScreenshot = async (url) => {

  //var browserOptions = new LaunchOptions
  //{
    //Headless = false,
    //ExecutablePath = "C:\\Windows\\SystemApps\\Microsoft.MicrosoftEdge_8wekyb3d8bbwe\\MicrosoftEdge.exe"
  //};

  //var browser = await Puppeteer.LaunchAsync(browserOptions);
  //var page = await browser.NewPageAsync();

  var t = 'C:\Windows\SystemApps\Microsoft.MicrosoftEdge_8wekyb3d8bbwe'

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Create ScreenShot Folder
  var dir = process.env.SCREENSHOT_PATH;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  // Divide URL
  var str = new String(url);
  var splits = str.split("/");
  var ret = splits[4].replace('.html','');

  if (!fs.existsSync(dir + '/' + splits[3])){
    fs.mkdirSync(dir + '/' + splits[3]);
  }

  // Make the Path
  var path;
  if(splits[4] != "") {
    path = process.env.SCREENSHOT_PATH + '/' + splits[3] + '/' + ret;
  }else{
    path = process.env.SCREENSHOT_PATH + '/' + splits[3] + '/main';
  }

  // Create the Path Folder
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }

  // ScreenShot Method
  for (let i = 0; i < Screen_X.length; i++) {
    await page.setViewport({ width: Screen_Y[i], height: 100});
    await page.goto(str, {waitUntil: 'networkidle2'});
    
    if (i === 0) {
      await page.screenshot({path: path + '/mobile-' + Screen_X[i] + '.png', fullPage: true});
    }else if(i === 1) {
      await page.screenshot({path: path + '/tablet-' + Screen_X[i] + '-dikey.png', fullPage: true});
    }else if(i === 2){
      await page.screenshot({path: path + '/tablet-' + Screen_X[i] + '-yatay.png', fullPage: true});
    }else{
      await page.screenshot({path: path + '/' + Screen_Y[i] + '.png', fullPage: true});
    }
  }

  console.log("Done.");

  browser.close();
}

module.exports={
    takeScreenshot
}
