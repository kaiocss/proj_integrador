package com.example.dao;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.classes.SessionManager;
import com.example.models.Usuario;

public class UsuarioDAOTest {

    private UsuarioDAO usuarioDAO;

    /**
     * 
     */
    @BeforeEach
    public void setup() {
        usuarioDAO = new UsuarioDAO();
    }

    @Test
    public void testLoginValido() {
        // Substitua com dados que EXISTEM no seu banco de dados
        String email = "admin@teste.com";
        String senha = "admin123";

        Usuario usuario = usuarioDAO.validarLogin(email, senha);
        assertNotNull(usuario, "Usuário deveria ser válido");
        assertEquals(email, usuario.getEmail());
    }

    @Test
    public void testLoginInvalidoSenhaErrada() {
        String email = "admin@teste.com";
        String senhaErrada = "senhaErrada";

        Usuario usuario = usuarioDAO.validarLogin(email, senhaErrada);
        assertNull(usuario, "Usuário não deveria ser autenticado com senha incorreta");
    }

    @Test
    public void testLoginInvalidoUsuarioInexistente() {
        String email = "naoexiste@teste.com";
        String senha = "qualquercoisa";

        Usuario usuario = usuarioDAO.validarLogin(email, senha);
        assertNull(usuario, "Usuário inexistente não deve passar");
    }

    @Test
    public void testListarUsuarios() {
        List<Usuario> usuarios = UsuarioDAO.listarUsuarios();
        assertNotNull(usuarios, "Lista de usuários não pode ser nula");
        assertTrue(usuarios.size() > 0, "Lista deve conter ao menos um usuário");
    }

    @Test
    public void testSessionManagerSetAndGet() {
        Usuario usuario = new Usuario("teste@exemplo.com", "adm", "ativado", "João", "00000000000", "senha123");
        SessionManager.setUsuarioLogado(usuario);

        Usuario usuarioRecuperado = SessionManager.getUsuarioLogado();
        assertNotNull(usuarioRecuperado);
        assertEquals("teste@exemplo.com", usuarioRecuperado.getEmail());
    }
}
