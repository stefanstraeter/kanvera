// src/pages/board/board-template.js

export function renderColumnHtml(data) {
    return `
        <section class="board-column">
            <div class="board-column__header">
                <span class="status-dot status-dot--${data.cssClass}"></span>
                <h2 class="board-column__title">${data.title}</h2>
            </div>
            <div class="board-column__drop-zone js-drop-zone" id="${data.id}">
                </div>
        </section>
    `;
}

export function createTaskCardHtml(task) {
    return `
        <article class="task-card" draggable="true" id="${task.id}">
            <div class="task-card__category badge">${task.taskType}</div>
            <div class="task-card__content">
                <h3 class="task-card__title">${task.title}</h3>
                <p class="task-card__description">${task.description}</p>
            </div>
            
            ${task.hasSubtasks ? `
                <div class="task-card__progress">
                    <div class="progress-bar">
                        <div class="progress-bar__fill" style="width: ${task.progress}%"></div>
                    </div>
                    <span class="progress-text">${task.subtaskStatus} Subtasks</span>
                </div>
            ` : ''}

            <div class="task-card__footer">
                <div class="task-card__assignees">
                    <div class="avatar-group">${task.assigneeAvatars}</div>
                </div>
                <div class="task-card__priority">
                    <img src="assets/icons/priority/${task.priority}.svg" alt="${task.priority}">
                </div>
            </div>
        </article>
    `;
}