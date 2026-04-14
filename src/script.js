document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const assigneeInput = document.getElementById('assignee-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');
    const list = document.getElementById('task-list');
    const count = document.getElementById('task-count');
    const emptyState = document.getElementById('empty-state');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    render();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = {
            id: Date.now(),
            text: taskInput.value,
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

        // EMPTY STATE
        if (tasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }

        tasks.forEach(t => {
            const li = document.createElement('li');
            li.className = `task-item ${t.completed ? 'completed' : ''}`;

            const pClass = t.priority.toLowerCase();

            li.innerHTML = `
                <div>
                    <input type="checkbox" ${t.completed ? 'checked' : ''} onclick="toggle(${t.id})">
                    <b>${t.text}</b><br>
                    <small>${t.assignee} | ${t.dueDate}</small><br>
                    <span class="priority ${pClass}">${t.priority}</span>
                </div>
                <button onclick="hapus(${t.id})">❌</button>
            `;

            list.appendChild(li);
        });

        count.innerText = tasks.length + " tugas";
    }

    window.toggle = function(id) {
        tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
        save();
    }

    window.hapus = function(id) {
        tasks = tasks.filter(t => t.id !== id);
        save();
    }

});