module.exports = function(config) {
  config.set({
    scripts: [{
      id: 'angular',
      src: 'angular.min.js'
    },{
      id: 'ngTasty',
      src: 'ng-tasty-tpls.js'
    },{
      src: 'ngtasty-benchmark.js',
    }]
  })
};