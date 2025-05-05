document.addEventListener("DOMContentLoaded", () => {
    const cartItems = JSON.parse(sessionStorage.getItem("carrinhoTemporario") || "[]");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const pagamentoSelect = document.getElementById("pagamento");
    const cartaoInfo = document.getElementById("cartao-info");
    const boletoInfo = document.getElementById("boleto-info");
    const finalizarPedidoButton = document.getElementById("finalizar-pedido");

    let totalPrice = 0;

    cartItems.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.produto.nome} - R$ ${item.produto.valorProduto} x ${item.quantidade}`;
        cartItemsContainer.appendChild(li);
        totalPrice += item.produto.valorProduto * item.quantidade;
    });

    totalPriceElement.textContent = `R$ ${totalPrice.toFixed(2)}`;

    pagamentoSelect.addEventListener("change", (e) => {
        const selectedPayment = e.target.value;
        
        if (selectedPayment === "cartao") {
            cartaoInfo.style.display = "block";
            boletoInfo.style.display = "none";
        } else if (selectedPayment === "boleto") {
            cartaoInfo.style.display = "none";
            boletoInfo.style.display = "block";
        }
    });

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

        const form = document.getElementById("form-checkout");
        const formData = new FormData(form);
        const clienteData = Object.fromEntries(formData.entries());

        fetch("http://localhost:8080/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cliente: clienteData,
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
        });
    });
});