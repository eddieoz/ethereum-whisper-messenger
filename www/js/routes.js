angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.newWallet', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/newWallet.html',
        controller: 'newWalletCtrl'
      }
    }
  })

  .state('restoreWallet', {
    url: '/page3',
    templateUrl: 'templates/restoreWallet.html',
    controller: 'restoreWalletCtrl'
  })

  .state('sendEther', {
    url: '/page4',
    templateUrl: 'templates/sendEther.html',
    controller: 'sendEtherCtrl'
  })

  .state('sendMessage', {
    url: '/page10',
    templateUrl: 'templates/sendMessage.html',
    controller: 'sendMessageCtrl'
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.showAddresses', {
    url: '/page7',
    views: {
      'tab2': {
        templateUrl: 'templates/showAddresses.html',
        controller: 'showAddressesCtrl'
      }
    }
  })

  .state('tabsController.functionCall', {
    url: '/page8',
    views: {
      'tab3': {
        templateUrl: 'templates/functionCall.html',
        controller: 'functionCallCtrl'
      }
    }
  })

  .state('home', {
    url: '/page9',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

$urlRouterProvider.otherwise('/page9')

  

});