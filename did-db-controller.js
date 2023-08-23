import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import { DIDAuth } from "https://jigintern.github.io/did-login/auth/DIDAuth.js";

import { connectionParam } from "./env.ts";

// SQLクライアントの作成
const client = await new Client().connect(connectionParam);

// DBにDIDがあるか
export async function checkIfIdExists(did) {
  const res = await client.execute(`select count(*) from users where did = ?;`, [did]);
  // レスポンスのObjectから任意のDIDと保存されているDIDが一致している数を取得し
  // その数が1かどうかを返す
  // DBにはDIDが重複されない設計になっているので一致している数は0か1になる
  return res.rows[0][res.fields[0].name] === 1;
}

// DBにDIDとuserNameを追加
export async function addDID(did, userName) {
  await client.execute(`insert into users (did, user_name) values (?, ?);`, [did, userName]);
}

// didから，DBにアクセスして，一致するユーザの行を取得．戻値はDBからの応答であることに注意
// res.rows[0].user_name などでカラムの値を取得する必要がある
export async function getUser(did) {
  // DBからsignatureが一致するレコードを取得
  const res = await client.execute(`select * from users where did = ?;`, [did]);
  return res;
}

// ログインの確認を行い，正常であればユーザ情報を返す．
// 戻値 ... loggedIn: Boolean, loginUserInfo: Object
export async function isLoggedIn(req) {
  const json = await req.json();
  const [did, sign, message] = [json.did, json.sign, json.message];

  if (did == null || sign == null || message == null) {
    console.log("No did, sign, or message provided.");
    return { loggedIn: false, loginUserInfo: new Object() };
  }

  const idExists = await checkIfIdExists(did);
  if (!idExists) {
    console.log("DID, sign, and message were provided but the DID is not exist on DB.");
    return { loggedIn: false, loginUserInfo: new Object() };
  }

  const isVerified = DIDAuth.verifySign(did, sign, message);
  if (!isVerified) {
    console.log("DID, sign, and message were provided and the DID is on DB, but verifySign failed!");
    return { loggedIn: false, loginUserInfo: new Object() };
  }

  // ここまでくれば送信者はデータベースに存在し，reqは正しいリクエストである
  const res = await getUser(did);
  const userId = res.rows[0].user_id;
  const userName = res.rows[0].user_name;

  const loginUserInfo = {
    userId: userId,
    userName: userName,
    did: did,
  };
  return { loggedIn: true, loginUserInfo: loginUserInfo };
}

// getUserのuser_idを入力とするバージョン
async function userExists(userId) {
  const result = await client.execute(`SELECT * FROM users WHERE user_id = ?;`, [userId]);
  if (!result.rows) {
    return false;
  } else {
    return result.rows.length === 1;
  }
}

export async function getUserIdFromDID(did) {
  const result = await client.execute(`SELECT * FROM users WHERE did = ?;`, [did]);
  if (!result.rows) {
    return null;
  } else {
    return result.rows[0].user_id;
  }
}

// あるユーザ一人に対して，tasksテーブルにある全タスクを，id_completedを0として紐づけ
export async function addUserTasks(userId) {
  if (!(await userExists(userId))) {
    console.log("Error in addUserTasks(): Missing user, abort query execution.");
    return { rows: [] };
  }

  const allTaskIDs = await client.execute(`SELECT id FROM tasks;`); // クエリ結果
  if (!allTaskIDs.rows || allTaskIDs.rows.length === 0) {
    return { rows: [] };
  }

  const is_completed = 0;
  const newRows = allTaskIDs.rows.map((r) => [userId, r.id, is_completed]); // user_tasksに追加される新しい行を二次元配列で表現したもの

  let mainQueryStr = "INSERT INTO user_tasks (user_id, Task_id, is_completed) VALUES ";
  mainQueryStr += new Array(newRows.length).fill("(?, ?, ?)").join(", ");
  mainQueryStr += ";";
  const result = await client.execute(mainQueryStr, newRows.flat(Infinity));
  return result;
}
