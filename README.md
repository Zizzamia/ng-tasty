# #ngTasty [![Bower version](https://badge.fury.io/bo/ng-tasty.svg)](https://github.com/Zizzamia/bower-ng-tasty) [![NPM version](https://badge.fury.io/js/ng-tasty.svg)](https://www.npmjs.org/package/ng-tasty) [![NPM Downloads](http://img.shields.io/npm/dm/ng-tasty.svg)](https://www.npmjs.org/package/ng-tasty) [![Build Status](https://secure.travis-ci.org/Zizzamia/ng-tasty.svg)](https://travis-ci.org/Zizzamia/ng-tasty)
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
For running the dev enviroment you just need install
all the dependencies by `npm`, the [node package manager][npm-site]. 

```
npm install -g bower
npm install
bower install
```

Run dev enviroment, it's a watch script with several task running
like jshint, html2js, build and unit test on the js build files.
```
npm run watch
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
npm test
```

## Changelog

[https://github.com/Zizzamia/ng-tasty/CHANGELOG.md](https://github.com/Zizzamia/ng-tasty/blob/master/CHANGELOG.md)


## Creator

Designed and built by Leonardo Zizzamia, like grandma used to make.

- <http://twitter.com/zizzamia>
- <http://github.com/zizzamia>

Tasty Contributors: [@proudlygeek](https://twitter.com/proudlygeek)

[bower]: https://github.com/Zizzamia/bower-ng-tasty
[bower-badge]: https://badge.fury.io/bo/ng-tasty.svg
[npm-site]: https://www.npmjs.org/
[npm]: https://www.npmjs.org/package/ng-tasty
[npm-badge]: https://badge.fury.io/js/ng-tasty.svg
[npm-downloads]: http://img.shields.io/npm/dm/ng-tasty.svg
[travis]: https://travis-ci.org/Zizzamia/ng-tasty
[travis-badge]: https://secure.travis-ci.org/Zizzamia/ng-tasty.svg