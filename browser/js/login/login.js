app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('home');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});

// /////////////////////////////

// app.directive('login', function () {
//     return {
//         restrict: 'E',
//         controller: 'LoginCtrl', 
//         templateUrl: 'js/login/login.html'
//     };
// });

// app.controller('LoginCtrl', function ($scope, $mdDialog, $state, AuthService) {
//     $scope.openDialog = function ($event) {
//         $mdDialog.show({
//           clickOutsideToClose: true,
//           controller: function($mdDialog) {
//             // Save the clicked item
//             this.item = item;
//             // Setup some handlers
//             this.close = function() {
//               $mdDialog.cancel();
//             };
//             this.submit = function() {
//               $mdDialog.hide();
//             };
//           },
//           controllerAs: 'dialog',
//           templateUrl: "js/login/login.html",
//           targetEvent: $event
//         });
//     };
// });

// /////////////////////////////

// app.controller('ShareCtrl', function ($http, $scope, $mdDialog, InstructionsFactory, FilterFactory) {
//   function requestReelVideo (instructions) {
//     return $http.post('/api/videos/makeit', instructions);
//   }
//   function promisifiedDownload (instructions) {
//     requestReelVideo(instructions)
//       .then(function (resp) {
//         if (resp.status===201) {
//           var url = '/api/videos/download/'+resp.data;
//           // this "append" is what actually causes the video file to download to the user's computer
//           $("body").append("<iframe src=" + url + " style='display: none;' ></iframe>");
//         }
//         else {
//           console.error('The server responded with status', resp.status);
//         }
//       });
//   }

//     $scope.socialNetworks = [
//     'Download', 
//     // commented out Twitter to make this menu smaller for now
//     // 'Twitter', 
//     'Facebook', 
//     'Instagram'
//     ];

//     $scope.isOpen = false;
//     $scope.openDialog = function($event, item) {
//       console.log('oh hey I was clicked')
//       var instructions = InstructionsFactory.get();
//       FilterFactory.addFiltersToAllInstructions(instructions);
//       console.log(instructions);
//       if (item==='Download') {
//         promisifiedDownload(instructions);
//       }
//       else {
//         // Show the dialog
        
//       }
//     }
// });
