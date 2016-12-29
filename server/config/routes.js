var mongoose = require('mongoose');
var user = require('../controllers/controls.js');

module.exports = function(app) {
app.post('/user',function(req, res){
  user.create(req, res)
});


app.post('/login', function(req, res) {
  user.login(req, res)
});

app.get('/getTopics', function(req, res) {
  user.getTopics(req, res)
})

app.post('/newTopic', function(req, res) {
  user.newTopic(req, res)
})

app.get('/getOneTopic/:id', function(req, res) {
  user.getOneTopic(req, res)
})

app.get('/getPosts', function(req, res) {
  user.getPosts(req, res)
})

app.post('/newPost', function(req, res) {
  user.newPost(req, res)
})

app.post('/newComment', function(req, res) {
  user.newComment(req, res)
})

app.post('/like', function(req, res) {
  user.like(req, res)
})

app.post('/dislike', function(req, res) {
  user.dislike(req, res)
})

app.get('/getOneUser/:id', function(req, res) {
  user.getOneUser(req, res)
})
}




