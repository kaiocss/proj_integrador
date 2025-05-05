document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    let usuario = null;

    // Verifica se o usuário está logado e preenche os dados no formulário
    if (usuarioLogado) {
        usuario = JSON.parse(usuarioLogado);
        console.log("Usuário logado:", usuario);

        // Preencher automaticamente os dados do cliente no formulário
        document.getElementById("nome").value = usuario.nome || "";
        document.getElementById("email").value = usuario.email || "";
        document.getElementById("telefone").value = usuario.telefone || "";
    } else {
        console.warn("Usuário não está logado. Continuando com a compra como anônimo...");
    }

    const cartItems = JSON.parse(sessionStorage.getItem("carrinhoTemporario") || "[]");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const pagamentoSelect = document.getElementById("pagamento");
    const cartaoInfo = document.getElementById("cartao-info");
    const boletoInfo = document.getElementById("boleto-info");
    const finalizarPedidoButton = document.getElementById("finalizar-pedido");

    let totalPrice = 0;

    // Renderizar itens do carrinho e calcular o preço total
    cartItems.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.produto.nome} - R$ ${item.produto.valorProduto} x ${item.quantidade}`;
        cartItemsContainer.appendChild(li);
        totalPrice += item.produto.valorProduto * item.quantidade;
    });

    totalPriceElement.textContent = `R$ ${totalPrice.toFixed(2)}`;

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

    // Exibir o formulário para adicionar um novo endereço
    btnAdicionarEndereco.addEventListener("click", () => {
        formNovoEndereco.style.display = "block";
    });

    // Salvar novo endereço
    salvarEnderecoBtn.addEventListener("click", () => {
        const rua = document.getElementById("novo-endereco-rua").value;
        const cep = document.getElementById("novo-endereco-cep").value;
        const cidade = document.getElementById("novo-endereco-cidade").value;
        const estado = document.getElementById("novo-endereco-estado").value;

        if (!rua || !cep || !cidade || !estado) {
            alert("Por favor, preencha todos os campos do novo endereço.");
            return;
        }

        const novoEndereco = { rua, cep, cidade, estado };
        enderecos.push(novoEndereco);
        localStorage.setItem("enderecos", JSON.stringify(enderecos));

        // limpar campos
        document.getElementById("novo-endereco-rua").value = "";
        document.getElementById("novo-endereco-cep").value = "";
        document.getElementById("novo-endereco-cidade").value = "";
        document.getElementById("novo-endereco-estado").value = "";

        formNovoEndereco.style.display = "none";
        renderizarEnderecos();
    });

    // Finalizar pedido
    finalizarPedidoButton.addEventListener("click", (e) => {
        e.preventDefault();

        const selectedPayment = pagamentoSelect.value;
        if (!selectedPayment) {
            alert("Você precisa escolher uma forma de pagamento.");
            return;
        }

        if (selectedPayment === "cartao") {
            const numeroCartao = document.getElementById("numero-cartao").value;
            const codigoCartao = document.getElementById("codigo-cartao").value;
            const nomeCartao = document.getElementById("nome-cartao").value;
            const vencimentoCartao = document.getElementById("vencimento-cartao").value;
            const parcelasCartao = document.getElementById("parcelas-cartao").value;

            if (!numeroCartao || !codigoCartao || !nomeCartao || !vencimentoCartao || !parcelasCartao) {
                alert("Todos os campos do cartão precisam ser preenchidos.");
                return;
            }
        }

        const enderecoSelecionadoIndex = document.querySelector("input[name='enderecoSelecionado']:checked");
        if (!enderecoSelecionadoIndex) {
            alert("Por favor, selecione um endereço de entrega.");
            return;
        }

        const endereco = enderecos[parseInt(enderecoSelecionadoIndex.value)];

        const form = document.getElementById("form-checkout");
        const formData = new FormData(form);
        const clienteData = Object.fromEntries(formData.entries());

        // Enviar o pedido para o backend
        fetch("http://localhost:8080/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cliente: clienteData,
                endereco: endereco,
                carrinho: cartItems,
                pagamento: selectedPayment
            })
        }).then(response => {
            if (response.ok) {
                alert("Pedido realizado com sucesso!");
                window.location.href = "/ecommerce/frontend/index.html";
            } else {
                alert("Erro ao finalizar pedido.");
            }
        }).catch(error => {
            console.error("Erro ao finalizar pedido:", error);
            alert("Houve um erro ao processar o pedido.");
        });
    });

    renderizarEnderecos();
});
