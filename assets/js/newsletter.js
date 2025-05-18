document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM carregado");

  const form = document.getElementById('newsletter-form');
  console.log("form:", form);
  const emailInput = document.getElementById('newsletter-email');
  const messageDiv = document.getElementById('newsletter-message');

  // const baseUrl = window.location.hostname === 'localhost'
  // ? 'http://localhost:3000'
  // : 'https://api.ligafemininadeti.com';
//substituir pelo domínio publicado

const baseUrl = 'http://localhost:3000';


  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log("Submit capturado, preventDefault chamado");

    const email = emailInput.value.trim();

    // Validação simples de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      messageDiv.textContent = "Por favor, insira um e-mail válido.";
      messageDiv.classList.remove('text-success');
      messageDiv.classList.add('text-danger');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
    });

      const data = await res.json();

      if (res.ok) {
        messageDiv.textContent = "E-mail cadastrado com sucesso!";
        messageDiv.classList.remove('text-danger');
        messageDiv.classList.add('text-success');
        emailInput.value = '';

          setTimeout(() => {
          messageDiv.textContent = '';
        }, 5000);
        
      } else {
        messageDiv.textContent = data.message || "Erro ao cadastrar e-mail.";
        messageDiv.classList.remove('text-success');
        messageDiv.classList.add('text-danger');
      }
    } catch (error) {
      messageDiv.textContent = "Erro de conexão com o servidor.";
      messageDiv.classList.remove('text-success');
      messageDiv.classList.add('text-danger');
    }
    return false;
  });
});
