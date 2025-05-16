document.addEventListener("DOMContentLoaded", async () => {
  async function verificarSessao() {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/usuarios/sessao", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
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

  async function buscarCarrinhoBackend() {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/carrinho/listar", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Erro ao buscar carrinho:", response.status);
        return [];
      }

      const carrinho = await response.json();
      return carrinho;
    } catch (error) {
      console.error("Erro na requisição do carrinho:", error);
      return [];
    }
  }

  const usuario = await verificarSessao();
  if (!usuario) return;

  // Preenche dados do usuário
  document.getElementById("nome").value = usuario.nome || "";
  document.getElementById("email").value = usuario.email || "";
  document.getElementById("telefone").value = usuario.telefone || "";

  document.getElementById("telefone").addEventListener("input", (e) => {
    let telefone = e.target.value.replace(/\D/g, "");
    telefone = telefone.replace(/^(\d{2})(\d)/g, "($1) $2");
    telefone = telefone.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = telefone;
  });

  function renderizarEnderecos() {
    const listaEnderecosContainer = document.getElementById("lista-enderecos");
    enderecos = JSON.parse(localStorage.getItem("enderecos") || "[]");

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
      label.textContent = `${endereco.logradouro}, ${endereco.numero || ""} - ${endereco.bairro || ""}, ${endereco.cidade} - ${endereco.uf} (${endereco.cep})`;

      div.appendChild(radio);
      div.appendChild(label);
      listaEnderecosContainer.appendChild(div);
    });
  }

  let enderecos = JSON.parse(localStorage.getItem("enderecos") || "[]");
  renderizarEnderecos();

  const cartItemsElement = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const cartItems = await buscarCarrinhoBackend();

  if (!cartItems || cartItems.length === 0) {
    cartItemsElement.innerHTML = "<li>O carrinho está vazio.</li>";
    totalPriceElement.textContent = "R$ 0,00";
  } else {
    cartItemsElement.innerHTML = "";
    let total = 0;
    cartItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.produto.nome} - Quantidade: ${item.quantidade}`;
      cartItemsElement.appendChild(li);

      const precoUnitario = item.produto.valorProduto || 0;
      total += precoUnitario * item.quantidade;
    });
    totalPriceElement.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  }

  const pagamentoSelect = document.getElementById("pagamento");
  const cartaoInfo = document.getElementById("cartao-info");
  const boletoInfo = document.getElementById("boleto-info");

  pagamentoSelect.addEventListener("change", (e) => {
    const selectedPayment = e.target.value;
    cartaoInfo.style.display = selectedPayment === "cartao" ? "block" : "none";
    boletoInfo.style.display = selectedPayment === "boleto" ? "block" : "none";
  });

  const btnAdicionarEndereco = document.getElementById("btn-adicionar-endereco");
  const novoEnderecoContainer = document.getElementById("novo-endereco");

  btnAdicionarEndereco.addEventListener("click", () => {
    novoEnderecoContainer.style.display =
      novoEnderecoContainer.style.display === "none" || !novoEnderecoContainer.style.display
        ? "block"
        : "none";
  });

  document.getElementById("salvar-endereco").addEventListener("click", () => {
    const logradouro = document.getElementById("novo-endereco-rua").value.trim();
    const numero = document.getElementById("novo-endereco-numero").value.trim();
    const complemento = document.getElementById("novo-endereco-complemento").value.trim();
    const bairro = document.getElementById("novo-endereco-bairro").value.trim();
    const cep = document.getElementById("novo-endereco-cep").value.trim();
    const cidade = document.getElementById("novo-endereco-cidade").value.trim();
    const uf = document.getElementById("novo-endereco-estado").value.trim();

    if (!logradouro || !cep || !cidade || !uf) {
      alert("Por favor, preencha todos os campos obrigatórios: rua, cep, cidade e estado.");
      return;
    }

    const novoEndereco = { logradouro, numero, complemento, bairro, cep, cidade, uf };
    enderecos.push(novoEndereco);
    localStorage.setItem("enderecos", JSON.stringify(enderecos));

    document.getElementById("novo-endereco-rua").value = "";
    document.getElementById("novo-endereco-numero").value = "";
    document.getElementById("novo-endereco-complemento").value = "";
    document.getElementById("novo-endereco-bairro").value = "";
    document.getElementById("novo-endereco-cep").value = "";
    document.getElementById("novo-endereco-cidade").value = "";
    document.getElementById("novo-endereco-estado").value = "";

    novoEnderecoContainer.style.display = "none";
    renderizarEnderecos();
  });

  document.getElementById("resumo-pedido").addEventListener("click", async (e) => {
    e.preventDefault();

    const radios = document.getElementsByName("enderecoSelecionado");
    let enderecoSelecionado = null;
    for (const radio of radios) {
      if (radio.checked) {
        const index = parseInt(radio.value);
        enderecoSelecionado = enderecos[index];
        break;
      }
    }

    if (!enderecoSelecionado) {
      alert("Por favor, selecione um endereço para entrega.");
      return;
    }

    const itensPedido = cartItems.map((item) => ({
      produto: { id: item.produto.id },
      quantidade: item.quantidade,
      precoUnitario: item.produto.valorProduto,
    }));

    let pagamento = {};
    if (pagamentoSelect.value === "cartao") {
      pagamento = {
        "@type": "pagamentoCartao",
        numeroCartao: document.getElementById("numero-cartao").value,
        nomeTitular: document.getElementById("nome-cartao").value,
        dataValidade: document.getElementById("validade-cartao").value,
        codigoSeguranca: document.getElementById("codigo-cartao").value,
      };
    } else if (pagamentoSelect.value === "boleto") {
      pagamento = {
        "@type": "pagamentoBoleto"
      };
    }

    const pedido = {
      enderecoEntrega: enderecoSelecionado,
      itens: itensPedido,
      pagamento: pagamento
    };

    console.log("Pedido a ser enviado:", pedido);

    try {
      const response = await fetch("http://127.0.0.1:8080/api/orders/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(pedido),
      });

      if (response.ok) {
        alert("Pedido finalizado com sucesso!");
        window.location.href = "resumo-pedido.html";
      } else {
        const erro = await response.text();
        alert("Erro ao finalizar pedido: " + erro);
      }
    } catch (error) {
      console.error("Erro no pedido:", error);
      alert("Erro ao finalizar pedido.");
    }
  });
});
