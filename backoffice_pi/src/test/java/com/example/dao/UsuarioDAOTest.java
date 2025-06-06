package com.example.dao;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.classes.SessionManager;
import com.example.models.Usuario;

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

     @Test
    public void testLoginValido() {
        String email = "teste@teste.com";
        String senha = "senha123";
        Usuario usuario = usuarioDAO.validarLogin(email, senha);
        assertNotNull(usuario, "Usuário deveria ser válido");
        assertEquals(email, usuario.getEmail());
    }

    @Test
    public void testLoginInvalidoSenhaErrada() {
        String email = "teste@teste.com";
        String senhaErrada = "senhaErrada";
        Usuario usuario = usuarioDAO.validarLogin(email, senhaErrada);
        assertNull(usuario, "Usuário não deveria ser autenticado com senha incorreta");
    }

    @Test
    public void testLoginInvalidoUsuarioInexistente() {
        String email = "naoexiste@teste.com";
        String senha = "senha123";
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
