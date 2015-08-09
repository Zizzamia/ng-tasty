# #ngTasty 
[![Bower version](https://badge.fury.io/bo/ng-tasty.svg)](https://github.com/Zizzamia/bower-ng-tasty) [![NPM version](https://badge.fury.io/js/ng-tasty.svg)](https://www.npmjs.org/package/ng-tasty) [![NPM Downloads](http://img.shields.io/npm/dm/ng-tasty.svg)](https://www.npmjs.org/package/ng-tasty) [![Build Status](https://secure.travis-ci.org/Zizzamia/ng-tasty.svg)](https://travis-ci.org/Zizzamia/ng-tasty) [![Coverage Status](https://coveralls.io/repos/Zizzamia/ng-tasty/badge.svg?branch=master)](https://coveralls.io/r/Zizzamia/ng-tasty?branch=master)
> A lightweight, flexible, and tasty collection of reusable UI components for [AngularJS](https://angularjs.org/), like grandma used to make.

Live demo visit http://zizzamia.com/ng-tasty/

## Quick start

Installing via [Bower](bower)
```
bower install ng-tasty
```
or installing via [NPM](npm)
```
npm install ng-tasty
```

Include the required bower component:
``` html
<script src="bower_components/ng-tasty/ng-tasty-tpls.min.js"></script>
```

Inject the `ngTasty` module into your app:
``` JavaScript
angular.module('myApp', ['ngTasty']);
```


## Development
For running the dev environment you just need install
all the dependencies by `npm`, the [node package manager][npm-site]. 

```
npm install -g bower
npm install -g gulp
npm install -g http-server
npm install -g protractor
webdriver-manager update
npm install
bower install
```

Run dev environment, it's a watch script with several task running
like jshint, html2js, build and unit test on the js build files.
```
gulp build
```

During development keep running all main gulp task by using the `watch` task.
```
gulp watch
```

#### Run demo app

We have pre-configured the demo with a simple development web server.  
Here the [Website Readme](https://github.com/Zizzamia/ng-tasty/blob/master/website/README.md).


#### Unit Tests

The easiest way to run the unit tests is to use the supplied gulp script:

```
gulp test
```

## Docs

The main docs you will find at http://zizzamia.com/ng-tasty/ , here the list of all components, service,
filters supported.

#### Component

- Table : http://zizzamia.com/ng-tasty/directive/table/simple
- Table server side : http://zizzamia.com/ng-tasty/directive/table-server-side/simple

#### Service

- WebSocket : http://zizzamia.com/ng-tasty/service/websocket
- Debounce : http://zizzamia.com/ng-tasty/service/debounce
- Throttle : http://zizzamia.com/ng-tasty/service/throttle

#### Filter

- Filter Int : http://zizzamia.com/ng-tasty/filter/filter-int
- Range : http://zizzamia.com/ng-tasty/filter/
- Camelize : http://zizzamia.com/ng-tasty/filter/camelize
- Slugify : http://zizzamia.com/ng-tasty/filter/slugify


## Benchpress
Benchpress allows creation and sampling of macro benchmarks to compare performance of real world web applications.
```
npm install -g benchpress
```

Bower install all benchmark dependencies
```
cd benchmarks/dist/
bower install
```

Run ngTasty benchmark from base folder
```
bower install
protractor benchmarks/protractor.conf.js --specs benchmarks/dist/benchmark.spec.js
```

Open benchmark with Chrome
```
http-server -p 8000
http://localhost:8000/benchmarks/dist/
```

## Latest Benchmark v0.5.2

ngtasty.table.reference
```
          gcAmount |   gcAmountInScript |             render |             script
------------------ | ------------------ | ------------------ | ------------------
            621.10 |             194.23 |              11.14 |               9.83
```
ngtasty.table.collection
```
          gcAmount |   gcAmountInScript |             render |             script
------------------ | ------------------ | ------------------ | ------------------
            766.28 |               0.00 |              11.06 |              11.17
```
ngtasty.table.equality
```
          gcAmount |   gcAmountInScript |             render |             script
------------------ | ------------------ | ------------------ | ------------------
          29557.73 |           41947.09 |              10.86 |             110.40
```
More about how I run this benchmark on my talk [#ngTasty Building high performance measurable directives](https://www.youtube.com/watch?v=e6J_JZaIOAQ) at ngconf


## Changelog

[https://github.com/Zizzamia/ng-tasty/CHANGELOG.md](https://github.com/Zizzamia/ng-tasty/blob/master/CHANGELOG.md)


## Who's using #ngTasty? 
- [Twitter](https://twitter.com) Internal Tools
- [Opentaste](http://opentaste.co) Admin


## Creator

Designed and built by Leonardo Zizzamia, like grandma used to make.

- <http://twitter.com/zizzamia>
- <http://github.com/zizzamia>

Tasty Contributors: [@proudlygeek](https://twitter.com/proudlygeek), [@wesww](https://twitter.com/w3sw), [@aganglada](https://twitter.com/aganglada), [@alexcasalboni](https://twitter.com/alex_casalboni), [@bogdan-alexandrescu](https://twitter.com/balx), [@yagoferrer](https://twitter.com/jsYago)

[bower]: https://github.com/Zizzamia/bower-ng-tasty
[bower-badge]: https://badge.fury.io/bo/ng-tasty.svg
[npm-site]: https://www.npmjs.org/
[npm]: https://www.npmjs.org/package/ng-tasty
[npm-badge]: https://badge.fury.io/js/ng-tasty.svg
[npm-downloads]: http://img.shields.io/npm/dm/ng-tasty.svg
[travis]: https://travis-ci.org/Zizzamia/ng-tasty
[travis-badge]: https://secure.travis-ci.org/Zizzamia/ng-tasty.svg
