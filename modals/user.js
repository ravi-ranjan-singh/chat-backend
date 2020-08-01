const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    socketId: { type: String },
    name: { type: String },
    batch: {
        type: Number
    },
    gender: {
        type: String,
        //required: true,
        enum: ['m', 'f', 'o']
    },

    collegeUniv: {
        type: String
    },
    campusName: {
        type: String
    },
    campusLocation: {
        type: String
    },
    eduLevel: {
        type: String,
        enum: [
            'ug',
            'pg',
            '11',
            '12',
            'pgd',
            'others']
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 10,
        minlength: 10
    },
    email: { type: String, require: true },
    password: { type: String },
    online: { status: { type: Boolean, require: true, default: false }, lastSeen: { type: Date } },
    joinedDate: { type: Date, require: true },
    friendList: [
        {
            friend_id: { type: Schema.Types.ObjectId, ref: 'user', unique: false },

            name: { type: String, require: true },
            new: { type: Boolean },
            dpURL: { type: String },
            stage: { type: String, required: true, default: "none" },
            sender: { type: Boolean, required: true },
            email: { type: String },
        }
    ],
    fastMessages: [{

        recieverId: { type: Schema.Types.ObjectId, ref: 'user' },
        name: { type: String },

        messages: [{

            deliveredTime: { type: Date },
            sentTime: { type: String, require: true },
            receivedTime: { type: Date },
            messageText: { type: String, require: true }, sender: { type: Boolean, require: true },
            status: { type: String, require: true },
            type: { type: String, default: 'text' },
            commonId: { type: String }
        }],





    }],
    offlineMessages: [{
        senderId: { type: Schema.Types.ObjectId, ref: 'user' },
        sentTime: { type: String, require: true },
        messageText: { type: String, require: true }, sender: { type: Boolean, require: true },
        status: { type: String, require: true },
        commonId: { type: String }
    }],

    chats: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "user" },
            name: { type: String, require: true },
            sender: { type: Boolean, require: true },

            time: { type: String, require: true },

            type: { type: String, require: true, default: "text" },
            lastMessage: { type: String, require: true, default: "text" },
            status: { type: String, require: true, default: "waiting" },
            unseenCount: { type: Number, default: 0 }
        }
    ]
    ,
    notications: [{

        type: { type: String, require: true, default: "text" },

        content: { type: String, require: true },

        time: { type: Schema.Types.Date, require: true },
        offline: { type: Boolean, require: true }



    }],
    upvotedPost: [String],
    downvotedPost: [String]

})

const User = mongoose.model('user', userSchema)
module.exports = User
