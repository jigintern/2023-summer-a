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

    const userData = JSON.parse(jsonData);
    console.log(userData);

    const data=userData[`tasksMockUser${userID}`];
    console.log(data);

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

  taskSet.appendChild(taskTitle);
  taskSet.appendChild(isCompleted);
  taskSet.appendChild(label);
  taskSet.appendChild(newValueInput);

  newValueInput.addEventListener('change', () => checkBoxChanged(task.id+1));

  return taskSet;
}

//パラメーターを取得する関数
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// タスクのチェックボックスが変更されたときに実行される関数
async function checkBoxChanged(taskNumber) {
    // タスク内容の取得
    const taskContent = document.querySelector(
      `.taskSet:nth-child(${taskNumber}) .taskTitle`
    ).textContent;
  
    const newValue = document.querySelector(
      `.taskSet:nth-child(${taskNumber}) .newValue`
    ).checked;
  
    // 更新結果を表示するエリアにメッセージを表示
    const updateResult = document.getElementById('updateResult');
    updateResult.textContent = `タスク "${taskContent}" の状態が変更されました。新しい値: ${newValue}`;

    const response = await fetch("/test",{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id:taskNumber-1,isCompleted:newValue})
      });

    const res= await response.text()
    document.getElementById("server_response").textContent = res;
    console.log(res);
  }
  