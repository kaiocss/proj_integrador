document.addEventListener("DOMContentLoaded", async () => {
    const orderId = new URLSearchParams(window.location.search).get("orderId"); // Obter o ID do pedido da URL
    const numeroPedidoElement = document.getElementById("numero-pedido");
    const dataPedidoElement = document.getElementById("data-pedido");
    const statusPedidoElement = document.getElementById("status-pedido");
    const orderItemsContainer = document.getElementById("order-items");
    const totalValueElement = document.getElementById("total-value");
    const shippingCostElement = document.getElementById("shipping-cost");
    const grandTotalElement = document.getElementById("grand-total");
    const deliveryAddressElement = document.getElementById("delivery-address");
    const paymentMethodElement = document.getElementById("payment-method");

    try {
        const response = await fetch(`http://localhost:8080/api/orders/summary?orderId=${orderId}`);
        const orderSummary = await response.json();

        numeroPedidoElement.textContent = orderSummary.numeroPedido;
        dataPedidoElement.textContent = orderSummary.dataPedido;
        statusPedidoElement.textContent = orderSummary.status;

        orderSummary.produtos.forEach(produto => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${produto.precoUnitario.toFixed(2)}</td>
                <td>R$ ${produto.total.toFixed(2)}</td>
            `;
            orderItemsContainer.appendChild(row);
        });

        totalValueElement.textContent = `R$ ${orderSummary.totalGeral.toFixed(2)}`;
        shippingCostElement.textContent = `R$ ${orderSummary.frete.toFixed(2)}`;
        grandTotalElement.textContent = `R$ ${(orderSummary.totalGeral + orderSummary.frete).toFixed(2)}`;

        deliveryAddressElement.textContent = orderSummary.enderecoEntrega;
        paymentMethodElement.textContent = orderSummary.formaPagamento;
    } catch (error) {
        console.error("Erro ao buscar resumo do pedido:", error);
        alert("Erro ao carregar o resumo do pedido. Tente novamente.");
    }

    const finalizarPedidoButton = document.getElementById("finalizar-pedido");

    finalizarPedidoButton.addEventListener("click", async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/finalize?orderId=${orderId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Pedido concluído com sucesso!\nNúmero do Pedido: ${result.numeroPedido}\nValor Total: R$ ${result.totalGeral.toFixed(2)}`);
                window.location.href = "/ecommerce/frontend/index.html"; 
            } else {
                throw new Error("Erro ao gravar o pedido.");
            }
        } catch (error) {
            console.error("Erro ao finalizar o pedido:", error);
            alert("Erro ao finalizar o pedido. Por favor, tente novamente.");
        }
    });
});