package com.example.classes;

import java.io.File;
import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

import com.example.dao.ProdutoDAO;
import com.example.models.ImagemProduto;
import com.example.models.Produto;
import com.example.models.Usuario;

public class MenuProduto {

    // Vamos obter o usuário logado do SessionManager
    private static Usuario usuarioLogado = SessionManager.getUsuarioLogado();

   public static void listarProdutos() {
        List<Produto> produtos = ProdutoDAO.listarProdutos(); // Obtém todos os produtos
        Scanner sc = new Scanner(System.in);

        // Se a lista de produtos estiver vazia, exibe uma mensagem e retorna
        if (produtos.isEmpty()) {
            System.out.println("Nenhum produto encontrado.");
            return;
        }

        // Exibe a lista de produtos
        System.out.println("ID | Nome | Quantidade | Valor | Status");
        for (int i = 0; i < produtos.size(); i++) {
            Produto p = produtos.get(i);
            System.out.println((i + 1) + " | " + p.getNome() + " | " + p.getQtdEstoque() + " | " + p.getValorProduto() + " | " + p.getStatus());
        }

        // Solicita ao administrador a ação desejada
        System.out.print("Selecione o ID do produto para editar/habilitar/desabilitar, 0 para voltar e i para incluir: ");
        String opcao = sc.nextLine();

        // Caso a opção seja voltar
        if (opcao.equals("0")) {
            return; // Retorna para o menu anterior
        }

        // Caso a opção seja incluir, chama o método para incluir um novo produto
        if (opcao.equalsIgnoreCase("i")) {
            incluirProduto();
            return;
        }

        // Caso contrário, seleciona o produto baseado no ID informado
        int idEscolhido = Integer.parseInt(opcao);
        Produto produtoEscolhido = produtos.get(idEscolhido - 1);

        System.out.println("Produto selecionado:");
        System.out.println(produtoEscolhido);

        // Exibe opções de ações que podem ser feitas com o produto
        System.out.println("""
            Opções:
            1) Alterar produto
            2) Alterar quantidade em estoque
            3) Habilitar/Desabilitar status
            4) Voltar
            """);

        int acao = sc.nextInt();
        sc.nextLine();  // Consumir a linha

        switch (acao) {
            case 1 -> editarProduto(produtoEscolhido); // Chama o método para alterar o produto
            case 2 -> editarQuantidadeEstoque(produtoEscolhido);  // Chama o método para alterar a quantidade em estoque
            case 3 -> habilitarDesabilitarProduto(produtoEscolhido);  // Habilitar/desabilitar status do produto
            case 4 -> { /* Volta para a lista de produtos */ }
            default -> System.out.println("Opção inválida.");
        }
    }

    // Método para incluir um novo produto
    private static void incluirProduto() {
        Scanner sc = new Scanner(System.in);

        System.out.println("Informe o nome do produto: ");
        String nome = sc.nextLine();

        System.out.println("Informe a avaliação (1.0 a 5.0): ");
        double avaliacao = sc.nextDouble();
        sc.nextLine();  // Consumir a quebra de linha após o double

        System.out.println("Informe a descrição detalhada do produto: ");
        String descricaoDetalhada = sc.nextLine();

        System.out.println("Informe a quantidade em estoque: ");
        int qtdEstoque = sc.nextInt();

        System.out.println("Informe o valor do produto: ");
        double valorProduto = sc.nextDouble();
        sc.nextLine();  // Consumir a quebra de linha após o double

        // Aqui, em vez de solicitar o status, definimos como "ativo"
        String status = "ativo"; // Produto será sempre ativo

        ProdutoDAO produtoDAO = new ProdutoDAO();
        try {
            String resultado = produtoDAO.cadastrarProduto(nome, avaliacao, descricaoDetalhada, qtdEstoque, valorProduto, status);
            System.out.println(resultado);
            int produtoId = produtoDAO.obterUltimoProdutoId(); 
            incluirImagem(produtoId); // Método para incluir imagem (se necessário)
        } catch (SQLException e) {
            System.out.println("Erro ao cadastrar produto: " + e.getMessage());
        }

        listarProdutos(); // Volta para a lista de produtos
    }

