var http = require('http');
var express = require('express');
var WebSocketServer = require('ws').Server;
var Twit = require('twit');
var config = require('./config.sample');
var app = express();

var args = {};
process.argv.forEach(function (val, index, array) {
  if (val.indexOf('=') > 0) {
    args[val.split('=')[0]] = val.split('=')[1];
  }
});

try {
  config = require('./config');
} catch(e) {
  console.log('Warning: config file not found.');
}

var server = http.createServer(app);
var wss = new WebSocketServer({ server: server });
var T = new Twit(config.twitter_auth);


app.set('views', 'docs/');
app.engine('html', require('ejs').renderFile);
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use('/static',  express.static('docs/static'));
app.use('/components',  express.static('components'));
app.use('/dist',  express.static('dist'));
app.use('/src',  express.static('src'));
//app.use('/template',  express.static('dist/template'));

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  };
}

var prevSortBy, prevSortOrder, base;
if (args.port != 3000) {
  base = '/ng-tasty';
  ngTasty = '/ng-tasty/components/ng-tasty/ng-tasty-tpls.js';
} else {
  base = '';
  ngTasty = '/dist/ng-tasty-tpls.js';
}

app.use(function(req, res, next) {
  if (req.url === '/ng-tasty') {
    res.redirect(301, req.url + '/');
  } else {
    next();
  }
});

app.get('/', function(req, res){
  title = '#ngTasty';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title:title });
});
app.get('/home.html', function(req, res){
  res.render('template/home.html', { base: base, ngTasty: ngTasty });
});

app.get('/contribute', function(req, res){
  title = '#ngTasty - Contribute';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title:title });
});
app.get('/contribute.html', function(req, res){
  res.render('template/contribute.html', { base: base, ngTasty: ngTasty });
});

app.get('/make-your-own', function(req, res){
  title = '#ngTasty - Make your own tasty collection';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title:title });
});
app.get('/make-your-own.html', function(req, res){
  res.render('template/make-your-own.html', { base: base, ngTasty: ngTasty });
});

app.get('/directive/table', function(req, res){
  title = '#ngTasty - AngularJS table directive';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title:title });
});
app.get('/table/index.html', function(req, res){
  res.render('template/table/index.html', { base: base, ngTasty: ngTasty });
});

app.get('/directive/table-server-side', function(req, res){
  title = '#ngTasty - AngularJS server side table directive';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title:title });
});
app.get('/table-server-side/index.html', function(req, res){
  res.render('template/table-server-side/index.html', { base: base, ngTasty: ngTasty });
});

app.get('/filter/filter-int', function(req, res){
  title = '#ngTasty - AngularJS filter Integer';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title:title });
});
app.get('/filter/filter-int.html', function(req, res){
  res.render('template/filter/filter-int.html', { base: base, ngTasty: ngTasty });
});

app.get('/filter/range', function(req, res){
  title = '#ngTasty - AngularJS range filter';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title:title });
});
app.get('/filter/range.html', function(req, res){
  res.render('template/filter/range.html', { base: base, ngTasty: ngTasty });
});

app.get('/service/debounce', function(req, res) {
  title = '#ngTasty - AngularJS debounce service';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title: title });
});
app.get('/service/debounce.html', function(req, res) {
  title = '#ngTasty - AngularJS debounce service';
  res.render('template/service/debounce.html', { base: base, ngTasty: ngTasty, title: title });
});

app.get('/service/throttle', function(req, res) {
  title = '#ngTasty - AngularJS throttle service';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title: title });
});
app.get('/service/throttle.html', function(req, res) {
  title = '#ngTasty - AngularJS throttle service';
  res.render('template/service/throttle.html', { base: base, ngTasty: ngTasty, title: title });
});

app.get('/service/websocket', function(req, res) {
  title = '#ngTasty - AngularJS websocket service';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title: title });
});
app.get('/service/websocket.html', function(req, res) {
  title = '#ngTasty - AngularJS websocket service';
  res.render('template/service/websocket.html', { base: base, ngTasty: ngTasty, title: title });
});

