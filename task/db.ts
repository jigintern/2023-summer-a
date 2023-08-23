import { Client, ExecuteResult } from "https://deno.land/x/mysql@v2.11.0/mod.ts"
import { Task, Tasks } from "../task.type.ts";

export interface TaskModel {
	getAllTasks(): Promise<ExecuteResult>;
	getUserTasks(userId: number): Promise<ExecuteResult>;
	updateTask(userId: number, taskId: number, isCompleted: boolean): Promise<ExecuteResult>;
}

// dbからデータを取得する
export class TaskDb implements TaskModel {
	constructor(private db: Client) {
		this.db = db;
	}

	public async getAllTasks(): Promise<ExecuteResult> {
		const userTasks = await this.db.execute(`SELECT user_tasks.user_id, user_tasks.Task_id, user_tasks.is_completed, tasks.description, users.user_name 
		FROM user_tasks LEFT JOIN tasks ON user_tasks.Task_id = tasks.id
		RIGHT JOIN users ON users.user_id = user_tasks.user_id;`);

		if (!userTasks.rows || userTasks.rows.length === 0) {
			return {rows: []};
		}
		
		return {rows: userTasks.rows} as ExecuteResult;
	}


	public async getUserTasks(userId: number): Promise<ExecuteResult> {
		// user_tasksテーブルとtasksテーブルを結合して、user_idが一致するものを取得する
		const task = await this.db.execute(
			`SELECT user_tasks.id, user_tasks.user_id, user_tasks.Task_id, user_tasks.is_completed, tasks.description, users.user_name 
			FROM user_tasks LEFT JOIN tasks ON user_tasks.Task_id = tasks.id
			RIGHT JOIN users ON user_tasks.user_id = users.user_id WHERE user_tasks.user_id = ?;`,
			 [userId]
			);

		if (!task.rows || task.rows.length === 0) {
			return {rows: []};
		}

		return {rows: task.rows} as ExecuteResult;
	}

	// タスクのcompletedを更新する
	public async updateTask(userId: number, taskId: number, isCompleted: boolean): Promise<ExecuteResult> {
		const task = await this.db.execute(`UPDATE user_tasks SET is_completed = ? WHERE Task_id = ? AND user_id = ?`, [
			isCompleted,
			taskId,
			userId,
		]);

		if (!task.rows || task.rows.length === 0) {
			return {rows: []};
		}

		return {rows: task.rows} as ExecuteResult;
	}
}