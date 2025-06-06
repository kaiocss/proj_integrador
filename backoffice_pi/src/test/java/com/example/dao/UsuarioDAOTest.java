package com.example.dao;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UsuarioDAOTest {

    private UsuarioDAO usuarioDAO;

    @BeforeEach
    public void setup() {
        usuarioDAO = new UsuarioDAO();
    }

    @Test
    public void testEncriptarSenhaDeterministico() throws Exception {
        String senha = "minhaSenha";
        String hash1 = usuarioDAO.encriptarSenha(senha);
        String hash2 = usuarioDAO.encriptarSenha(senha);
        assertEquals(hash1, hash2, "Hash deve ser determinístico para a mesma entrada");
        assertNotEquals(senha, hash1, "Hash não pode ser igual à senha original");
    }
}
