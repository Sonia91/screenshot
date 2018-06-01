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

urlArray = [];
db.all(sql, urlArray, (err, rows) => {
    if (err) {
        throw err;
    }
    lastScreen = [];
    rows.forEach((row) => {
        // console.log(row.URL);
        lastScreen[n] = row.LastScreenDate;

        urlArray[n] = row.URL;
        n++;
    });
    //);
    console.log(urlArray);
    console.log("Previous set of screenshots at: " +  lastScreen[0]);

/*  return global value and close function here  */
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

