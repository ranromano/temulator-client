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
        setInLocalStorage('userName',name);
        userName = name;
    }
  
    function updateFriendsList(){
        $http.get('http://teamulator.herokuapp.com/users/'+ userName + '/friends').
            then(function(response) {
                setObjectInLocalStorage('friendsList',response.data);
                console.log("Logger: received friends list from server");
            }, function(response) {
                console.log("ERROR: Could not retrive friends list from server");
        });
    }

    function updateRank(user, rank){
        $http.put('http://teamulator.herokuapp.com/users/'+ user ,{rank: rank}).
            then(function(response) {
              console.log("Logger: updated", user, " rank");
            }, function(response) {
              console.log("ERROR: Could not update", user, " rank");
            });
    };



  return {
    populateFriendsList: function() {
        updateFriendsList();
    },

    addFriend: function(friendName, rank){
      $http.post('http://teamulator.herokuapp.com/users/'+ userName + '/friends',{friend: friendName}).
          then(function(response) {
            console.log("Logger: ", friendName, "added to " + userName + " friends list");
            updateRank(friendName, rank);
              $scope.doRefresh();
          }, function(response) {
            console.log("ERROR: Could not add", friendName, "to " + userName + " friends list");
          });

    },

    setUserName: setUserName,
    getUserName: function() {
      return getFromLocalStorage('userName', null);
    },
    getFriendsList: function() {
      return getObjectFromLocalStorage('friendsList');
    },
    
    editPlayer: function(friend) {
    },

    addPlayerRank: function(user, rank) {
      updateRank(user, rank);
    },

    userSignIn: function(user, password){
      $http.post('http://teamulator.herokuapp.com/signup/',{username: user, password: password}).
          then(function(response) {
            console.log("Logger: ", user, "added to DB");
            setUserName(user);
            updateFriendsList();
          }, function(response) {
            console.log("ERROR: Could not add", user, "to DB");
          });
    }
  };
});
