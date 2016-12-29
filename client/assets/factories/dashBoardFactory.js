
 myApp.factory('dashBoardFactory', ['$filter', '$http', '$location', function ( $filter, $http, $location){

    var factory = {};

    factory.getTopics = function(callback) {
      $http.get('/getTopics').then(function(data) {
        console.log('got topics')
        callback(data);
      })
    }
    factory.addTopic = function(newTopic, callback) {
      $http.post('/newTopic', newTopic).then(function(data){
        console.log("topic added")
        callback(data);
      })
    }
    factory.getOneTopic = function(topicId, callback) {
      $http.get('/getOneTopic/' + topicId).then(function(data) {
        console.log('got one topic')
        callback(data);
      })
    }

    factory.addUser = function(newUser, callback) {
      $http.post('/user', newUser).then(function(data){
        console.log("data sent back")
        if(data.data.errors || data.data.errmsg || data.data.firstName) {
          console.log(data)
          callback(data);
        }
      })
    }
    factory.login = function(user, callback) {
      $http.post('/login', user).then(function(data){
        console.log("login data back")
        if(data.data.noEmail || data.data.IncorrectPassword) {
          callback(data);
        }
        else if (data.data._id) {
          callback(data)
        }
      })
    }

    factory.getPosts = function(callback) {
      $http.get('/getPosts').then(function(data) {
        console.log('got posts')
        callback(data);
      })
    }
    factory.post = function(newpost, callback) {
      $http.post('/newPost', newpost).then(function(data) {
        console.log('post successful')
        callback(data)
      })
    }
    factory.comment = function(newComment, callback) {
      $http.post('/newComment', newComment).then(function(data) {
        console.log('comment successful')
        callback(data)
      })
    }
    factory.like = function(info, callback) {
      $http.post('/like', info).then(function(data) {
        console.log('Like successful')
        callback(data)
      })
    }
    factory.dislike = function(info, callback) {
      $http.post('/dislike', info).then(function(data) {
        console.log('dislike successful')
        callback(data)
      })
    }

    factory.getOneUser = function(userId, callback) {
      $http.get('/getOneUser/' + userId).then(function(data) {
        console.log('got one user')
        callback(data);
      })
    }

    return factory;
    }]);