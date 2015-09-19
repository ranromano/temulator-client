angular.module('starter.services', [])

.factory('DBUtilities', function($http, $window, $rootScope, $ionicPopup, $state) {
        var userName = getFromLocalStorage('userName', null);

        var friendsNames = new Set([]);

        // Local storage functions
        function setInLocalStorage(key, value) {
            $window.localStorage[key] = value;
        }

        function getFromLocalStorage(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        }

        function setObjectInLocalStorage(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        }

        function getObjectFromLocalStorage(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }

        function setUserName(name) {
            setInLocalStorage('userName', name);
            userName = name;
        }

        function getUserName() {
            return getFromLocalStorage('userName', null);
        }

        // Retrieve an updated version of the user friends list from the server.
        // Update the locally saved list.
        function updateFriendsList() {
            $http.get('http://teamulator.herokuapp.com/users/' + userName + '/friends').
                then(function (response) {
                    setFriendsList(response.data);
                    console.log("Logger: received friends list from server");
                }, function (response) {
                    console.log("ERROR: Could not retrieve friends list from server");
                });
        }

        function updateRank(user, rank) {
            $http.put('http://teamulator.herokuapp.com/users/' + user, {rank: rank}).
                then(function (response) {
                    console.log("Logger: updated", user, " rank");
                }, function (response) {
                    console.log("ERROR: Could not update", user, " rank");
                });
        }

        function addFriend(friendName, rank) {
            // Check that friends name does not exist in friends
            if (friendsNames.has(friendName)) {
                console.log("ERROR: ", friendName, "already exist in friends list");
                $ionicPopup.alert({
                    title: 'Friend already exist'
                });
            } else {
                // Add friend to list in DB
                $http.post('http://teamulator.herokuapp.com/users/' + userName + '/friends', {friend: friendName}).
                    then(function (response) {
                        console.log("Logger: ", friendName, "added to " + userName + "'s friends list");
                        $ionicPopup.alert({
                            title: 'User added!'
                        });
                        if (rank) {
                            updateRank(friendName, rank);
                        }
                        updateFriendsList();
                    }, function (response) {
                        console.log("ERROR: Could not add", friendName, "to " + userName + "'s friends list");
                        $ionicPopup.alert({
                            title: 'Error: User was not added, something went wrong :('
                        });
                    });
            }
        }

        function removeFriendFromFriendList(friendName){
            $http.delete('http://teamulator.herokuapp.com/users/' + userName + '/friends', {friend: friendName}).
                then(function (response) {
                    console.log("Logger: ", friendName, "removed from " + userName + "'s friends list");
                    $ionicPopup.alert({
                        title: 'User removed'
                    });
                    friendsNames.delete(friendName);
                    updateFriendsList();
                }, function (response) {
                    console.log("ERROR: Could not add", friendName, "to " + userName + "'s friends list");
                    $ionicPopup.alert({
                        title: 'Error: User was not added, something went wrong :('
                    });
                });
        }


        function setFriendsList(list) {
            friendsNames.clear();
            for (item in list) {
                friendsNames.add(list[item].username);
            };
            setObjectInLocalStorage('friendsList', list);
            $rootScope.$broadcast('friendsListUpdated');
        }

        function getFriendsList() {
            return getObjectFromLocalStorage('friendsList');
        }

        function userSignIn(user, password) {
            if (!password) {
                $ionicPopup.alert({
                    title: 'Please enter a password'
                });
            }
            $http.post('http://teamulator.herokuapp.com/signup/', {username: user, password: password}).
                then(function (response) {
                    console.log("Logger: ", user, "added to DB");
                    setUserName(user);
                    updateFriendsList();
                    $state.go('tab.friends');
                }, function (response) {
                    console.log("ERROR: Could not add", user, "to DB");
                    $ionicPopup.alert({
                        title: 'Username already exist, please choose another one'
                    });
                });
        }

        return {
            setUserName: setUserName,
            getUserName: getUserName,
            getFriendsList: getFriendsList,
            deleteUserData: function(){
                $window.localStorage.clear();
                friendsNames.clear();
                updateFriendsList();

            },

            populateFriendsList: updateFriendsList,
            addFriend: addFriend,
            addPlayerRank: function(user, rank) {
                updateRank(user, rank);
            },
            editPlayer: function (playerName) {
            },
            userSignIn: userSignIn,
            removeFriendFromFriendList: removeFriendFromFriendList
        }
    })

.factory('TeamulateUtilities', function() {
        var teams = [];

        function comparePlayer (player1, player2) {
            if (player1.rank == player2.rank) {
                return Math.random() - Math.random();
            }
            return player1.rank - player2.rank;
        }

        function compareTeams (team1, team2) {
            return team2.teamRank - team1.teamRank;
        }

        return {
            teamulate: function (players, numberOfTeams) {
                teams = [];
                for (var i = 0; i < numberOfTeams; i++) {
                    teams.push({teamRank: 0, teamMembers: []})
                }

                players.sort(comparePlayer);

                var teamsPointer = 0;

                for (var i= 0; i < players.length; i++){
                    if (teamsPointer > teams.length - 1) {
                        teamsPointer = 0;
                        teams.sort(compareTeams);
                    }
                    teams[teamsPointer].teamRank += players[i].rank;
                    teams[teamsPointer].teamMembers.push(players[i]);
                    teamsPointer++;
                }
            },

            getTeams: function () {
                console.info(teams);
                return teams;
            }
        };
});
