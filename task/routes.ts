// https://deno.land/std@0.194.0/http/server.ts?s=serve
import { serve } from 'https://deno.land/std@0.194.0/http/server.ts?s=serve'
// https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir
import { serveDir } from 'https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir'

export const taskRouter = (req) => {
	const pathname = new URL(req.url).pathname;
	console.log(pathname);

	if (req.method === "GET" && pathname === "/tasks") {
		return new Response(JSON.stringify(taskListMock), {
			headers: {
				"content-type": "application/json",
			},
		});
	}

	if (req.method === "GET" && pathname === "/tasks/0") {
		return new Response(JSON.stringify(tasksMockUser0), {

			headers: {
				"content-type": "application/json",
			},
		});
	}

	if (req.method === "GET" && pathname === "/tasks/1") {
		return new Response(JSON.stringify(tasksMockUser1), {

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
}