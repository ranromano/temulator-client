angular.module('starter.controllers', [])

.controller('SigninCtrl', function($scope, DBUtilities, $state) {

    // Get user name from local storage
    $scope.user = DBUtilities.getUserName();

    // Check if user is logged in
    if ($scope.user) {
        DBUtilities.populateFriendsList();
        $state.go('tab.friends');
    }

    $scope.signin = function() {
        var username = document.getElementById("usernameSignin").value;
        var password = document.getElementById("passwordSignin").value;

        DBUtilities.userSignIn(username, password);
    };

})


.controller('FriendsCtrl', function($scope, DBUtilities, $ionicPopup, TeamulateUtilities, $state) {
    $scope.friends = DBUtilities.getFriendsList();
    $scope.doRefresh = function() {
      DBUtilities.populateFriendsList();
      $scope.friends = DBUtilities.getFriendsList();
      $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.$on('friendsListUpdated', function () {
        console.log("Logger: friendsListUpdated");
        $scope.friends = DBUtilities.getFriendsList();
    });
    $scope.editPlayer = function(friend) {
        $state.go("tab.friends-edit", { "userName": friend.username});
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
            title: 'Choose a number of players that can be divided into even teams (4 or more)'
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
            alertPopup.then(function(){
                $state.go('tab.teams');
            })
        });
    }
    };
})

.controller('EditFriendCtrl', function($scope, $stateParams, DBUtilities, $state) {
    $scope.friend = $stateParams.userName;
    $scope.updateRank = function(){
        var rank = document.getElementById("editPlayerRank").value;
        console.log("Called addplayerrank with" + $scope.friend + "and " + rank);
        DBUtilities.addPlayerRank($scope.friend, rank);
        $state.go('tab.friends');
    }
    $scope.removeFriend = function(){
        $scope.friend = $stateParams.userName;
        DBUtilities.removeFriendFromFriendList($scope.friend);
        $state.go('tab.friends');

    }

})
.controller('AddPlayerCtrl', function($scope, $ionicPopup, DBUtilities) {
  $scope.addPlayer = function() {
    var player = document.getElementById("playerName").value;
    var rank = document.getElementById("playerRank").value;
    DBUtilities.addFriend(player, rank);
  };
})

.controller('TeamsCtrl', function($scope, TeamulateUtilities) {
    $scope.teams = TeamulateUtilities.getTeams();
})

.controller('SignoutCtrl', function($scope, DBUtilities, $state) {
    $scope.signout = function(){
        // Clear user data from local storage
        DBUtilities.deleteUserData();

        $state.go('signin');
    }
});