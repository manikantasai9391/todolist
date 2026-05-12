// ── State ──────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// ── DOM References ─────────────────────────────────────
const taskInput  = document.getElementById('taskInput');
const addBtn     = document.getElementById('addBtn');
const taskList   = document.getElementById('taskList');
const taskCount  = document.getElementById('taskCount');
const clearBtn   = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// ── Save to Local Storage ──────────────────────────────
function save() {
  localStorage.setItem('todos', JSON.stringify(tasks));
}

// ── Render ─────────────────────────────────────────────
function render() {
  taskList.innerHTML = '';

  const filtered = tasks.filter(t => {
    if (currentFilter === 'active')    return !t.done;
    if (currentFilter === 'completed') return  t.done;
    return true;
  });

  if (filtered.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = currentFilter === 'completed'
      ? 'No completed tasks yet.'
      : 'No tasks here. Add one above!';
    taskList.appendChild(empty);
  } else {
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' completed' : '');

      // Checkbox
      const check = document.createElement('div');
      check.className = 'task-check' + (task.done ? ' checked' : '');
      check.addEventListener('click', () => toggle(task.id));

      // Text
      const text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = task.text;

      // Delete
      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.innerHTML = '&times;';
      del.title = 'Delete task';
      del.addEventListener('click', () => remove(task.id));

      li.append(check, text, del);
      taskList.appendChild(li);
    });
  }

  // Update count
  const active = tasks.filter(t => !t.done).length;
  taskCount.textContent = active === 1 ? '1 task left' : `${active} tasks left`;
}

// ── Actions ────────────────────────────────────────────
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  taskInput.value = '';
  save();
  render();
}

function toggle(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  render();
}

function remove(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
}

// ── Event Listeners ────────────────────────────────────
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

clearBtn.addEventListener('click', clearCompleted);

// ── Init ───────────────────────────────────────────────
render();
