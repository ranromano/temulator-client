angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, DBUtilities) {
      DBUtilities.setUser('volo');
      $scope.settings = {
        userName: DBUtilities.getUser()
      };
      /*
      // Check if user is loged in
      var userName = 'ran';

      var userName = LocalStorage.getUser();

      if (userName){
        $scope.settings = {
          userName: true
        };
        // move to home tab
      } else {
        // load login screen
        // Get username and password
        // send them to server
        // save user localy
        LocalStorage.setUser(userName);
      }
      */

    })

.controller('FriendsCtrl', function($scope, DBUtilities, $ionicPopup) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.friends = DBUtilities.getFriendsList();
  $scope.doRefresh = function() {
      DBUtilities.populateFriendsList();
      $scope.friends = DBUtilities.getFriendsList();
      $scope.$broadcast('scroll.refreshComplete');
  };
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

.controller('AddPlayerCtrl', function($scope, DBUtilities) {
  $scope.addPlayer = function() {
    var player = document.getElementById("playerName").value;
    DBUtilities.addPlayer(player);
  };
});
