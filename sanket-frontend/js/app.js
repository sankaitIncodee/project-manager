// Main application script for the project portal

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const projectForm = document.getElementById('project-form');
    const projectsList = document.getElementById('projects-list');
    const refreshBtn = document.getElementById('refresh-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
    const projectDetails = document.getElementById('project-details');
    
    // Bootstrap toast initialization
    const bsToast = new bootstrap.Toast(toast);
    
    // Show notification
    function showNotification(message, isSuccess = true) {
        toast.classList.remove('bg-success', 'bg-danger');
        toast.classList.add(isSuccess ? 'bg-success' : 'bg-danger');
        toastMessage.textContent = message;
        bsToast.show();
    }
    
    // Load all projects
    async function loadProjects() {
        projectsList.innerHTML = `
            <div class="text-center py-4" id="loading">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
        
        try {
            const projects = await API.getAllProjects();
            
            if (projects.length === 0) {
                projectsList.innerHTML = `
                    <div class="text-center py-5">
                        <div class="text-muted mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-folder" viewBox="0 0 16 16">
                                <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
                            </svg>
                        </div>
                        <h5>No projects available</h5>
                        <p class="text-muted">Submit a new project to get started</p>
                    </div>
                `;
                return;
            }
            
            // Sort projects by creation date (newest first)
            projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Render projects
            projectsList.innerHTML = projects.map(project => `
                <div class="list-group-item project-item" data-id="${project.id}">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${escapeHTML(project.title)}</h5>
                        <small class="timestamp">${formatDate(project.createdAt)}</small>
                    </div>
                    <p class="mb-1 text-truncate">${escapeHTML(project.description)}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="project-domain">${escapeHTML(project.projectDomain)}</small>
                        <small>By: <span class="fw-medium">${escapeHTML(project.groupLeaderName)}</span></small>
                    </div>
                </div>
            `).join('');
            
            // Add click event to project items
            document.querySelectorAll('.project-item').forEach(item => {
                item.addEventListener('click', () => openProjectDetails(item.dataset.id));
            });
            
        } catch (error) {
            projectsList.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <div class="d-flex">
                        <div class="me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="alert-heading">Failed to load projects</h4>
                            <p class="mb-0">${error.message}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Escape HTML to prevent XSS
    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Open project details
    async function openProjectDetails(id) {
        projectDetails.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
        
        projectModal.show();
        
        try {
            const project = await API.getProjectById(id);
            
            projectDetails.innerHTML = `
                <div class="details-header">
                    <h4>${escapeHTML(project.title)}</h4>
                    <span class="timestamp">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3 me-1" viewBox="0 0 16 16">
                            <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
                            <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                        </svg>
                        ${formatDate(project.createdAt)}
                    </span>
                </div>
                <div class="mb-3">
                    <span class="badge bg-primary">${escapeHTML(project.projectDomain)}</span>
                    <span class="ms-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill me-1" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                        </svg>
                        Led by: <span class="fw-medium">${escapeHTML(project.groupLeaderName)}</span>
                    </span>
                </div>
                <div class="card project-details-card mb-4">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">Description</h6>
                        <p class="card-text">${escapeHTML(project.description)}</p>
                    </div>
                </div>
                <div class="text-center">
                    <a href="${project.codeUrl}" class="btn btn-primary download-btn" target="_blank" download>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                        </svg>
                        Download Code File
                    </a>
                </div>
            `;
            
        } catch (error) {
            projectDetails.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <div class="d-flex">
                        <div class="me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="alert-heading">Failed to load project details</h4>
                            <p class="mb-0">${error.message}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // Handle project submission
    projectForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(projectForm);
        
        try {
            // Disable form while submitting
            const submitBtn = projectForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Submitting...
            `;
            
            await API.submitProject(formData);
            
            // Reset form
            projectForm.reset();
            
            // Show success notification
            showNotification('Project submitted successfully!');
            
            // Refresh project list
            loadProjects();
            
        } catch (error) {
            showNotification(`Failed to submit project: ${error.message}`, false);
        } finally {
            // Re-enable form
            const submitBtn = projectForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Project';
        }
    });
    
    // Handle refresh button
    refreshBtn.addEventListener('click', loadProjects);
    
    // Initial load
    loadProjects();
});
