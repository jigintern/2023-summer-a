// window.onload = load;
document.getElementById("load").onclick = load;

async function load(){
    const response = await fetch('/tasks');
    // const body = { //エラー時確認用
    //     message: "DBに登録されていません",
    //     redirectURL: "/register",
    // };
    // const response = new Response(JSON.stringify(body), {
    //     status: 303,
    //     headers: {
    //       "content-type": "application/json",
    //     },
    // });

    const json = await response.json();

    //エラー処理
    if (!response.ok) {
        const errMsg = await json.message;
        const DOMmessage=document.getElementById("emessage");
        DOMmessage.innerText = "エラー:"+response.status+' '+errMsg;
        // DOMmessage.innerText+="\nログインし直してください"
        document.getElementById("error").style.display='flex';
        if(json.redirectURL==='/register') {
            document.getElementById("redirect").addEventListener("click", ()=>{location.href=json.redirectURL;});
            document.getElementById("redirect").innerText="新規登録";
        }

        //ボタン無効化
        const DOMload=document.getElementById("load");
        DOMload.disabled="disabled";
        DOMload.style.backgroundColor="#0056b3";
        const DOMupdate=document.getElementById("update");
        DOMupdate.disabled="disabled";
        DOMupdate.style.backgroundColor="#0056b3";

        return;
    }

    const id=json.userId;
    const list=json.taskListMock;

    //table作成
    let table="<table>";
    table+="<thead><tr><th>ID</th><th>USER</th><th>COMPLETED</th></tr></thead>"
    table+="<tbody>";

    //自分
    table+="<tr class=\'me\'>";
    table+="<td>"+list[id].id+"</td>"+
    "<td>"+list[id].user+"</td>"+
    "<td><div>"+list[id].completed+"%"+"<progress max=\"100\" value="+list[id].completed+"></progress></div></td>";
    table+="</tr>";

    //自分以外
    for(let i=0; i<list.length; ++i){
        if(id===i) continue;
        table+="<tr>";
        table+="<td>"+list[i].id+"</td>"+
        "<td>"+list[i].user+"</td>"+
        "<td><div>"+list[i].completed+"%"+"<progress max=\"100\" value="+list[i].completed+"></progress></div></td>";
        table+="</tr>";
    }
    table+="</tbody>"
    table+="</table>";
    document.getElementById("contents").innerHTML=table;
}