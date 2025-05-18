async function fetchComToken(url, options = {}) {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Cria um objeto headers, mas só adiciona 'Content-Type' se o body não for FormData
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const res = await fetch(url, config);

        // Se o conteúdo não for JSON, pode dar erro no .json()
        // Então vamos tentar pegar o texto e tentar converter
        let data;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        if (res.status === 401 && data.message === 'Sessão expirada. Faça login novamente.') {
            alert('Sua sessão expirou. Faça login novamente.');
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }

        if (!res.ok) {
            throw new Error(data.message || data || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
        alert('Erro ao conectar ao servidor.');
    }
}
