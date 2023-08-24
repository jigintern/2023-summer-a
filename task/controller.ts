import type { TaskModel } from './db.ts';

export interface TaskController {
	getTasks(): any;
	getTask(userId: number): any;
	updateTask(userId: number, taskId: number, isCompleted: boolean): any;
}

export class TaskControllerImpl implements TaskController{
	constructor(private taskModel: TaskModel) {
		this.taskModel = taskModel;
	}

	public async getTasks() {
		const tasks = await this.taskModel.getAllTasks();

		if (!tasks.rows || tasks.rows.length === 0) {
			return [];
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
				user_name: userTask[0].user_name,
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
		return userTaskList;
	}

	public async getTask(userId: number) {
		const task = await this.taskModel.getUserTasks(userId);

		if (!task.rows || task.rows.length === 0) {
			return {userId, task: []};
		}

		// is_completedがtrueの割合を求める
		const completed = task.rows.filter((row) => row.is_completed).length / task.rows.length * 100;

		const taskList = {
			user_id: userId,
			user_name: task.rows[0].user_name,
			completed: completed,
			tasks: task.rows.map((row) => {
				return {
					id: row.Task_id,
					name: row.description,
					is_completed: row.is_completed,
				};
			}),
		};
		console.log(taskList);
		return taskList;
	}

	public async updateTask(userId: number, TaskId: number, isCompleted: boolean) {
		const task = await this.taskModel.updateTask(userId, TaskId, isCompleted);
		return task;
	}
}