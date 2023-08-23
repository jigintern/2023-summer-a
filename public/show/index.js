window.onload=load;
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
    let tbody="";

    //自分
    tbody+="<tr class=\'me\'>";
    tbody+="<td>"+list[id].id+"</td>"+
    "<td>"+list[id].user+"</td>"+
    "<td><div>"+list[id].completed+"%"+"<progress max=\"100\" value="+list[id].completed+"></progress></div></td>";
    tbody+="</tr>";

    //自分以外
    for(let i=0; i<list.length; ++i){
        if(id===i) continue;
        tbody+="<tr>";
        tbody+="<td>"+list[i].id+"</td>"+
        "<td>"+list[i].user+"</td>"+
        "<td><div>"+list[i].completed+"%"+"<progress max=\"100\" value="+list[i].completed+"></progress></div></td>";
        tbody+="</tr>";
    }
    document.getElementById("tbody").innerHTML=tbody;
    initInfo();
}

document.querySelectorAll('th').forEach(elm => {
    elm.onclick = function () {
        const columnNo = this.cellIndex; //クリックされた列番号
        const table = this.parentNode.parentNode.parentNode;
        const sortArray = []; //クリックした列のデータを全て格納する配列
        for (let r = 1; r < table.rows.length; r++) {
            //行番号と値を配列に格納
            const column = new Object;
            column.row = table.rows[r];
            column.value = table.rows[r].cells[columnNo].textContent;
            sortArray.push(column);
        }
        if (columnNo === 0) { //ID
            sortArray.sort(compareNumber);
        } else if (columnNo === 1){ //なまえ
            sortArray.sort(compareString);
        } else {
            sortArray.sort(comparePercentDesc);
        }
        //ソート後のTRオブジェクトを順番にtbodyへ追加（移動）
        const tbody = document.getElementById("tbody");
        for (let i = 0; i < sortArray.length; i++) {
            tbody.appendChild(sortArray[i].row);
        }
    };
});



//数値ソート（昇順）
function compareNumber(a, b)
{
	return a.value - b.value;
}

//文字列ソート（昇順）
function compareString(a, b) {
	if (a.value < b.value) {
		return -1;
	} else {
		return 1;
	}
}

//％ソート (降順)
function comparePercentDesc(a, b)
{
	return b.value.split('%')[0] - a.value.split('%')[0];
}

function initInfo(){
    document.querySelectorAll('td').forEach(elm => {
        elm.onclick = function() {
            document.getElementById("modal").style.display = "block";
        };
    });
}

document.getElementById("modal").addEventListener("click", (e) =>{
    e.target.style.display="none";
});