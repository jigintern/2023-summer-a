import { DIDAuth } from "https://jigintern.github.io/did-login/auth/DIDAuth.js";

// [コールバックを登録] 登録ボタンの処理
document.getElementById("submit").onclick = async (event) => {
  event.preventDefault(); // デフォルトの動作(フォーム送信と連動した勝手なリロードなど？)を明示的に防ぐ

  const name = document.getElementById("name").value;

  // 名前が入力されていなければエラー
  if (name === "") {
    document.getElementById("error").innerText = "名前は必須パラメータです";
    return;
  }

  // 以降，名前入力された前提．
  const [did, password, message, sign] = DIDAuth.createNewUser(name); // 鍵とかを作成する
  document.getElementById("did").value = did;
  document.getElementById("password").value = password;
  document.getElementById("sign").value = sign;
  document.getElementById("message").value = message;

  try {
    const resp = await fetch("/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        did,
        sign,
        message,
      }),
    });

    // サーバーから成功ステータスが返ってこないときの処理
    if (!resp.ok) {
      const errMsg = await resp.text();
      document.getElementById("error").innerText = "エラー：" + errMsg;
      return;
    }

    // レスポンスが正常ならローカルストレージに保存
    localStorage.setItem("did", did);
    localStorage.setItem("password", password);
    localStorage.setItem("name", name);
  } catch (err) {
    document.getElementById("error").innerText = err.message;
  }
};

// [コールバックを登録] DIDをファイルとして保存ボタンの処理
// HTML要素からdid, passをとってきて，外部ライブラリで保存処理呼び出すだけ
document.getElementById("saveBtn").onclick = async () => {
  const did = localStorage.getItem("did");
  const password = localStorage.getItem("password");
  DIDAuth.savePem(did, password);
};
