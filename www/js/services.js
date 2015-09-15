angular.module('starter.services', [])

.factory('DBUtilities', function($http, $window) {

  var userName = getFromLocalStorage('userName', null);

  function setInLocalStorage(key, value) {
    $window.localStorage[key] = value;
  };

  function getFromLocalStorage(key, defaultValue) {
    return $window.localStorage[key] || defaultValue;
  };

  function setObjectInLocalStorage(key, value) {
    $window.localStorage[key] = JSON.stringify(value);
  };

  function getObjectFromLocalStorage(key) {
    return JSON.parse($window.localStorage[key] || '{}');
  };
  
  function updateFriendsList(){
	  $http.get('http://teamulator.herokuapp.com/users/'+ userName + '/friends').
				then(function(response) {
					setObjectInLocalStorage('friendsList',response.data);
					console.log("Logger: received friends list from server");
				}, function(response) {
					console.log("ERROR: Could not retrive friends list from server");
			});
  };

  return {
    populateFriendsList: function() {
        updateFriendsList();
    },

    addPlayer: function(friendName){
      $http.post('http://teamulator.herokuapp.com/users/'+ userName + '/friends',{friend: friendName}).
          then(function(response) {
            console.log("Logger: ", friendName, "added to " + userName + " friends list");
            updateFriendsList();
          }, function(response) {
            console.log("ERROR: Could not add", friendName, "to " + userName + " friends list");
          });

    },

    setUser: function(name) {
      setInLocalStorage('userName',name);
      userName = name;
    },
    getUser: function() {
      return getFromLocalStorage('userName', null);
    },
    setFriendsList: function(list) {
      setObjectInLocalStorage('friendsList',list)
    },
    getFriendsList: function() {
      return getObjectFromLocalStorage('friendsList');
    },
    
    editPlayer: function(friend) {

    }
  };

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
