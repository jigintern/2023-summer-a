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
