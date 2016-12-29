var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post') 
var Topic = mongoose.model('Topic')
var Comment = mongoose.model('Comment')


module.exports = {
	create: function(req, res){
      var user = new User(req.body);
      user.save(function(err, context) {
	    if(err) {
	      console.log('Error with registering new user');
        console.log(err)
        return res.json(err)
	    } else {
	      console.log('successfully registered a new user!');
        console.log(context)
        return res.json(context)
	    }
	})
    },
  login: function(req, res) {
    console.log(req.body.emailLogin)
    User.find({ email: req.body.emailLogin}, function(err, context) {
      if(context[0]) {
        console.log('success finding email')
        if(context[0].validPassword(req.body.passwordLogin)) {
          return res.json({_id:context[0]._id})
        } else {
          console.log("wrong password")
          return res.json({IncorrectPassword: 'Incorrect Password'})
        }
      }
      else {
        console.log("no email found")
        return res.json({noEmail: "No such email in database"})
      }
    })
  },

  getTopics: function (req, res) {
    Topic.find({}, null, {sort: 'created_at'}).populate('_user').populate({path: 'posts', options: { sort: { 'created_at': -1 } } }).exec( function(err, context) {
      if(context[0]) {
        for(item in context) {
          context[item].postCounter();
        }
        console.log('success getting topics')
        return res.json(context)
      }
      else {
        console.log('no Topics yet')
        return res.json(context)
      }
    })
  },
  newTopic: function (req, res) {
    User.findOne({_id : req.body.id}, function(err, user) {
      var topic = new Topic(req.body)
      topic._user = req.body.id;
      topic.postCounter()
      topic.save(function(err) {
        console.log(err)
        if(err) {
          console.log('topic not saved')
        } else {
          console.log('topic saved')
          // return res.json({he:"hi"})
          user.topics.push(topic)
          user.save(function(err) {
            if(err) {
              console.log(err)
              console.log('Error with saving user after saving topic')
            } else {
              console.log('user saved after saving topic')
              return res.json({he:"hi"})
            }
          })
        }
      })
    })
  },
  getOneTopic: function (req, res) {
    Topic.findOne({_id: req.params.id}, null, {sort: 'created_at'}).populate('_user').populate({path: 'posts', options: {sort:{'numberLikes': -1 }}, populate: [{ path: '_user'}, {path: 'comments', options: {sort:{'created_at': -1 }} }] }).exec( function(err, context) {
      if(context) {
        console.log('success getting one topic')
        return res.json(context)
      }
      else {
        console.log('no Topic yet')
        return res.json(context)
      }
    })
  },
  newPost: function (req, res) {
    console.log(req.body)
    User.findOne({_id : req.body.userId}, function(err, user) {    
      Topic.findOne({_id : req.body.topicId}, function(err, topic) {  
      var post = new Post({post: req.body.post})
      post._user = req.body.userId;
      post._topic= req.body.topicId;
      post.save(function(err) {
        if(err) {
          console.log('post not saved')
        } else {
          console.log('post saved')
          user.posts.push(post)
          topic.posts.push(post)
          user.save(function(err) {
            if(err) {
              console.log(err)
              console.log('Error with saving user after saving post')
            } else {
              console.log('user saved after saving post')
              // return res.json({he:"hi"})
            }
          })
          topic.save(function(err) {
            if(err) {
              console.log(err)
              console.log('Error with saving topic after saving post')
            } else {
              console.log('topic saved after saving post')
              return res.json({he:"hi"})
            }
          })
        }
      })
    })
    })
  },
  newComment: function (req, res) {
    var user = User.findOne({_id: req.body.userId}, function(err, user) {
    Post.findOne({_id: req.body.id}, function(err, post){
        var comment = new Comment({ text: req.body.text, name: user.firstName + " " + user.lastName});
        comment._post = post._id;
        comment._user = req.body.userId;
        comment.save(function(err){
            if(err) {
              console.log("comment not saved")
              app.set('error', comment.errors);
            } else {
              console.log("comment saved")
              post.comments.push(comment);
              post.save(function(err){
                   if(err) {
                        console.log('Error with saving post');
                   } else {
                        console.log("Post Saved for comments")
                        return res.json({hi:'hi'})
                   }
               });
              user.comments.push(comment);
              user.save(function(err){
                   if(err) {
                        console.log('Error with saving user for comments');
                   } else {
                        console.log("User Saved for comments")
                   }
               });

              }
         });
    });
    })
  },
  like: function(req, res) {
    Post.findOne({_id: req.body.postId}, function(err, post){
      if(!err) {
        post.like(req.body.userId);
        console.log("successful like")
        return res.json(post)
      }
    })
  },
  dislike: function(req, res) {
    Post.findOne({_id: req.body.postId}, function(err, post){
      if(!err) {
        post.dislike(req.body.userId);
        console.log("successful dislike")
        return res.json(post)
      }
    })
  },
  getOneUser: function (req, res) {
    User.findOne({_id: req.params.id}).exec( function(err, context) {
      if(context) {
        context.topicCounter();
        context.postCounter();
        context.commentCounter();
        console.log('success getting one user')
        return res.json(context)
      }
      else {
        console.log('no User yet')
        return res.json(context)
      }
    })
  }
};