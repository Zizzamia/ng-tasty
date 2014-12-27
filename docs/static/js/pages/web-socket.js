angular.module('myApp.pages.webSocket', [])
.controller('WebSocketCtrl', function($rootScope, $scope, $timeout, webSocket, throttle) {
  $rootScope.page = 'webSocket';

  $scope.tag = 'angularjs';
  $scope.counters = {};
  $scope.tweets = [];
  $scope.echoes = [];
  $scope.showEcho = true;
  $scope.newTweet = true;

  var tweetWs = new webSocket('ws://localhost:3000');
  var echoWs = new webSocket('ws://echo.websocket.org');

  var addTweet = throttle(function (tweet) {
    if ($scope.newTweet) {
      $scope.counters[$scope.currentTag] += 1;
      $scope.tweets.unshift(tweet);
      $scope.$emit('new_tweet');
    }
  }, 2000);

  tweetWs.on('tweet', function(data) {
    var tweet = {
      created_at: new Date(data.created_at),
      username: data.user.name,
      screen_name: data.user.screen_name,
      picture: data.user.profile_image_url,
      extended_entities: data.extended_entities,
      text: data.text
    };
    console.log(tweet)

    $scope.$evalAsync(function() {
      addTweet(tweet);
    });
  });

  tweetWs.on('error', function(error) {
    $scope.$evalAsync(function() {
      $scope.error = error;
    });
  });

  echoWs.on('all', function(msg) {
    $scope.$evalAsync(function() {
      $scope.echoes.push(msg);
      $scope.echoText = '';
    });
  });

  $scope.tagFilter = function() {
    if (!$scope.tag) { 
      return; 
    }
    $scope.newTweet = true;
    tweetWs.send({tag: $scope.tag});
    $scope.currentTag = angular.copy($scope.tag);
    $scope.counters[$scope.currentTag] = $scope.counters[$scope.currentTag] || 0;
  };

  $scope.stopFilter = function() {
    $scope.newTweet = false;
    tweetWs.send({close: true});
  }

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

  $timeout(function () {
    Rainbow.color();
  }); 
});
