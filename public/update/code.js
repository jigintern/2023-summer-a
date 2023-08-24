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
const hideButton=document.getElementById('hideButton');

const userID=getParam('userID');

let allUserData,userData;

window.onload=fetchDataAndInit();

async function fetchDataAndInit(){
    if(hideButton){
   hideButton.addEventListener('click', () => hideErrorMessage());
    }

    try{
        const url = `/tasks/${userID}`;
        const options = {
            method: "POST"
        };

        allUserData = await (await fetchWithDidFromLocalstorage(url,options)).json();
        console.log(allUserData);

        if(allUserData.message){
            stopElement();
            showErrorMessage(`エラーメッセージ:${allUserData.message}`);
            return;
        }

        const accessUserId=allUserData.access_user_id;

        userData = allUserData["body"];
        console.log(userData);

        if(userID){
            Init(accessUserId);
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
function Init(accessUserId) {
    
    console.log(userData.tasks);

    userNameElement.textContent = userData.user_name;
    userProgress.value = userData.completed;
    progressValue.textContent = String(userData.completed);

    clearTaskList(completedtTaskList);
    clearTaskList(uncompletedtTaskList);


    // JSONデータからタスクを動的に生成
    userData.tasks.forEach((task) => {
      const taskSet = createTaskSet(task,Number(accessUserId)===Number(userData.user_id));
      if(task.is_completed)
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
function createTaskSet(task,isMine) {
  const taskSet = document.createElement('div');
  taskSet.classList.add('box'); 

  const taskTitle = document.createElement('p');
  taskTitle.classList.add('title');
  taskTitle.textContent = `${task.id}: ${task.name}`;

  if(isMine){
    const newValue = document.createElement('input');
    newValue.type = 'checkbox';
    newValue.id = `cb${task.id}`;
    newValue.required = true;
    newValue.checked = task.is_completed;

    const customCheckBox = document.createElement('label');
    customCheckBox.setAttribute('for', `cb${task.id}`);
    customCheckBox.classList.add('check-box');

    taskSet.appendChild(newValue);
    taskSet.appendChild(customCheckBox);

    newValue.addEventListener('change', () => checkBoxChanged(task.id));
  }

  taskSet.appendChild(taskTitle);

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

    const url = `/tasks`
    const options = {
        method: "PUT",
        userId: Number(userID),
        taskId: taskNumber,
        isCompleted: newValue
    }

    const res = await(await fetchWithDidFromLocalstorage(url, options)).json();

    serverResponse.textContent = res;

    if(res.message)
    {
        console.log(`データの取得に失敗しました :${res.message}`);
        showErrorMessage(`データの取得に失敗しました :${res.message}`);
        Init(userID);
        return;
    }
  
    // 更新結果を表示するエリアにメッセージを表示
    const updateResult = document.getElementById('updateResult');
    updateResult.textContent = `タスク "${taskContent}" の状態が変更されました。新しい値: ${newValue}`;

    //保存していたjsonファイルの内容の書き換え
    userData.tasks.filter(task => task.id===taskNumber)[0].is_completed=newValue;
    fetchDataAndInit(userID);
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