const API_URL = 'http://localhost:3000/members';

document.addEventListener('DOMContentLoaded', () => {
    const memberList = document.getElementById('member-list');
    const searchInput = document.getElementById('search-member');
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    const memberToDeleteNameElem = document.getElementById('memberToDeleteName');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    let editingMemberId = null;
    let memberIdToDelete = null;
    let members = [];

    async function fetchMembers() {
        try {
            const data = await fetchComToken(API_URL);
            if (!data) throw new Error('Falha ao buscar membros');

            members = data;
            displayMembers(members);
        } catch (error) {
            console.error(error);
            memberList.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Erro ao carregar membros</td></tr>`;
        }
    }

    function displayMembers(membersToDisplay) {
        memberList.innerHTML = '';

        if (membersToDisplay.length === 0) {
            memberList.innerHTML = `<tr><td colspan="7" class="text-center">Nenhum membro encontrado</td></tr>`;
            return;
        }

        membersToDisplay.forEach((member, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${member.name}</td>
                <td>${member.role}</td>
                <td>${member.course}</td>
                <td>${new Date(member.admission).toLocaleDateString('pt-BR')}</td>
                <td><img src="${member.imageUrl}" alt="Foto de ${member.name}" height="50"></td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editMember(${member.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDelete(${member.id}, '${member.name}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            memberList.appendChild(row);
        });
    }

    function filterMembers() {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = members.filter(member =>
            member.name.toLowerCase().includes(searchTerm) ||
            member.role.toLowerCase().includes(searchTerm) ||
            member.course.toLowerCase().includes(searchTerm)
        );
        displayMembers(filtered);
    }

    searchInput.addEventListener('input', filterMembers);

    const form = document.getElementById('add-member-form');
    const modalTitle = document.getElementById('addMemberModalLabel');
    const submitButton = form.querySelector('button[type="submit"]');
    const addMemberModal = new bootstrap.Modal(document.getElementById('addMemberModal'));

    window.editMember = async function (id) {
        try {
            const member = await fetchComToken(`${API_URL}/${id}`);
            if (!member) throw new Error('Erro ao buscar membro');

            document.getElementById('member-name').value = member.name;
            document.getElementById('member-role').value = member.role;
            document.getElementById('member-course').value = member.course;
            document.getElementById('member-admission').value = member.admission.split('T')[0];
            document.getElementById('member-linkedin').value = member.linkedin;

            // Limpar input file (não tem como setar arquivo selecionado por JS)
            document.getElementById('member-image-file').value = '';
            // Guardar URL atual no campo hidden (para enviar se não trocar a imagem)
            document.getElementById('member-image').value = member.imageUrl;

            modalTitle.textContent = 'Editar Membro';
            submitButton.textContent = 'Salvar Alterações';

            editingMemberId = id;
            addMemberModal.show();
        } catch (error) {
            alert('Erro ao carregar dados do membro para edição.');
            console.error(error);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const imageFileInput = document.getElementById('member-image-file');
        const formData = new FormData();

        formData.append('name', document.getElementById('member-name').value);
        formData.append('role', document.getElementById('member-role').value);
        formData.append('course', document.getElementById('member-course').value);
        formData.append('admission', document.getElementById('member-admission').value);
        formData.append('linkedin', document.getElementById('member-linkedin').value);

        if (imageFileInput.files.length > 0) {
            formData.append('image', imageFileInput.files[0]);
        } else {
            formData.append('imageUrl', document.getElementById('member-image').value);
        }

        try {
            const url = editingMemberId ? `${API_URL}/${editingMemberId}` : API_URL;
            const method = editingMemberId ? 'PUT' : 'POST';

            // fetchComToken deve suportar FormData no body e não setar Content-Type (deixe o browser cuidar)
            const result = await fetchComToken(url, {
                method,
                body: formData,
            });

            if (!result) throw new Error('Erro ao salvar membro');

            addMemberModal.hide();
            form.reset();
            editingMemberId = null;
            modalTitle.textContent = 'Adicionar Novo Membro';
            submitButton.textContent = 'Adicionar';

            fetchMembers();
        } catch (error) {
            alert('Erro ao salvar o membro.');
            console.error(error);
        }
    });

    document.getElementById('btnAddMember').addEventListener('click', () => {
        editingMemberId = null;
        form.reset();
        modalTitle.textContent = 'Adicionar Novo Membro';
        submitButton.textContent = 'Adicionar';
        // Limpar campo hidden da url de imagem
        document.getElementById('member-image').value = '';
        // Limpar input file
        document.getElementById('member-image-file').value = '';
    });

    window.confirmDelete = function (id, name) {
        memberIdToDelete = id;
        memberToDeleteNameElem.textContent = name;
        confirmDeleteModal.show();
    };

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!memberIdToDelete) return;

        try {
            const result = await fetchComToken(`${API_URL}/${memberIdToDelete}`, {
                method: 'DELETE'
            });

            if (!result) throw new Error('Erro ao deletar membro');

            confirmDeleteModal.hide();
            showToast('Membro deletado com sucesso!', 'success');
            fetchMembers();
        } catch (error) {
            showToast('Erro ao deletar o membro.', 'danger');
            console.error(error);
        } finally {
            memberIdToDelete = null;
        }
    });

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');

        const toastId = 'toast' + Date.now();
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
        toastEl.id = toastId;
        toastEl.role = 'alert';
        toastEl.ariaLive = 'assertive';
        toastEl.ariaAtomic = 'true';
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
            </div>
        `;

        toastContainer.appendChild(toastEl);

        const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
        toast.show();

        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }

    fetchMembers();
});
