// API communication module for the project portal

const API_URL = 'http://localhost:3000';

// API endpoints
const API = {
    // Submit a new project
    submitProject: async (formData) => {
        try {
            const response = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                body: formData, // FormData object for multipart/form-data
                // Don't set Content-Type header, the browser will set it with the correct boundary
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit project');
            }

            return await response.json();
        } catch (error) {
            console.error('Error submitting project:', error);
            throw error;
        }
    },

    // Get all projects
    getAllProjects: async () => {
        try {
            const response = await fetch(`${API_URL}/projects`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    },

    // Get project by ID
    getProjectById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/projects/${id}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching project with ID ${id}:`, error);
            throw error;
        }
    }
};

// Export the API object
window.API = API;