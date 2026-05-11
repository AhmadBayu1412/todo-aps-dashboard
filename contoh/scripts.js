const submitForm = document.getElementById('form');
const nextTodo = document.getElementById('input');
const timeStamp = document.getElementById('date');
const description = document.getElementById('task-desc');
const status = document.getElementById('task-column');
const priority = document.getElementById('task-priority');

const todos = [];
const RENDER_EVENT = 'render-todo';

document.addEventListener('DOMContentLoaded', function () {
  loadDataFromStorage();

  // createModal();
  // createTaskModal();

  submitForm.addEventListener('submit', function (e) {
    e.preventDefault();

    addTask();
  });
});

// ADD TASK
function addTask() {
  const generateID = generateId();

  if (!nextTodo.value.trim() || !timeStamp.value) {
    alert('Task dan tanggal wajib diisi!');
    return;
  }

  const todoObject = generateTodoObject(
    generateID,
    nextTodo.value,
    description.value,
    timeStamp.value,
    status.value,
    priority.value,
  );

  todos.push(todoObject);
  submitForm.reset();

  saveData();

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateTodoObject(
  id,
  task,
  description,
  timestamp,
  status,
  priority,
) {
  return {
    id,
    task,
    description,
    timestamp,
    status,
    priority,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(todos);

  renderTask();
});

// MAKE OBJECT
// Object Todo

const todoContainer = document.getElementById('todo-list');
const progressContainer = document.getElementById('progress-list');
const completedContainer = document.getElementById('completed-list');

function createCard(task) {
  const card = document.createElement('div');
  card.classList.add('tf-card');

  let actionButtons = '';

  // Entered Todo
  if (task.status === 'todo') {
    actionButtons = `
    <div class="tf-card-actions">
      <button class="tf-action-btn complete-btn" data-id="${task.id}">
        <i class="ti ti-check" aria-hidden="true"></i>
      </button>

      <button class="tf-action-btn delete-btn" data-id = "${task.id}">
          <i class="ti ti-trash" aria-hidden="true"></i> 
      </button>      
    </div>
    `;
  }

  // Entered Inprogress
  else if (task.status === 'progress') {
    actionButtons = `
    <div class="tf-card-actions">
      <button class="tf-action-btn back-btn" data-id = "${task.id}">
          <i class="ti ti-arrow-back-up" aria-hidden="true"></i>
      </button>

      <button class="tf-action-btn complete-btn" data-id = "${task.id}">
          <i class="ti ti-check" aria-hidden="true"></i> 
      </button>      
    </div>
    `;
  }

  // Entered Complete
  else if (task.status === 'completed') {
    actionButtons = `
    <div class="tf-card-actions">
      <button class="tf-action-btn back-btn" data-id = "${task.id}">
          <i class="ti ti-arrow-back-up" aria-hidden="true"></i>
      </button>

      <button class="tf-action-btn delete-btn" data-id = "${task.id}">
          <i class="ti ti-trash" aria-hidden="true"></i> 
      </button>      
    </div>
    `;
  }

  let checkMarkup = '';

  // check: todo
  if (task.status === 'todo') {
    checkMarkup = `<div class="tf-card-check"></div>`;
  }
  // check: progress
  else if (task.status === 'progress') {
    checkMarkup = `
    <div class="tf-card-check-progress">
      <i class="ti ti-loader-2"></i>
    </div>`;
  }
  // check: completed
  else if (task.status === 'completed') {
    checkMarkup = `
    <div class="tf-card-check done">
    <i class="ti ti-check">
    </i>
    </div>
    `;
  }

  const titleClass =
    task.status === 'completed' ? 'tf-card-title done' : 'tf-card-title';

  card.dataset.id = task.id;
  card.innerHTML = `    
  <div class="tf-card-header">
      ${checkMarkup}
      <div class="${titleClass}">${task.task}</div>
      ${actionButtons}
  </div>

  <div class="tf-card-body-click" data-id="${task.id}">
  <div class="tf-card-desc">${task.description || ''}</div>
  
    <div class="tf-card-footer">
      <span class="tf-badge ${task.priority}">${task.priority}</span>
      <span class="tf-date"><i class="ti ti-calendar" aria-hidden="true"></i>
      ${task.timestamp}
      </span>
    </div>
  </div>
  `;

  return card;
}

const todoCount = document.getElementById('todo-count');
const progressCount = document.getElementById('progress-count');
const completedCount = document.getElementById('completed-count');

function renderTask() {
  todoContainer.innerHTML = '';
  progressContainer.innerHTML = '';
  completedContainer.innerHTML = '';

  let todoTotal = 0;
  let progressTotal = 0;
  let completedTotal = 0;

  // Cara 1: Use append
  todos.forEach((task) => {
    const cardColumn = createCard(task);

    if (task.status === 'todo') {
      todoContainer.append(cardColumn);
      todoTotal++;
    } else if (task.status === 'progress') {
      progressContainer.append(cardColumn);
      progressTotal++;
    } else if (task.status === 'completed') {
      completedContainer.append(cardColumn);
      completedTotal++;
    }
  });

  todoCount.textContent = todoTotal;
  progressCount.textContent = progressTotal;
  completedCount.textContent = completedTotal;

  // Cara 2: use raw innerHTML
  /*todos.forEach((task) => {
    const card = createCard(task);

    if (task.status == 'todo') {
      todoContainer.innerHTML += card;
    } else if (task.status == 'progress') {
      progressContainer.innerHTML += card;
    } else if (task.status == 'completed') {
      completedContainer.innerHTML += card;
    }
  });*/
}

// addEventListener_Move
document.addEventListener('click', function (e) {
  // Button Todo
  if (e.target.closest('.complete-btn')) {
    const id = Number(e.target.closest('.complete-btn').dataset.id);

    moveTaskForward(id);
  }

  // Button Back
  else if (e.target.closest('.back-btn')) {
    const id = Number(e.target.closest('.back-btn').dataset.id);

    moveTaskBack(id);
  }

  // Button Delete
  else if (e.target.closest('.delete-btn')) {
    const id = Number(e.target.closest('.delete-btn').dataset.id);

    deleteTask(id);
  }

  // Click card body -> open edit modal
  else if (e.target.closest('.tf-card-body-click')) {
    const id = Number(e.target.closest('.tf-card-body-click').dataset.id);
    openTaskModal('edit', id);
  }

  // Click '+ Add Task' link inn columns -> open add modal for that column
  else if (e.target.closest('.tf-add-link')) {
    const col = e.target.closest('.tf-col');
    const colStatus = col.id.replace('-container', '');
    openTaskModal('add', null, colStatus);
  }
});

// move task to diferent column
// Action 1: Move
function moveTaskForward(id) {
  const task = todos.find((t) => t.id === id);

  if (!task) return;

  if (task.status === 'todo') {
    task.status = 'progress';
  } else if (task.status === 'progress') {
    task.status = 'completed';
  }

  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Action 2: Move back
function moveTaskBack(id) {
  const task = todos.find((t) => t.id === id);

  if (!task) return;

  if (task.status === 'completed') {
    task.status = 'progress';
  } else if (task.status === 'progress') {
    task.status = 'todo';
  }

  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Action 3: Delete
function deleteTask(id) {
  const taskIndex = todos.findIndex((t) => t.id === id);

  if (taskIndex === -1) return;

  todos.splice(taskIndex, 1);

  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

const STORAGE_KEY = 'TASKFLOW_APPS';
const SAVED_EVENT = 'saved_task';

function saveData() {
  const parsed = JSON.stringify(todos);
  localStorage.setItem(STORAGE_KEY, parsed);

  document.dispatchEvent(new Event(SAVED_EVENT));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  if (!serializedData) return;

  const data = JSON.parse(serializedData);

  for (const todo of data) {
    todos.push(todo);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Dynamic Analytics
function calcAnalytics() {
  const completed = todos.filter((t) => t.status === 'completed').length;
  const inProgress = todos.filter((t) => t.status === 'progress').length;
  const todo = todos.filter((t) => t.status === 'todo').length;

  const total = todos.length;
  const productivity = total === 0 ? 0 : Math.round((completed / total) * 100);
  const todayProgress =
    total === 0
      ? 0
      : Math.round(((completed + inProgress * 0.5) / total) * 100);

  return { total, completed, inProgress, todo, productivity, todayProgress };
}

function updateStats() {
  const { total, completed, productivity, todayProgress } = calcAnalytics();

  // update value
  document.querySelector(`.tf-stat:nth-child(1) .tf-stat-value`).textContent =
    total;
  document.querySelector(`.tf-stat:nth-child(2) .tf-stat-value`).textContent =
    completed;
  document.querySelector(`.tf-stat:nth-child(3) .tf-stat-value`).textContent =
    productivity + '%';
  document.querySelector(`.tf-stat:nth-child(4) .tf-stat-value`).textContent =
    todayProgress + '%';

  // update sub labels
  const prodLabel =
    productivity >= 80
      ? 'Excellent 🔥'
      : productivity >= 50
        ? 'Good 👍'
        : productivity > 0
          ? 'Keep Going 💪'
          : 'No tasks yet';

  document.querySelector('.tf-stat:nth-child(3) .tf-stat-sub').textContent =
    prodLabel;

  const progressSub = document.querySelector('.tf-stat:nth-child(4)');
  const motivText = progressSub.querySelector('.tf-progress-motivtext');

  if (motivText)
    motivText.textContent =
      todayProgress >= 80
        ? 'Almost there! 🎯'
        : todayProgress >= 50
          ? "Keep going! You're doing great."
          : todayProgress > 0
            ? "Let's get started! 🚀"
            : 'Add tasks to begin.';

  // update progress bar
  document.querySelector('.tf-progress-fill').style.width = todayProgress + '%';

  // update sparklines
  updateSparklines();
}

const SPARK_HISTORY_KEY = 'TASKFLOW_SPARK_HISTORY';
const SPARK_MAX_POINTS = 8;

function loadSparkHistory() {
  try {
    return (
      JSON.parse(localStorage.getItem(SPARK_HISTORY_KEY)) || {
        total: [],
        completed: [],
        productivity: [],
      }
    );
  } catch {
    return { total: [], completed: [], productivity: [] };
  }
}

function saveSparkHistory(history) {
  localStorage.setItem(SPARK_HISTORY_KEY, JSON.stringify(history));
}

function recordSparkSnapshot() {
  const { total, completed, productivity } = calcAnalytics();
  const history = loadSparkHistory();

  // Only record if value changed from last snapshot
  const push = (arr, val) => {
    if (arr.length === 0 || arr[arr.length - 1] !== val) {
      arr.push(val);
    }
    return arr.slice(-SPARK_MAX_POINTS);
  };

  history.total = push(history.total, total);
  history.completed = push(history.completed, completed);
  history.productivity = push(history.productivity, productivity);

  saveSparkHistory(history);
  return history;
}

function updateSparklines() {
  const history = recordSparkSnapshot();

  const buildPoints = (arr, minY, maxY) => {
    const midY = ((minY + maxY) / 2).toFixed(1);
    // Need at least 2 points for polyline to render
    if (arr.length === 0) return `0,${midY} 100,${midY}`;
    const data = arr.length === 1 ? [arr[0], arr[0]] : arr;
    const max = Math.max(...data, 1);
    return data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y =
          max === 0 ? midY : (maxY - (val / max) * (maxY - minY)).toFixed(1);
        return `${x.toFixed(1)},${y}`;
      })
      .join(' ');
  };

  document
    .querySelector('.tf-stat:nth-child(1) .tf-sparkline polyline')
    .setAttribute('points', buildPoints(history.total, 5, 22));

  document
    .querySelector('.tf-stat:nth-child(2) .tf-sparkline polyline')
    .setAttribute('points', buildPoints(history.completed, 6, 22));

  document
    .querySelector('.tf-stat:nth-child(3) .tf-sparkline polyline')
    .setAttribute('points', buildPoints(history.productivity, 8, 20));
}

// listen to render event to update stats
document.addEventListener(RENDER_EVENT, updateStats);

// Analytics Modal
function createModal() {
  const modal = document.createElement('div');

  modal.id = 'analytics-modal';
  modal.innerHTML = `
  <div class="modal-backdrop"></div>
  <div class="modal-panel">
    <div class="modal-header">
      <div class="modal-title-wrap">
        <span class="modal-icon"></span>
        <h3 class="modal-title">Analytics Overview</h3>
      </div>
      
      <button class="modal-close" id="modal-close-btn"><i class="ti ti-x"></i></button>
    </div>

    <div class="modal-body" id="modal-body" ></div>
  </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  modal.querySelector('#modal-close-btn').addEventListener('click', closeModal);
}

function closeModal() {
  const modal = document.getElementById('analytics-modal');
  modal.classList.remove('open');
}

function openModal(type) {
  const { total, completed, inProgress, todo, productivity, todayProgress } =
    calcAnalytics();
  const modal = document.getElementById('analytics-modal');
  const body = document.getElementById('modal-body');
  const icon = modal.querySelector('.modal-icon');
  const title = modal.querySelector('.modal-title');

  const highCount = todos.filter((t) => t.priority === 'high').length;
  const medCount = todos.filter((t) => t.priority === 'medium').length;
  const lowCount = todos.filter((t) => t.priority === 'low').length;

  const recentTasks = [...todos].reverse().slice(0, 5);

  const configs = {
    total: {
      icon: '📋',
      title: 'Total Tasks Overview',
      html: `
      <div class="modal-big-number">${total}</div>
      <p class="modal-desc">Total tasks created across all columns</p>

      <div class="modal-breakdown">
        <div class="modal-breakdown-item">
          <span class="modal-dot" style="background:#94a3b8"></span>
          <span>To Do</span>
          <strong>${todo}</strong>
        </div>

        <div class="modal-breakdown-item">
          <span class="modal-dot" style="background:#a78bfa"></span>
          <span>In Progress</span>
          <strong>${inProgress}</strong>
        </div>

        <div class="modal-breakdown-item">
          <span class="modal-dot" style="background:#22c55e"></span>
          <span>Completed</span>
          <strong>${completed}</strong>
        </div>
      </div>

      <div class="modal-section-title">Priority Distribution</div>

      <div class="modal-bar-group">

        <div class="modal-bar-row">
          <span>High</span>

          <div class="modal-bar">
            <div 
              class="modal-bar-fill"
              style="width:${total ? Math.round((highCount / total) * 100) : 0}%; background:#f87171">
            </div>
          </div>

          <span>${highCount}</span>
        </div>

        <div class="modal-bar-row">
          <span>Medium</span>

          <div class="modal-bar">
            <div 
              class="modal-bar-fill"
              style="width:${total ? Math.round((medCount / total) * 100) : 0}%; background:#fbbf24">
            </div>
          </div>

          <span>${medCount}</span>
        </div>

        <div class="modal-bar-row">
          <span>Low</span>

          <div class="modal-bar">
            <div 
              class="modal-bar-fill"
              style="width:${total ? Math.round((lowCount / total) * 100) : 0}%; background:#818cf8">
            </div>
          </div>

          <span>${lowCount}</span>
        </div>

      </div>

      <div class="modal-section-title">Recent Tasks</div>

      <div class="modal-task-list">
        ${
          recentTasks.length
            ? recentTasks
                .map(
                  (t) => `
              <div class="modal-task-item">
                <span class="modal-task-status ${t.status}"></span>
                <span class="modal-task-name">${t.task}</span>
                <span class="tf-badge ${t.priority}">
                  ${t.priority}
                </span>
              </div>
            `,
                )
                .join('')
            : '<p style="color:var(--text-muted);font-size:12px">No tasks yet.</p>'
        }
      </div>
    `,
    },

    completed: {
      icon: '✅',
      title: 'Completed Tasks',

      html: `
      <div class="modal-big-number" style="color:#22c55e">
        ${completed}
      </div>

      <p class="modal-desc">
        ${completed} of ${total} tasks completed
      </p>

      <div class="modal-progress-ring-wrap">
        <svg viewBox="0 0 120 120" class="modal-ring-svg">

          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            stroke-width="10"
          />

          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#22c55e"
            stroke-width="10"
            stroke-dasharray="${
              total ? ((completed / total) * 314).toFixed(1) : 0
            } 314"
            stroke-linecap="round"
            transform="rotate(-90 60 60)"
          />

          <text
            x="60"
            y="65"
            text-anchor="middle"
            fill="#22c55e"
            font-size="20"
            font-weight="700"
          >
            ${total ? Math.round((completed / total) * 100) : 0}%
          </text>

        </svg>
      </div>

      <div class="modal-section-title">Completed Tasks</div>

      <div class="modal-task-list">
        ${
          todos.filter((t) => t.status === 'completed').length
            ? todos
                .filter((t) => t.status === 'completed')
                .map(
                  (t) => `
              <div class="modal-task-item">
                <span class="modal-task-status completed"></span>

                <span 
                  class="modal-task-name"
                  style="text-decoration:line-through;opacity:0.6"
                >
                  ${t.task}
                </span>

                <span class="tf-badge ${t.priority}">
                  ${t.priority}
                </span>
              </div>
            `,
                )
                .join('')
            : '<p style="color:var(--text-muted);font-size:12px">No completed tasks yet.</p>'
        }
      </div>
    `,
    },

    productivity: {
      icon: '📈',
      title: 'Productivity Score',

      html: `
      <div class="modal-big-number" style="color:#a78bfa">
        ${productivity}%
      </div>

      <p class="modal-desc">
        ${
          productivity >= 80
            ? 'Excellent performance! 🔥'
            : productivity >= 50
              ? 'Good progress! 👍'
              : productivity > 0
                ? 'Keep pushing! 💪'
                : 'Start completing tasks to boost your score.'
        }
      </p>

      <div class="modal-progress-ring-wrap">
        <svg viewBox="0 0 120 120" class="modal-ring-svg">

          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            stroke-width="10"
          />

          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#a78bfa"
            stroke-width="10"
            stroke-dasharray="${((productivity / 100) * 314).toFixed(1)} 314"
            stroke-linecap="round"
            transform="rotate(-90 60 60)"
          />

          <text
            x="60"
            y="65"
            text-anchor="middle"
            fill="#a78bfa"
            font-size="20"
            font-weight="700"
          >
            ${productivity}%
          </text>

        </svg>
      </div>

      <div class="modal-breakdown">

        <div class="modal-breakdown-item">
          <span class="modal-dot" style="background:#22c55e"></span>
          <span>Completed</span>
          <strong>${completed}</strong>
        </div>

        <div class="modal-breakdown-item">
          <span class="modal-dot" style="background:#a78bfa"></span>
          <span>In Progress</span>
          <strong>${inProgress}</strong>
        </div>

        <div class="modal-breakdown-item">
          <span class="modal-dot" style="background:#94a3b8"></span>
          <span>Pending</span>
          <strong>${todo}</strong>
        </div>

      </div>

      <div class="modal-section-title">Tip</div>

      <div class="modal-tip">
        💡 Complete your 
        <strong>high priority</strong> tasks first 
        to boost your score faster!
      </div>
    `,
    },

    progress: {
      icon: '🎯',
      title: "Today's Progress",

      html: `
      <div class="modal-big-number" style="color:#6c63ff">
        ${todayProgress}%
      </div>

      <p class="modal-desc">
        Based on completed + in-progress tasks
      </p>

      <div class="modal-big-bar">
        <div 
          class="modal-big-bar-fill"
          style="width:${todayProgress}%"
        ></div>
      </div>

      <div class="modal-breakdown">

        <div class="modal-breakdown-item">
          <span class="modal-dot" style="background:#22c55e"></span>
          <span>Done (100%)</span>
          <strong>${completed}</strong>
        </div>

        <div class="modal-breakdown-item">
          <span class="modal-dot" style="background:#a78bfa"></span>
          <span>In Progress (50%)</span>
          <strong>${inProgress}</strong>
        </div>

        <div class="modal-breakdown-item">
          <span class="modal-dot" style="background:#94a3b8"></span>
          <span>To Do (0%)</span>
          <strong>${todo}</strong>
        </div>

      </div>

      <div class="modal-section-title">
        In Progress Tasks
      </div>

      <div class="modal-task-list">
        ${
          todos.filter((t) => t.status === 'progress').length
            ? todos
                .filter((t) => t.status === 'progress')
                .map(
                  (t) => `
              <div class="modal-task-item">

                <span class="modal-task-status progress"></span>

                <span class="modal-task-name">
                  ${t.task}
                </span>

                <span class="tf-badge ${t.priority}">
                  ${t.priority}
                </span>

              </div>
            `,
                )
                .join('')
            : '<p style="color:var(--text-muted);font-size:12px">No tasks in progress.</p>'
        }
      </div>
    `,
    },
  };

  const cfg = configs[type];
  icon.textContent = cfg.icon;
  title.textContent = cfg.title;
  body.innerHTML = cfg.html;

  modal.classList.add('open');
  // Animate bars
  setTimeout(() => {
    modal
      .querySelectorAll('.modal-bar-fill, .modal-big-bar-fill')
      .forEach((el) => {
        const w = el.style.width;
        el.style.width = '0';
        requestAnimationFrame(() => {
          el.style.transition = 'width 0.7s ease';
          el.style.width = w;
        });
      });
  }, 50);
}

// Init modal and stat click handlers
document.addEventListener('DOMContentLoaded', function () {
  createModal();

  const statTypes = ['total', 'completed', 'productivity', 'progress'];
  document.querySelectorAll('.tf-stat').forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.title = 'Click for details';
    el.addEventListener('click', () => openModal(statTypes[i]));
    // hover hint
    el.addEventListener(
      'mouseenter',
      () => (el.style.borderColor = 'rgba(108, 99, 255, 0.5)'),
    );
    el.addEventListener('mouseleave', () => (el.style.borderColor = ''));
  });
});

// Task Modal (Edit & Add)
let taskModalMode = 'add';
let taskModalEditId = null;

// shorcut mendapatkan dom
const $ = (id) => document.getElementById(id);
const qs = (parent, selector) => parent.querySelector(selector);

const TASK_MODAL_ID = 'task-modal';

function getTaskModalEls() {
  const modal = $(TASK_MODAL_ID);

  return {
    modal,
    backdrop: qs(modal, '.tm-backdrop'),
    icon: qs(modal, '.tm-mode-icon'),
    title: qs(modal, '.tm-title'),
    task: $('tm-task'),

    date: $('tm-date'),
    desc: $('tm-desc'),
    priority: $('tm-priority'),
    colPicker: $('tm-col-picker'),
    saveLabel: $('tm-save-label'),
    closeBtn: $('tm-close-btn'),
    cancelBtn: $('tm-cancel-btn'),
    saveBtn: $('tm-save-btn'),
  };
}

function setActiveColumn(status = 'todo') {
  const { colPicker } = getTaskModalEls();

  colPicker.querySelectorAll('.tm-col-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.val === status);
  });
}
function getActiveColumn() {
  const activeBtn = qs(document, '#tm-col-picker .tm-col-btn.active');
  return activeBtn ? activeBtn.dataset.val : 'todo';
}

function resetTaskModalFields() {
  const { task, desc, date, priority } = getTaskModalEls();
  task.value = '';
  desc.value = '';
  date.value = '';
  priority.value = 'high';
}

function fillTaskModal(task) {
  const { task: taskInput, desc, date, priority } = getTaskModalEls();

  taskInput.value = task.task || '';
  desc.value = task.description || '';
  date.value = task.timestamp || '';
  priority.value = task.priority || 'high';
  setActiveColumn(task.status || 'todo');
}

function setModalHeader(mode) {
  const { icon, title, saveLabel } = getTaskModalEls();

  if (mode === 'edit') {
    icon.textContent = '✏️';
    title.textContent = 'Edit Task';
    saveLabel.textContent = 'Save Changes';
  } else {
    icon.textContent = '➕';
    title.textContent = 'Add New Task';
    saveLabel.textContent = 'Add Task';
  }
}

function showInputError(inputEl) {
  inputEl.classList.add('tm-error');
  inputEl.focus();

  setTimeout(() => {
    inputEl.classList.remove('tm-error');
  }, 1500);
}

const tmField = (label, content) => `
  <div class="tm-field">
  <label class="tm-label">${label}</label>
  ${content}
  </div>
`;
const colButtons = [
  { val: 'todo', text: '📑 To Do' },
  { val: 'progress', text: '⚡ In Progress' },
  { val: 'completed', text: '✅ Completed' },
]
  .map(
    (b) => `<button class="tm-col-btn" data-val="${b.val}">${b.text}</button>`,
  )
  .join('');

function createTaskModal() {
  if ($(TASK_MODAL_ID)) return;

  const modal = document.createElement('div');
  modal.id = TASK_MODAL_ID;

  modal.innerHTML = `
    <div class="tm-backdrop"></div>
    <div class="tm-panel">
      <div class="tm-header">
        <div class="tm-header-left">
          <span class="tm-mode-icon"></span>
          <h3 class="tm-title"></h3>
        </div>
      <button class="tm-close" id="tm-close-btn"><i class="ti ti-x"></i></button>
      </div>

      <div class="tm-body">
        ${tmField('Task <span class="tm-required" >*</span>', '<input id="tm-task" class="tm-input" placeholder="What do you want to accomplish?" />')}
        ${tmField('Description', '<textarea id="tm-desc" class="tm-input tm-textarea" placeholder="Add a description..."></textarea>')}
      
        <div class="tm-row">
          ${tmField('Date <span class="tm-required">*</span>', `<input id="tm-date" class="tm-input" type="date">`)}
          ${tmField(
            'Priority',
            `
            <select id="tm-priority" class="tm-input tm-select">
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🔵 Low</option>
            </select>
            `,
          )}
        </div>

        ${tmField('Column', `<div class="tm-col-picker" id="tm-col-picker">${colButtons}</div>`)}
      </div>

      <div class="tm-footer">
          <button class="tm-btn-cancel" id="tm-cancel-btn">Cancel</button>
          <button class="tm-btn-save" id="tm-save-btn">
            <i class="ti ti-check"></i>
            <span id="tm-save-label">Save Changes</span>
          </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const els = getTaskModalEls();
  [els.backdrop, els.closeBtn, els.cancelBtn].forEach((el) => {
    el.addEventListener('click', closeTaskModal);
  });

  els.saveBtn.addEventListener('click', saveTaskModal);

  els.colPicker.addEventListener('click', (e) => {
    const btn = e.target.closest('.tm-col-btn');
    if (btn) setActiveColumn(btn.dataset.val);
  });
}

function openTaskModal(mode, id = null, defaultStatus = 'todo') {
  createTaskModal();

  taskModalMode = mode;
  taskModalEditId = id;

  const els = getTaskModalEls();

  resetTaskModalFields();
  setModalHeader(mode);

  if (mode === 'edit' && id) {
    const task = todos.find((t) => t.id === id);
    if (task) {
      fillTaskModal(task);
    } else {
      console.error('Task tidak ditemukan');
      return;
    }
  } else {
    setActiveColumn(defaultStatus);
  }

  els.modal.classList.add('open');

  requestAnimationFrame(() => els.task.focus());
}

function closeTaskModal() {
  const modal = $(TASK_MODAL_ID);
  if (!modal) return;

  modal.classList.remove('open');

  setTimeout(resetTaskModalFields, 300);
}

function saveTaskModal() {
  const els = getTaskModalEls();

  const formData = {
    task: els.task.value.trim(),
    description: els.desc.value.trim(),
    timestamp: els.date.value,
    priority: els.priority.value,
    status: getActiveColumn(),
  };

  if (!formData.task) return showInputError(els.task);
  if (!formData.timestamp) return showInputError(els.date);

  if (taskModalMode === 'edit') {
    const index = todos.findIndex((t) => t.id === taskModalEditId);

    if (index === -1) return;

    todos[index] = { ...todos[index], ...formData };
  } else {
    const newTask = generateTodoObject(
      generateId(),
      formData.task,
      formData.description,
      formData.timestamp,
      formData.status,
      formData.priority,
    );
    todos.push(newTask);
  }

  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
  closeTaskModal();
}

// Init task modal on Domcontentloaded
document.addEventListener('DOMContentLoaded', function () {
  createTaskModal();
});

// document.querySelectorAll('.tf-add-link').forEach((link) => {
//   link.addEventListener('click', () => {
//     const col = link.closest('.tf-col')?.id.replace('-container', '') ?? 'todo';
//     openTaskModal('add', null, col);
//   });
// });
