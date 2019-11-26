const puppeteer = require('puppeteer');
var fs = require('fs')

var Screen_Y = [360, 768, 1024, 1280, 1366, 1920];
var Screen_X = [640, 1024, 768, 754, 768 ,1080];

const takeScreenshot = async (url, delayTime) => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Create ScreenShot Folder
  var dir = process.env.SCREENSHOT_PATH;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  // Divide URL
  var path;
  var str = new String(url);
  var splits = str.split("/");

  // Create ScreenShot Folder
  var dir = process.env.SCREENSHOT_PATH;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  // Create splits[3] folders if exiest
  if (splits[3] == "") {splits[3] = 'main'}
  if (!fs.existsSync(dir + '/' + splits[3])){
    fs.mkdirSync(dir + '/' + splits[3]);
    path = dir + '/' + splits[3];
  }

  // Create splits[4] folders inside splits[3]
  if (splits[4]) {
    if (!fs.existsSync(dir + '/' + splits[3] + '/' + splits[4])){
      fs.mkdirSync(dir + '/' + splits[3] + '/' + splits[4]);
      path = dir + '/' + splits[3] + '/' + splits[4];
    }
  }

  // ScreenShot Method
  for (let i = 0; i < Screen_X.length; i++) {
    await page.setViewport({ width: Screen_Y[i], height: 100});
    await page.goto(str, {waitUntil: 'networkidle2'});

    if(delayTime != 0){
      var time = (delayTime * 1000)
      await page.waitFor(time)
    }
    
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

  await browser.close();
}

const takeSitemapScreenshot = async (url, delayTime) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, {waitUntil: 'networkidle2'});

  var styleNumbers = await page.$$(process.env.SITEMAP_ELEMENT + '.' +process.env.SITEMAP_ELEMENT_CLASS);

  for( let styleNumber of styleNumbers ) {
      try {
          var string = await ( await styleNumber.getProperty( 'innerText' ) ).jsonValue();
          substring1 = process.env.SITEMAP_KEY;
          if (string.includes(substring1)) {
            documenting(string, delayTime)
          }
      } catch (e) {
          console.log("Span Error: " + e);
      }
  }
}

const documenting = async (url, delayTime) => {
  // Divide URL
  var path;
  var str = new String(url);
  var splits = str.split("/");

  // Create ScreenShot Folder
  var dir = process.env.SCREENSHOT_PATH;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  // Create splits[3] folders if exiest
  if (splits[3] == "") {splits[3] = 'main'}
  if (!fs.existsSync(dir + '/' + splits[3])){
    fs.mkdirSync(dir + '/' + splits[3]);
    path = dir + '/' + splits[3];
  }

  // Create splits[4] folders inside splits[3]
  if (splits[4]) {
    if (!fs.existsSync(dir + '/' + splits[3] + '/' + splits[4])){
      fs.mkdirSync(dir + '/' + splits[3] + '/' + splits[4]);
      path = dir + '/' + splits[3] + '/' + splits[4];
    }
  }

  const browser = await puppeteer.launch({ args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();

  // Screenshot
  try {
    for (let i = 0; i < Screen_X.length; i++) {
      await page.setViewport({ width: Screen_Y[i], height: 100});
      await page.goto(str, {waitUntil: 'networkidle2', timeout: 3000000});

      if(delayTime != 0){
        var time = (delayTime * 1000)
        await page.waitFor(time)
      }

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
  } catch (error) {
    console.log("Screenshot Error For: " + path + " Details: " + error)
  }
  await browser.close();
}

module.exports={
    takeScreenshot, takeSitemapScreenshot, documenting
}
