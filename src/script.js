let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let searchQuery = '';

const form = document.getElementById('task-form');
const list = document.getElementById('task-list');
const count = document.getElementById('task-count');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');

form.addEventListener('submit', e => {
  e.preventDefault();

  const task = {
    id: Date.now(),
    text: document.getElementById('task-input').value,
    assignee: document.getElementById('assignee-input').value || 'Anonim',
    dueDate: document.getElementById('due-date-input').value,
    priority: document.getElementById('priority-input').value,
    completed: false
  };

  tasks.unshift(task);
  save();
  form.reset();
});

searchInput.addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase();
  render();
});

function save(){
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

function render(){
  list.innerHTML = '';

  let filtered = tasks;

  if(currentFilter === 'active')
    filtered = tasks.filter(t => !t.completed);

  if(currentFilter === 'completed')
    filtered = tasks.filter(t => t.completed);

  if(searchQuery)
    filtered = filtered.filter(t => t.text.toLowerCase().includes(searchQuery));

  count.innerText = filtered.length + " tugas";
  emptyState.style.display = filtered.length ? 'none' : 'block';

  filtered.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item ' + (t.completed ? 'completed' : '');

    li.innerHTML = `
      <div>
        <input type="checkbox" ${t.completed ? 'checked' : ''} onclick="toggle(${t.id})">
        <b>${t.text}</b><br>
        <small>${t.assignee} | ${t.dueDate}</small><br>
        <span class="priority ${t.priority.toLowerCase()}">${t.priority}</span>
      </div>
      <button onclick="hapus(${t.id})">❌</button>
    `;

    li.classList.add('enter');
      list.appendChild(li);

setTimeout(() => {
    li.classList.add('show');
}, 10);
  });
}

function toggle(id){
  tasks = tasks.map(t =>
    t.id === id ? {...t, completed: !t.completed} : t
  );
  save();
}

function hapus(id){
  tasks = tasks.filter(t => t.id !== id);
  save();
}

function setFilter(filter, event){
  currentFilter = filter;

  document.querySelectorAll('.filter button')
    .forEach(b => b.classList.remove('active'));

  event.target.classList.add('active');

  render();
}

function hapusSelesai(){
  tasks = tasks.filter(t => !t.completed);
  save();
}

render();