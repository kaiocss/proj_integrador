package com.example.ecommerce.services;

import com.example.ecommerce.model.Pedido;
import com.example.ecommerce.model.Produto;
import com.example.ecommerce.model.ItemPedido;
import com.example.ecommerce.model.OrderSummaryDTO;
import com.example.ecommerce.repository.PedidoRepository;
import com.example.ecommerce.repository.ProdutoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private PedidoRepository pedidoRepository;

     @Autowired
    private ProdutoRepository produtoRepository;

    public OrderSummaryDTO getOrderSummary(Long orderId) {
        
        Optional<Pedido> pedidoOptional = pedidoRepository.findById(orderId);

        if (pedidoOptional.isPresent()) {
            Pedido pedido = pedidoOptional.get();

            OrderSummaryDTO summaryDTO = new OrderSummaryDTO();
            summaryDTO.setProdutos(pedido.getItens().stream().map(itemPedido -> {
                OrderSummaryDTO.ProdutoDTO produtoDTO = new OrderSummaryDTO.ProdutoDTO();
                produtoDTO.setNome(itemPedido.getProduto().getNome());  
                produtoDTO.setPrecoUnitario(itemPedido.getPrecoUnitario().doubleValue()); 
                produtoDTO.setTotal(itemPedido.getPrecoUnitario().doubleValue() * itemPedido.getQuantidade());  
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
        pedido.setStatus("aguardando pagamento");
        pedido.setDataHora(LocalDateTime.now());
        pedido.setNumeroPedido("PED-" + System.currentTimeMillis());

         if (pedido.getPagamento() == null) {
          throw new IllegalArgumentException("Pagamento não pode ser nulo.");
         }
        
        double total = 0.0;

        if (pedido.getItens() != null) {
            for (ItemPedido item : pedido.getItens()) {
                Integer produtoId = item.getProduto().getCodigo(); 
                Produto produto = produtoRepository.findById(produtoId)
                        .orElseThrow(() -> new IllegalArgumentException("Produto com código " + produtoId + " não encontrado."));

                item.setProduto(produto);
                item.setPedido(pedido);

                if (item.getPrecoUnitario() == null) {
                    item.setPrecoUnitario(produto.getValorProduto()); 
                }

                total += item.getPrecoUnitario().doubleValue() * item.getQuantidade();
            }
        }

        pedido.setTotalGeral(total + pedido.getFrete());

        return pedidoRepository.save(pedido);
    }
}

