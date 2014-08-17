# #ngTasty [![Bower version](https://badge.fury.io/bo/ng-tasty.svg)](http://badge.fury.io/bo/ng-tasty) [![NPM version](https://badge.fury.io/js/ng-tasty.svg)](http://badge.fury.io/js/ng-tasty) [![Build Status](https://secure.travis-ci.org/Zizzamia/ng-tasty.svg)](http://travis-ci.org/Zizzamia/ng-tasty)
> A lightweight, flexible, and tasty collection of reusable UI components for [AngularJS](https://angularjs.org/).

Live demo visit http://zizzamia.com/ng-tasty/

## Quick start

Installing via Bower
```
bower install ng-tasty
```
or installing Via NPM
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
For running the dev enviroment you just need install
all the dependencies by `npm`, the [node package manager][npm]. 

```
npm install -g gulp
npm install -g bower
npm install
bower install
```

Run dev enviroment, it's a watch script with several task running
like jshint, html2js, build and unit test on the js build files.
```
gulp watch
```

#### Run demo app

We have preconfigured the demo with a simple development web server.  
The simplest way to start this server is:

```
npm start
// Running on http://localhost:3000/
```

#### Unit Tests

The easiest way to run the unit tests is to use the supplied npm script:

```
gulp test
```

## Changelog

### v0.2.4 (master, released on August 13th 2014)
- Added a new table that has sorting and pagination client side
- Improved `setDirectivesValues` in `ngTasty.table`
- Fixed issues in `ngTasty.filter.range`
- Fixed issue in `ngTasty.service.setProperty`

## Creator

**Leonardo Zizzamia**

- <http://twitter.com/zizzamia>
- <http://github.com/zizzamia>


[npm]: https://www.npmjs.org/