var benchpress = require('benchpress');
var SeleniumWebDriverAdapter = 
    require('benchpress/src/webdriver/selenium_webdriver_adapter').SeleniumWebDriverAdapter;
var runner = new benchpress.Runner([
  benchpress.bind(benchpress.WebDriverAdapter).toFactory(
    function() { return new SeleniumWebDriverAdapter(global.browser); }, []
  ),
  benchpress.bind(benchpress.Options.DEFAULT_DESCRIPTION).toValue({'tree':'baseline'})
]);
var baseUrl = 'http://localhost:8080/benchmarks';

describe('deep tree baseline', function() {
  [ 
    'reference',
    'collection',
    'equality'
  ].forEach(function(benchmarkType) {
    it('should work '+benchmarkType, function (done) {
      //Tells protractor this isn't an Angular 1 application
      browser.ignoreSynchronization = true;
      //Load the benchmark
      browser.get(baseUrl+'/dist?'+benchmarkType);
      return runner.sample({
        id: 'ngtasty.'+benchmarkType,
        execute: function () {
          $('#'+benchmarkType).click();
          $('#destroyDom').click();
          $('#createDom').click();
        }
      }).then(done, done.fail);
    });
  });
});