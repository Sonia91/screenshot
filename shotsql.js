// How to: save as capture.js and run with "phantomjs capture.js"
// Setup by modifying URLS, PAGE_WIDTH AND PAGE_HEIGHT constants!
// Hint: set PAGE_WIDTH or PAGE_HEIGHT to 0 to capture full page!
// modified version of script at http://www.cameronjtinker.com/post/2011/09/26/Take-Screenshot-of-all-HTML-documents-in-a-folder-using-PhantomJS.aspx

var PAGE_WIDTH = 1920;
var PAGE_HEIGHT = 1080;
var timeout = 10000;
var default_folder = 'dashboardSnapshots/';

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./screenshot', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the Screenshot.db SQlite database.');
});

let sql = 'SELECT * FROM URLS';
console.log("SQL query: " + sql);
n = 0;

db.all(sql, [], (err, urlArray) => {
    if (err) {
        throw err;
    }
    lastScreen = [];
    urlArray.forEach((row) => {
        // console.log(row.URL);
        lastScreen[n] = row.LastScreenDate;

        urlArray[n] = row.URL;
        n++;
    });
    //);
    console.log(urlArray);
    console.log("Previous set of screenshots at: " +  lastScreen[0]);

/* PLZ HELP  -> return global value and close function here  */
/////////////////////////////////////////////////////////////////////////////////////////////

    var dt = new Date();
    var date = dt.getHours() + '_' + dt.getMinutes() + "_" +
        dt.getFullYear() + '_' + (((dt.getMonth() + 1) < 10) ? '0' : '') +
        (dt.getMonth() + 1) + '_' + ((dt.getDate() < 10) ? '0' : '') +
        dt.getDate() + '_';

var phantom = require('phantom');
pageIndex = 0;
urlArray.forEach(renderDashboard);

async function renderDashboard(url) {
    var phantom_inst = await phantom.create();
    var page = await phantom_inst.createPage();
    page.property("viewportSize", {
        width: PAGE_WIDTH, height: PAGE_HEIGHT
    });
    var status = await page.open(url);
    await setTimeout(function () {

        var match = url.match(/[grafana\.org\/d\/](\d+)/)
        var match2 = url.match(/(?:)[\d\w]+\:\/\/(.*?)\.(?:com|au\.uk|co\.in)/)

        if (match) {
            url = match[1];
            console.log("Dashboard ID: " + match[1]);
        }
        else if (match2){
            url = match2[1];
            console.log("Unexpected name: " + match2[1]);
        }
        else {
            url = "WrongID";
            console.log("WRONG Dashboard ID");
        }

        page.render(default_folder + date + 'x' + url + ".png");
        console.log('page ' + (pageIndex + 1) + ' load finished');
        // phantom_inst.exit();
        pageIndex++;

    }, timeout);

    setTimeout(() => phantom_inst.exit(), (timeout + 10000));
}

/*  closing the db.all function  - plz move it if possible (line 88) */
});

var dt = new Date();
var date2 = dt.getHours() + '.' + dt.getMinutes() + "" +
    dt.getFullYear() + '' + (((dt.getMonth() + 1) < 10) ? '0' : '') +
    (dt.getMonth() + 1) + '' + ((dt.getDate() < 10) ? '0' : '') +
    dt.getDate();

date2.toString();

let sql2 = "UPDATE URLS SET LastScreenDate = "+date2+"";
    //+") WHERE ID = 1
db.all(sql2, function (err, result) {
    if (err) throw err;
    console.log("Time in SQLlite db updated");
    console.log("New screenshot time taken: " + date2);
  });


db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('database connection closed');
});


//////////////////////////////////////////////////////////////////////////////////////////


// var page = require('webpage').create(),
//     loadInProgress = false,
//     pageIndex = 0;

// if (PAGE_WIDTH > 0 && PAGE_HEIGHT > 0) {
//     page.viewportSize = {
//         width: PAGE_WIDTH,
//         height: PAGE_HEIGHT
//     };

//     page.clipRect = {
//         top: 0,
//         left: 0,
//         width: PAGE_WIDTH,
//         height: PAGE_HEIGHT
//     };
// }

// // page handlers
// page.onLoadStarted = function() {
//     loadInProgress = true;
//     console.log('page ' + (pageIndex + 1) + ' load started');
// };

// page.onLoadFinished = function() {

//     window.setTimeout(
//     function() {

//         loadInProgress = false;
//         page.render("dashboardSnapshots/" + date + 'x' + dashboardID[pageIndex] + ".png");
//         console.log('page ' + (pageIndex + 1) + ' load finished');
//         pageIndex++;

//     }, 10000);
// };

// // try to load or process a new page every 250ms
// setInterval(function() {
//     if (!loadInProgress && pageIndex < URLS.length) {
//         console.log("image " + (pageIndex + 1));
//         page.open(URLS[pageIndex]);
//     }
//     if (pageIndex == URLS.length) {
//         console.log("image render complete!");
//         phantom.exit();
//     }
// }, 250);

// console.log('Number of URLS: ' + URLS.length);


////////////////////////////////////////

/*
 var urlArray = [
     "https://play.grafana.org/d/000000056/graphite-templated-nested?orgId=1",
     "http://play.grafana-zabbix.org/d/000000025/aggregations?orgId=2",
     "http://play.grafana-zabbix.org/d/000000003/grafana-zabbix-demo?orgId=2",
     "https://grafana.com/"
 ];
 */
/*
    var i;
    var dashboardID = [];
    for (i = 0; i < urlArray.length; i++) {

        var match = urlArray[i].match(/[grafana\.org\/d\/](\d+)/)
        if (match) {
            dashboardID[i] = match[1];
            console.log("Dashboard ID: " + match[1]);
        } else {
            dashboardID[i] = "wrongID";
            console.log("WRONG Dashboard ID");
        }
    }
    console.log("dashboardID[0]" + dashboardID[0]);
    console.log("dashboardID[1]" + dashboardID[1]);
    console.log("dashboardID[2]" + dashboardID[2]);
    console.log("dashboardID[3]" + dashboardID[3]);
*/
