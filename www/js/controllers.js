angular.module('app.controllers', [])
     
.controller('newWalletCtrl', function($scope) {

})
   
.controller('restoreWalletCtrl', function($scope) {

})
   
.controller('sendEtherCtrl', function($scope) {

})

.controller('sendMessageCtrl', function($scope) {
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		document.getElementById('sendFrom').value = storage.getItem('messageFromId');;
		// setup filter for messages on topic
		var filter = web3.shh.filter({
		    to: storage.getItem('messageFromId')
		});

		// watch for changes on filter
		filter.watch(function (err, result) {
		    document.getElementById('showMessage').innerHTML = web3.toAscii(result.payload);
		});
	});

})
      
.controller('showAddressesCtrl', function($scope) {
	$scope.$on("$ionicView.beforeEnter", function(event, data){
        showAddresses();
    });
})
   
.controller('functionCallCtrl', function($scope) {

})
   
.controller('homeCtrl', function($scope) {

})
 