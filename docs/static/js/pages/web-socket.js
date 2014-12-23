angular.module('myApp.pages.webSocket', [])
.factory('throttle', function ($timeout) {
  return function (fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last, promise;
    return function () {
      var context = scope || this;
      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        $timeout.cancel(promise);
        promise = $timeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }
})
.controller('WebSocketCtrl', function($rootScope, $scope, webSocket, throttle) {
  $rootScope.page = 'webSocket';

  $scope.tag = 'angularjs';
  $scope.counters = {};
  $scope.tweets = [];
  $scope.echoes = [];
  $scope.showEcho = true;
  $scope.stopFilter = false;

  var tweetWs = new webSocket('ws://localhost:3000');
  var echoWs = new webSocket('ws://echo.websocket.org');

  var addTweet = throttle(function (tweet) {
    $scope.counters[$scope.currentTag] += 1;
    $scope.tweets.unshift(tweet);
    if (!$scope.stopFilter) {
      $scope.$emit('new_tweet');
    }
  }, 2000);

  tweetWs.on('tweet', function(data) {
    var tweet = {
      created_at: new Date(data.created_at),
      username: data.user.name,
      screen_name: data.user.screen_name,
      picture: data.user.profile_image_url,
      text: data.text
    };

    $scope.$apply(function() {
      addTweet(tweet);
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
    $scope.stopFilter = false;
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
