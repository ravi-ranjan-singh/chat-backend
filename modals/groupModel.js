const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    groupName: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    totalMembers: { type: Number, default: 1 },
    membersList: [{
        user_id: { type: Schema.Types.ObjectId, ref: 'user', unique: false },
        name: { type: String, require: true },
        new: { type: Boolean },
        dpURL: { type: String },
    }],
    messages: [
        {
            sentTime: { type: String, required: true },
            statusList: [
                {
                    status: { type: String, require: true },
                    deliveredTime: { type: String },
                    seenTime: { type: String }
                }
            ],
            deliveredTime: { type: Date },

            receivedTime: { type: Date },
            messageText: { type: String, required: true },
            file: {
                fileType: { type: String, required: true },
                size: { type: String, required: true },
                fileName: { type: String, required: true },
                filePath: { type: String, required: true }
            }
            , sender: { type: Boolean, require: true },

            type: { type: String, default: 'text' }

        }],
    admin: {
        adminId: { type: Schema.Types.ObjectId, ref: "user" },
        name: { type: String, required: true }

    }
})

const GroupMessages = mongoose.model('groupMessages', userSchema)
module.exports = GroupMessages