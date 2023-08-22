import type { TaskModel } from './db.ts';

export interface TaskController {
	getTasks(userId: number): Promise<string>;
	getTask(userId: number): Promise<string>;
	updateTask(userId: number, taskId: number, isCompleted: boolean): Promise<string>;
}

export class TaskControllerImpl implements TaskController{
	constructor(private taskModel: TaskModel) {
		this.taskModel = taskModel;
	}
	public async getTask(userId: number): Promise<string> {
		const task = await this.taskModel.getUserTasks(userId);

		if (!task.rows || task.rows.length === 0) {
			return JSON.stringify({userId, task: []});
		}

		// is_completedがtrueの割合を求める
		const completed = task.rows.filter((row) => row.is_completed).length / task.rows.length * 100;

		const taskList = {
			user_id: userId,
			completed: completed,
			tasks: task.rows.map((row) => {
				return {
					id: row.id,
					name: row.description,
					is_completed: row.is_completed,
				};
			}),
		};
		console.log(taskList);
		return JSON.stringify(taskList);
	}

	public async updateTask(userId: number, TaskId: number, isCompleted: boolean): Promise<string> {
		const task = await this.taskModel.updateTask(userId, TaskId, isCompleted);
		return JSON.stringify(task);
	}
}