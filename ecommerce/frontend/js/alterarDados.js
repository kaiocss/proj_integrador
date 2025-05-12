document.addEventListener('DOMContentLoaded', async function () {
    const formDados = document.getElementById("formEditarDados");
    const formSenha = document.getElementById("formTrocarSenha");
    const formEndereco = document.getElementById("formNovoEndereco");

    const mensagemDados = document.getElementById("mensagemDados");
    const mensagemSenha = document.getElementById("mensagemSenha");
    const mensagemEndereco = document.getElementById("mensagemEndereco");

    const buscarEnderecoPorCep = async (cep) => {
        const cepLimpo = cep.replace(/\D/g, ""); 
        if (cepLimpo.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                if (!response.ok) throw new Error("Erro ao buscar CEP.");
                
                const dados = await response.json();
                if (!dados.erro) {
                    document.getElementById("rua").value = dados.logradouro || "";
                    document.getElementById("bairro").value = dados.bairro || "";
                    document.getElementById("cidade").value = dados.localidade || "";
                    document.getElementById("uf").value = dados.uf || "";
                } else {
                    mensagemEndereco.innerText = "CEP inválido ou não encontrado.";
                    mensagemEndereco.style.color = "red";
                    mensagemEndereco.style.display = "block";
                }
            } catch (error) {
                mensagemEndereco.innerText = "Erro ao buscar informações do CEP. Tente novamente.";
                mensagemEndereco.style.color = "red";
                mensagemEndereco.style.display = "block";
                console.error("Erro ao buscar CEP:", error);
            }
        } else {
            mensagemEndereco.innerText = "CEP inválido. Certifique-se de que contém 8 dígitos.";
            mensagemEndereco.style.color = "red";
            mensagemEndereco.style.display = "block";
        }
    };

    document.getElementById("cep").addEventListener("blur", function () {
        const cep = this.value;
        buscarEnderecoPorCep(cep);
    });

    try {
        const response = await fetch("http://127.0.0.1:8080/api/usuarios/sessao", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            console.warn("Sessão inválida. Redirecionando para a página de login...");
            window.location.href = "/ecommerce/frontend/login.html";
            return;
        }

        const usuarioLogado = await response.json();

        document.getElementById("nome").value = usuarioLogado.nome || "";
        document.getElementById("dataNascimento").value = usuarioLogado.dataNascimento || "";
        document.getElementById("genero").value = usuarioLogado.genero || "";


    } catch (error) {
        console.error("Erro ao buscar sessão do usuário:", error);
        window.location.href = "/ecommerce/frontend/login.html";
    }

    formDados.addEventListener("submit", async function (e) {
        e.preventDefault();

    
        const nome = document.getElementById("nome").value;
        const dataNascimento = document.getElementById("dataNascimento").value;
        const genero = document.getElementById("genero").value;

        const dadosAtualizados = { nome, dataNascimento, genero };

        try {
            const response = await fetch("http://127.0.0.1:8080/api/usuarios/atualizar", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosAtualizados)
            });

            if (response.ok) {
                const usuarioAtualizado = await response.json();
                mensagemDados.innerText = "Alterações salvas com sucesso!";
                mensagemDados.textContent = `Dados atualizados com sucesso!
                Nome: ${nome}
                Data de Nascimento: ${dataNascimento}
                Gênero: ${genero}`;
                mensagemDados.style.color = "green";
                mensagemDados.style.display = "block";
            } else {
                const erro = await response.text();
                mensagemDados.innerText = `Erro: ${erro}`;
                mensagemDados.style.color = "red";
                mensagemDados.style.display = "block";
            }
        } catch (error) {
            console.error("Erro ao atualizar dados:", error);
            mensagemDados.innerText = "Erro ao atualizar. Tente novamente.";
            mensagemDados.style.color = "red";
            mensagemDados.style.display = "block";
        }
    });

    formSenha.addEventListener("submit", async function (e) {
        e.preventDefault();

        const senhaAtual = document.getElementById("senhaAtual").value;
        const novaSenha = document.getElementById("novaSenha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            mensagemSenha.innerText = "Preencha todos os campos.";
            mensagemSenha.style.color = "red";
            mensagemSenha.style.display = "block";
            return;
        }

        if (novaSenha !== confirmarSenha) {
            mensagemSenha.innerText = "As senhas não coincidem.";
            mensagemSenha.style.color = "red";
            mensagemSenha.style.display = "block";
            return;
        }

        const dadosSenha = { senhaAtual, novaSenha };

        try {
            const response = await fetch("http://127.0.0.1:8080/api/usuarios/alterarSenha", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosSenha)
            });

            if (response.ok) {
                mensagemSenha.innerText = "Senha alterada com sucesso!";
                mensagemSenha.style.color = "green";
                mensagemSenha.style.display = "block";
            } else {
                const erro = await response.text();
                mensagemSenha.innerText = `Erro: ${erro}`;
                mensagemSenha.style.color = "red";
                mensagemSenha.style.display = "block";
            }
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            mensagemSenha.innerText = "Erro ao alterar senha. Tente novamente.";
            mensagemSenha.style.color = "red";
            mensagemSenha.style.display = "block";
        }
    });

    formEndereco.addEventListener("submit", async function (e) {
        e.preventDefault();

        const cep = document.getElementById("cep").value;
        const rua = document.getElementById("rua").value;
        const numero = document.getElementById("numero").value;
        const complemento = document.getElementById("complemento").value || "";
        const bairro = document.getElementById("bairro").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;

        const endereco = { cep, logradouro: rua, numero, complemento, bairro, cidade, uf };

        try {
            const response = await fetch("http://127.0.0.1:8080/api/usuarios/enderecos", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(endereco)
            });

            if (response.ok) {
                mensagemEndereco.innerText = "Endereço alterado com sucesso!";
                mensagemEndereco.style.color = "green";
                mensagemEndereco.style.display = "block";
            } else {
                const erro = await response.text();
                mensagemEndereco.innerText = `Erro: ${erro}`;
                mensagemEndereco.style.color = "red";
                mensagemEndereco.style.display = "block";
            }
        } catch (error) {
            console.error("Erro ao adicionar endereço:", error);
            mensagemEndereco.innerText = "Erro ao adicionar endereço. Tente novamente.";
            mensagemEndereco.style.color = "red";
            mensagemEndereco.style.display = "block";
        }
    });
});
    // Inicializar renderização ao carregar a página
    renderizarEnderecos();
});
