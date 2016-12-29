myApp.controller('oneUserController', ['$scope', 'dashBoardFactory', '$location', '$cookies', '$routeParams', function ($scope, dashBoardFactory, $location, $cookies, $routeParams){
  
  if(!$cookies.get('loginId')) {
    $location.url('/');
  }
  $scope.loginId = $cookies.get('loginId')

  $scope.check = 0;
  $scope.$watch('check', function(newValue, oldValue) {
    dashBoardFactory.getOneUser($routeParams.id, function(data){
      $scope.user = data.data
    })
  })



}])