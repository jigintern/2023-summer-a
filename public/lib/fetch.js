import { DIDAuth } from "https://jigintern.github.io/did-login/auth/DIDAuth.js";

export const fetchWithDid = async (url, method, options, did, password) => {
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
// 戻値は，localStorageに必要な変数がなければnull，そうでなければResponse
export const fetchWithDidFromLocalstorage = async (url, options) => {
  const did = localStorage.getItem("did");
  const password = localStorage.getItem("password");

  if (did == null || password == null) {
    console.log("No DID or no password saved in LocalStorage!");
    return null;
  }

  const method = options.method;
  return await fetchWithDid(url, method, options, did, password);
};
