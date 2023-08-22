import { fetchWithDidFromLocalstorage } from "/lib/fetch.js";

window.onload = async () => {
  const elem = document.querySelector("#loginstate");
  const path = "/logintest";
  const method = "POST";
  // fetchWithDidFromLocalstorageはメッセージボディ(json形式)を含むリクエストのため，GETを使うことができない.

  try {
    const res = await fetchWithDidFromLocalstorage(path, {
      method,
    });
    if (res == null) {
      elem.innerText = "ログインしていません．";
    } else if (!res.ok) {
      // サーバーから成功ステータスが返ってこない場合
      const errMsg = await res.text();
      elem.innerText = "エラー：" + errMsg;
      console.log(errMsg);
    } else {
      // 成功の応答が返ってきた場合
      elem.innerText = await res.text();
    }
  } catch (e) {
    elem.innerText = "エラー：" + e.message;
    console.log(e);
  }

  return;
};
