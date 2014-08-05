# ng-tasty [![Build Status](https://secure.travis-ci.org/Zizzamia/ng-tasty.png)](http://travis-ci.org/Zizzamia/ng-tasty)
> A tasty suite async [AngularJS](https://angularjs.org/) directives.

## Quick start

Installing via Bower
```
bower install ng-tasty
```

Include the required library:
``` html
<script src="bower_components/ng-tasty/ng-tasty.min.js"></script>
```

Inject the `ngTasty` module into your app:
``` JavaScript
angular.module('myApp', ['ngTasty']);
```


## Development
For running the demo and test the directive you just need install
all the dependencies by `npm`, the [node package manager][npm]. 

```
npm install -g gulp
npm install
bower install
```

### Run demo app

We have preconfigured the demo with a simple development web server.  
The simplest way to start this server is:

```
npm start
// Running on http://localhost:5000/
```


## Testing

There are two kinds of tests in the angular-seed application: Unit tests and End to End tests.

### Running Unit Tests

The easiest way to run the unit tests is to use the supplied npm script:

```
gulp test
```

### End to end testing

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

## Contact

The project was created by [@zizzamia](https://twitter.com/Zizzamia). 

[npm]: https://www.npmjs.org/