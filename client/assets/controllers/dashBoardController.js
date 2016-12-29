myApp.controller('dashBoardController', ['$scope', 'dashBoardFactory', '$location', '$routeParams','$cookies', function ($scope, dashBoardFactory, $location, $routeParams, $cookies){
	
if(!$cookies.get('loginId')) {
    $location.url('/');
  }

  dashBoardFactory.getTopics(function (data){
      $scope.topics = data.data;
  })
  $scope.$watch('check', function(newValue, oldValue) {
     dashBoardFactory.getTopics(function(data){
      $scope.topics = data.data
    })
  })

  $scope.addTopic = function() {
  	$scope.topic.id = $cookies.get('loginId')
    $scope.TError = true
    dashBoardFactory.addTopic($scope.topic, function(data) {
      $scope.check = data;
      // if(data.data.errors.name) {
      //           $scope.ACError = false
      //           $scope.customerError = data.data.errors.name.message  
      //         }
    }); 
  }

  
}])