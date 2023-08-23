import { fetchWithDidFromLocalstorage } from "/lib/fetch.js";

window.onload = async () => {
  const elem = document.querySelector("#loginstate");

  let res;
  try {
    res = await fetchWithDidFromLocalstorage("/authsample", {
      method: "POST",
    });
  } catch (e) {
    elem.innerText = "例外：" + e.message;
    console.log(e);
  }
  const json = await res.json();

  if (!res.ok) {
    // サーバーから成功ステータスが返ってこない場合(もしくはlocalStorageに認証情報がない)
    console.log(res);
    elem.innerText = "エラー：" + json.message;
  } else {
    // 成功の応答が返ってきた場合
    elem.innerText = json.message;
  }
};

document.getElementById("load").onclick = async () => {
  let res;
  try {
    res = await fetchWithDidFromLocalstorage("/tasks", {
      method: "POST",
    });
  } catch (e) {
    console.log(e);
  }
  const json = await res.json();

  if (!res.ok) {
    // サーバーから成功ステータスが返ってこない場合(もしくはlocalStorageに認証情報がない)
    if (res.status == 303) {
      // localStorageにアカウント情報がない場合，303が返ってくるのでリダイレクト
      console.log(json.message);
      alert("ログインが必要です．ログインページへリダイレクトします．");
      location.href = json.redirectURL; // リダイレクトを実行
    } else {
      console.log(json);
    }
  } else {
    // 成功の応答が返ってきた場合
    console.log(json);
  }
};

document.getElementById("logout").onclick = () => {
  localStorage.clear();
  location.href = "/";
};
