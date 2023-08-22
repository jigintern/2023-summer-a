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

	public async updateTask(userId: number, TaskId: number, isCompleted: boolean): Promise<string> {
		const task = await this.taskModel.updateTask(userId, TaskId, isCompleted);
		return JSON.stringify(task);
	}
}