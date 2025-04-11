// Seleciona o botão e a barra de menu
const menuToggle = document.getElementById("menu-toggle");
const menuBar = document.getElementById("menu-bar");

// Adiciona um evento de clique para mostrar/ocultar o menu
menuToggle.addEventListener("click", () => {
    menuBar.classList.toggle("show"); // Adiciona ou remove a classe "show"
});