angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope) {})

.controller('FriendsCtrl', function($scope, DBUtilities, $ionicPopup) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.friends = DBUtilities.getFriendsList();
  $scope.editPlayer = function(friend) {
    DBUtilities.editPlayer(friend);
  };
  $scope.teamulate = function(friends) {
      var selectedList = [];
    angular.forEach(friends, function(friend) {
        if (friend.isChecked) {
            selectedList.push(friend);
        }
    });
    var confirmPopup = $ionicPopup.confirm({
        title: selectedList.length.toString() + ' players were selected',
        template: 'select the number of teams'
    });
    confirmPopup.then(function(res) {
        if(res) {
            console.log('You are sure');
        } else {
            console.log('You are not sure');
        }
    });
  };
})

.controller('AddPlayerCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
