const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowsSchema = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Follows', FollowsSchema);
