// JSONデータの読み込み
//import data from './test.json' assert { type: 'json' };

// const response = await fetch("/tasks");
// let jsonData = (await response.text());

// const data = JSON.parse(jsonData);
// console.log(jsonData.length);

//         // プルダウンメニューにオプションを追加
//         var userSelect = document.getElementById("userSelect");
//         for (var i = 0; i < data.length; i++) {
//             var option = document.createElement("option");
//             option.value = data[i].user;
//             option.text = data[i].user;
//             userSelect.appendChild(option);
//         }

//                 // 変更ボタンにクリックイベントを追加し、func関数を実行
//                 var changeButton = document.getElementById("changeButton");
//                 changeButton.addEventListener("click", func);
        
//                 // 変更ボタンがクリックされたときに実行される空の関数
//                 function changePage() {
//                     Init(1);
//                 }

const userID=getParam('userID');
if(userID){
Init(userID);
}else
{
    const updateResult = document.getElementById('updateResult');
    updateResult.textContent = `エラー:パラメーター{userID}が指定されていません`;
}

async function Init(userID) 
 {
const response = await fetch(`/tasks/${userID}`);
let jsonData = (await response.text());

const data = JSON.parse(jsonData);

console.log(data);
console.log(jsonData);

// ユーザー情報を表示
const userNameElement = document.getElementById('userName');
userNameElement.textContent = data.user;

// ユーザーの進捗をプログレスバーで表示
const userProgress = document.getElementById('userProgress');
userProgress.value = data.completed;

const progressValue=document.getElementById('progressValue');
progressValue.textContent = String(data.completed);

// JSONデータからタスクを動的に生成
const taskList = document.getElementById('taskList');
data.tasks.forEach((task) => {
  const taskSet = createTaskSet(task);
  taskList.appendChild(taskSet);
});
}

// タスクを更新する関数
function updateTask(taskNumber) {
  // タスク内容の取得
  const taskContent = document.querySelector(
    `.taskSet:nth-child(${taskNumber}) .taskTitle`
  ).textContent;

  const newValue = document.querySelector(
    `.taskSet:nth-child(${taskNumber}) .newValue`
  ).checked;

  // 更新結果を表示するエリアにメッセージを表示
  const updateResult = document.getElementById('updateResult');
  updateResult.textContent = `タスク "${taskContent}" が更新されました。新しい値: ${newValue}`;
}

// タスクセットを生成する関数
function createTaskSet(task) {
  const taskSet = document.createElement('div');
  taskSet.classList.add('taskSet');

  const taskTitle = document.createElement('p');
  taskTitle.classList.add('taskTitle');
  taskTitle.textContent = `タスク${task.id}: ${task.name}`;

  const isCompleted = document.createElement('p');
  isCompleted.classList.add('isCompleted');
  isCompleted.textContent = task.isCompleted ? '完了済み' : '未完了';

  const label = document.createElement('label');
  label.textContent = '新しい値:';

  const newValueInput = document.createElement('input');
  newValueInput.type = 'checkbox';
  newValueInput.classList.add('newValue');
  newValueInput.required = true;
  newValueInput.checked=task.isCompleted;

  const updateButton = document.createElement('button');
  updateButton.type = 'button';
  updateButton.classList.add('updateButton');
  updateButton.textContent = 'タスク更新';
  updateButton.addEventListener('click', () => updateTask(task.id+1));

  taskSet.appendChild(taskTitle);
  taskSet.appendChild(isCompleted);
  taskSet.appendChild(label);
  taskSet.appendChild(newValueInput);
  taskSet.appendChild(updateButton);

  return taskSet;
}

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}