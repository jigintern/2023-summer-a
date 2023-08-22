import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";
import { DIDAuth } from "https://jigintern.github.io/did-login/auth/DIDAuth.js";
import { addDID, checkIfIdExists, getUser, isLoggedIn } from "./did-db-controller.js";
import { taskListMock } from "./mock/mock.ts";

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  // リクエスト(テスト)
  if (req.method === "GET" && pathname === "/welcome-message") {
    return new Response("jigインターンへようこそ！");
  }

  // ログインテスト
  if (req.method === "POST" && pathname === "/logintest") {
    let loggedIn, loginUserInfo;
    try {
      ({ loggedIn, loginUserInfo } = await isLoggedIn(req)); // 分割代入
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }

    if (!loggedIn) {
      // isLoggedInが未ログインと判断した場合の処理
      // 検証に必要なデータがリクエストに含まれるか，DIDの登録，署名の検証，の3工程をまとめたエラーとなっているため注意
      return new Response(
        JSON.stringify({ message: "リクエストはサーバに到達しましたが，認証情報が不正であるか不足しています．再度ログインを行ってください．" }),
        { status: 400 }
      );
    } else {
      // 以下，ログインができている場合の処理
      const [userId, userName, did] = [loginUserInfo.userId, loginUserInfo.userName, loginUserInfo.did];
      return new Response(
        JSON.stringify({ message: "（エンドポイント/logintestからの応答）あなたはログインに成功しています．ユーザ名: " + userName + ", ユーザID: " + userId })
      );
    }
  }

  // タスクの一覧を要求されたとき
  if (req.method === "POST" && pathname === "/tasks") {
    let loggedIn, loginUserInfo;
    try {
      ({ loggedIn, loginUserInfo } = await isLoggedIn(req)); // 分割代入
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }

    if (!loggedIn) {
      return new Response(
        JSON.stringify({ message: "リクエストはサーバに到達しましたが，認証情報が不正であるか不足しています．再度ログインを行ってください．" }),
        { status: 400 }
      );
    } else {
      const [userId, userName, did] = [loginUserInfo.userId, loginUserInfo.userName, loginUserInfo.did];
      return new Response(JSON.stringify({ userId, taskListMock }), {
        headers: {
          "content-type": "application/json",
        },
      });
    }
  }

  // リクエスト(ユーザ登録)
  if (req.method === "POST" && pathname === "/users/register") {
    const json = await req.json();
    const userName = json.name;
    const sign = json.sign;
    const did = json.did;
    const message = json.message;

    try {
      // 電子署名が正しいかチェック．不正なら，はねてreturn 400
      const chk = DIDAuth.verifySign(did, sign, message);
      if (!chk) {
        return new Response("不正な電子署名です", { status: 400 });
      }
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }

    try {
      // 既にDBにDIDが登録されているかチェック: 登録済みなら，はねてreturn 400
      const isExists = await checkIfIdExists(did);
      if (isExists) {
        return Response("登録済みです", { status: 400 });
      }
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }

    try {
      // ここまでくれば正常なので，DBにDIDとuserNameを保存する
      await addDID(did, userName);
      return new Response("ok");
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
  }

  // リクエスト(ログイン)
  if (req.method === "POST" && pathname === "/users/login") {
    const json = await req.json();
    const sign = json.sign;
    const did = json.did;
    const message = json.message;

    try {
      // 電子署名が正しいかチェック
      const chk = DIDAuth.verifySign(did, sign, message);
      if (!chk) {
        return new Response("不正な電子署名です", { status: 400 });
      }
    } catch (e) {
      return new Response(e.message, { status: 400 });
    }

    try {
      // DBにdidが登録されているかチェック
      const isExists = await checkIfIdExists(did);
      if (!isExists) {
        return new Response("登録されていません", { status: 400 });
      }
      // 登録済みであればuser情報を返す
      const res = await getUser(did);
      const user = { did: res.rows[0].did, name: res.rows[0].user_name };
      return new Response(JSON.stringify({ user }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
  }

  // エントリポイント
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
