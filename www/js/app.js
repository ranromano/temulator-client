
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('signin', {
                url: '/signin',
                templateUrl: 'templates/signin.html',
                controller: 'SigninCtrl'
            })
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            .state('tab.add-player', {
                url: '/addPlayer',
                views: {
                    'tab-add-player': {
                        templateUrl: 'templates/tab-add-player.html',
                        controller: 'AddPlayerCtrl'
                    }
                }
            })

            .state('tab.friends', {
                url: '/friends',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/tab-friends.html',
                        controller: 'FriendsCtrl'
                    }
                }
            })
            .state('tab.friends-edit', {
                url: '/friends/:userName',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/tab-friends-editFriend.html',
                        controller: 'EditFriendCtrl'
                    }
                }
            })

            .state('tab.teams', {
                cache: false,
                url: '/teams',
                views: {
                    'tab-teams': {
                        templateUrl: 'templates/tab-teams.html',
                        controller: 'TeamsCtrl'
                    }
                }
            })
            .state('tab.signout', {
                url: '/signout',
                views: {
                    'tab-signout': {
                        templateUrl: 'templates/logout.html',
                        controller: 'SignoutCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/signin');
    });
