document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const assigneeInput = document.getElementById('assignee-input');
    const taskList = document.getElementById('task-list');
    const taskCount = document.getElementById('task-count');

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('internshipTasks')) || [];

    // Initialize
    renderTasks();

    // Event Listener for form submit
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = taskInput.value.trim();
        const assignee = assigneeInput.value.trim() || 'Tanpa Nama';
        
        if (text !== '') {
            addTask(text, assignee);
            taskInput.value = '';
            assigneeInput.value = '';
            taskInput.focus();
        }
    });

    // Add new task
    function addTask(text, assignee) {
        const newTask = {
            id: Date.now().toString(),
            text: text,
            assignee: assignee,
            completed: false,
            createdAt: new Date().toLocaleDateString('id-ID')
        };
        
        tasks.unshift(newTask); // Add to the beginning of the array
        saveAndRender();
    }

    // Toggle task completion
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveAndRender();
    }

    // Delete task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    }

    // Save to local storage and render UI
    function saveAndRender() {
        localStorage.setItem('internshipTasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Render tasks to DOM
    function renderTasks() {
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    <div class="task-details">
                        <span class="task-text">${task.text}</span>
                        <span class="task-assignee"><i class="fas fa-user-circle"></i> ${task.assignee} • ${task.createdAt}</span>
                    </div>
                </div>
                <button class="delete-btn" data-id="${task.id}" title="Hapus Tugas">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            
            taskList.appendChild(li);
        });

        // Update task count
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${tasks.length} Total (${activeTasks} Sisa)`;

        // Add Event Listeners to generated elements
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                toggleTask(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                deleteTask(id);
            });
        });
    }
});