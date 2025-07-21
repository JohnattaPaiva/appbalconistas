// Função para editar produto da tabela - VERSÃO CORRIGIDA
function editarProdutoTabela(produtoId) {
  console.log('=== INICIANDO EDIÇÃO DO PRODUTO ===');
  console.log('ID do produto:', produtoId);
  
  try {
    // Verificar se o produto existe
    const produtos = obterProdutos();
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!produto) {
      console.error('Produto não encontrado:', produtoId);
      toastErro('Erro', 'Produto não encontrado!');
      return;
    }
    
    console.log('Produto encontrado:', produto);
    
    // Mostrar a seção de produtos
    mostrarSecao('produtos');
    
    // Aguardar um pouco para garantir que a seção foi carregada
    setTimeout(() => {
      // Clicar no botão "Cadastrar Produto" para abrir o formulário
      const botaoCadastrar = document.getElementById('btn-cadastrar-produto');
      if (botaoCadastrar) {
        botaoCadastrar.click();
      }
      
      // Aguardar o formulário abrir
      setTimeout(() => {
        // Verificar se os elementos existem
        const listaElement = document.getElementById('produtos-lista-principal');
        const formElement = document.getElementById('produtos-form-section');
        
        if (!listaElement || !formElement) {
          console.error('Elementos não encontrados');
          toastErro('Erro', 'Erro na interface!');
          return;
        }
        
        // Garantir que o formulário esteja visível
        listaElement.style.display = 'none';
        formElement.style.display = 'block';
        
        // Preencher campos básicos
        const nomeInput = document.getElementById('produto-nome');
        const pontosInput = document.getElementById('produto-pontos');
        const categoriaSelect = document.getElementById('produto-categoria');
        const ativoSelect = document.getElementById('produto-ativo');
        
        if (nomeInput) nomeInput.value = produto.nome || '';
        if (pontosInput) pontosInput.value = produto.pontos || '';
        if (categoriaSelect) categoriaSelect.value = produto.categoria || '';
        if (ativoSelect) ativoSelect.value = produto.ativo ? 'true' : 'false';
        
        // Configurar título do formulário
        const titleElement = document.getElementById('form-title');
        if (titleElement) titleElement.textContent = '✏️ Editar Produto';
        
        // Configurar botão de submit
        const submitButton = document.getElementById('btn-submit-produto');
        if (submitButton) {
          submitButton.textContent = '💾 Salvar Alterações';
          submitButton.className = 'btn-warning';
        }
        
        // Configurar o formulário para edição
        const form = document.getElementById('form-produto');
        if (form) {
          form.onsubmit = function(event) {
            event.preventDefault();
            salvarEdicaoProduto(produtoId);
          };
        }
        
        // Processar cores do produto
        if (produto.cores && produto.cores.length > 0) {
          document.querySelectorAll('input[name="cores"]').forEach(checkbox => {
            checkbox.checked = false;
          });
          
          const coresSelecionadasIds = [];
          if (typeof produto.cores[0] === 'string') {
            coresSelecionadasIds.push(...produto.cores);
          } else {
            coresSelecionadasIds.push(...produto.cores.map(cor => cor.id || cor.nome));
          }
          
          document.querySelectorAll('input[name="cores"]').forEach(checkbox => {
            if (coresSelecionadasIds.includes(checkbox.value)) {
              checkbox.checked = true;
            }
          });
        }
        
        // Processar tamanhos do produto
        if (produto.tamanhos && produto.tamanhos.length > 0) {
          document.querySelectorAll('input[name="tamanhos"]').forEach(checkbox => {
            checkbox.checked = false;
          });
          
          document.querySelectorAll('input[name="tamanhos"]').forEach(checkbox => {
            if (produto.tamanhos.includes(checkbox.value)) {
              checkbox.checked = true;
            }
          });
        }
        
        // Marcar que estamos editando
        window.produtoEditando = produtoId;
        
        console.log('=== EDIÇÃO CONFIGURADA COM SUCESSO ===');
        toastSucesso('Edição', 'Produto carregado para edição!');
        
      }, 200);
    }, 100);
    
  } catch (error) {
    console.error('=== ERRO NA EDIÇÃO ===', error);
    toastErro('Erro', 'Erro ao carregar produto: ' + error.message);
  }
}
