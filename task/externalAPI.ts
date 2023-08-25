#!/usr/bin/env  deno run --allow-read --allow-net --allow-write --allow-env --watch serve.ts
import { fetchChat } from "https://code4fukui.github.io/ai_chat/fetchChat.js";
import { serveDir } from "https://deno.land/std@0.180.0/http/file_server.ts";
import { isLoggedIn } from "../did-db-controller.js";

export const externalAPIRouter = async (req: Request) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  const loginInfo = await isLoggedIn(req.clone());
  const isLogin = loginInfo.loggedIn;

  if (!isLogin) {
    const body = { message: "認証されていません", redirectURL: "/login" };
    const res = new Response(JSON.stringify(body), {
      status: 403,
      headers: {
        "content-type": "application/json",
      },
    });
    console.log(res);
    return res;
  }

  if (pathname === "/api/chat" && req.method === "POST") {
    const json = await req.json();
    console.log(json.prompt);
    console.log("++++++++++++++++");
    const response = await fetchChat(json.prompt);
    return new Response(JSON.stringify({ message: response }));
  }
};
