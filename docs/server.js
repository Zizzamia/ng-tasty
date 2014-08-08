var express = require('express');
var app = express();

app.set('views', 'docs/');
app.engine('html', require('ejs').renderFile);
app.use('/static',  express.static('docs/static'));
app.use('/components',  express.static('components'));
app.use('/dist',  express.static('dist'));
app.use('/src',  express.static('src'));
app.use('/template',  express.static('dist/template'));

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
};

var prevSortBy, prevSortOrder, base;

app.get('/', function(req, res){
  if (args.port == 25907) {
    base = '/ng-tasty';
  } else {
    base = '';
  }
  res.render('template/index.html', { base: base });
});

app.get('/table.json', function(req, res){
  var items, pagination, rows, sortBy, fromRow, toRow;
  rows = [
    { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
    { "name": "coffee bar", "star": "★★★★", "sf-location": "financial distric"},
    { "name": "blue bootle", "star": "★★★★★", "sf-location": "hayes valley" },
    { "name": "CoffeeShop", "star": "★★★", "sf-location": "Bernal Heights" },
    { "name": "Spike's Coffee & Teas", "star": "★★★", "sf-location": "Castro" },
    { "name": "La Boulange", "star": "★★", "sf-location": "Cole Valley" },
    { "name": "Dynamo Donut and Coffee", "star": "★★★★★", "sf-location": "Cow Hollow" },
    { "name": "The Mill", "star": "★★★★", "sf-location": "Divisadero" },
    { "name": "Piccino Coffee Bar", "star": "★★★", "sf-location": "Dogpatch" },
    { "name": "Philz", "star": "★★★", "sf-location": "Downtown" },
    { "name": "Duboce Park Cafe", "star": "★★", "sf-location": "Duboce Triangle" },
    { "name": "Blue Bottle", "star": "★★★★★", "sf-location": "Embarcadero" },
    { "name": "Four Barrel", "star": "★★★", "sf-location": "Excelsior" },
    { "name": "Coffee Bar", "star": "★★★★★", "sf-location": "FiDi" },
    { "name": "Biscoff Coffee Corner", "star": "★★★", "sf-location": "Fisherman’s Wharf" },
    { "name": "Fifty/Fifty Coffee and Tea", "star": "★★★", "sf-location": "Inner Richmond" },
    { "name": "Beanery", "star": "★★★", "sf-location": "Inner Sunset" },
    { "name": "Cafe du Soleil", "star": "★★", "sf-location": "Lower Haight" },
    { "name": "Peet's", "star": "★", "sf-location": "The Marina" },
    { "name": "Sightglass", "star": "★★★★", "sf-location": "The Mission" },
    { "name": "Contraband Coffee Bar", "star": "★★★★", "sf-location": "Nob Hill" },
    { "name": "Martha & Bros Coffee", "star": "★★★", "sf-location": "Noe Valley" },
    { "name": "Réveille", "star": "★★★", "sf-location": "North Beach" },
    { "name": "Cup Coffee Bar", "star": "★★★", "sf-location": "Outer Mission" },
    { "name": "Garden House Cafe", "star": "★★★", "sf-location": "Outer Richmond" },
    { "name": "Andytown Coffee Roasters", "star": "★★★", "sf-location": "Outer Sunset" },
    { "name": "Jane on Fillmore", "star": "★★", "sf-location": "Pacific Heights" },
    { "name": "Saint Frank Coffee", "star": "★★★", "sf-location": "Polk" },
    { "name": "Farley’s", "star": "★★★", "sf-location": "Potrero Hill" },
    { "name": "House of Snacks", "star": "★★★", "sf-location": "The Presidio" },
    { "name": "The Brew", "star": "★★★", "sf-location": "Russian Hill" },
    { "name": "Wicked Grounds", "star": "★★★", "sf-location": "SOMA" },
    { "name": "farm:table", "star": "★★★", "sf-location": "Tenderloin" },
    { "name": "Starbucks", "star": "★", "sf-location": "Union Square" },
    { "name": "Flywheel Coffee Roasters", "star": "★★★★★", "sf-location": "Upper Haight" }
  ];
  count = req.query.count;
  page = req.query.page;
  if (req.query['sort-by']) {
    sortBy = req.query['sort-by'];
    if (req.query['sort-order'] === 'dsc') {
      sortBy = '-' + sortBy;
    }
    rows.sort(dynamicSort(sortBy));
    if (prevSortBy != sortBy) {
      page = 1;
    }
    if (req.query['sort-order']) {
      if (prevSortOrder != req.query['sort-order']) {
        page = 1;
      }
    } 
  }
  pagination = {
    "count": count,
    "page": page,
    "pages": Math.ceil(rows.length / count),
    "size": rows.length
  };
  toRow = pagination.count * pagination.page;
  fromRow = toRow - pagination.count;
  prevSortBy = req.query['sort-by'];
  prevSortOrder = req.query['sort-order'];

  if (fromRow >= 0 && toRow >= 0) {
    rowToShow = rows.slice(fromRow, toRow)
  } else {
    rowToShow = rows;
  }
  
  var items = {
    "header": [
      {
        "key": "name", 
        "name": "Name"
      },
      {
        "key": "star", 
        "name": "star"
      },
      {
        "key": "sf-location", 
        "name": "SF Location"
      }
    ],
    "rows": rowToShow,
    "pagination": pagination,
    "sort-by": req.query['sort-by'],
    "sort-order": req.query['sort-order']
  };
  res.json(items);
});

var args = {}
process.argv.forEach(function (val, index, array) {
  if (val.indexOf('=') > 0) {
    args[val.split("=")[0]] = val.split("=")[1];
  }
});

app.listen(args.port);