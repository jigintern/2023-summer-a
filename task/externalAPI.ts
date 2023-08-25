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
    console.log(json);
    const response = await fetchChat(json.message);
    console.log("From ChatGPT API: " + response);
    return new Response(JSON.stringify({ message: response }));
  }

  if (pathname === "/api/chat/praisemsg" && req.method === "POST") {
    const prompt =
      "あなたは小中学生の面倒を見るのが好きな，地元の寺子屋な学習支援員です．\n宿題を頑張った生徒たちに100文字程度でお褒めの言葉をいただきたいと思います．それでは，どうぞ！";
    const response = await fetchChat(prompt);
    console.log("From ChatGPT API: " + response);
    return new Response(JSON.stringify({ message: response }));
  }
};
