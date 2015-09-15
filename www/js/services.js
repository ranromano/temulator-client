angular.module('starter.services', [])

.factory('DBUtilities', function($http, $window) {
        var userName = getFromLocalStorage('userName', null);

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
            $http.post('http://teamulator.herokuapp.com/users/' + userName + '/friends', {friend: friendName}).
                then(function (response) {
                    console.log("Logger: ", friendName, "added to " + userName + " friends list");
                    updateRank(friendName, rank);
                    $scope.doRefresh();
                }, function (response) {
                    console.log("ERROR: Could not add", friendName, "to " + userName + " friends list");
                });

        }

        function setFriendsList(list) {
            setObjectInLocalStorage('friendsList', list);
        }

        function getFriendsList() {
            return getObjectFromLocalStorage('friendsList');
        }

        return {
            setUserName: setUserName,
            getUserName: getUserName,
            getFriendsList: getFriendsList,
            populateFriendsList: updateFriendsList,
            addFriend: addFriend,
            addPlayerRank: updateRank,
            editPlayer: function (playerName) {
            },
            userSignIn: function (user, password) {
                $http.post('http://teamulator.herokuapp.com/signup/', {username: user, password: password}).
                    then(function (response) {
                        console.log("Logger: ", user, "added to DB");
                        setUserName(user);
                        updateFriendsList();
                    }, function (response) {
                        console.log("ERROR: Could not add", user, "to DB");
                    });
            }
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
