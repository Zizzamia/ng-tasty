var express = require('express');
var app = express();

app.set('views', 'example/');
app.engine('html', require('ejs').renderFile);
app.use('/components',  express.static('components'));
app.use('/src',  express.static('src'));
app.use('/template',  express.static('template'));

app.get('/', function(req, res){
  res.render('index.html');
});

app.get('/table.json', function(req, res){
  var items, pagination;
  pagination = {
    "count": req.query.count,
    "page": req.query.page,
    "pages": 5,
    "size": 20
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
    "rows": [{
        "name": "ritual", 
        "star": "★★★★★", 
        "sf-location": "hayes valley"
      },{
        "name": "coffee bar", 
        "star": "★★★★", 
        "sf-location": "financial distric"
      },{
        "name": "blue bootle", 
        "star": "★★★★★", 
        "sf-location": "hayes valley"
      }
    ],
    "pagination": pagination,
    "sortBy": req.query.sortBy,
    "sortOrder": req.query.sortOrder
  };
  res.json(items);
});

app.listen(3000);