package com.example.ecommerce.services;

import com.example.ecommerce.model.Status;
import com.example.ecommerce.model.TipoUser;
import com.example.ecommerce.model.Usuario;
import com.example.ecommerce.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario cadastrar(Usuario usuario) throws Exception {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new Exception("Email já cadastrado.");
        }

        if (usuarioRepository.existsByCpf(usuario.getCpf())) {
            throw new Exception("CPF já cadastrado.");
        }

        usuario.setSenha(criptografarSenha(usuario.getSenha()));
        usuario.setTipo(TipoUser.cliente);
        usuario.setStatus(Status.ativado);

        return usuarioRepository.save(usuario);
    }

    private String criptografarSenha(String senha) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(senha.getBytes());
        StringBuilder hexString = new StringBuilder();

        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }

        return hexString.toString();
    }
}
