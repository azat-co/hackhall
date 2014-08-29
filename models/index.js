var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roles = 'user staff mentor investor founder'.split(' ');
var findOrCreate = require('mongoose-findorcreate');

exports.Post = new Schema ({
  title: {
    required: true,
    type: String,
    trim: true,
    // match: /^([[:alpha:][:space:][:punct:]]{1,100})$/
    match: /^([\w ,.!?]{1,100})$/
  },
  url: {
    type: String,
    trim: true,
    max: 1000
  },
  text: {
    type: String,
    trim: true,
    max: 2000
  },
  comments: [{
    text: {
      type: String,
      trim: true,
      max:2000
    },
    author: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String
    }
  }],
  watches: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  },
  own: Boolean,
  like: Boolean,
  watch: Boolean,
  admin: Boolean,
  action: String
});

var User = new Schema({
  angelListId: String,
  angelListProfile: Schema.Types.Mixed,
  angelToken: String,
  githubProfile: Schema.Types.Mixed,
  githubToken: String,
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
    password: String,
    email: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type:String,
    enum: roles,
    required: true,
    default: roles[0]
  },
  approved: {
    type: Boolean,
    default: false
  },
  banned: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  headline: String,
  photoUrl: String,
  angelList: Schema.Types.Mixed,
  created: {
    type: Date,
    default: Date.now
  },
  updated:  {
    type: Date, default: Date.now
  },
  angelUrl: String,
  twitterUrl: String,
  facebookUrl: String,
  linkedinUrl: String,
  githubUrl: String,
  own: Boolean,
  posts: {
    own: [Schema.Types.Mixed],
    likes: [Schema.Types.Mixed],
    watches: [Schema.Types.Mixed],
    comments: [Schema.Types.Mixed]
  }
});


User.plugin(findOrCreate);
exports.User = User;
