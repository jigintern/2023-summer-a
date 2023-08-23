// https://deno.land/std@0.194.0/http/server.ts?s=serve
import { serve } from 'https://deno.land/std@0.194.0/http/server.ts?s=serve'
// https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir
import { serveDir } from 'https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir'

import { TaskController, TaskControllerImpl } from './controller.ts';
import { isLoggedIn } from '../did-db-controller.js';

interface LoginUserInfo {
    userId: number;
    userName: string;
    did: string;
};


export const taskRouter = async (req: Request, taskController: TaskController) => {
	const pathname = new URL(req.url).pathname;
	console.log(pathname);

	const loginInfo = await isLoggedIn(req);
	const isLogin = loginInfo.loggedIn;
	const userInfo = loginInfo.loginUserInfo as LoginUserInfo;
	const access_user_id = userInfo.userId;

	if (!isLogin) {
		const body = { message: "認証されていません" };
		const res = new Response(JSON.stringify({access_user_id, body}), {
			status: 403,
			headers: {
				"content-type": "application/json",
			},
		});
		console.log(res);
		return res;
	} 

	if (req.method === "GET" && pathname === "/tasks") {
		const body = await taskController.getTasks();
		console.log(body);
		return new Response(JSON.stringify({access_user_id, body}), {
			headers: {
				"content-type": "application/json",
			},
		});
	}

	if (req.method === "GET" && pathname.startsWith("/tasks/")) {
		const userId = Number(pathname.split("/")[2]);
		const body = await taskController.getTask(userId);
		return new Response(JSON.stringify({access_user_id, body}), {
			headers: {
				"content-type": "application/json",
			},
		});
	}

	if (req.method === "PUT" && pathname === "/tasks") {
		const reqJson = await req.json();

		const userId = reqJson.user_id;
		const taskId = reqJson.task_id;
		const isCompleted = reqJson.is_completed;

		const body = await taskController.updateTask(userId, taskId, isCompleted);
		return new Response(JSON.stringify({access_user_id, body}), {
			headers: {
				"content-type": "application/json",
			},
		});
	}
}