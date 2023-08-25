//Powered by ChatGPT API
import { fetchWithDidFromLocalstorage } from "/lib/fetch.js";

window.onload=load;
document.getElementById("load").onclick = load;

async function gptComment(top, me) {
    const comment=document.getElementById("comment");
    comment.classList.add("empty");

    comment.innerText="";    
    const message="あなたは小6のクラスを受け持つ担任です。彼の宿題の進捗に対してなにか、やる気が出るような面白い言葉を50文字程度でおねがいします。1位の進捗は"+top+"%で彼の進捗は"+me+"%です";
    const body={
        method: "POST",
        prompt:message
    }
    console.log(body);
    const response=await fetchWithDidFromLocalstorage("/api/chat", body);
    const json=await response.json();
    if(!json.message.includes('error')){
        comment.innerText=json.message;
        comment.classList.remove("empty");
    }
}

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
    let top=list[id-startId].completed;
    for(let i=0; i<list.length; ++i){
        if(id-startId===i) continue;
        tbody+="<tr>";
        tbody+="<td>"+list[i].user_id+"</td>"+
        "<td>"+list[i].user_name+"</td>"+
        "<td><div>"+list[i].completed+"%"+"<progress max=\"100\" value="+list[i].completed+"></progress></div></td>";
        tbody+="</tr>";
        top=Math.max(top, list[i].completed);
    }
    document.getElementById("tbody").innerHTML=tbody;
    initInfo(json);
    gptComment(top,list[id-startId].completed);
}

//ソート用
document.querySelectorAll('th').forEach(elm => {
    elm.onclick = function () {
        const tbody = document.getElementById("tbody"); //tableBody
        const columnNo = this.cellIndex; //クリックされた列番号
        const table = this.parentNode.parentNode.parentNode;
        const sortArray = []; //クリックした列のデータを全て格納する配列
        let min=100;
        let first=-1;
        let second=-1;
        let third=-1;

        //装飾用クラス削除
        document.querySelectorAll('.comp').forEach(elm => {elm.classList.remove("comp")});
        document.querySelectorAll('.worst').forEach(elm => {elm.classList.remove("worst")});
        document.querySelectorAll('.first').forEach(elm => {elm.classList.remove("first")});
        document.querySelectorAll('.second').forEach(elm => {elm.classList.remove("second")});
        document.querySelectorAll('.third').forEach(elm => {elm.classList.remove("third")});


        for (let r = 1; r < table.rows.length; r++) {
            //行番号と値を配列に格納
            const column = new Object;
            column.row = table.rows[r];
            column.value = table.rows[r].cells[columnNo].textContent;
            sortArray.push(column);

            //完遂者にクラス付与、最下位計算、上位計算
            if(columnNo==2){
                const val=Number(column.value.split('%')[0]);
                if(val==100)
                    column.row.classList.add("comp");
                min=Math.min(val,min);

                if(val>first){
                    third=second;
                    second=first;
                    first=val;
                } else if (val>second) {
                    third=second;
                    second=val;
                } else if (val>third) {
                    third=val;
                }
            }
        }
        //最下位にクラス付与
        if(columnNo==2){
            for(let r = 0; r < table.rows.length-1; r++){
                if(first!=-1&&document.getElementById("tbody").rows[r].cells[2].textContent==first+'%')
                    document.getElementById("tbody").rows[r].classList.add("first");
                if(second!=-1&&document.getElementById("tbody").rows[r].cells[2].textContent==second+'%')
                    document.getElementById("tbody").rows[r].classList.add("second");
                if(third!=-1&&document.getElementById("tbody").rows[r].cells[2].textContent==third+'%')
                    document.getElementById("tbody").rows[r].classList.add("third");
            }

            if(min!=100) {
                for(let r = 0; r < table.rows.length-1; r++){
                    if(document.getElementById("tbody").rows[r].cells[2].textContent==min+'%')
                        document.getElementById("tbody").rows[r].classList.add("worst");
                }
            }
        }
        

        if (columnNo === 0) { //ID
            sortArray.sort(compareNumber);
        } else if (columnNo === 1){ //なまえ
            sortArray.sort(compareString);
        } else { //%
            sortArray.sort(comparePercentDesc);
        }
        //ソート後のTRオブジェクトを順番にtbodyへ追加（移動）
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
            document.getElementById("modalHead").innerHTML="<div>"+response.body[targetIndex].user_name+"</div>";
            document.getElementById("modalHead").innerHTML+=
            "<button onclick=\"location.href='../update?userID="+targetId+"'\" >詳細</button>";
            //詳細進捗の取得
            const tasks=response.body[targetIndex].tasks;
            let text="<ul>";
            for(let i=0; i<tasks.length; ++i){
                text+="<li>"+tasks[i].name+" ";
                if(tasks[i].is_completed==1)
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