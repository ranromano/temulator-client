angular.module('starter.services', [])

.factory('DBUtilities', function($http) {
  var friends = [];

  return {
    populateFriendsList: function() {
        $http.get('http://teamulator.herokuapp.com/users/ran/friends').
            then(function(response) {
                friends = response.data;
            }, function(response) {
        });
    },
    getFriendsList: function() {
       return friends;
    },
    editPlayer: function(friend) {

    }
  };
});
