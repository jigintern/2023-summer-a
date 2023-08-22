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
    if (!res.ok) {
      // サーバーから成功ステータスが返ってこない場合(もしくはlocalStorageに認証情報がない)
      console.log(res);
      const json = await res.json();
      elem.innerText = "エラー：" + json.message;
    } else {
      // 成功の応答が返ってきた場合
      const json = await res.json();
      elem.innerText = json.message;
    }
  } catch (e) {
    elem.innerText = "例外発生：" + e.message;
    console.log(e);
  }

  return;
};

document.getElementById("load").onclick = async () => {
  try {
    const res = await fetchWithDidFromLocalstorage("/tasks", {
      method: "POST",
    });
    if (!res.ok) {
      // サーバーから成功ステータスが返ってこない場合(もしくはlocalStorageに認証情報がない)
      if (res.status == 303) {
        // localStorageにアカウント情報がない場合，303が返ってくるのでリダイレクト
        const json = await res.json();
        console.log(json.message);
        alert("ログインが必要です．ログインページへリダイレクトします．");
        location.href = json.redirectURL; // リダイレクトを実行
        return; // reqのbodyを2回読んでしまう心配は恐らくないが一応．
      } else {
        console.log(await res.text());
      }
    } else {
      // 成功の応答が返ってきた場合
      console.log(await res.json());
    }
  } catch (e) {
    console.log(e);
  }
};

document.getElementById("logout").onclick = async () => {
  localStorage.clear();
  location.href = "/";
};
