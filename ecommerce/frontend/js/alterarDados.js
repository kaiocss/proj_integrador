document.addEventListener('DOMContentLoaded', () => {
    // Formulários
    const formEditarDados = document.getElementById('formEditarDados');
    const formTrocarSenha = document.getElementById('formTrocarSenha');
    const formNovoEndereco = document.getElementById('formNovoEndereco');

    // Mensagens
    const mensagemDados = document.getElementById('mensagemDados');
    const mensagemSenha = document.getElementById('mensagemSenha');
    const mensagemEndereco = document.getElementById('mensagemEndereco');

    // Campos de endereço
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const ufInput = document.getElementById('uf');

    const listaEnderecos = document.getElementById('listaEnderecos');

    // Carregar endereços do localStorage
    let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];

    // Preencher endereço via API do ViaCEP
    cepInput.addEventListener('blur', () => {
        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(res => res.json())
                .then(data => {
                    if (data.erro) {
                        mensagemEndereco.textContent = "CEP não encontrado.";
                        mensagemEndereco.style.display = "block";
                        mensagemEndereco.style.color = "red";
                    } else {
                        ruaInput.value = data.logradouro || '';
                        bairroInput.value = data.bairro || '';
                        cidadeInput.value = data.localidade || '';
                        ufInput.value = data.uf || '';
                        mensagemEndereco.style.display = "none";
                    }
                })
                .catch(() => {
                    mensagemEndereco.textContent = "Erro ao buscar o CEP.";
                    mensagemEndereco.style.display = "block";
                    mensagemEndereco.style.color = "red";
                });
        }
    });

    // Editar dados pessoais
    formEditarDados.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const dataNascimento = document.getElementById('dataNascimento').value;
        const genero = document.getElementById('genero').value;

        console.log("Enviando dados pessoais:", { nome, dataNascimento, genero });

        mensagemDados.textContent = `Dados atualizados com sucesso!
        Nome: ${nome}
        Data de Nascimento: ${dataNascimento}
        Gênero: ${genero}`;
        mensagemDados.style.display = "block";
        mensagemDados.style.color = "green";
    });

    // Trocar senha
    formTrocarSenha.addEventListener('submit', (e) => {
        e.preventDefault();

        const senhaAtual = document.getElementById('senhaAtual').value.trim();
        const novaSenha = document.getElementById('novaSenha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            mensagemSenha.textContent = "Todos os campos são obrigatórios!";
            mensagemSenha.style.display = "block";
            mensagemSenha.style.color = "red";
            return;
        }

        if (novaSenha !== confirmarSenha) {
            mensagemSenha.textContent = "As senhas não coincidem!";
            mensagemSenha.style.display = "block";
            mensagemSenha.style.color = "red";
            return;
        }

        console.log("Alterando senha:", { senhaAtual, novaSenha });

        mensagemSenha.textContent = "Senha atualizada com sucesso!";
        mensagemSenha.style.display = "block";
        mensagemSenha.style.color = "green";
    });

    // Renderizar lista de endereços
    function renderizarEnderecos() {
        if (!listaEnderecos) return;
        listaEnderecos.innerHTML = '';

        enderecos.forEach((endereco) => {
            const li = document.createElement('li');
            li.textContent = `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}/${endereco.uf} - CEP: ${endereco.cep}` +
                (endereco.enderecoPadrao ? " ✅ Endereço Padrão" : "");
            listaEnderecos.appendChild(li);
        });
    }

    // Adicionar novo endereço
    formNovoEndereco.addEventListener('submit', (e) => {
        e.preventDefault();

        const novoEndereco = {
            cep: cepInput.value,
            rua: ruaInput.value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: bairroInput.value,
            cidade: cidadeInput.value,
            uf: ufInput.value,
            enderecoPadrao: document.getElementById('enderecoPadrao')?.checked || false
        };

        // Não alterar os endereços existentes, apenas adicionar o novo
        if (novoEndereco.enderecoPadrao) {
            enderecos.forEach(end => end.enderecoPadrao = false); // Remove o padrão anterior
        }

        enderecos.push(novoEndereco); // Adiciona o novo endereço
        localStorage.setItem('enderecos', JSON.stringify(enderecos));

        mensagemEndereco.textContent = "Endereço adicionado com sucesso!";
        mensagemEndereco.style.display = "block";
        mensagemEndereco.style.color = "green";

        renderizarEnderecos(); // Atualiza a lista
        formNovoEndereco.reset(); // Reseta o formulário
    });

    // Inicializar renderização ao carregar a página
    renderizarEnderecos();
});
