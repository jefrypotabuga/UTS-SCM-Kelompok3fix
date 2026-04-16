document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const assigneeInput = document.getElementById('assignee-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');
    const searchInput = document.getElementById('search-input');
    const list = document.getElementById('task-list');
    const count = document.getElementById('task-count');
    const emptyState = document.getElementById('empty-state');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let searchQuery = '';

    render();

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        render();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        if (!taskText) return alert("Tugas kosong!");

        const task = {
            id: Date.now(),
            text: taskText,
            assignee: assigneeInput.value || "Anonim",
            dueDate: dueDateInput.value,
            priority: priorityInput.value,
            completed: false
        };

        tasks.unshift(task);
        save();
        form.reset();
    });

    function save() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        render();
    }

    function render() {
        list.innerHTML = '';

        let filtered = tasks;

        if (currentFilter === 'active') filtered = tasks.filter(t => !t.completed);
        if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

        if (searchQuery) {
            filtered = filtered.filter(t => t.text.toLowerCase().includes(searchQuery));
        }

        emptyState.style.display = filtered.length ? 'none' : 'block';
        count.innerText = filtered.length + " tugas";

        filtered.forEach(t => {
            const li = document.createElement('li');
            li.className = `task-item ${t.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <div>
                    <input type="checkbox" ${t.completed ? 'checked' : ''} onclick="toggle(${t.id})">
                    <b>${t.text}</b><br>
                    <small>${t.assignee} | ${t.dueDate}</small><br>
                    <span class="priority ${t.priority.toLowerCase()}">${t.priority}</span>
                </div>
                <button onclick="hapus(${t.id})">❌</button>
            `;

            list.appendChild(li);
        });
    }

    window.toggle = function(id) {
        tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
        save();
    }

    window.hapus = function(id) {
        tasks = tasks.filter(t => t.id !== id);
        save();
    }

    window.setFilter = function(filter) {
        currentFilter = filter;

        document.querySelectorAll('.filter button').forEach(btn => {
            btn.classList.remove('active');
        });

        event.target.classList.add('active');
        render();
    }

    window.hapusSelesai = function() {
        if (confirm("Yakin hapus semua yang selesai?")) {
            tasks = tasks.filter(t => !t.completed);
            save();
        }
    }

});