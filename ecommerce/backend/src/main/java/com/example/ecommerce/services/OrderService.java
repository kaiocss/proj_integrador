package com.example.ecommerce.services;

import com.example.ecommerce.model.Pedido;
import com.example.ecommerce.model.Produto;
import com.example.ecommerce.model.OrderSummaryDTO;
import com.example.ecommerce.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public OrderSummaryDTO getOrderSummary(Long orderId) {
        // Busca o pedido no banco de dados pelo ID
        Optional<Pedido> pedidoOptional = pedidoRepository.findById(orderId);

        if (pedidoOptional.isPresent()) {
            Pedido pedido = pedidoOptional.get();

            // Converter Pedido para OrderSummaryDTO
            OrderSummaryDTO summaryDTO = new OrderSummaryDTO();
            summaryDTO.setProdutos(pedido.getProdutos().stream().map(produto -> {
                OrderSummaryDTO.ProdutoDTO produtoDTO = new OrderSummaryDTO.ProdutoDTO();
                produtoDTO.setNome(produto.getNome());
                produtoDTO.setPrecoUnitario(produto.getValorProduto().doubleValue()); // Converte BigDecimal para double
                produtoDTO.setQuantidade(produto.getQtdEstoque());
                produtoDTO.setTotal(produto.getValorProduto().doubleValue() * produto.getQtdEstoque());
                return produtoDTO;
            }).collect(Collectors.toList()));
            summaryDTO.setEnderecoEntrega(pedido.getEnderecoEntrega());
            summaryDTO.setFormaPagamento(pedido.getFormaPagamento());
            summaryDTO.setFrete(pedido.getFrete());
            summaryDTO.setTotalGeral(pedido.getTotalGeral());

            return summaryDTO;
        } else {
            throw new RuntimeException("Pedido não encontrado para o ID: " + orderId);
        }
    }

    public Pedido finalizeOrder(Pedido pedido) {
        // Configurar o status 
        pedido.setStatus("aguardando pagamento");
        pedido.setDataHora(LocalDateTime.now());

        // Gerar um número sequencial para o pedido
        pedido.setNumeroPedido("PED-" + System.currentTimeMillis());

        return pedidoRepository.save(pedido);
    }
}
