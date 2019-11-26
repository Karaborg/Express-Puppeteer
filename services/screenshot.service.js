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

var url_array = [];

const takeSitemapScreenshot = async (url, delayTime) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, {waitUntil: 'networkidle2'});

  const innerHTML = await page.evaluate(() => document.querySelector('.collapsible-content').innerHTML);

  const text = page.evaluate(() => document.querySelector('.line').textContent);

  // TODO: Get All Span Elements
  // Get a list of all elements.
  var styleNumbers = await page.$$('span.text');

  // Print the style numbers.
  for( let styleNumber of styleNumbers ) {
      try {
          console.log( await ( await styleNumber.getProperty( 'innerText' ) ).jsonValue() );
      }
      catch( e ) {
          console.log( `Could not get the style number:`, e.message );
      }
  }

  for (let i = 0; i < spans.length; i++) {
    var string = spans[i],
    substring1 = '/spod.madde22.com/'
    if (string.includes(substring1)) {
      url_array.push(spans[i])
    }
  }

  //console.log(innerHTML)
  //console.log(url_array)
  //console.log(text)

  console.log("Done.")
}

module.exports={
    takeScreenshot, takeSitemapScreenshot
}
