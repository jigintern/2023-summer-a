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
