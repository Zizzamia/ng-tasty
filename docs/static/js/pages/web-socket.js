angular.module('myApp.pages.webSocket', [])
.controller('WebSocketCtrl', function($scope, webSocket) {
  $scope.tag = 'angularjs';
  $scope.counters = {};
  $scope.tweets = [];
  $scope.echoes = [];
  $scope.showEcho = true;

  var tweetWs = new webSocket('ws://localhost:3000');
  var echoWs = new webSocket('ws://echo.websocket.org');

  tweetWs.on('tweet', function(data) {
    var tweet = {
      created_at: new Date(data.created_at),
      username: data.user.name,
      screen_name: data.user.screen_name,
      picture: data.user.profile_image_url,
      text: data.text
    };

    $scope.$apply(function() {
      $scope.counters[$scope.currentTag] += 1;
      $scope.tweets.unshift(tweet);
      $scope.$emit('new_tweet');
    });
  });

  tweetWs.on('error', function(error) {
    $scope.$apply(function() {
      $scope.error = error;
    });
  });

  echoWs.on('all', function(msg) {
    $scope.$apply(function() {
      $scope.echoes.push(msg);
    });
  });

  $scope.tagFilter = function() {
    if (!$scope.tag) { 
      return; 
    }

    tweetWs.send({tag: $scope.tag});
    $scope.currentTag = angular.copy($scope.tag);
    $scope.counters[$scope.currentTag] = $scope.counters[$scope.currentTag] || 0;
  };

  $scope.echo = function() {
    echoWs.send($scope.echoText);
  };

  $scope.open = function(open) {
    $scope.showEcho = false;
    $scope.showTwitterStreams = false;

    if (open === 'echo') {
      $scope.showEcho = true;
    } else if (open === 'twitter-streams') {
      $scope.showTwitterStreams = true;
    }
  };
});
