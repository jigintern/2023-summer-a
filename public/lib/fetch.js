import { DIDAuth } from "https://jigintern.github.io/did-login/auth/DIDAuth.js";

const fetchWithDid = async (url, method, options, did, password) => {
  const [message, sign] = await DIDAuth.genMsgAndSign(did, password, url, method);

  const body = {
    did,
    sign,
    message,
    ...options,
  };

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
};

// 引数はエンドポイント(String)，オプション(Object)
// 戻値はResponseで統一．
export const fetchWithDidFromLocalstorage = async (url, options) => {
  const did = localStorage.getItem("did");
  const password = localStorage.getItem("password");

  if (did == null || password == null) {
    // localStorageにdidパラメータもしくはpasswordパラメータが無い場合
    // そもそもHTTP通信をしていないがResponseを返すことに注意
    console.log("No DID or no password saved in LocalStorage!");
    const body = {
      message: "ログインが必要です．",
      redirectURL: "/login",
    };
    return new Response(JSON.stringify(body), {
      status: 303,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const method = options.method;
  return await fetchWithDid(url, method, options, did, password);
};
