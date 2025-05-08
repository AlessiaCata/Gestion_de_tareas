const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

const bAdd = document.querySelector('#bAdd');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const taskName = document.querySelector('#taskName');

renderTime();
renderTasks();

form.addEventListener('submit', e => {
  e.preventDefault();
  if (itTask.value.trim() !== '') {
    createTask(itTask.value);
    itTask.value = '';
    renderTasks();
  }
});

function createTask(value) {
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(3),
    title: value,
    completed: false,
    completedAt: null
  };
  tasks.unshift(newTask);
}

function renderTasks() {
  const tasksContainer = document.querySelector('#tasks');
  const completedContainer = document.querySelector('#completedTasks');

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  tasksContainer.innerHTML = activeTasks.map(task => `
    <div class="task">
      <div class="completed">
        <button class="start-button" data-id="${task.id}">Start</button>
      </div>
      <div class="title" data-id="${task.id}" ondblclick="editTaskTitle(this)">${task.title}</div>
      <div>
        <button class="delete-button" data-id="${task.id}">Eliminar</button>
      </div>
    </div>
  `).join('');

  completedContainer.innerHTML = completedTasks.map(task => `
    <div class="task done">
      <div class="title">${task.title}</div>
      <div class="timestamp">✔️ ${task.completedAt}</div>
      <div>
        <button class="delete-button" data-id="${task.id}">Eliminar</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.start-button').forEach(button => {
    button.addEventListener('click', () => {
      if (!timer) {
        const id = button.getAttribute('data-id');
        startButtonHandler(id);
        button.textContent = 'In progress...';
      }
    });
  });

  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      deleteTask(id);
    });
  });
}

function deleteTask(id) {
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    renderTasks();
  }
}

function editTaskTitle(element) {
  const id = element.getAttribute('data-id');
  const index = tasks.findIndex(task => task.id === id);
  const currentTitle = tasks[index].title;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentTitle;
  input.className = 'edit-input';

  element.innerHTML = '';
  element.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    saveEditedTitle(id, input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveEditedTitle(id, input.value);
    }
  });
}

function saveEditedTitle(id, newTitle) {
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1 && newTitle.trim() !== '') {
    tasks[index].title = newTitle.trim();
    renderTasks();
  }
}

function startButtonHandler(id){
  time = 3; // 25*60 para tiempo real
  current = id;
  const taskIndex = tasks.findIndex(task => task.id === id);
  taskName.textContent = tasks[taskIndex].title;

  timer = setInterval(() => {
    timeHandler(id);
  }, 1000);
}

function timeHandler(id){
  time--;
  renderTime();

  if (time === 0){
    clearInterval(timer);
    markCompleted(id);
    timer = null;
    playSound();
    renderTasks();
    startBreak();
  }
}

function startBreak(){
  time = 3; // 5*60 para tiempo real
  taskName.textContent = 'Break';
  timerBreak = setInterval(() => {
    timerBreakHandler();
  }, 1000);
}

function timerBreakHandler(){
  time--;
  renderTime();

  if (time === 0){
    clearInterval(timerBreak);
    current = null;
    timerBreak = null;
    playSound();
    taskName.textContent = "";
    renderTasks();
  }
}

function renderTime(){
  const timeDiv = document.querySelector('#value');
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);

  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function markCompleted(id){
  const taskIndex = tasks.findIndex(task => task.id === id);
  tasks[taskIndex].completed = true;
  tasks[taskIndex].completedAt = new Date().toLocaleString();
}

function playSound() {
  const audio = new Audio('./sounds/sonido.mp3');
  audio.play();
}
