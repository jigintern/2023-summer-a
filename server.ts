// https://deno.land/std@0.194.0/http/server.ts?s=serve
import { serve } from 'https://deno.land/std@0.194.0/http/server.ts?s=serve'
// https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir
import { serveDir } from 'https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir'

import { taskRouter } from "./task/routes.js";

serve(async (req) => {
	const pathname = new URL(req.url).pathname;

	if (pathname.startsWith("/tasks")) {
		return taskRouter(req);
	} else if (pathname.startsWith("/users")) {
		return AuthRouter(req);
	} else {
		return serveDir(req, {
			fsRoot: "public",
			urlRoot: "",
			showDirListing: true,
			enableCors: true,
		});
	}
});