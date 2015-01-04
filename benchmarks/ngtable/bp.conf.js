module.exports = function(config) {
  config.set({
    scripts: [{
      id: 'angular',
      src: 'angular.min.js'
    },{
      id: 'ngTable',
      src: '../../components/ng-table/ng-table.js'
    },{
      src: 'app.js',
    }]
  })
};