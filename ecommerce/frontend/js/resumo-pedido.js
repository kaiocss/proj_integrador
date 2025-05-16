document.addEventListener("DOMContentLoaded", () => {
    // Recupera os dados do pedido do sessionStorage
    const resumoPedido = JSON.parse(sessionStorage.getItem("resumoPedido"));

    if (!resumoPedido) {
        alert("Nenhum pedido encontrado. Redirecionando para a escolha de pagamento.");
        window.location.href = "/ecommerce/frontend/checkout.html";
        return;
    }

    // Preenche os detalhes do pedido
    document.getElementById("numero-pedido").textContent = resumoPedido.numeroPedido || "---";
    document.getElementById("data-pedido").textContent = resumoPedido.dataPedido || new Date().toLocaleDateString();
    document.getElementById("status-pedido").textContent = resumoPedido.status || "Pendente";

    // Preenche os itens do pedido
    const orderItems = document.getElementById("order-items");
    orderItems.innerHTML = resumoPedido.itens.map(item => `
        <tr>
            <td>${item.produtoNome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.precoUnitario.toFixed(2)}</td>
            <td>R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}</td>
        </tr>
    `).join("");

    // Preenche os valores financeiros
    document.getElementById("total-value").textContent = `R$ ${resumoPedido.totalGeral.toFixed(2)}`;
    document.getElementById("shipping-cost").textContent = `R$ ${resumoPedido.frete || 0.00}`;
    document.getElementById("grand-total").textContent = `R$ ${(resumoPedido.totalGeral + (resumoPedido.frete || 0)).toFixed(2)}`;

    // Preenche o endereço de entrega
    document.getElementById("delivery-address").textContent = resumoPedido.enderecoEntrega;

    // Preenche a forma de pagamento
    document.getElementById("payment-method").textContent = resumoPedido.formaPagamento;

    // Botão de finalizar pedido
    document.getElementById("finalizar-pedido").addEventListener("click", () => {
        alert("Compra concluída com sucesso!");
        sessionStorage.removeItem("resumoPedido");
        window.location.href = "/ecommerce/frontend/index.html";
    });
});
