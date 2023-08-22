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
		const userTasks = await this.db.execute(`SELECT * FROM user_tasks LEFT JOIN tasks ON user_tasks.Task_id = tasks.id;`);

		if (!userTasks.rows || userTasks.rows.length === 0) {
			return {rows: []};
		}
		
		return {rows: userTasks.rows} as ExecuteResult;
	}


	public async getUserTasks(userId: number): Promise<ExecuteResult> {
		// user_tasksテーブルとtasksテーブルを結合して、user_idが一致するものを取得する
		const task = await this.db.execute(
			`SELECT * FROM user_tasks LEFT JOIN tasks ON user_tasks.Task_id = tasks.id WHERE user_tasks.user_id = ?`,
			 [userId]
			);

		if (!task.rows || task.rows.length === 0) {
			return {rows: []};
		}

		return {rows: task.rows} as ExecuteResult;
	}
