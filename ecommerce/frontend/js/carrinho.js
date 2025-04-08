document.addEventListener('DOMContentLoaded', () => {
    const listaCarrinho = document.getElementById('lista-carrinho');
    const botaoLimpar = document.getElementById('limpar-carrinho');
    const resumoCarrinho = document.getElementById('resumo-carrinho');
    const inputCEP = document.getElementById('cep');
    const opcoesFrete = document.getElementById('frete-opcoes');

    let valorFreteSelecionado = 0;

    const atualizarCarrinho = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/carrinho/listar');
            if (!response.ok) throw new Error("Erro ao carregar os dados do carrinho.");

            const itensCarrinho = await response.json();
            listaCarrinho.innerHTML = '';
            resumoCarrinho.innerHTML = '';
            opcoesFrete.innerHTML = '';

            if (itensCarrinho.length === 0) {
                listaCarrinho.innerHTML = '<p>O carrinho está vazio.</p>';
                return;
            }

            let valorTotal = 0;
            let quantidadeTotal = 0;

            itensCarrinho.forEach((item) => {
                const precoUnitario = parseFloat(item.precoUnitario || 0);
                const quantidade = parseInt(item.quantidade || 0);
                const totalItem = precoUnitario * quantidade;

                valorTotal += totalItem;
                quantidadeTotal += quantidade;

                const card = document.createElement('div');
                card.classList.add('card-produto');
                card.innerHTML = `
                    <img src="${item.produto.imagemPrincipal || '/ecommerce/frontend/assets/default.png'}" alt="Produto">
                    <div class="info">
                        <h3>${item.produto.nome}</h3>
                        <p>
                            <button class="quantidade-btn" data-id="${item.id}" data-op="sub">−</button>
                            <span class="quantidade-text">${quantidade}</span>
                            <button class="quantidade-btn" data-id="${item.id}" data-op="add">+</button>
                        </p>
                        <p><span style="color: green;">Em estoque e pronto para envio.</span></p>
                    </div>
                    <div class="preco">
                        R$ ${totalItem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                `;
                listaCarrinho.appendChild(card);
            });

            if (inputCEP.value) {
                const fretes = gerarFretesAleatorios(); 
                fretes.forEach((valor, index) => {
                    const label = document.createElement('label');
                    label.innerHTML = `
                        <input type="radio" name="frete" value="${valor}" ${index === 0 ? 'checked' : ''}>
                        Frete opção ${index + 1}: R$ ${valor.toFixed(2)}
                    `;
                    opcoesFrete.appendChild(label);
                    if (index === 0) valorFreteSelecionado = valor;
                });

                document.querySelectorAll('input[name="frete"]').forEach(radio => {
                    radio.addEventListener('change', () => {
                        valorFreteSelecionado = parseFloat(radio.value);
                        exibirResumo(valorTotal);
                    });
                });
            }

            exibirResumo(valorTotal);

            document.querySelectorAll('.quantidade-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = btn.getAttribute('data-id');
                    const op = btn.getAttribute('data-op');
                    const spanQuantidade = btn.parentElement.querySelector('.quantidade-text');
                    let novaQtd = parseInt(spanQuantidade.textContent);

                    if (op === 'add') novaQtd++;
                    else if (op === 'sub' && novaQtd > 1) novaQtd--;
                    else if (op === 'sub' && novaQtd === 1) {
                        await fetch(`http://localhost:8080/api/carrinho/${id}`, { method: 'DELETE' });
                        return atualizarCarrinho();
                    }

                    await fetch(`http://localhost:8080/api/carrinho/atualizar/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(novaQtd)
                    });

                    atualizarCarrinho();
                });
            });

        } catch (error) {
            console.error("Erro ao atualizar o carrinho:", error);
            listaCarrinho.innerHTML = '<p>Erro ao carregar o carrinho.</p>';
        }
    };

    const exibirResumo = (subtotal) => {
        resumoCarrinho.innerHTML = `
            <p>Subtotal: R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p>Frete: R$ ${valorFreteSelecionado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <hr>
            <p class="total">Total: R$ ${(subtotal + valorFreteSelecionado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        `;
    };

    const gerarFretesAleatorios = () => {
        return [
            Math.floor(Math.random() * 10) + 5,
            Math.floor(Math.random() * 10) + 15,
            Math.floor(Math.random() * 10) + 25
        ];
    };

    inputCEP.addEventListener('change', atualizarCarrinho);
    botaoLimpar.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:8080/api/carrinho/limpar', { method: 'DELETE' });
            if (!response.ok) throw new Error("Erro ao limpar o carrinho.");
            atualizarCarrinho();
        } catch (error) {
            console.error("Erro ao limpar o carrinho:", error);
            listaCarrinho.innerHTML = '<p>Erro ao limpar o carrinho.</p>';
        }
    });

    atualizarCarrinho();
});