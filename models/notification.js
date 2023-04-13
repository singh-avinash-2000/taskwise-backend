const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
	{
		to: {
			type: Schema.Types.ObjectId,
			ref: "users"
		},
		from: {
			type: Schema.Types.ObjectId,
			ref: "users"
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: "projects"
		},
		event: {
			type: String,
			trim: true
		},
		read: {
			type: Boolean,
			required: true,
			defaultValue: false
		},
		payload: {}
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	}
);

module.exports = mongoose.model('notifications', NotificationSchema);
