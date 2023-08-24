import {fetchWithDidFromLocalstorage} from "/lib/fetch.js";

const completedtTaskList = document.getElementById('completedtTaskList');
const uncompletedtTaskList = document.getElementById('uncompletedtTaskList');
const progressValue=document.getElementById('progressValue');
const userProgress = document.getElementById('userProgress');
const userNameElement = document.getElementById('userName');
const serverResponse =  document.getElementById('server_response');
const progressId=document.getElementById('progressId');
const uncompletedtTask=document.getElementById('uncompletedtTask');
const completedtTask=document.getElementById('completedtTask');

const userID=getParam('userID');
let allUserData,userData;

window.onload=fetchDataAndInit();

async function fetchDataAndInit(){

    try{
        const url = `/tasks/${userID}`;
        const options = {
            method: "POST"
        };

        allUserData = JSON.parse(await (await fetchWithDidFromLocalstorage(url,options)).text());
        console.log(allUserData);

        if(allUserData.message){
            stopElement();
            showErrorMessage(`エラーメッセージ:${allUserData.message}`);
            return;
        }

        //userData = allUserData[`tasksMockUser${userID}`];
        userData = allUserData["body"];
        console.log(userData);

        if(userID){
            Init(userID);
        }else{
            const updateResult = document.getElementById('updateResult');
            updateResult.textContent = `エラー:パラメーター{userID}が指定されていません`;
        }

    }catch (error) {
        stopElement();
        console.error('エラー:', error);
        showErrorMessage(`エラー:${error}`);
    }
}

//タスクの初期化
function Init() {
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

    const url = `/tasks`
    const options = {
        method: "PUT",
        userId: userID,
        taskId: taskNumber,
        isCompleted: newValue
    }

    const res = await(await fetchWithDidFromLocalstorage(url, options)).text();

    serverResponse.textContent = res;

    if(res.message)
    {
        showErrorMessage(`データの取得に失敗しました :${res.message}`);
        return;
    }

    // タスク内容の取得
    const taskContent = document.querySelector(`#cb${taskNumber}`).nextSibling.textContent;
    const newValue = document.querySelector(`#cb${taskNumber}`).checked;
  
    // 更新結果を表示するエリアにメッセージを表示
    const updateResult = document.getElementById('updateResult');
    updateResult.textContent = `タスク "${taskContent}" の状態が変更されました。新しい値: ${newValue}`;

    //保存していたjsonファイルの内容の書き換え
    userData.tasks[taskNumber].isCompleted=newValue;
    Init(userID);
  }
  
  // エラーメッセージを表示する関数
function showErrorMessage(message) {
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
  
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
  }
  
  // エラーメッセージを非表示にする関数
  function hideErrorMessage() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.style.display = 'none';
  }
  
function stopElement(){
    userNameElement.remove();
    userProgress.remove();
    progressValue.remove();
    completedtTaskList.remove();
    uncompletedtTaskList.remove();
    progressId.remove();
    uncompletedtTask.remove();
    completedtTask.remove();
}