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
