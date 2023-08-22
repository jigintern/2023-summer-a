// https://deno.land/std@0.194.0/http/server.ts?s=serve
import { serve } from 'https://deno.land/std@0.194.0/http/server.ts?s=serve'
// https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir
import { serveDir } from 'https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir'

import { TaskController, TaskControllerImpl } from './controller.ts';


export const taskRouter = async (req: Request, taskController: TaskController) => {
	const pathname = new URL(req.url).pathname;
	console.log(pathname);



	if (req.method === "GET" && pathname === "/tasks") {
		const body = await taskController.getTasks(1);
		console.log(body);
		return new Response(JSON.stringify(body), {
			headers: {
				"content-type": "application/json",
			},
		});
	}

	if (req.method === "GET" && pathname.startsWith("/tasks/")) {
		const userId = Number(pathname.split("/")[2]);
		const body = await taskController.getTask(userId);
		return new Response(JSON.stringify(body), {
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
		return new Response(JSON.stringify(body), {
			headers: {
				"content-type": "application/json",
			},
		});
	}
}