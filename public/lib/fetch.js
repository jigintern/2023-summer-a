import { DIDAuth } from "https://jigintern.github.io/did-login/auth/DIDAuth.js";

export const fetchWithDid = async (url, method, options, did, password) => {
	const [message, sign] = DIDAuth.genMsgAndSign(did, password, url, method);

	const body = {
		message,
		sign,
		did,
		...options
	};

	const response = await fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	return response;
};

export const fetchWithDidFromLocalstorage = async (url, method, options) => {
	const did = localStorage.getItem('did');
	const password = localStorage.getItem('password');

	return await fetchWithDid(url, method, options, did, password);
};