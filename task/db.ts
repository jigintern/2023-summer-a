import { Client, ExecuteResult } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
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
			return { rows: [] };
		}

		return { rows: userTasks.rows } as ExecuteResult;
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
			return { rows: [] };
		}

		return { rows: task.rows } as ExecuteResult;
	}

	// タスクのcompletedを更新する
	public async updateTask(userId: number, taskId: number, isCompleted: boolean): Promise<ExecuteResult> {
		const task = await this.db.execute(`UPDATE user_tasks SET is_completed = ? WHERE Task_id = ? AND user_id = ?`, [isCompleted, taskId, userId]);

		if (!task.rows || task.rows.length === 0) {
			return { rows: [] };
		}

		return { rows: task.rows } as ExecuteResult;
	}

	// private async userExists(userId: number): Promise<boolean> {
	// 	const result = await this.db.execute(`SELECT * FROM users WHERE user_id = ?;`, [userId]);
	// 	if (!result.rows) {
	// 		return false;
	// 	} else {
	// 		return result.rows.length === 1;
	// 	}
	// }

	// // あるユーザ一人に対して，tasksテーブルにある全タスクを，id_completedを0として紐づけ
	// public async addUserTasks(userId: number): Promise<ExecuteResult> {
	// 	if (!(await this.userExists(userId))) {
	// 		console.log("Error in addUserTasks(): Missing user, abort query execution.");
	// 		return { rows: [] };
	// 	}

	// 	const allTaskIDs = await this.db.execute(`SELECT id FROM tasks;`); // クエリ結果
	// 	if (!allTaskIDs.rows || allTaskIDs.rows.length === 0) {
	// 		return { rows: [] };
	// 	}

	// 	const is_completed = 0;
	// 	const newRows = allTaskIDs.rows.map((r) => [userId, r.id, is_completed]); // user_tasksに追加される新しい行を二次元配列で表現したもの
	// 	//
	// 	let mainQueryStr = "INSERT INTO user_tasks (user_id, Task_id, is_completed) VALUES ";
	// 	mainQueryStr += new Array(newRows.length).fill("(?, ?, ?)").join(", ");
	// 	mainQueryStr += ";";
	// 	const result = await this.db.execute(mainQueryStr, newRows.flat(Infinity));

	// 	if (!result.rows || result.rows.length === 0) {
	// 		return { rows: [] };
	// 	}

	// 	return { rows: result.rows } as ExecuteResult;
	// }
}
