const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = Schema(
	{
		type: {
			type: String,
			enum: ["MAIN_TASK", "SUB_TASK"]
		},
		task_key: {
			type: String,
			trim: true,
			required: true
		},
		summary: {
			type: String,
			trim: true
		},
		description: {
			type: String,
			trim: true
		},
		priority: {
			type: String,
			enum: ["LOW", "MEDIUM", "HIGH", "URGENT"]
		},
		assignee: {
			type: Schema.types.ObjectId,
			ref: "users"
		},
		reporter: {
			type: Schema.types.ObjectId,
			ref: "users"
		},
		documents: [
			{
				link: {
					type: String
				}
			}
		],
		parent_task: {
			type: String,
			default: null
		},
		status: {
			type: String,
			enum: ["TO_DO", "IN_PROGRESS", "COMPLETED", "CLOSED"],
			default: "TO_DO"
		}
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	}
);

module.exports = mongoose.model("tasks", taskSchema);
