// https://deno.land/std@0.194.0/http/server.ts?s=serve
import { serve } from 'https://deno.land/std@0.194.0/http/server.ts?s=serve'
// https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir
import { serveDir } from 'https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir'

import { taskRouter } from "./task/route.ts";
import { authRouter } from "./server.deno.js";

import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import { connectionParam } from "./env.ts";

import { TaskControllerImpl } from "./task/controller.ts";
import { TaskDb } from "./task/db.ts";

// クライアントの作成
const sqlClient = await new Client().connect(connectionParam);
const taskController = new TaskControllerImpl(new TaskDb(sqlClient));

serve(async (req: Request) => {
	const pathname = new URL(req.url).pathname;

	if (pathname.startsWith("/tasks")) {
		return await taskRouter(req, taskController);
	} else if (pathname.startsWith("/users")) {
		return await authRouter(req);
	}

	return serveDir(req, {
		fsRoot: "public",
		urlRoot: "",
		showDirListing: true,
		enableCors: true,
	});
});