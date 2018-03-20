var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    id: {
		type: Number,
		required: true,
		index: {
			unique: true
        },
        default:1
	},
    referer:
    {
   type: String,
   default:'Unknown'
    }, 

	added_date: {
        type: Date,
        required:true,
        default: Date.now 
    },

    last_login:{
     type:Date,
     required:false,
     default: Date.now
    },

    language:{
        type:String,
        default:'English'
    },

    orders_count:{
        type: Number,
        default:0,
        min:0
    },

    email: {
		type: String,
        required: true,
        unique:true,
		lowercase: true
	},
	access_level: {
		type: String,
		default: 'User'
    },
    
    Password_flag:
    {
      type: Boolean,
      default:false
    }
	
  });
  
  module.exports = mongoose.model('User', UserSchema);