app.get('/benchmarks/table', function(req, res) {
  title = '#ngTasty - AngularJS websocket service';
  res.render('template/index.html', { base: base, ngTasty: ngTasty, title: title });
});
app.get('/table/benchmarks.html', function(req, res) {
  title = '#ngTasty - AngularJS benchmarks table';
  res.render('template/table/benchmarks.html', { base: base, ngTasty: ngTasty, title: title });
});

app.get('/table.json', function(req, res){
  var items, pagination, rows, sortBy, fromRow, toRow;
  rows = [
    { 'name': 'Ritual Coffee Roasters', 'star': '★★★★★', 'sf-location': 'Hayes Valley'},
    { 'name': 'Blue Bottle', 'star': '★★★★★', 'sf-location': 'Hayes Valley' },
    { 'name': 'CoffeeShop', 'star': '★★★', 'sf-location': 'Bernal Heights' },
    { 'name': 'Spike\'s Coffee & Teas', 'star': '★★★', 'sf-location': 'Castro' },
    { 'name': 'La Boulange', 'star': '★★', 'sf-location': 'Cole Valley' },
    { 'name': 'Dynamo Donut and Coffee', 'star': '★★★★★', 'sf-location': 'Cow Hollow' },
    { 'name': 'The Mill', 'star': '★★★★', 'sf-location': 'Divisadero' },
    { 'name': 'Piccino Coffee Bar', 'star': '★★★', 'sf-location': 'Dogpatch' },
    { 'name': 'Philz', 'star': '★★★', 'sf-location': 'Downtown' },
    { 'name': 'Duboce Park Cafe', 'star': '★★', 'sf-location': 'Duboce Triangle' },
    { 'name': 'Blue Bottle', 'star': '★★★★★', 'sf-location': 'Embarcadero' },
    { 'name': 'Four Barrel', 'star': '★★★', 'sf-location': 'Excelsior' },
    { 'name': 'Coffee Bar', 'star': '★★★★★', 'sf-location': 'FiDi' },
    { 'name': 'Biscoff Coffee Corner', 'star': '★★★', 'sf-location': 'Fisherman’s Wharf' },
    { 'name': 'Fifty/Fifty Coffee and Tea', 'star': '★★★', 'sf-location': 'Inner Richmond' },
    { 'name': 'Beanery', 'star': '★★★', 'sf-location': 'Inner Sunset' },
    { 'name': 'Cafe du Soleil', 'star': '★★', 'sf-location': 'Lower Haight' },
    { 'name': 'Dimmi Tutto Cafe', 'star': '★★★', 'sf-location': 'North Beach' },
    { 'name': 'Peet\'s', 'star': '★', 'sf-location': 'The Marina' },
    { 'name': 'Sightglass', 'star': '★★★★', 'sf-location': 'The Mission' },
    { 'name': 'Contraband Coffee Bar', 'star': '★★★★', 'sf-location': 'Nob Hill' },
    { 'name': 'Martha & Bros Coffee', 'star': '★★★', 'sf-location': 'Noe Valley' },
    { 'name': 'Réveille', 'star': '★★★', 'sf-location': 'North Beach' },
    { 'name': 'Cup Coffee Bar', 'star': '★★★', 'sf-location': 'Outer Mission' },
    { 'name': 'Garden House Cafe', 'star': '★★★', 'sf-location': 'Outer Richmond' },
    { 'name': 'Andytown Coffee Roasters', 'star': '★★★', 'sf-location': 'Outer Sunset' },
    { 'name': 'Jane on Fillmore', 'star': '★★', 'sf-location': 'Pacific Heights' },
    { 'name': 'Saint Frank Coffee', 'star': '★★★', 'sf-location': 'Polk' },
    { 'name': 'Farley’s', 'star': '★★★', 'sf-location': 'Potrero Hill' },
    { 'name': 'House of Snacks', 'star': '★★★', 'sf-location': 'The Presidio' },
    { 'name': 'The Brew', 'star': '★★★', 'sf-location': 'Russian Hill' },
    { 'name': 'Wicked Grounds', 'star': '★★★', 'sf-location': 'SOMA' },
    { 'name': 'Starbucks', 'star': '★', 'sf-location': 'Union Square' },
    { 'name': 'Flywheel Coffee Roasters', 'star': '★★★★★', 'sf-location': 'Upper Haight' }
  ];
  count = req.query.count;
  page = req.query.page;

  if (!req.query['sort-by']) {
    req.query['sort-by'] = 'name';
  }
  if (req.query['sort-by']) {
    sortBy = req.query['sort-by'];
    if (req.query['sort-order'] === 'dsc') {
      sortBy = '-' + sortBy;
    }
    rows.sort(dynamicSort(sortBy));
  }

  toRow = parseInt(count) * parseInt(page);
  fromRow = toRow - parseInt(count);
  prevSortBy = req.query['sort-by'];
  prevSortOrder = req.query['sort-order'];

  rows = rows.filter(function (el) {
    var name, location;
    if (req.query.name && req.query.name.length &&
        req.query['sf-location'] && req.query['sf-location'].length) {
      name = req.query.name.toLowerCase();
      location = req.query['sf-location'].toLowerCase();
      return el.name.toLowerCase().indexOf(name) >= 0 && 
             el['sf-location'].toLowerCase().indexOf(location) >= 0;

    } else if (req.query.name && req.query.name.length) {
      name = req.query.name.toLowerCase();
      return el.name.toLowerCase().indexOf(name) >= 0;

    } else if (req.query['sf-location'] && req.query['sf-location'].length) {
      location = req.query['sf-location'].toLowerCase();
      return el['sf-location'].toLowerCase().indexOf(location) >= 0;

    } else {
      return el;
    }
  });

  if (fromRow >= 0 && toRow >= 0) {
    rowToShow = rows.slice(fromRow, toRow);
  } else {
    rowToShow = rows;
  }

  pagination = {
    'count': parseInt(count),
    'page': parseInt(page),
    'pages': Math.ceil(rows.length / count),
    'size': rows.length
  };
  
  items = {
    'header': [
      {
        'key': 'name', 
        'name': 'Name'
      },
      {
        'key': 'star', 
        'name': 'Star'
      },
      {
        'key': 'sf-location', 
        'name': 'SF Location'
      }
    ],
    'rows': rowToShow,
    'pagination': pagination,
    'sort-by': req.query['sort-by'],
    'sort-order': req.query['sort-order'] || 'asc'
  };
  res.json(items);
});

var exec = require('exec');
app.post('/compile.json', function(req, res){
  var modules = req.body.join(':');
  return exec('node_modules/gulp/bin/gulp.js build-module --env ' + modules, function (error, stdout, stderr) {
    res.json({'success': true });
  });
});

wss.on('connection', function(ws) {
  console.log('Client connected');

  if (config.twitter_auth.consumer_key === 'your-consumer-key') {
    ws.send(JSON.stringify({
      type: 'error',
      title: 'Config Error!',
      msg: 'You should update your docs/config.json'
    }));
  }

  var _stream = null;
  
  var stream = function(tag) {
    if (_stream) {
      _stream.stop();
    }
    _stream = T.stream('statuses/filter', { track: tag });
    _stream.on('tweet', function(tweet) {
      tweet.type = 'tweet';
      ws.send(JSON.stringify(tweet));
    });
  };

  ws.on('message', function(msg) {
    var data = JSON.parse(msg);
    if (data.tag) {
      stream(data.tag);
    }
    if (data.close) {
      _stream.stop();
    }
    return;
  });

  ws.on('close', function() {
    console.log('client disconnect');
    if(_stream) {
      _stream.stop();
    }
  });
});

server.listen(args.port);
