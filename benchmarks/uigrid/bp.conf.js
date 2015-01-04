module.exports = function(config) {
  config.set({
    scripts: [{
      id: 'angular',
      src: 'angular.js'
    },{
      id: 'angular-touch',
      src: 'angular-touch.js'
    },{
      id: 'angular-animate',
      src: 'angular-animate.js'
    },{
      id: 'ngTable',
      src: '../../components/angular-ui-grid/ui-grid.js'
    },{
      src: 'app.js',
    }]
  })
};