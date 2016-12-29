var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  firstName : {
  	type: String,
  	required: [true, 'First name is required'],
  	minlength: [2, 'First name must be at least 2 characters'],
  	trim: true
  },
  lastName : {
  	type: String,
  	required: [true, 'Last name is required'],
  	minlength: [2, 'Last name must be at least 2 characters'],
  	trim: true
  },
  email : {
  	type: String,
  	validate: {
  		validator: function(email) {
  		var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  		return emailRegex.test(email)
  		},
  		message: 'Not a valid email'
  	},
	required: [true, "Email is required"],
	unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function( value ) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test( value );
      },
      message: "Password failed validation, you must have at least 1 number, uppercase and special character"
    }
  },
  birthday: {
  	type: Date,
  	required: [true, 'Birthday is required']
  },
  created_at: { type : Date, default: Date.now },
  topics: [{type: Schema.Types.ObjectId, ref: 'Topic'}],
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  topicCount: {type: Number},
  postCount: {type: Number},
  commentCount: {type: Number}
 });

userSchema.methods.generateHash = function(password) {
	if(password.length > 32) {
		return password
	} else {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
	}
}
userSchema.pre('save', function(done) {
	this.password = this.generateHash(this.password);
	done();
})
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}
userSchema.methods.topicCounter = function() {
  this.topicCount = this.topics.length;
  this.save()
}
userSchema.methods.postCounter = function() {
  this.postCount = this.posts.length;
  this.save()
}
userSchema.methods.commentCounter = function() {
  this.commentCount = this.comments.length;
  this.save()
}
mongoose.model('User', userSchema);

var topicSchema = new mongoose.Schema({
  topic: { type: String, required: [true, "Topic is required"] },
  description: { type: String, required: [true, "Description is required"] },
  created_at: { type : Date, default: Date.now },
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  postCount: {type: Number}
  });
topicSchema.methods.postCounter = function() {
  this.postCount = this.posts.length
  return this.posts.length
}
mongoose.model('Topic', topicSchema);

var postSchema = new mongoose.Schema({
  post: { type: String, required: [true, "Text is required"] },
  created_at: { type : Date, default: Date.now },
  likes: [],
  dislikes: [],
  numberLikes : {type: Number, default: 0},
  numberDislikes : {type: Number, default: 0},
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  _topic: {type: Schema.Types.ObjectId, ref: 'Topic'},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
  });
postSchema.methods.like = function(userId) {
  var exist = false;
  for(item in this.likes) {
    if(userId == this.likes[item]) {exist = true;}
  }
  if(exist == false) { this.likes.push(userId) }
  this.numberLikes = this.likes.length;
  this.save()
}
postSchema.methods.dislike = function(userId) {
  var exist = false;
  for(item in this.dislikes) {
    if(userId == this.dislikes[item]) {exist = true;}
  }
  if(exist == false) { this.dislikes.push(userId) }
  this.numberDislikes = this.dislikes.length;
  this.save()
}
mongoose.model('Post', postSchema);


var commentSchema = new mongoose.Schema({
  name: String,
  text: { type: String, required: [true, "Comment Text is required"] },
  created_at: { type : Date, default: Date.now },
  _post: {type: Schema.Types.ObjectId, ref: 'Post'},
  _user: {type: Schema.Types.ObjectId, ref: 'User'}
  });
mongoose.model('Comment', commentSchema);
