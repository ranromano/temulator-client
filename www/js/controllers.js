angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, DBUtilities) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = DBUtilities.all();
  $scope.remove = function(chat) {
    DBUtilities.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, DBUtilities) {
  $scope.chat = DBUtilities.get($stateParams.chatId);
})

.controller('AddPlayerCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
