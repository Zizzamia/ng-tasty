module.exports = function(config) {
  config.set({
    scripts: [{
      id: 'angular',
      src: '../../components/angular/angular.js'
    },{
      id: 'ngTasty',
      src: '../../dist/ng-tasty-tpls.js'
    },{
      src: 'app.js',
    }]
  })
};