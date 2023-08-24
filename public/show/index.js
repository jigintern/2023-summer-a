import { fetchWithDidFromLocalstorage } from "/lib/fetch.js";

// window.onload=load;
document.getElementById("load").onclick = load;

async function load(){
    const response = await fetchWithDidFromLocalstorage('/tasks', {method: "POST"});
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
    
    const id=json.access_user_id;
    const list=json.body;
    const startId=list[0].user_id;
    document.getElementById("update").addEventListener("click", ()=>{location.href='../update?userID='+id});

    //table作成
    let tbody="";
    
    //自分
    tbody+="<tr class=\'me\'>";
    tbody+="<td>"+list[id-startId].user_id+"</td>"+
    "<td>"+list[id-startId].user_name+"</td>"+
    "<td><div>"+list[id-startId].completed+"%"+"<progress max=\"100\" value="+list[id-startId].completed+"></progress></div></td>";
    tbody+="</tr>";
    
    //自分以外
    for(let i=0; i<list.length; ++i){
        if(id-startId===i) continue;
        tbody+="<tr>";
        tbody+="<td>"+list[i].user_id+"</td>"+
        "<td>"+list[i].user_name+"</td>"+
        "<td><div>"+list[i].completed+"%"+"<progress max=\"100\" value="+list[i].completed+"></progress></div></td>";
        tbody+="</tr>";
    }
    document.getElementById("tbody").innerHTML=tbody;
    initInfo(json);
}

//ソート用
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
        } else { //%
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

//詳細表示用
function initInfo(response){
    document.querySelectorAll('td').forEach(elm => {
        elm.onclick = function() {
            //モーダルの表示
            document.getElementById("modal").style.display = "block";
            //インデックスの取得
            const targetId=this.parentNode.firstChild.textContent;
            const targetIndex=response.body.findIndex(item => item.user_id==targetId);
            //名前の取得
            document.getElementById("modalHead").innerText=response.body[targetIndex].user_name;
            //詳細進捗の取得
            const tasks=response.body[targetIndex].tasks;
            let text="<ul>";
            for(let i=0; i<tasks.length; ++i){
                text+="<li>"+tasks[i].name+" ";
                if(tasks[i].isCompleted===true)
                    text+="&#10004;"//チェック
                else
                    text+="&#10006;"//バツ
                text+="<il>";
            }
            text+="</ul>";

            document.getElementById("modalBody").innerHTML=text;
        };
    });
}

document.getElementById("modal").addEventListener("click", (e) =>{
    if(e.target.id==="modal")
        e.target.style.display="none";
});