import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class TodoView extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: 100%;
            color: var(--text-color);
        }

        .todo-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: 20px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid var(--border-color);
        }

        .header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .add-task-btn {
            background: var(--text-input-button-background);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s ease;
        }

        .add-task-btn:hover {
            background: var(--text-input-button-hover);
        }

        .task-form {
            background: var(--input-background);
            padding: 20px;
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: var(--option-label-color);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--input-background);
            color: var(--text-color);
            font-size: 14px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 2px var(--focus-box-shadow);
        }

        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
        }

        .btn-primary {
            background: var(--text-input-button-background);
            color: white;
        }

        .btn-primary:hover {
            background: var(--text-input-button-hover);
        }

        .btn-secondary {
            background: var(--button-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
            background: var(--hover-background);
        }

        .tasks-container {
            flex: 1;
            overflow-y: auto;
        }

        .task-item {
            background: var(--input-background);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 15px;
            margin-bottom: 10px;
            transition: all 0.2s ease;
        }

        .task-item:hover {
            border-color: var(--focus-border-color);
        }

        .task-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }

        .task-title {
            font-size: 16px;
            font-weight: 500;
            margin: 0;
            flex: 1;
        }

        .task-status {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
        }

        .status-todo {
            background: rgba(255, 193, 7, 0.2);
            color: #ffc107;
        }

        .status-done {
            background: rgba(40, 167, 69, 0.2);
            color: #28a745;
        }

        .task-description {
            color: var(--description-color);
            font-size: 14px;
            margin-bottom: 10px;
            line-height: 1.4;
        }

        .task-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: var(--description-color);
        }

        .task-actions {
            display: flex;
            gap: 8px;
        }

        .action-btn {
            background: none;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            transition: background 0.2s ease;
        }

        .action-btn:hover {
            background: var(--hover-background);
        }

        .action-btn.start-focus {
            background: var(--text-input-button-background);
            color: white;
        }

        .action-btn.start-focus:hover {
            background: var(--text-input-button-hover);
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--description-color);
        }

        .empty-state h3 {
            margin-bottom: 10px;
            font-size: 18px;
        }

        .empty-state p {
            margin-bottom: 20px;
            font-size: 14px;
        }

        .filter-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            padding: 15px;
            background: var(--input-background);
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
        }

        .filter-btn {
            background: var(--button-background);
            border: 1px solid var(--border-color);
            color: var(--text-color);
            padding: 6px 12px;
            border-radius: 16px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .filter-btn.active {
            background: var(--text-input-button-background);
            color: white;
            border-color: var(--text-input-button-background);
        }

        .filter-btn:hover {
            background: var(--hover-background);
        }

        .filter-btn.active:hover {
            background: var(--text-input-button-hover);
        }
    `;

    static properties = {
        tasks: { type: Array },
        showForm: { type: Boolean },
        currentFilter: { type: String },
        newTask: { type: Object }
    };

    constructor() {
        super();
        this.tasks = [];
        this.showForm = false;
        this.currentFilter = 'all';
        this.newTask = {
            title: '',
            description: ''
        };
        this.loadTasks();
    }

    async loadTasks() {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('get-todo-list');
            if (result.success) {
                this.tasks = result.todoList.tasks;
                this.requestUpdate();
            } else {
                console.error('Failed to load tasks:', result.error);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    get filteredTasks() {
        if (this.currentFilter === 'all') {
            return this.tasks;
        }
        return this.tasks.filter(task => task.status === this.currentFilter.toUpperCase());
    }

    handleAddTaskClick() {
        this.showForm = true;
        this.newTask = {
            title: '',
            description: ''
        };
    }

    handleCancelAdd() {
        this.showForm = false;
        this.newTask = {
            title: '',
            description: ''
        };
    }

    async handleSubmitTask() {
        if (!this.newTask.title.trim()) {
            return;
        }

        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('add-todo-task', this.newTask);
            if (result.success) {
                this.tasks = [...this.tasks, result.task];
                this.showForm = false;
                this.newTask = {
                    title: '',
                    description: ''
                };
            } else {
                console.error('Failed to add task:', result.error);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    async handleTaskStatusChange(taskId, newStatus) {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('update-todo-task', taskId, { status: newStatus });
            if (result.success) {
                this.tasks = this.tasks.map(task => 
                    task.id === taskId ? result.task : task
                );
            } else {
                console.error('Failed to update task:', result.error);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    async handleDeleteTask(taskId) {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('delete-todo-task', taskId);
            if (result.success) {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
            } else {
                console.error('Failed to delete task:', result.error);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    handleStartFocus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            // Dispatch custom event to parent component
            this.dispatchEvent(new CustomEvent('start-focus-session', {
                detail: { task },
                bubbles: true,
                composed: true
            }));
        }
    }

    handleFilterChange(filter) {
        this.currentFilter = filter;
    }

    renderTaskForm() {
        return html`
            <div class="task-form">
                <div class="form-group">
                    <label for="task-title">Task Title *</label>
                    <input 
                        id="task-title"
                        type="text" 
                        .value=${this.newTask.title}
                        @input=${(e) => this.newTask.title = e.target.value}
                        placeholder="Enter task title"
                    >
                </div>
                <div class="form-group">
                    <label for="task-description">Description</label>
                    <textarea 
                        id="task-description"
                        .value=${this.newTask.description}
                        @input=${(e) => this.newTask.description = e.target.value}
                        placeholder="Enter task description (optional)"
                        rows="3"
                    ></textarea>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" @click=${this.handleCancelAdd}>
                        Cancel
                    </button>
                    <button class="btn btn-primary" @click=${this.handleSubmitTask}>
                        Add Task
                    </button>
                </div>
            </div>
        `;
    }

    renderTaskItem(task) {
        return html`
            <div class="task-item">
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <span class="task-status status-${task.status.toLowerCase()}">
                        ${task.status}
                    </span>
                </div>
                ${task.description ? html`
                    <div class="task-description">${task.description}</div>
                ` : ''}
                <div class="task-meta">
                    <div class="task-actions">
                        ${task.status === 'TODO' ? html`
                            <button class="action-btn start-focus" @click=${() => this.handleStartFocus(task.id)}>
                                Start Focus
                            </button>
                            <button class="action-btn" @click=${() => this.handleTaskStatusChange(task.id, 'DONE')}>
                                Mark Done
                            </button>
                        ` : html`
                            <button class="action-btn" @click=${() => this.handleTaskStatusChange(task.id, 'TODO')}>
                                Mark Todo
                            </button>
                        `}
                        <button class="action-btn" @click=${() => this.handleDeleteTask(task.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        return html`
            <div class="todo-container">
                <div class="header">
                    <h2>Todo List</h2>
                    <button class="add-task-btn" @click=${this.handleAddTaskClick}>
                        + Add Task
                    </button>
                </div>

                ${this.showForm ? this.renderTaskForm() : ''}

                <div class="filter-bar">
                    <button 
                        class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}"
                        @click=${() => this.handleFilterChange('all')}
                    >
                        All (${this.tasks.length})
                    </button>
                    <button 
                        class="filter-btn ${this.currentFilter === 'todo' ? 'active' : ''}"
                        @click=${() => this.handleFilterChange('todo')}
                    >
                        Todo (${this.tasks.filter(t => t.status === 'TODO').length})
                    </button>
                    <button 
                        class="filter-btn ${this.currentFilter === 'done' ? 'active' : ''}"
                        @click=${() => this.handleFilterChange('done')}
                    >
                        Done (${this.tasks.filter(t => t.status === 'DONE').length})
                    </button>
                </div>

                <div class="tasks-container">
                    ${this.filteredTasks.length === 0 ? html`
                        <div class="empty-state">
                            <h3>No tasks found</h3>
                            <p>${this.currentFilter === 'all' ? 'Create your first task to get started!' : `No ${this.currentFilter} tasks.`}</p>
                            ${this.currentFilter !== 'all' ? html`
                                <button class="btn btn-primary" @click=${this.handleAddTaskClick}>
                                    Add New Task
                                </button>
                            ` : ''}
                        </div>
                    ` : this.filteredTasks.map(task => this.renderTaskItem(task))}
                </div>
            </div>
        `;
    }
}

customElements.define('todo-view', TodoView); 