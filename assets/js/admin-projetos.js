document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:3000/projects';
    const token = localStorage.getItem('token');

    // Verifica se o token existe
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    let isEditMode = false;
    let editingProjectId = null;
    let projectIdToDelete = null;
    let allProjects = [];

    // ==============================
    // Elementos DOM
    // ==============================
    const domElements = {
        toastContainer: document.getElementById('toastContainer'),
        projectList: document.getElementById('project-list'),
        addProjectForm: document.getElementById('add-project-form'),
        btnAddProject: document.getElementById('btnAddProject'),
        searchProject: document.getElementById('search-project'),
        addProjectModal: document.getElementById('addProjectModal'),
        confirmDeleteProjectModal: document.getElementById('confirmDeleteProjectModal'),
        confirmDeleteProjectBtn: document.getElementById('confirmDeleteProjectBtn'),
        projectToDeleteName: document.getElementById('projectToDeleteName'),
        addProjectModalLabel: document.getElementById('addProjectModalLabel'),
        modalProjectSubmitBtn: document.getElementById('modalProjectSubmitBtn'),
        formFields: {
            name: document.getElementById('project-name'),
            type: document.getElementById('project-type'),
            description: document.getElementById('project-description'),
            imageUrl: document.getElementById('project-image'),
            year: document.getElementById('project-year'),
            extraImages: document.getElementById('project-extra-images')
        }
    };

    // Verifica se todos os elementos necessários existem
    for (const [key, element] of Object.entries(domElements)) {
        if (!element && key !== 'toastContainer') {
            console.error(`Elemento não encontrado: ${key}`);
            return;
        }
    }

    // ==============================
    // Utilitários
    // ==============================
    function showToast(message, type = 'success') {
        if (!domElements.toastContainer) return;

        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast show align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        domElements.toastContainer.insertAdjacentHTML('beforeend', toastHTML);

        setTimeout(() => {
            const toastElement = document.getElementById(toastId);
            if (toastElement) toastElement.remove();
        }, 5000);
    }

    // ==============================
    // Inicialização
    // ==============================
    async function fetchProjects() {
        try {
            const response = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login.html';
                return;
            }

            const data = await response.json();
            allProjects = data;
            renderProjects(allProjects);
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            showToast('Erro ao carregar projetos', 'danger');
        }
    }

    // ==============================
    // Renderização
    // ==============================
    function renderProjects(projects) {
        domElements.projectList.innerHTML = '';

        projects.forEach((project, index) => {
            const extraImagesHTML = project.images?.length
                ? project.images.map(img => `<img src="${img.url}" width="40" class="me-1 rounded">`).join('')
                : '—';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${project.name}</td>
                <td>${project.type}</td>
                <td class="text-wrap" style="max-width: 200px;"><div class="truncate-text">${project.description || '—'}</div></td>
                <td>${project.year || '—'}</td>
                <td><img src="${project.imageUrl}" width="60" class="rounded"></td>
                <td>${extraImagesHTML}</td>
                <td>
                    <button class="btn btn-primary btn-sm me-1" onclick="editProject(${project.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteProject(${project.id}, '${project.name.replace(/'/g, "\\'")}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            domElements.projectList.appendChild(tr);
        });
    }

    // ==============================
    // Ações: Criar / Editar / Deletar
    // ==============================
    document.getElementById('add-project-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Campos de texto
        formData.append('name', document.getElementById('project-name').value);
        formData.append('type', document.getElementById('project-type').value);
        formData.append('description', document.getElementById('project-description').value);
        formData.append('year', document.getElementById('project-year').value);

        // 📌 COVER IMAGE
        const coverImageInput = document.getElementById('project-image-file');
        const existingCoverImageUrl = document.getElementById('project-image').value;

        if (coverImageInput.files.length > 0) {
            // Nova imagem foi selecionada
            formData.append('coverImage', coverImageInput.files[0]);
        } else if (existingCoverImageUrl) {
            // Nenhuma imagem nova, mas temos uma URL antiga
            formData.append('imageUrl', existingCoverImageUrl);
        }

        // 📌 EXTRA IMAGES
        const extraImagesInput = document.getElementById('project-extra-images');
        const existingExtraImagesUrls = document.getElementById('project-extra-file').value;

        if (extraImagesInput.files.length > 0) {
            // Novas imagens foram selecionadas
            for (let i = 0; i < extraImagesInput.files.length; i++) {
                formData.append('extraImages', extraImagesInput.files[i]);
            }
        } else if (existingExtraImagesUrls) {
            // Se temos URLs antigas (em JSON, separado por vírgulas ou algo assim)
            // Enviaremos como um campo extra (caso precise atualizar sem reenvio de arquivos)
            // Você pode adaptar esse campo no backend se quiser
            formData.append('existingExtraImages', existingExtraImagesUrls);
        }

        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const endpoint = isEditMode ? `${API_URL}/${editingProjectId}` : API_URL;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Não setar Content-Type aqui, deixa o browser fazer
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao salvar projeto');

            bootstrap.Modal.getInstance(document.getElementById('addProjectModal')).hide();
            showToast(isEditMode ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!');
            fetchProjects();
            e.target.reset();

            // Reset flags
            isEditMode = false;
            editingProjectId = null;

        } catch (error) {
            console.error('Erro:', error);
            showToast(`Falha: ${error.message}`, 'danger');
        }
    });

    domElements.btnAddProject.addEventListener('click', () => {
        isEditMode = false;
        editingProjectId = null;
        domElements.addProjectForm.reset();

        domElements.addProjectModalLabel.textContent = 'Novo Projeto';
        domElements.modalProjectSubmitBtn.textContent = 'Salvar';

        bootstrap.Modal.getOrCreateInstance(domElements.addProjectModal).show();
    });


    async function editProject(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login.html';
                return;
            }

            const project = await response.json();

            domElements.formFields.name.value = project.name || '';
            domElements.formFields.type.value = project.type || '';
            domElements.formFields.description.value = project.description || '';
            domElements.formFields.year.value = project.year || '';
            const hiddenExtraImagesInput = document.getElementById('project-extra-file');
            if (hiddenExtraImagesInput) {
            hiddenExtraImagesInput.value = JSON.stringify(project.images?.map(img => img.url) || []);
            }

            // Atualiza a URL oculta da imagem principal
            domElements.formFields.imageUrl.value = project.imageUrl || '';

            // Limpa input de file (não pode ser preenchido)
            const fileInput = document.getElementById('project-image-file');
            if (fileInput) fileInput.value = '';


            isEditMode = true;
            editingProjectId = id;

            domElements.addProjectModalLabel.textContent = 'Editar Projeto';
            domElements.modalProjectSubmitBtn.textContent = 'Atualizar';
            bootstrap.Modal.getOrCreateInstance(domElements.addProjectModal).show();
        } catch (error) {
            console.error('Erro ao carregar projeto para edição:', error);
            showToast('Erro ao carregar dados do projeto', 'danger');
        }
    }

    function confirmDeleteProject(id, name) {
        projectIdToDelete = id;
        domElements.projectToDeleteName.textContent = name;
        bootstrap.Modal.getOrCreateInstance(domElements.confirmDeleteProjectModal).show();
    }

    domElements.confirmDeleteProjectBtn.addEventListener('click', async () => {
        if (!projectIdToDelete) return;

        try {
            const response = await fetch(`${API_URL}/${projectIdToDelete}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login.html';
                return;
            }

            if (response.ok) {
                showToast('Projeto excluído com sucesso!');
                fetchProjects();
            } else {
                const err = await response.json();
                showToast(err.error || 'Erro ao excluir projeto', 'danger');
            }
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            showToast('Erro ao excluir projeto', 'danger');
        } finally {
            bootstrap.Modal.getInstance(domElements.confirmDeleteProjectModal).hide();
            projectIdToDelete = null;
        }
    });

    // ==============================
    // Filtro de busca
    // ==============================
    domElements.searchProject.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allProjects.filter(project =>
            project.name.toLowerCase().includes(searchTerm) ||
            project.type.toLowerCase().includes(searchTerm)
        );
        renderProjects(filtered);
    });

    // ==============================
    // Execução Inicial
    // ==============================
    fetchProjects();

    // Expondo funções para uso inline
    window.editProject = editProject;
    window.confirmDeleteProject = confirmDeleteProject;
});