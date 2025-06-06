Funcionalidade: Testar funcionalidades do Menu

  Cenario: Criptografar senha retorna hash deterministico
    Dado uma senha "senhaSegura"
    Quando eu criptografo a senha duas vezes
    Entao o hash gerado deve ser igual para ambas as execucoes
    E o hash deve ser diferente da senha original

  Esquema do Cenario: Validar CPF
    Dado um CPF "<cpf>"
    Quando eu valido o CPF
    Entao o resultado deve ser <resultado>
    Exemplos:
      | cpf         | resultado |
      | 52998224725 | true      |
      | 12345678901 | false     |

  Cenario: Habilitar usuario
    Dado um usuario com status "desativado"
    Quando eu confirmo a alteracao de status
    E eu habilito ou desabilito o usuario
    Entao o status do usuario deve ser "ativado"
