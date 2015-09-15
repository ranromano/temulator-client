angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, DBUtilities) {
    // Check if user is logged in
    var user = DBUtilities.getUserName();

    if (user){
        // 1. Say hello user
        // 2. move to home screen
    } else {
        // Show login screen
    }

    $scope.signin = function() {
        var user = document.getElementById("usernameSignin").value;
        var password = document.getElementById("passwordSignin").value;
        DBUtilities.userSignIn(user, password);
    };

})

.controller('FriendsCtrl', function($scope, DBUtilities, $ionicPopup, TeamulateUtilities) {
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
    var numberOfTeams;
    var numberOfTeamsButtons = [] ;
    for (var i = 2; i <= selectedList.length / 2; i++) {
        if ((selectedList.length % i == 0)) {
        numberOfTeamsButtons.push({
            text: i.toString(),
            type: 'button-positive',
            onTap: function(e) {
                numberOfTeams = parseInt(e.path[0].innerText);
            }
        });
    };
    }
    if (numberOfTeamsButtons.length == 0) {
        var alertPopup = $ionicPopup.alert({
            title: 'Choose a number of players that can be divided into even teams'
        });
    }  else {
        var NumberOfteamsSelectionPopup = $ionicPopup.show({
            title: selectedList.length.toString() + ' players were selected',
            subTitle: 'select the number of teams',
            buttons: numberOfTeamsButtons
        });
        NumberOfteamsSelectionPopup.then(function(res) {
            TeamulateUtilities.teamulate(selectedList, numberOfTeams);
            var alertPopup = $ionicPopup.alert({
                title: 'Check out who is against who in the teams tab',
                template: 'Let the best team win!'
            });
        });
    }
  };
})

.controller('AddPlayerCtrl', function($scope, DBUtilities) {
  $scope.addPlayer = function() {
    var player = document.getElementById("playerName").value;
    var rank = document.getElementById("playerRank").value;
    DBUtilities.addFriend(player, rank);
  };
})

.controller('TeamsCtrl', function($scope, TeamulateUtilities) {
    $scope.teams = TeamulateUtilities.getTeams();
});