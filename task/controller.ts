import type { TaskModel } from './db.ts';

export interface TaskController {
	getTasks(): Promise<string>;
	getTask(userId: number): Promise<string>;
	updateTask(userId: number, taskId: number, isCompleted: boolean): Promise<string>;
}

export class TaskControllerImpl implements TaskController{
	constructor(private taskModel: TaskModel) {
		this.taskModel = taskModel;
	}

	public async getTasks(): Promise<string> {
		const tasks = await this.taskModel.getAllTasks();

		if (!tasks.rows || tasks.rows.length === 0) {
			return JSON.stringify([]);
		}

		// user_idのユニークな数を取得する
		const userIds = tasks.rows.map((row) => row.user_id);
		const uniqueUserIds = userIds.filter((x, i, self) => self.indexOf(x) === i);

		const userTaskList = [];
		// user_idごとにis_completedがtrueの割合を求める
		for (let i = 0; i < uniqueUserIds.length; i++) {
			const userTask = tasks.rows.filter((row) => row.user_id === uniqueUserIds[i]);
			const completed = userTask.filter((row) => row.is_completed).length / userTask.length * 100;
			userTaskList.push({
				user_id: uniqueUserIds[i],
				completed: completed,
				tasks: userTask.map((row) => {
					return {
						id: row.id,
						name: row.description,
						is_completed: row.is_completed,
					};
				}),
			});
		}
		return JSON.stringify(userTaskList);
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