document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Load tasks from localStorage
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true; // 'all'
        }).forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add(task.completed ? 'completed' : '');
            taskItem.dataset.id = task.id;

            taskItem.innerHTML = `
                <span>${task.text}</span>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
                <button class="toggle">Mark as ${task.completed ? 'Pending' : 'Completed'}</button>
            `;

            taskItem.querySelector('.edit').addEventListener('click', () => editTask(task.id));
            taskItem.querySelector('.delete').addEventListener('click', () => deleteTask(task.id));
            taskItem.querySelector('.toggle').addEventListener('click', () => toggleTaskCompletion(task.id));

            taskList.appendChild(taskItem);
        });
    }

    // Add new task
    addTaskButton.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = ''; // Clear input
        }
    });

    // Edit task
    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        }
    }

    // Delete task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    // Toggle task completion status
    function toggleTaskCompletion(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Filter tasks based on status
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = button.dataset.filter;
            renderTasks(filter);
        });
    });

    // Initial render
    renderTasks();
});
