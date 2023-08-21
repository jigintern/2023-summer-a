// JSONデータの読み込み
//import data from './test.json' assert { type: 'json' };

const response = await fetch("/tasks/0");
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
  newValueInput.checked=true

  const updateButton = document.createElement('button');
  updateButton.type = 'button';
  updateButton.classList.add('updateButton');
  updateButton.textContent = 'タスク更新';
  updateButton.addEventListener('click', () => updateTask(task.id));

  taskSet.appendChild(taskTitle);
  taskSet.appendChild(isCompleted);
  taskSet.appendChild(label);
  taskSet.appendChild(newValueInput);
  taskSet.appendChild(updateButton);

  return taskSet;
}
