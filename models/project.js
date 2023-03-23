const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = Schema(
	{
		name: {
			type: String,
			trim: true
		},
		description: {
			type: String,
			trim: true
		},
		type: {
			type: String,
			enum: ["PERSONAL", "SHARED"],
			default: "SHARED"
		},
		chat_enabled: {
			type: Boolean,
			default: true,
		},
		document: {
			type: Boolean,
			default: true,
		},
		members: [
			{
				user_id: {
					type: Schema.types.ObjectId,
					ref: 'users'
				},
				role: {
					type: String,
					enum: ["ADMIN", "OWNER", "READ", "WRITE"],
					default: "READ"
				}
			}
		],
		status: {
			type: String,
			enum: ["ACTIVE", "DELETED"],
			default: "ACTIVE"
		}
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	}
);

module.exports = mongoose.model("projects", projectSchema);