    private static void editarProduto(Produto produto) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Editar produto: " + produto.getNome());

        System.out.println("Novo nome: ");
        produto.setNome(sc.nextLine());

        System.out.println("Nova avaliação (1.0 a 5.0): ");
        produto.setAvaliacao(sc.nextDouble());
        sc.nextLine(); // Consumir a quebra de linha após o double

        System.out.println("Nova descrição detalhada: ");
        produto.setDescricaoDetalhada(sc.nextLine());

        System.out.println("Nova quantidade em estoque: ");
        produto.setQtdEstoque(sc.nextInt());

        System.out.println("Novo valor do produto: ");
        produto.setValorProduto(sc.nextDouble());
        sc.nextLine(); 

        System.out.println("Novo status (ativo/desativado): ");
        produto.setStatus(sc.nextLine());

        ProdutoDAO produtoDAO = new ProdutoDAO();
        String resultado = produtoDAO.atualizarProduto(produto);
        System.out.println(resultado);

        listarProdutos(); 
    }

    private static void editarProduto(int id) {
        ProdutoDAO produtoDAO = new ProdutoDAO();

        try {
            Produto produto = produtoDAO.buscarProdutoPorId(id); // Busca o produto pelo ID
            if (produto != null) {
                // Aqui você pode exibir os detalhes do produto e permitir ao usuário alterá-los
                Scanner sc = new Scanner(System.in);

                System.out.println("Editar produto: " + produto.getNome());

                // Permite editar todos os campos para administradores
                System.out.println("Novo nome: ");
                produto.setNome(sc.nextLine());

                System.out.println("Nova avaliação (1.0 a 5.0): ");
                produto.setAvaliacao(sc.nextDouble());
                sc.nextLine(); // Consumir a quebra de linha após o double

                System.out.println("Nova descrição detalhada: ");
                produto.setDescricaoDetalhada(sc.nextLine());

                System.out.println("Nova quantidade em estoque: ");
                produto.setQtdEstoque(sc.nextInt());

                System.out.println("Novo valor do produto: ");
                produto.setValorProduto(sc.nextDouble());
                sc.nextLine(); // Consumir a quebra de linha após o double

                System.out.println("Novo status (ativo/desativado): ");
                produto.setStatus(sc.nextLine());

                System.out.println("Deseja alterar a imagem do produto: ");

                String resultado = produtoDAO.atualizarProduto(produto);
                System.out.println(resultado);
            } else {
                System.out.println("Produto não encontrado.");
            }
        } catch (SQLException e) {
            System.out.println("Erro ao buscar ou atualizar produto: " + e.getMessage());
        }

        listarProdutos(); // Volta para a lista de produtos
    }

     private static void habilitarDesabilitarProduto(Produto produto) {
        Scanner sc = new Scanner(System.in);
        String statusAtual = produto.getStatus();
        String novoStatus = statusAtual.equalsIgnoreCase("ativo") ? "desativado" : "ativo";

        System.out.println("Status atual: " + statusAtual);
        System.out.print("Alterar status para " + novoStatus + "? (Y/N): ");
        String opcao = sc.nextLine();

        if (opcao.equalsIgnoreCase("Y")) {
            produto.setStatus(novoStatus);
            ProdutoDAO produtoDAO = new ProdutoDAO();
            String resultado = produtoDAO.atualizarProduto(produto);
            System.out.println("Status alterado com sucesso.");
        } else {
            System.out.println("Operação cancelada.");
        }

        listarProdutos();
    }


    private static void editarQuantidadeEstoque(int id) {
        ProdutoDAO produtoDAO = new ProdutoDAO();

        try {
            Produto produto = produtoDAO.buscarProdutoPorId(id); // Busca o produto pelo ID
            if (produto != null) {
                // Estoquista pode editar apenas a quantidade em estoque
                Scanner sc = new Scanner(System.in);

                System.out.println("Editar quantidade em estoque do produto: " + produto.getNome());

                System.out.println("Nova quantidade em estoque: ");
                produto.setQtdEstoque(sc.nextInt());

                // Agora, atualiza apenas a quantidade no banco de dados
                String resultado = produtoDAO.atualizarProduto(produto);
                System.out.println(resultado);
            } else {
                System.out.println("Produto não encontrado.");
            }
        } catch (SQLException e) {
            System.out.println("Erro ao buscar ou atualizar produto: " + e.getMessage());
        }

        listarProdutos(); 
    }

    private static void incluirImagem(int produtoId) throws SQLException {
        Scanner sc = new Scanner(System.in);
        ProdutoDAO produtoDAO = new ProdutoDAO();
        boolean continuar = true;
    
        while (continuar) {
            System.out.println("Incluir imagem do produto");
            System.out.println("Nome do arquivo => ");
            String nomeArquivo = sc.nextLine();
            System.out.println("Diretório de origem => ");
            String diretorioOrigem = sc.nextLine();
            System.out.println("É a imagem principal? (Y/N) => ");
            String imagemPrincipal = sc.nextLine();
    
            boolean principal = "Y".equalsIgnoreCase(imagemPrincipal);
    
            if (principal) {
                produtoDAO.atualizarImagemPrincipal(produtoId, 0, diretorioOrigem);
            }
    
            produtoDAO.cadastrarImagemProduto(produtoId, nomeArquivo, diretorioOrigem, principal);
    
            System.out.println("Salvar e incluir mais uma imagem (1), Salvar e finalizar (2), Não salvar e finalizar (3) => ");
            int opcao = sc.nextInt();
            sc.nextLine(); 
    
            switch (opcao) {
                case 1:
                    break;
                case 2:
                    salvarImagens(produtoId, nomeArquivo, diretorioOrigem);
                    listarProdutos();
                    continuar = false;
                    break;
                case 3:
                    listarProdutos();
                    continuar = false;
                    break;
                default:
                    System.out.println("Opção inválida!");
            }
        }
    }

    private static void alterarImagem(int produtoId) throws SQLException {
        Scanner sc = new Scanner(System.in);
        ProdutoDAO produtoDAO = new ProdutoDAO();
        List<ImagemProduto> imagens = produtoDAO.listarImagensProduto(produtoId);

        System.out.println("Imagens do Produto:");
        for (ImagemProduto img : imagens) {
            System.out.println(img.getId() + " | " + img.getNomeArquivo() + " | Principal: " + (img.isPrincipal() ? "Sim" : "Não"));
        }

        System.out.println("Digite o ID da imagem para alterar ou 0 para voltar:");
        int imagemId = sc.nextInt();
        sc.nextLine();

        if (imagemId == 0) return;

        System.out.println("Novo nome do arquivo => ");
        String novoNome = sc.nextLine();
        System.out.println("Novo diretório de origem => ");
        String novoDiretorio = sc.nextLine();
        System.out.println("Definir como principal? (Y/N) => ");
        boolean principal = sc.nextLine().equalsIgnoreCase("Y");

        boolean sucesso = produtoDAO.alterarImagemProduto(imagemId, novoNome, novoDiretorio, principal);
        if (sucesso) {
            System.out.println("Imagem atualizada com sucesso!");
            salvarImagens(imagemId, novoNome, novoDiretorio);
        } else {
            System.out.println("Erro ao atualizar a imagem.");
        }
    }

    private static boolean salvarImagens(int produtoId, String nomeArquivo, String diretorioOrigem) {
        if (produtoId <= 0) {
            System.err.println("Erro: ID do produto inválido.");
            return false;
        }

        String diretorioDestino = diretorioOrigem + File.separator + nomeArquivo;
        File diretorio = new File(diretorioDestino);

        try {
            if (!diretorio.exists() && diretorio.mkdirs()) {
                System.out.println("Imagens salvas com sucesso no diretório: " + diretorioDestino);
                return true;
            } else if (diretorio.exists()) {
                System.out.println("O diretório já existe: " + diretorioDestino);
                return true;
            } else {
                System.err.println("Erro ao criar o diretório: " + diretorioDestino);
            }
        } catch (SecurityException e) {
            System.err.println("Erro de permissão ao criar o diretório: " + e.getMessage());
        }

        return false;
    }

}
