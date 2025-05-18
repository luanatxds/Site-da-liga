document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const itemsPerPage = 15;
    let currentPage = 1;
    let emails = [];
    let filteredEmails = [];

    const tbody = document.getElementById("email-list");
    const paginationContainer = document.createElement("div");
    paginationContainer.classList.add("d-flex", "justify-content-center", "mt-3");
    document.querySelector(".table-responsive").after(paginationContainer);

    const searchInput = document.getElementById("search-input");

    function renderTable(page) {
        tbody.innerHTML = "";
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredEmails.slice(start, end);

        paginatedItems.forEach((item, index) => {
            const tr = document.createElement("tr");
            const formattedDate = item.created_at
                ? new Date(item.created_at).toLocaleDateString('pt-BR')
                : 'Data inválida';

            tr.innerHTML = `
        <td>${start + index + 1}</td>
        <td>${item.email}</td>
        <td>${formattedDate}</td>
        <td>
          <button class="btn btn-link btn-sm text-danger p-0" data-id="${item.id}" title="Excluir">
            <i class="bi bi-trash-fill fs-5"></i>
          </button>
        </td>
      `;
            tbody.appendChild(tr);

            const deleteBtn = tr.querySelector('button[data-id]');
            deleteBtn.addEventListener('click', () => {
                window.emailIdToDelete = item.id;
                document.getElementById('emailToDeleteText').textContent = item.email;
                const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
                deleteModal.show();
            });
        });

        renderPagination();
    }

    function renderPagination() {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.classList.add("btn", "btn-sm", i === currentPage ? "btn-primary" : "btn-outline-primary", "mx-1");
            btn.textContent = i;
            btn.addEventListener("click", () => {
                currentPage = i;
                renderTable(currentPage);
            });
            paginationContainer.appendChild(btn);
        }
    }

    function applyFilter() {
        const query = searchInput.value.toLowerCase().trim();
        filteredEmails = emails.filter(email =>
            email.email.toLowerCase().includes(query)
        );
        currentPage = 1;
        renderTable(currentPage);
    }

    searchInput.addEventListener("input", applyFilter);

    // Listener do botão Excluir, registrado APENAS UMA VEZ aqui:
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        const emailId = window.emailIdToDelete;
        const token = localStorage.getItem('token');

        fetchComToken(`/newsletter/${emailId}`, {
            method: 'DELETE'
        })
            .then(data => {
                // data é o JSON recebido do backend, ex: { message: "Email excluído com sucesso" }
                showToast(data.message || 'E-mail excluído com sucesso!', 'success');


                    // Fecha a modal
                    const modalEl = document.getElementById('confirmDeleteModal');
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    modal.hide();

                    // Atualiza a lista local removendo o email excluído
                    emails = emails.filter(e => e.id !== emailId);
                    filteredEmails = filteredEmails.filter(e => e.id !== emailId);
                    renderTable(currentPage);

                })
                    .catch(() => {
                        showToast('Erro ao excluir. Tente novamente.', 'danger');
                    });
            });

        fetchComToken('/newsletter')
            .then(data => {
                if (!data) return; // Token inválido, já redirecionou
                emails = data;
                filteredEmails = [...emails];
                renderTable(currentPage);
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
      <div class="toast-body">
        ${message}
      </div>
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


    document.getElementById("exportExcelBtn").addEventListener("click", () => {
    try {
        // Check if library is loaded
        if (typeof XLSX === 'undefined') {
            throw new Error("Biblioteca de exportação não carregada");
        }

        // Check if there's data to export
        if (!filteredEmails || filteredEmails.length === 0) {
            showToast("Nenhum e-mail para exportar!", "warning");
            return;
        }

        // Prepare data
        const data = filteredEmails.map((item, index) => ({
            "#": index + 1,
            "E-mail": item.email,
            "Data de Cadastro": item.created_at 
                ? new Date(item.created_at).toLocaleDateString('pt-BR')
                : 'Data inválida'
        }));

        // Create workbook
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Emails");

        // Export file
        XLSX.writeFile(workbook, `emails_newsletter_${new Date().toISOString().slice(0,10)}.xlsx`);
        
        showToast("Exportação concluída com sucesso!", "success");
    } catch (error) {
        console.error("Erro na exportação:", error);
        showToast(`Falha na exportação: ${error.message}`, "danger");
    }
});

    });

