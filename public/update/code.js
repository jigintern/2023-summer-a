const completedtTaskList = document.getElementById('completedtTaskList');
const uncompletedtTaskList = document.getElementById('uncompletedtTaskList');
const progressValue=document.getElementById('progressValue');
const userProgress = document.getElementById('userProgress');
const userNameElement = document.getElementById('userName');

const userID=getParam('userID');

const data = JSON.parse(await (await fetch(`/tasks/${userID}`)).text());
const userData=data[`tasksMockUser${userID}`];

if(userID){
    Init(userID);
}else
{
    const updateResult = document.getElementById('updateResult');
    updateResult.textContent = `エラー:パラメーター{userID}が指定されていません`;
}

//タスクの初期化
function Init() 
 {
    console.log(userData);

    userNameElement.textContent = userData.user;
    userProgress.value = userData.completed;
    progressValue.textContent = String(userData.completed);

    clearTaskList(completedtTaskList);
    clearTaskList(uncompletedtTaskList);


    // JSONデータからタスクを動的に生成
    userData.tasks.forEach((task) => {
      const taskSet = createTaskSet(task);
      if(task.isCompleted)
       completedtTaskList.appendChild(taskSet);
      else
      uncompletedtTaskList.appendChild(taskSet);
    });
}

//タスクの子を削除する
function clearTaskList(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

//タスクを作る関数
function createTaskSet(task) {
  const taskSet = document.createElement('div');
  taskSet.classList.add('box'); 

  const taskTitle = document.createElement('p');
  taskTitle.classList.add('title');
  taskTitle.textContent = `${task.id}: ${task.name}`;

  const newValue = document.createElement('input');
  newValue.type = 'checkbox';
  newValue.id = `cb${task.id}`;
  newValue.required = true;
  newValue.checked = task.isCompleted;

  const customCheckBox = document.createElement('label');
  customCheckBox.setAttribute('for', `cb${task.id}`);
  customCheckBox.classList.add('check-box');

  taskSet.appendChild(newValue);
  taskSet.appendChild(customCheckBox);
  taskSet.appendChild(taskTitle);

  newValue.addEventListener('change', () => checkBoxChanged(task.id));

  return (taskSet);
}

//パラメーターを取得する関数
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// タスクのチェックボックスが変更されたときに実行される関数
async function checkBoxChanged(taskNumber) {

    // タスク内容の取得
    const taskContent = document.querySelector(`#cb${taskNumber}`).nextSibling.textContent;
    const newValue = document.querySelector(`#cb${taskNumber}`).checked;
  
    // 更新結果を表示するエリアにメッセージを表示
    const updateResult = document.getElementById('updateResult');
    updateResult.textContent = `タスク "${taskContent}" の状態が変更されました。新しい値: ${newValue}`;

    //PUTリクエストを送信
    const response = await fetch("/test",{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id:taskNumber,isCompleted:newValue})
      });

    const res = await response.text()
    document.getElementById("server_response").textContent = res;

    //保存していたjsonファイルの内容の書き換え
    userData.tasks[taskNumber].isCompleted=newValue;
    Init(userID);
  }
  