import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import { DIDAuth } from "https://jigintern.github.io/did-login/auth/DIDAuth.js";

import { connectionParam } from "./env.ts";


// クライアントの作成
const client = await new Client().connect(connectionParam);

export async function checkIfIdExists(did) {
  // DBにDIDがあるか
  const res = await client.execute(`select count(*) from users where did = ?;`, [did]);
  // レスポンスのObjectから任意のDIDと保存されているDIDが一致している数を取得し
  // その数が1かどうかを返す
  // DBにはDIDが重複されない設計になっているので一致している数は0か1になる
  return res.rows[0][res.fields[0].name] === 1;
}

export async function addDID(did, userName) {
  // DBにDIDとuserNameを追加
  await client.execute(`insert into users (did, name) values (?, ?);`, [did, userName]);
}

export async function getUser(did) {
  // DBからsignatureが一致するレコードを取得
  const res = await client.execute(`select * from users where did = ?;`, [did]);
  return res;
}

export async function isLoggedIn(req) {
  const idExists = await checkIfIdExists(req["did"]);
  const isVerified = DIDAuth.verifySign(req["did"], req["sign"], req["message"]);
  let userName = undefined;

  if (idExists && isVerified) {
    userName = await getUser(did);
  } else {
    userName = false;
  }
  return idExists, userName;
}
