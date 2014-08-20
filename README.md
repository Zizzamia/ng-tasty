# #ngTasty [![Bower version](bower-badge)](bower) [![NPM version](npm-badge)](npm) [![NPM Downloads](npm-downloads)](npm) [![Build Status](travis-badge)](travis)
> A lightweight, flexible, and tasty collection of reusable UI components for [AngularJS](https://angularjs.org/).

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
For running the dev enviroment you just need install
all the dependencies by `npm`, the [node package manager][npm-site]. 

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

Designed and built by Leonardo Zizzamia, like grandma used to make.

- <http://twitter.com/zizzamia>
- <http://github.com/zizzamia>

[bower]: https://github.com/Zizzamia/bower-ng-tasty
[bower-badge]: https://badge.fury.io/bo/ng-tasty.svg
[npm-site]: https://www.npmjs.org/
[npm]: https://www.npmjs.org/package/ng-tasty
[npm-badge]: https://badge.fury.io/js/ng-tasty.svg
[npm-downloads]: http://img.shields.io/npm/dm/ng-tasty.svg
[travis]: https://secure.travis-ci.org/Zizzamia/ng-tasty.svg
[travis-badge]: https://secure.travis-ci.org/Zizzamia/ng-tasty.svg