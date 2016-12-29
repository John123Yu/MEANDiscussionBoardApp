
myApp.controller('topicController', ['$scope', 'dashBoardFactory', '$location', '$cookies', '$routeParams', function ($scope, dashBoardFactory, $location, $cookies, $routeParams){
  
  if(!$cookies.get('loginId')) {
    $location.url('/');
  }

  $scope.check = 0;
  $scope.$watch('check', function(newValue, oldValue) {
    dashBoardFactory.getOneTopic($routeParams.id, function(data){
      $scope.topic = data.data
    })
  })
  $scope.loginId = $cookies.get('loginId')

  $scope.newcomment = []
  $scope.Comment = function(id, index) {
    console.log($scope.newcomment)
    console.log($scope.newcomment[index])
    $scope.newcomment[index].id = id
    $scope.newcomment[index].userId = $cookies.get('loginId')
    dashBoardFactory.comment($scope.newcomment[index], function(data) {
      $scope.check = data
    })
    }
  $scope.Post = function() {
    $scope.post.userId = $cookies.get('loginId')
    $scope.post.topicId = $scope.topic._id
     dashBoardFactory.post($scope.post, function(data) {
      $scope.check = data
     })
  }

  $scope.like = function (postId) {
    $scope.likes = {};
    $scope.likes.userId = $cookies.get('loginId')
    $scope.likes.postId = postId
    dashBoardFactory.like($scope.likes, function(data) {
      $scope.check = data
    });
  }
  $scope.dislike = function (postId) {
    $scope.dislikes = {};
    $scope.dislikes.userId = $cookies.get('loginId')
    $scope.dislikes.postId = postId
    dashBoardFactory.dislike($scope.dislikes, function(data) {
      $scope.check = data
    });
  }

}])