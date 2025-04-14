document.addEventListener('DOMContentLoaded', async function () {
    const form = document.getElementById("formCadastro");
    const mensagem = document.getElementById("mensagem");
  
    try {
      const response = await fetch("http://127.0.0.1:8080/api/usuarios/sessao", {
        method: "GET",
        credentials: "include"
      });
  
      if (!response.ok) {
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
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const nome = document.getElementById("nome").value;
      const dataNascimento = document.getElementById("dataNascimento").value;
      const genero = document.getElementById("genero").value;
      const senha = document.getElementById("senha").value;
      const confirmarSenha = document.getElementById("confirmarSenha").value;
  
      if (senha && senha !== confirmarSenha) {
        mensagem.innerText = "As senhas não coincidem.";
        mensagem.style.display = "block";
        return;
      }
  
      const dadosAtualizados = {
        nome,
        dataNascimento,
        genero
      };
  
      if (senha) {
        dadosAtualizados.senha = senha;
      }
  
      try {
        const response = await fetch("http://127.0.0.1:8080/api/usuarios/atualizar", {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dadosAtualizados)
        });
  
        if (response.ok) {
          alert("Dados atualizados com sucesso!");
          window.location.href = "/ecommerce/frontend/index.html";
        } else {
          const erro = await response.text();
          mensagem.innerText = erro;
          mensagem.style.display = "block";
        }
  
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        mensagem.innerText = "Erro ao atualizar. Tente novamente.";
        mensagem.style.display = "block";
      }
    });
  });
  