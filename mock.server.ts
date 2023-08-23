// https://deno.land/std@0.194.0/http/server.ts?s=serve
import { serve } from 'https://deno.land/std@0.194.0/http/server.ts?s=serve'
// https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir
import { serveDir } from 'https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir'

import { taskListMock, tasksMockUser0, tasksMockUser1 } from "./mock/mock.ts";

serve(async (req) => {
	const pathname = new URL(req.url).pathname;
	console.log(pathname);

	if (req.method === "GET" && pathname === "/tasks") {
		const userId = 1;
		return new Response(JSON.stringify({userId,taskListMock}), {
			headers: {
				"content-type": "application/json",
			},
		});
	}

	if (req.method === "GET" && pathname === "/tasks/0") {
		const userId = 0
		return new Response(JSON.stringify({userId,tasksMockUser0}), {
			headers: {
				"content-type": "application/json",
			},
		});
	}

	if (req.method === "GET" && pathname === "/tasks/1") {
		const userId = 1
		return new Response(JSON.stringify({userId,tasksMockUser1}), {

			headers: {
				"content-type": "application/json",
			},
		});
	}

	if (req.method === "PUT") {
		const body = await req.json();
		console.log(body);
		return new Response(JSON.stringify(body), {
			headers: {
				"content-type": "application/json",
			},
		});
	}

	if(req.method === "GET" && pathname === "/error"){
		const body = {message: "認証されていません"};
		const res = new Response(JSON.stringify(body), {
			status: 403,
			headers: {
				"content-type": "application/json",
			},
		});
		console.log(res);
		return res;
	}




	return serveDir(req, {
		fsRoot: "public",
		urlRoot: "",
		showDirListing: true,
		enableCors: true,
	});
});
