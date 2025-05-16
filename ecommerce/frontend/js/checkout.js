document.addEventListener("DOMContentLoaded", async () => {
    // Função para verificar sessão direto no backend
    async function verificarSessao() {
        try {
            const response = await fetch("http://127.0.0.1:8080/api/usuarios/sessao", {
                method: "GET",
                credentials: "include" // importante para enviar cookies
            });

            if (!response.ok) {
                // Não está logado
                window.location.href = "login.html";
                return null;
            }

            const usuario = await response.json();
            if (!usuario || !usuario.nome) {
                window.location.href = "login.html";
                return null;
            }

            return usuario;
        } catch (error) {
            console.error("Erro ao verificar sessão:", error);
            window.location.href = "login.html";
            return null;
        }
    }

    // Primeiro, verifica a sessão
    const usuario = await verificarSessao();
    if (!usuario) {
        return; // já redirecionou para login
    }

    console.log("Usuário logado:", usuario);

    // Preencher automaticamente os dados do cliente no formulário
    document.getElementById("nome").value = usuario.nome || "";
    document.getElementById("email").value = usuario.email || "";
    document.getElementById("telefone").value = usuario.telefone || "";

    document.getElementById("telefone").addEventListener("input", function (e) {
        let telefone = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        telefone = telefone.replace(/^(\d{2})(\d)/g, "($1) $2"); // Adiciona parênteses em volta do DDD
        telefone = telefone.replace(/(\d{5})(\d)/, "$1-$2"); // Adiciona o hífen no número
        e.target.value = telefone;
    });

    // Função para renderizar os endereços salvos
    function renderizarEnderecos() {
        const listaEnderecosContainer = document.getElementById("lista-enderecos");
        const enderecos = JSON.parse(localStorage.getItem("enderecos") || "[]");

        listaEnderecosContainer.innerHTML = ""; // Limpa a lista antes de renderizar

        if (enderecos.length === 0) {
            listaEnderecosContainer.innerHTML = "<p>Nenhum endereço salvo.</p>";
            return;
        }

        enderecos.forEach((endereco, index) => {
            const div = document.createElement("div");
            div.classList.add("endereco-item");

            const label = document.createElement("label");
            label.htmlFor = `endereco-${index}`;
            label.textContent = `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf} (${endereco.cep})`;

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "enderecoSelecionado";
            radio.value = index;
            radio.id = `endereco-${index}`;

            // Adiciona o texto do endereço antes do botão de seleção
            div.appendChild(label);
            div.appendChild(radio);
            listaEnderecosContainer.appendChild(div);
        });
    }

    // Renderizar os endereços ao carregar a página
    renderizarEnderecos();

    const cartItemsElement = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    // Recupera os itens do carrinho do sessionStorage
    const carrinhoTemporario = sessionStorage.getItem("carrinhoTemporario");
    const cartItems = carrinhoTemporario ? JSON.parse(carrinhoTemporario) : [];

    // Verifica se há itens no carrinho
    if (cartItems.length === 0) {
        cartItemsElement.innerHTML = "<li>O carrinho está vazio.</li>";
        totalPriceElement.textContent = "R$ 0,00";
        return;
    }

    // Limpa o conteúdo atual
    cartItemsElement.innerHTML = "";

    let total = 0;

    // Adiciona os itens ao resumo do carrinho
    cartItems.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.produto.nome} - Quantidade: ${item.quantidade}`;
        cartItemsElement.appendChild(li);

        total += item.precoUnitario * item.quantidade;
    });

    // Atualiza o total
    totalPriceElement.textContent = `R$ ${total.toFixed(2)}`;

    const pagamentoSelect = document.getElementById("pagamento");
    const cartaoInfo = document.getElementById("cartao-info");
    const boletoInfo = document.getElementById("boleto-info");
    const finalizarPedidoButton = document.getElementById("finalizar-pedido");

    // Controlar exibição das informações de pagamento
    pagamentoSelect.addEventListener("change", (e) => {
        const selectedPayment = e.target.value;
        cartaoInfo.style.display = selectedPayment === "cartao" ? "block" : "none";
        boletoInfo.style.display = selectedPayment === "boleto" ? "block" : "none";
    });

    const btnAdicionarEndereco = document.getElementById("btn-adicionar-endereco");
    const novoEnderecoContainer = document.getElementById("novo-endereco");

    // Adicionar evento de clique no botão "Adicionar Novo Endereço"
    btnAdicionarEndereco.addEventListener("click", () => {
        // Alterna a exibição do formulário
        if (novoEnderecoContainer.style.display === "none" || novoEnderecoContainer.style.display === "") {
            novoEnderecoContainer.style.display = "block"; // Exibe o formulário
        } else {
            novoEnderecoContainer.style.display = "none"; // Oculta o formulário
        }
    });

    const salvarEnderecoBtn = document.getElementById("salvar-endereco");
    let enderecos = JSON.parse(localStorage.getItem("enderecos") || "[]");

    salvarEnderecoBtn.addEventListener("click", () => {
        const rua = document.getElementById("novo-endereco-rua").value.trim();
        const cep = document.getElementById("novo-endereco-cep").value.trim();
        const cidade = document.getElementById("novo-endereco-cidade").value.trim();
        const estado = document.getElementById("novo-endereco-estado").value.trim();

        if (!rua || !cep || !cidade || !estado) {
            alert("Por favor, preencha todos os campos do novo endereço.");
            return;
        }

        const novoEndereco = { rua, cep, cidade, estado };
        enderecos.push(novoEndereco);
        localStorage.setItem("enderecos", JSON.stringify(enderecos));

        // Limpar campos
        document.getElementById("novo-endereco-rua").value = "";
        document.getElementById("novo-endereco-cep").value = "";
        document.getElementById("novo-endereco-cidade").value = "";
        document.getElementById("novo-endereco-estado").value = "";

        novoEnderecoContainer.style.display = "none";
        renderizarEnderecos();
    });

    finalizarPedidoButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const enderecoSelecionado = {
            rua: document.getElementById("novo-endereco-rua").value.trim(),
            cidade: document.getElementById("novo-endereco-cidade").value.trim(),
            estado: document.getElementById("novo-endereco-estado").value.trim(),
            cep: document.getElementById("novo-endereco-cep").value.trim()
        };

        // Validação dos campos de endereço
        if (!enderecoSelecionado.rua || !enderecoSelecionado.cidade || !enderecoSelecionado.estado || !enderecoSelecionado.cep) {
            alert("Por favor, preencha todos os campos do endereço.");
            return;
        }

        const enderecoEntrega = `${enderecoSelecionado.rua}, ${enderecoSelecionado.cidade} - ${enderecoSelecionado.estado} (${enderecoSelecionado.cep})`;
        console.log("Endereço formatado:", enderecoEntrega);

        // Continue com a lógica de salvar o pedido...
    });
});
