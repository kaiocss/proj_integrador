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

    const orderItemsContainer = document.getElementById("order-items");
    const totalValueElement = document.getElementById("total-price");
    const pagamentoSelect = document.getElementById("pagamento");
    const cartaoInfo = document.getElementById("cartao-info");
    const boletoInfo = document.getElementById("boleto-info");
    const finalizarPedidoButton = document.getElementById("finalizar-pedido");

    let totalPrice = 0;

    // Carregar itens do carrinho da sessão
    const cartItems = JSON.parse(sessionStorage.getItem("carrinhoTemporario") || "[]");

    cartItems.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.produto.nome} - R$ ${item.produto.valorProduto.toFixed(2)} x ${item.quantidade}`;
        orderItemsContainer.appendChild(li);
        totalPrice += item.produto.valorProduto * item.quantidade;
    });

    totalValueElement.textContent = `R$ ${totalPrice.toFixed(2)}`;

    // Controlar exibição das informações de pagamento
    pagamentoSelect.addEventListener("change", (e) => {
        const selectedPayment = e.target.value;
        cartaoInfo.style.display = selectedPayment === "cartao" ? "block" : "none";
        boletoInfo.style.display = selectedPayment === "boleto" ? "block" : "none";
    });

    // Endereços
    const listaEnderecosContainer = document.getElementById("lista-enderecos");
    const btnAdicionarEndereco = document.getElementById("btn-adicionar-endereco");
    const formNovoEndereco = document.getElementById("novo-endereco");
    const salvarEnderecoBtn = document.getElementById("salvar-endereco");
    let enderecos = JSON.parse(localStorage.getItem("enderecos") || "[]");

    function renderizarEnderecos() {
        listaEnderecosContainer.innerHTML = "";

        if (enderecos.length === 0) {
            listaEnderecosContainer.innerHTML = "<p>Nenhum endereço salvo.</p>";
            return;
        }

        enderecos.forEach((endereco, index) => {
            const div = document.createElement("div");
            div.classList.add("endereco-item");

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "enderecoSelecionado";
            radio.value = index;
            radio.id = `endereco-${index}`;

            const label = document.createElement("label");
            label.htmlFor = `endereco-${index}`;
            label.textContent = `${endereco.rua}, ${endereco.cidade} - ${endereco.estado} (${endereco.cep})`;

            div.appendChild(radio);
            div.appendChild(label);
            listaEnderecosContainer.appendChild(div);
        });
    }

    btnAdicionarEndereco.addEventListener("click", () => {
        formNovoEndereco.style.display = "block";
    });

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

        formNovoEndereco.style.display = "none";
        renderizarEnderecos();
    });

    finalizarPedidoButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const selectedPayment = pagamentoSelect.value;
        if (!selectedPayment) {
            alert("Você precisa escolher uma forma de pagamento.");
            return;
        }

        if (selectedPayment === "cartao") {
            const numeroCartao = document.getElementById("numero-cartao").value.trim();
            const codigoCartao = document.getElementById("codigo-cartao").value.trim();
            const nomeCartao = document.getElementById("nome-cartao").value.trim();
            const vencimentoCartao = document.getElementById("vencimento-cartao").value.trim();
            const parcelasCartao = document.getElementById("parcelas-cartao").value.trim();

            if (!numeroCartao || !codigoCartao || !nomeCartao || !vencimentoCartao || !parcelasCartao) {
                alert("Todos os campos do cartão precisam ser preenchidos.");
                return;
            }
        }

        const radiosEndereco = document.getElementsByName("enderecoSelecionado");
        let enderecoSelecionado = null;
        for (const radio of radiosEndereco) {
            if (radio.checked) {
                enderecoSelecionado = enderecos[parseInt(radio.value)];
                break;
            }
        }

        if (!enderecoSelecionado) {
            alert("Por favor, selecione ou preencha um endereço de entrega.");
            return;
        }

        const enderecoEntrega = `${enderecoSelecionado.rua}, ${enderecoSelecionado.cidade} - ${enderecoSelecionado.estado} (${enderecoSelecionado.cep})`;

        const pedido = {
            usuarioId: usuario.id,  // usa id do usuário vindo do backend
            enderecoEntrega,
            formaPagamento: selectedPayment,
            itens: cartItems.map(item => ({
                produtoId: item.produto.id,
                quantidade: item.quantidade,
                precoUnitario: item.produto.valorProduto
            })),
            totalGeral: totalPrice
        };

        try {
            const response = await fetch("http://localhost:8080/api/orders/finalize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedido)
            });

            if (response.ok) {
                const savedOrder = await response.json();

                // Guarda resumo do pedido para a próxima página (pode usar sessionStorage aqui)
                sessionStorage.setItem("resumoPedido", JSON.stringify({
                    numeroPedido: savedOrder.numeroPedido,
                    totalGeral: savedOrder.totalGeral,
                    enderecoEntrega: savedOrder.enderecoEntrega,
                    formaPagamento: savedOrder.formaPagamento,
                    itens: savedOrder.itens
                }));

                window.location.href = "/ecommerce/frontend/resumo-pedido.html";
            } else {
                alert("Erro ao finalizar o pedido. Por favor, tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao finalizar o pedido:", error);
            alert("Houve um erro ao processar o pedido.");
        }
    });

    renderizarEnderecos();
});
