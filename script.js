// Sistema de Notificações Toast
let navegacaoAtiva = false; // Controla se há navegação em andamento

// Sistema de Carrinho
let carrinho = [];
let carrinhoId = 0;

function mostrarToast(titulo, mensagem, tipo = 'info') {
  const container = document.getElementById('toast-container');
  
  // Cria o elemento toast
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  
  // Define ícones para cada tipo
  const icones = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <div class="toast-icon">${icones[tipo] || icones.info}</div>
    <div class="toast-content">
      <div class="toast-title">${titulo}</div>
      <div class="toast-message">${mensagem}</div>
    </div>
    <button class="toast-close" onclick="fecharToast(this)">×</button>
  `;
  
  // Adiciona ao container
  container.appendChild(toast);
  
  // Anima a entrada
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Remove automaticamente após 5 segundos
  setTimeout(() => {
    fecharToast(toast.querySelector('.toast-close'));
  }, 5000);
}

function fecharToast(botao) {
  const toast = botao.closest('.toast');
  toast.classList.remove('show');
  
  setTimeout(() => {
    toast.remove();
  }, 300);
}

// Funções de conveniência
function toastSucesso(titulo, mensagem) {
  mostrarToast(titulo, mensagem, 'success');
}

function toastErro(titulo, mensagem) {
  mostrarToast(titulo, mensagem, 'error');
}

function toastAviso(titulo, mensagem) {
  mostrarToast(titulo, mensagem, 'warning');
}

function toastInfo(titulo, mensagem) {
  mostrarToast(titulo, mensagem, 'info');
}

// Funções do Sistema de Carrinho
function adicionarAoCarrinho(tipoProduto) {
  let produto, cor, tamanho, imagem;
  
  if (tipoProduto === 'tshirt') {
    if (!corSelecionadaProduto) {
      toastAviso("Selecione uma Cor", "Por favor, selecione uma cor antes de adicionar ao carrinho.");
      return;
    }
    produto = CONFIG_PREMIOS.produtos.tshirt;
    cor = corSelecionadaProduto;
    tamanho = document.getElementById("tamanho-produto").value;
    imagem = produto.imagens[cor];
  } else if (tipoProduto === 'pantalona') {
    if (!corSelecionadaPantalona) {
      toastAviso("Selecione uma Cor", "Por favor, selecione uma cor antes de adicionar ao carrinho.");
      return;
    }
    produto = CONFIG_PREMIOS.produtos.pantalona;
    cor = corSelecionadaPantalona;
    tamanho = document.getElementById("tamanho-pantalona").value;
    imagem = produto.imagens[cor];
  }
  
  const itemCarrinho = {
    id: ++carrinhoId,
    tipo: tipoProduto,
    nome: produto.nome,
    cor: cor,
    tamanho: tamanho,
    pontos: produto.pontos,
    imagem: imagem
  };
  
  carrinho.push(itemCarrinho);
  atualizarCarrinho();
  toastSucesso("Produto Adicionado!", `${produto.nome} foi adicionado ao carrinho.`);
  
  // Salvar carrinho no localStorage
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function removerDoCarrinho(itemId) {
  carrinho = carrinho.filter(item => item.id !== itemId);
  atualizarCarrinho();
  toastInfo("Item Removido", "O item foi removido do carrinho.");
  
  // Salvar carrinho no localStorage
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function limparCarrinho() {
  if (carrinho.length === 0) {
    toastInfo("Carrinho Vazio", "Não há itens no carrinho para remover.");
    return;
  }
  
  carrinho = [];
  atualizarCarrinho();
  toastInfo("Carrinho Limpo", "Todos os itens foram removidos do carrinho.");
  
  // Salvar carrinho no localStorage
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarCarrinho() {
  // Atualizar contador no menu
  const contador = document.getElementById('carrinho-contador');
  if (contador) {
    contador.textContent = carrinho.length;
    
    // Mostrar/ocultar badge do contador
    if (carrinho.length > 0) {
      contador.style.display = 'flex';
    } else {
      contador.style.display = 'none';
    }
  }
  
  // Atualizar lista do carrinho
  const lista = document.getElementById('carrinho-lista');
  const empty = document.getElementById('carrinho-empty');
  const footer = document.getElementById('carrinho-footer');
  
  if (!lista || !empty || !footer) {
    // Se não estivermos na página do carrinho, apenas atualizar o contador
    return;
  }
  
  if (carrinho.length === 0) {
    lista.innerHTML = '';
    empty.style.display = 'block';
    footer.style.display = 'none';
  } else {
    empty.style.display = 'none';
    footer.style.display = 'block';
    
    lista.innerHTML = carrinho.map(item => `
      <div class="carrinho-item">
        <img src="${item.imagem}" alt="${item.nome}" class="carrinho-item-img">
        <div class="carrinho-item-info">
          <div class="carrinho-item-nome">${item.nome}</div>
          <div class="carrinho-item-detalhes">
            <span>Cor: ${item.cor}</span>
            <span>Tamanho: ${item.tamanho}</span>
          </div>
        </div>
        <div class="carrinho-item-actions">
          <div class="carrinho-item-pontos">${item.pontos} pontos</div>
          <button onclick="removerDoCarrinho(${item.id})" class="btn-remover-item">
            🗑️ Remover
          </button>
        </div>
      </div>
    `).join('');
  }
  
  // Atualizar resumo
  const totalItems = carrinho.length;
  const totalPontos = carrinho.reduce((total, item) => total + item.pontos, 0);
  const pontosUsuario = obterPontosUsuario();
  
  const totalItemsEl = document.getElementById('carrinho-total-items');
  const totalPontosEl = document.getElementById('carrinho-total-pontos');
  const resumoItemsEl = document.getElementById('resumo-items');
  const resumoPontosEl = document.getElementById('resumo-pontos');
  const resumoPontosUsuarioEl = document.getElementById('resumo-pontos-usuario');
  
  if (totalItemsEl) totalItemsEl.textContent = totalItems;
  if (totalPontosEl) totalPontosEl.textContent = totalPontos;
  if (resumoItemsEl) resumoItemsEl.textContent = totalItems;
  if (resumoPontosEl) resumoPontosEl.textContent = totalPontos;
  if (resumoPontosUsuarioEl) resumoPontosUsuarioEl.textContent = pontosUsuario;
  
  // Habilitar/desabilitar botão finalizar
  const btnFinalizar = document.getElementById('btn-finalizar-compra');
  if (btnFinalizar) {
    if (totalPontos > pontosUsuario) {
      btnFinalizar.disabled = true;
      btnFinalizar.textContent = '❌ Pontos Insuficientes';
    } else {
      btnFinalizar.disabled = false;
      btnFinalizar.textContent = '🎁 Finalizar Resgate';
    }
  }
}

function obterPontosUsuario() {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (!usuarioLogado) return 0;
  
  const userData = JSON.parse(localStorage.getItem(`usuario_${usuarioLogado}_data`));
  return userData ? (userData.pontos || 0) : 0;
}

function obterRegistrosUsuario(usuario) {
  if (!usuario) return 0;
  
  const userData = JSON.parse(localStorage.getItem(`usuario_${usuario}_data`));
  return userData ? (userData.registros || 0) : 0;
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    toastAviso("Carrinho Vazio", "Adicione itens ao carrinho antes de finalizar.");
    return;
  }
  
  const totalPontos = carrinho.reduce((total, item) => total + item.pontos, 0);
  const pontosUsuario = obterPontosUsuario();
  
  if (totalPontos > pontosUsuario) {
    toastErro("Pontos Insuficientes", "Você não tem pontos suficientes para este resgate.");
    return;
  }
  
  // Processar resgate
  const itensResgatados = carrinho.map(item => 
    `${item.nome} (${item.cor}, ${item.tamanho})`
  ).join(', ');
  
  // Deduzir pontos
  incrementarEstatisticaPerfil('pontos', -totalPontos);
  incrementarEstatisticaPerfil('resgates', carrinho.length);
  
  // Limpar carrinho
  carrinho = [];
  atualizarCarrinho();
  localStorage.removeItem('carrinho');
  
  toastSucesso("Resgate Realizado!", `Parabéns! Você resgatou: ${itensResgatados}`);
  
  // Voltar para a seção de prêmios
  setTimeout(() => {
    mostrarSecaoInteligente('premios');
  }, 2000);
}

function carregarCarrinho() {
  const carrinhoSalvo = localStorage.getItem('carrinho');
  if (carrinhoSalvo) {
    carrinho = JSON.parse(carrinhoSalvo);
    // Restaurar o ID do carrinho
    carrinhoId = carrinho.length > 0 ? Math.max(...carrinho.map(item => item.id)) : 0;
  }
  // Sempre atualizar o carrinho para garantir que o contador seja exibido
  atualizarCarrinho();
}

// Variáveis globais - usando configurações do config.js
const banners = CONFIG_BANNER.imagens;
let bannerAtual = 0;
let corSelecionadaProduto = "";
let corSelecionadaPantalona = "";

// Funções de navegação e interface
function validarLogin() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  // Verifica se existe um usuário válido na lista
  const usuarioValido = CONFIG_LOGIN.usuarios.find(user => 
    user.usuario === usuario && user.senha === senha
  );

  if (usuarioValido) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("conteudo-principal").style.display = "block";
    document.body.classList.add("sem-fundo");

    // Exibe o nome do usuário na interface
    document.getElementById("usuario-nome").textContent = `👤 ${usuarioValido.nome}`;

    // Verificar se é admin e mostrar botão admin
    if (usuarioValido.isAdmin) {
      document.getElementById("btn-admin").style.display = "block";
    }

    // Inicializar perfil do usuário
    carregarPerfilDoStorage();
    inicializarPerfil(usuario);

    mostrarSecao('home'); // Exibe a home ao logar
    
    // Toast de boas-vindas
    toastSucesso("Bem-vindo!", `Olá ${usuarioValido.nome}, login realizado com sucesso!`);

    // Atualizar contadores na interface
    atualizarContadoresInterface();
  } else {
    toastErro("Erro de Login", "Usuário ou senha incorretos. Tente novamente.");
  }
}

// Função para validar login com Enter
function adicionarEventoEnterLogin() {
  const campoUsuario = document.getElementById("usuario");
  const campoSenha = document.getElementById("senha");
  
  // Adiciona evento de Enter para o campo usuário
  if (campoUsuario) {
    campoUsuario.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        validarLogin();
      }
    });
    
    // Foco automático no campo usuário
    campoUsuario.focus();
  }
  
  // Adiciona evento de Enter para o campo senha
  if (campoSenha) {
    campoSenha.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        validarLogin();
      }
    });
  }
}

function mostrarSecao(secao) {
  // Evita múltiplas navegações simultâneas
  if (navegacaoAtiva) return;
  navegacaoAtiva = true;

  const secaoHome = document.getElementById("secao-home");
  const secaoRegistro = document.getElementById("secao-registro");
  const secaoPremios = document.getElementById("secao-premios");
  const secaoContato = document.getElementById("secao-contato");
  const secaoDashboard = document.getElementById("secao-dashboard");
  const cardsSection = document.getElementById("cards-section");

  // Scroll suave para o topo da página
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Delay pequeno para garantir que o scroll aconteça primeiro
  setTimeout(() => {
    // Esconde todas as seções
    secaoHome.style.display = "none";
    secaoRegistro.style.display = "none";
    secaoPremios.style.display = "none";
    secaoContato.style.display = "none";
    secaoDashboard.style.display = "none";
    cardsSection.style.display = "none";

    // Esconder seção perfil se existir
    const secaoPerfil = document.getElementById("secao-perfil");
    if (secaoPerfil) {
      secaoPerfil.style.display = "none";
      secaoPerfil.classList.remove("fade-in-up");
    }

    // Esconder seção admin se existir
    const secaoAdmin = document.getElementById("secao-admin");
    if (secaoAdmin) {
      secaoAdmin.style.display = "none";
      secaoAdmin.classList.remove("fade-in-up");
    }

    // Esconder seção carrinho se existir
    const secaoCarrinho = document.getElementById("secao-carrinho");
    if (secaoCarrinho) {
      secaoCarrinho.style.display = "none";
      secaoCarrinho.classList.remove("fade-in-up");
    }

    // Remove animação antes de trocar de seção
    secaoHome.classList.remove("fade-in-up");
    secaoRegistro.classList.remove("fade-in-up");
    secaoPremios.classList.remove("fade-in-up");
    secaoContato.classList.remove("fade-in-up");
    secaoDashboard.classList.remove("fade-in-up");
    cardsSection.classList.remove("fade-in-up");
  }, 100);

  // Para a rotação automática quando sair da home
  if (secao !== 'home') {
    pararRotacaoAutomatica();
  }

  // Delay para exibir seção após scroll
  setTimeout(() => {
    if (secao === 'home') {
      secaoHome.style.display = "block";
      void secaoHome.offsetWidth;
      secaoHome.classList.add("fade-in-up");
      // Inicializa os botões do banner e rotação automática
      setTimeout(() => {
        inicializarBanner();
        atualizarIndicadores(); // Atualiza indicadores quando mostrar a home
      }, 100);
    } else if (secao === 'registro') {
      console.log("🎯 Mostrando seção de registro...");
      secaoRegistro.style.display = "block";
      cardsSection.style.display = "flex";
      void secaoRegistro.offsetWidth;
      secaoRegistro.classList.add("fade-in-up");
      void cardsSection.offsetWidth;
      cardsSection.classList.add("fade-in-up");
      // Inicializar select de referências
      console.log("🔧 Chamando inicializarSelectReferencias...");
      inicializarSelectReferencias();
      // Atualizar pontos e registros
      const usuarioAtual = localStorage.getItem('usuarioLogado');
      const userData = JSON.parse(localStorage.getItem(`usuario_${usuarioAtual}_data`)) || {};
      const registrosUsuario = userData.registros || 0;
      const pontosUsuario = userData.pontos || 0;
      contarAnimado("pontos", pontosUsuario);
      contarAnimado("registros", registrosUsuario);
    } else if (secao === 'premios') {
      secaoPremios.style.display = "block";
      cardsSection.style.display = "flex";
      
      // Carregar produtos dinâmicos na vitrine
      carregarProdutosNaVitrine();
      
      // Manter funcionalidade antiga para compatibilidade
      selecionarCorProduto("Anís");
      selecionarCorPantalona("Preto");
      
      void secaoPremios.offsetWidth;
      secaoPremios.classList.add("fade-in-up");
      void cardsSection.offsetWidth;
      cardsSection.classList.add("fade-in-up");
      // Atualizar pontos e registros
      const usuarioAtual = localStorage.getItem('usuarioLogado');
      const userData = JSON.parse(localStorage.getItem(`usuario_${usuarioAtual}_data`)) || {};
      const registrosUsuario = userData.registros || 0;
      const pontosUsuario = userData.pontos || 0;
      contarAnimado("pontos", pontosUsuario);
      contarAnimado("registros", registrosUsuario);
    } else if (secao === 'dashboard') {
      secaoDashboard.style.display = "block";
      void secaoDashboard.offsetWidth;
      secaoDashboard.classList.add("fade-in-up");
      // Carrega dados do dashboard
      setTimeout(carregarDashboard, 300);
    } else if (secao === 'contato') {
      secaoContato.style.display = "block";
      void secaoContato.offsetWidth;
      secaoContato.classList.add("fade-in-up");
    } else if (secao === 'perfil') {
      const secaoPerfil = document.getElementById("secao-perfil");
      if (secaoPerfil) {
        secaoPerfil.style.display = "block";
        void secaoPerfil.offsetWidth;
        secaoPerfil.classList.add("fade-in-up");
        // Atualizar dados do perfil
        atualizarInterfacePerfil();
      }
    } else if (secao === 'admin') {
      const secaoAdmin = document.getElementById("secao-admin");
      if (secaoAdmin) {
        secaoAdmin.style.display = "block";
        void secaoAdmin.offsetWidth;
        secaoAdmin.classList.add("fade-in-up");
        // Carregar dados do admin
        carregarUsuariosSalvos();
        carregarListaUsuarios();
      }
    } else if (secao === 'carrinho') {
      const secaoCarrinho = document.getElementById("secao-carrinho");
      if (secaoCarrinho) {
        secaoCarrinho.style.display = "block";
        void secaoCarrinho.offsetWidth;
        secaoCarrinho.classList.add("fade-in-up");
        // Atualizar dados do carrinho
        atualizarCarrinho();
      }
    }
  }, 200); // Delay após scroll
  
  // Libera a navegação após completar
  setTimeout(() => {
    navegacaoAtiva = false;
  }, 400);
}

function sairPortal() {
  if (confirm("Tem certeza que deseja sair do portal?")) {
    // Fecha o menu mobile se estiver aberto
    closeMobileMenu();
    
    // Esconde o conteúdo principal
    document.getElementById("conteudo-principal").style.display = "none";
    // Exibe a tela de login
    document.getElementById("login-container").style.display = "block";
    // Remove a classe sem-fundo para mostrar o background novamente
    document.body.classList.remove("sem-fundo");
    
    // Limpa os campos de login
    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "";
    
    // Reseta para a home quando logar novamente
    document.getElementById("secao-home").style.display = "none";
    document.getElementById("secao-registro").style.display = "none";
    document.getElementById("secao-premios").style.display = "none";
    document.getElementById("secao-contato").style.display = "none";
    document.getElementById("secao-dashboard").style.display = "none";
    document.getElementById("cards-section").style.display = "none";
    
    // Esconder seção perfil se existir
    const secaoPerfil = document.getElementById("secao-perfil");
    if (secaoPerfil) {
      secaoPerfil.style.display = "none";
    }

    // Esconder seção admin se existir
    const secaoAdmin = document.getElementById("secao-admin");
    if (secaoAdmin) {
      secaoAdmin.style.display = "none";
    }

    // Esconder botão admin
    document.getElementById("btn-admin").style.display = "none";
  }
}

// Funções do banner rotativo
let transitioning = false; // Previne múltiplos cliques durante a transição
let autoRotateInterval = null; // Controla o intervalo de rotação automática

// Função para garantir que os botões do banner estejam sempre visíveis
function inicializarBanner() {
  const bannerPrev = document.getElementById("banner-prev");
  const bannerNext = document.getElementById("banner-next");
  
  if (bannerPrev && bannerNext) {
    // Força a visibilidade dos botões
    bannerPrev.style.display = "flex";
    bannerNext.style.display = "flex";
    bannerPrev.style.visibility = "visible";
    bannerNext.style.visibility = "visible";
    bannerPrev.style.opacity = "1";
    bannerNext.style.opacity = "1";
  }
  
  // Inicia a rotação automática
  iniciarRotacaoAutomatica();
}

// Função para iniciar rotação automática
function iniciarRotacaoAutomatica() {
  // Para qualquer rotação anterior
  pararRotacaoAutomatica();
  
  // Inicia nova rotação a cada 5 segundos
  autoRotateInterval = setInterval(() => {
    if (!transitioning) {
      trocarBanner(1, true); // Avança para o próximo banner (automático)
    }
  }, CONFIG_BANNER.intervalo);
}

// Função para parar rotação automática
function pararRotacaoAutomatica() {
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
    autoRotateInterval = null;
  }
}

// Função para pausar temporariamente a rotação (quando usuário interage)
function pausarRotacaoTemporaria() {
  pararRotacaoAutomatica();
  
  // Reinicia após 10 segundos de inatividade
  setTimeout(() => {
    iniciarRotacaoAutomatica();
  }, 10000);
}

function trocarBanner(direcao, automatico = false) {
  if (transitioning) return; // Evita cliques múltiplos
  
  const bannerImg = document.getElementById("banner-img");
  if (!bannerImg) return;

  // Se foi clique manual, pausa rotação temporariamente
  if (!automatico) {
    pausarRotacaoTemporaria();
  }

  transitioning = true;

  // Calcula o novo índice
  const novoIndice = bannerAtual + direcao;
  if (novoIndice < 0) {
    bannerAtual = banners.length - 1;
  } else if (novoIndice >= banners.length) {
    bannerAtual = 0;
  } else {
    bannerAtual = novoIndice;
  }

  // Efeito de transição suave
  bannerImg.style.transition = "opacity 0.3s ease-in-out";
  bannerImg.style.opacity = "0.3";
  
  setTimeout(() => {
    bannerImg.src = banners[bannerAtual];
    bannerImg.alt = `Banner ${bannerAtual + 1}`;
    
    // Restaura a opacidade
    bannerImg.style.opacity = "1";
    
    // Atualizar indicadores
    atualizarIndicadores();
    
    // Libera para próxima transição
    setTimeout(() => {
      transitioning = false;
    }, 100);
  }, 150);
}

// Função para ir diretamente para um banner específico
function irParaBanner(indice) {
  if (transitioning) return; // Evita cliques múltiplos
  if (indice === bannerAtual) return; // Já está no banner selecionado
  
  pausarRotacaoTemporaria();
  
  const bannerImg = document.getElementById("banner-img");
  if (!bannerImg) return;
  
  transitioning = true;
  bannerAtual = indice;
  
  // Efeito de transição suave
  bannerImg.style.transition = "opacity 0.3s ease-in-out";
  bannerImg.style.opacity = "0.3";
  
  setTimeout(() => {
    bannerImg.src = banners[bannerAtual];
    bannerImg.alt = `Banner ${bannerAtual + 1}`;
    
    // Restaura a opacidade
    bannerImg.style.opacity = "1";
    
    // Atualizar indicadores
    atualizarIndicadores();
    
    // Libera para próxima transição
    setTimeout(() => {
      transitioning = false;
    }, 100);
  }, 150);
}

// Função para atualizar os indicadores visuais
function atualizarIndicadores() {
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === bannerAtual);
  });
}

// Funções de animação
function contarAnimado(id, valorFinal, duracao = CONFIG_ANIMACAO.duracaoContador) {
  const elemento = document.getElementById(id);
  let inicio = 0;
  const incremento = valorFinal / (duracao / 30);

  const contador = setInterval(() => {
    inicio += incremento;
    if (inicio >= valorFinal) {
      inicio = valorFinal;
      clearInterval(contador);
    }
    elemento.textContent = Math.floor(inicio);
  }, 30);
}

// Funções de registro de produto
function inicializarSelectReferencias() {
  console.log("🔧 Inicializando select de referências...");
  const selectReferencia = document.getElementById("referencia");
  if (!selectReferencia) {
    console.error("❌ Elemento select 'referencia' não encontrado!");
    return;
  }
  
  if (!CONFIG_PRODUTOS) {
    console.error("❌ CONFIG_PRODUTOS não está definido!");
    return;
  }
  
  console.log("✅ CONFIG_PRODUTOS encontrado:", CONFIG_PRODUTOS);
  
  // Limpa as opções existentes (exceto a primeira)
  selectReferencia.innerHTML = '<option value="">Selecione uma referência...</option>';
  
  // Adiciona cada produto como opção
  CONFIG_PRODUTOS.produtos.forEach((produto, index) => {
    console.log(`📦 Adicionando produto ${index + 1}:`, produto.referencia, produto.nome);
    const option = document.createElement("option");
    option.value = produto.referencia;
    option.textContent = `${produto.referencia} - ${produto.nome}`;
    option.dataset.produto = JSON.stringify(produto);
    selectReferencia.appendChild(option);
  });
  
  console.log("✅ Select de referências inicializado com", CONFIG_PRODUTOS.produtos.length, "produtos");
}

function atualizarDadosProduto() {
  const selectReferencia = document.getElementById("referencia");
  const selectedOption = selectReferencia.options[selectReferencia.selectedIndex];
  
  const campoNome = document.getElementById("nome-produto");
  const campoCodBarras = document.getElementById("cod_barras");
  const campoEstoque = document.getElementById("estoque-atual");
  const campoQuantidade = document.getElementById("quantidade");
  
  if (selectedOption.value === "") {
    // Limpa todos os campos se nenhuma referência for selecionada
    campoNome.value = "";
    campoCodBarras.value = "";
    campoEstoque.value = "";
    campoQuantidade.value = "";
    return;
  }
  
  try {
    const produto = JSON.parse(selectedOption.dataset.produto);
    
    // Preenche os campos automaticamente
    campoNome.value = produto.nome;
    campoCodBarras.value = produto.codigoBarras;
    campoEstoque.value = produto.estoqueAtual;
    
    // Limpa o campo quantidade para nova entrada
    campoQuantidade.value = "";
    campoQuantidade.focus();
    
  } catch (error) {
    console.error("Erro ao processar dados do produto:", error);
    toastErro("Erro", "Erro ao carregar dados do produto selecionado.");
  }
}

function registrarProduto() {
  const referencia = document.getElementById("referencia").value;
  const nomeProduto = document.getElementById("nome-produto").value;
  const codBarras = document.getElementById("cod_barras").value;
  const estoqueAtual = parseInt(document.getElementById("estoque-atual").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  // Validações
  if (!referencia) {
    toastErro("Campo Obrigatório", "Por favor, selecione uma referência.");
    return;
  }
  
  if (!quantidade || quantidade <= 0) {
    toastErro("Quantidade Inválida", "Por favor, informe uma quantidade válida maior que zero.");
    return;
  }
  
  if (quantidade > estoqueAtual) {
    toastErro("Estoque Insuficiente", `Quantidade solicitada (${quantidade}) é maior que o estoque atual (${estoqueAtual}).`);
    return;
  }

  // Simula o registro do produto
  console.log("Produto registrado:", {
    referencia,
    nomeProduto,
    codBarras,
    estoqueAtual,
    quantidadeRegistrada: quantidade
  });
  
  // Atualiza o estoque (simulação)
  const novoEstoque = estoqueAtual - quantidade;
  document.getElementById("estoque-atual").value = novoEstoque;
  
  // Atualiza no CONFIG_PRODUTOS
  const produto = CONFIG_PRODUTOS.produtos.find(p => p.referencia === referencia);
  if (produto) {
    produto.estoqueAtual = novoEstoque;
  }
  
  // Limpa apenas o campo quantidade
  document.getElementById("quantidade").value = "";
  
  // Incrementar estatísticas do perfil
  incrementarEstatisticaPerfil('registros', 1); // Sempre 1 registro, independente da quantidade
  incrementarEstatisticaPerfil('pontos', quantidade * 5); // 5 pontos por produto
  
  // Atualizar contadores na interface imediatamente
  atualizarContadoresInterface();
  
  // Toast de sucesso
  toastSucesso("Produto Registrado!", `${quantidade} unidade(s) de ${nomeProduto} registrada(s). Estoque atual: ${novoEstoque}`);
}

// Função para atualizar contadores na interface
function atualizarContadoresInterface() {
  const usuarioAtual = localStorage.getItem('usuarioLogado');
  
  if (usuarioAtual) {
    const userData = JSON.parse(localStorage.getItem(`usuario_${usuarioAtual}_data`)) || {};
    const registrosUsuario = userData.registros || 0;
    const pontosUsuario = userData.pontos || 0;
    
    // Atualizar contadores com animação
    contarAnimado("registros", registrosUsuario);
    contarAnimado("pontos", pontosUsuario);
  }
}

// Validação em tempo real dos campos
function adicionarValidacaoTempo() {
  // Validação do campo de referência
  const refInput = document.getElementById("referencia");
  if (refInput) {
    refInput.addEventListener("input", function() {
      this.value = this.value.toUpperCase();
    });
  }

  // Validação do campo de código de barras (apenas números)
  const barcodeInput = document.getElementById("cod_barras");
  if (barcodeInput) {
    barcodeInput.addEventListener("input", function() {
      this.value = this.value.replace(/\D/g, '');
    });
  }

  // Validação do campo de quantidade (mínimo 1)
  const quantInput = document.getElementById("quantidade");
  if (quantInput) {
    quantInput.addEventListener("input", function() {
      if (this.value < 1) this.value = 1;
      if (this.value > 999) this.value = 999;
    });
  }
}

// Função para adicionar efeitos visuais nos botões
function adicionarEfeitosVisuais() {
  // Adiciona ripple effect nos botões principais
  document.querySelectorAll('.formulario button, nav button').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Função para mostrar dicas úteis
function mostrarDicasIniciais() {
  setTimeout(() => {
    toastInfo("Dica do Portal", "Vai com DelRio. Vai com Tudo.");
  }, 2000);
}

// Funções dos produtos - Produto 1 (T-shirt)
function selecionarCorProduto(cor) {
  corSelecionadaProduto = cor;
  trocarCorProduto();
  // Destaca o ícone selecionado
  document.querySelectorAll('#cores-produto .cor-icone').forEach(el => el.classList.remove('selected'));
  const idx = { "Anís": 0, "Branca": 1, "Cappuccino": 2 }[cor];
  document.querySelectorAll('#cores-produto .cor-icone')[idx].classList.add('selected');
  // Exibe o nome da cor
  document.getElementById('nome-cor-produto').textContent = cor;
}

function trocarCorProduto() {
  const img = document.getElementById("img-produto");
  const imagens = CONFIG_PREMIOS.produtos.tshirt.imagens;
  if (corSelecionadaProduto && imagens[corSelecionadaProduto]) {
    img.src = imagens[corSelecionadaProduto];
  }
}

function resgatarPremio() {
  const tamanho = document.getElementById("tamanho-produto").value;
  const produto = CONFIG_PREMIOS.produtos.tshirt;
  
  if (!corSelecionadaProduto) {
    toastAviso("Selecione uma Cor", "Por favor, selecione uma cor antes de resgatar o prêmio.");
    return;
  }
  
  // Incrementar estatísticas do perfil
  incrementarEstatisticaPerfil('resgates', 1);
  incrementarEstatisticaPerfil('pontos', -produto.pontos); // Subtrair pontos gastos
  
  toastSucesso("Prêmio Resgatado!", `${produto.nome} - Cor: ${corSelecionadaProduto}, Tamanho: ${tamanho}. Parabéns!`);
}

// Funções dos produtos - Produto 2 (Pantalona)
function selecionarCorPantalona(cor) {
  corSelecionadaPantalona = cor;
  trocarCorPantalona();
  // Destaca o ícone selecionado
  document.querySelectorAll('#cores-pantalona .cor-icone').forEach(el => el.classList.remove('selected'));
  const idx = { "Preto": 0, "Cappuccino": 1, "Verde Militar": 2 }[cor];
  document.querySelectorAll('#cores-pantalona .cor-icone')[idx].classList.add('selected');
  // Exibe o nome da cor
  document.getElementById('nome-cor-pantalona').textContent = cor;
}

function trocarCorPantalona() {
  const img = document.getElementById("img-pantalona");
  const imagens = CONFIG_PREMIOS.produtos.pantalona.imagens;
  if (corSelecionadaPantalona && imagens[corSelecionadaPantalona]) {
    img.src = imagens[corSelecionadaPantalona];
  }
}

function resgatarPantalona() {
  const tamanho = document.getElementById("tamanho-pantalona").value;
  const produto = CONFIG_PREMIOS.produtos.pantalona;
  
  if (!corSelecionadaPantalona) {
    toastAviso("Selecione uma Cor", "Por favor, selecione uma cor antes de resgatar o prêmio.");
    return;
  }
  
  // Incrementar estatísticas do perfil
  incrementarEstatisticaPerfil('resgates', 1);
  incrementarEstatisticaPerfil('pontos', -produto.pontos); // Subtrair pontos gastos
  
  toastSucesso("Prêmio Resgatado!", `${produto.nome} - Cor: ${corSelecionadaPantalona}, Tamanho: ${tamanho}. Parabéns!`);
}

// Funções do formulário de contato
function abrirFormularioContato() {
  document.getElementById("modal-contato").style.display = "flex";
}

function fecharFormularioContato() {
  document.getElementById("modal-contato").style.display = "none";
  // Limpa o formulário
  document.getElementById("form-contato").reset();
}

function abrirWhatsApp() {
  window.open(CONFIG_CONTATO.whatsapp, "_blank");
}

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', function() {
  // Garantir que o botão close esteja oculto no desktop
  const closeMobileBtn = document.getElementById('close-mobile-btn');
  if (closeMobileBtn && window.innerWidth > 768) {
    closeMobileBtn.style.display = 'none';
    closeMobileBtn.style.visibility = 'hidden';
    closeMobileBtn.style.opacity = '0';
    closeMobileBtn.style.pointerEvents = 'none';
  }

  // Carregar carrinho salvo
  carregarCarrinho();

  // Event listener para o formulário de contato
  document.getElementById("form-contato").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const nome = document.getElementById("nome-contato").value;
    const email = document.getElementById("email-contato").value;
    const telefone = document.getElementById("telefone-contato").value;
    const assunto = document.getElementById("assunto-contato").value;
    const mensagem = document.getElementById("mensagem-contato").value;
    
    // Simulação de envio
    console.log("Formulário de contato enviado:", {
      nome, email, telefone, assunto, mensagem
    });
    
    toastSucesso("Mensagem Enviada!", "Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.");
    fecharFormularioContato();
  });
  
  // Adiciona validações em tempo real
  adicionarValidacaoTempo();
  
  // Adiciona efeitos visuais
  adicionarEfeitosVisuais();
  
  // Adiciona evento Enter no login
  adicionarEventoEnterLogin();
  
  // Ajusta interface para dispositivos móveis
  ajustarParaMobile();
  
  // Adiciona suporte a toque para dispositivos móveis
  adicionarSuporteToque();
  
  // Mostra dicas iniciais
  mostrarDicasIniciais();
});

// Função para detectar se é dispositivo móvel
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
}

// Função para ajustar interface para dispositivos móveis
function ajustarParaMobile() {
  if (isMobile()) {
    console.log("📱 Dispositivo móvel detectado - Aplicando otimizações");
    
    // Reduz intervalo de rotação automática dos banners em mobile
    if (CONFIG_BANNER && CONFIG_BANNER.intervaloRotacao) {
      CONFIG_BANNER.intervaloRotacao = 7000; // 7 segundos em vez de 5
    }
    
    // Adiciona classe CSS para mobile
    document.body.classList.add('mobile-device');
    
    // Melhora performance removendo algumas animações em dispositivos lentos
    const isSlowDevice = navigator.hardwareConcurrency <= 2;
    if (isSlowDevice) {
      document.body.classList.add('reduced-animations');
    }
    
    // Ajusta toasts para mobile
    const originalToast = window.toastSucesso;
    window.toastSucesso = function(titulo, mensagem) {
      if (originalToast) {
        // Reduz duração dos toasts em mobile
        return originalToast(titulo, mensagem, 3000);
      }
    };
  }
}

// Função para adicionar suporte a toque em dispositivos móveis
function adicionarSuporteToque() {
  let startX = 0;
  let endX = 0;
  
  const bannerImg = document.getElementById('banner-img');
  if (!bannerImg) return;
  
  // Detecta swipe horizontal no banner
  bannerImg.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  
  bannerImg.addEventListener('touchend', function(e) {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const threshold = 50; // Mínimo de pixels para considerar um swipe
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe para esquerda - próximo banner
        trocarBanner(1);
      } else {
        // Swipe para direita - banner anterior
        trocarBanner(-1);
      }
    }
  }
  
  // Melhora a responsividade dos botões em dispositivos móveis
  const botoesMobile = document.querySelectorAll('nav button, .formulario button, .btn-sair');
  botoesMobile.forEach(botao => {
    // Adiciona feedback visual para toque
    botao.addEventListener('touchstart', function() {
      this.style.opacity = '0.7';
    }, { passive: true });
    
    botao.addEventListener('touchend', function() {
      this.style.opacity = '1';
    }, { passive: true });
    
    // Remove delay de 300ms no clique em iOS
    botao.style.touchAction = 'manipulation';
  });
  
  console.log("✅ Suporte a toque para dispositivos móveis adicionado");
}

// Dados mockados para demonstração
const DADOS_MOCK = {
  vendas: {
    hoje: 15,
    semana: [12, 8, 15, 20, 18, 25, 15],
    faturamento: 8500.00,
    metaProgresso: 78
  },
  produtos: [
    { id: 1, nome: "T-Shirt Básica Branca", categoria: "roupas", marca: "delrio", preco: 49.90, vendas: 45, imagem: "assets/images/produtos/produto-branca.jpg" },
    { id: 2, nome: "Calça Jeans Skinny", categoria: "roupas", marca: "delrio", preco: 159.90, vendas: 32, imagem: "assets/images/produtos/pantalona-preto.jpg" },
    { id: 3, nome: "Blusa Social Feminina", categoria: "roupas", marca: "delrio", preco: 89.90, vendas: 28, imagem: "assets/images/produtos/produto-cappuccino.jpg" },
    { id: 4, nome: "Tênis Esportivo", categoria: "calcados", marca: "nike", preco: 299.90, vendas: 21, imagem: "assets/images/produtos/produto-anis.jpg" },
    { id: 5, nome: "Vestido Casual", categoria: "roupas", marca: "delrio", preco: 129.90, vendas: 18, imagem: "assets/images/produtos/pantalona-cappuccino.jpg" },
    { id: 6, nome: "Bermuda Esportiva", categoria: "roupas", marca: "adidas", preco: 79.90, vendas: 15, imagem: "assets/images/produtos/pantalona-verde-militar.jpg" },
    { id: 7, nome: "Camiseta Polo", categoria: "roupas", marca: "puma", preco: 119.90, vendas: 12, imagem: "assets/images/produtos/produto-branca.jpg" },
    { id: 8, nome: "Jaqueta Jeans", categoria: "roupas", marca: "delrio", preco: 199.90, vendas: 10, imagem: "assets/images/produtos/produto-cappuccino.jpg" }
  ]
};

let produtosFiltrados = [...DADOS_MOCK.produtos];
let paginaAtual = 1;
const itensPorPagina = 6;

// Funções do Dashboard
function carregarDashboard() {
  // Obter dados do usuário atual
  const usuarioAtual = localStorage.getItem('usuarioLogado');
  const userData = JSON.parse(localStorage.getItem(`usuario_${usuarioAtual}_data`)) || {};
  const pontosUsuario = userData.pontos || 0;
  
  // Atualiza contadores animados
  contarAnimado("vendas-hoje", DADOS_MOCK.vendas.hoje);
  animarValor("faturamento", pontosUsuario, "points");
  animarValor("meta-progresso", DADOS_MOCK.vendas.metaProgresso, "percent");
  
  // Cria gráfico simples de vendas
  criarGraficoVendas();
}

function animarValor(elementId, valorFinal, tipo = "number") {
  const elemento = document.getElementById(elementId);
  let inicio = 0;
  const duracao = 1500;
  const incremento = valorFinal / (duracao / 30);

  const contador = setInterval(() => {
    inicio += incremento;
    if (inicio >= valorFinal) {
      inicio = valorFinal;
      clearInterval(contador);
    }
    
    let textoFinal = Math.floor(inicio);
    if (tipo === "currency") {
      textoFinal = `R$ ${inicio.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    } else if (tipo === "percent") {
      textoFinal = `${Math.floor(inicio)}%`;
    } else if (tipo === "points") {
      textoFinal = `${Math.floor(inicio)} pts`;
    }
    
    elemento.textContent = textoFinal;
  }, 30);
}

function criarGraficoVendas() {
  const canvas = document.getElementById('vendas-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const dados = DADOS_MOCK.vendas.semana;
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Configurações do gráfico
  const padding = 40;
  const chartWidth = canvas.width - 2 * padding;
  const chartHeight = canvas.height - 2 * padding;
  const maxValue = Math.max(...dados);
  const barWidth = chartWidth / dados.length;
  
  // Configurações da animação
  let animationProgress = 0;
  const animationDuration = 1500; // 1.5 segundos
  const startTime = Date.now();
  
  function desenharGrafico() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calcula o progresso da animação (0 a 1)
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    animationProgress = Math.min(elapsed / animationDuration, 1);
    
    // Easing function (ease-out cubic)
    const easedProgress = 1 - Math.pow(1 - animationProgress, 3);
    
    // Desenha as barras com animação
    dados.forEach((valor, index) => {
      const targetBarHeight = (valor / maxValue) * chartHeight;
      const animatedBarHeight = targetBarHeight * easedProgress;
      
      const x = padding + index * barWidth + barWidth * 0.2;
      const y = canvas.height - padding - animatedBarHeight;
      const width = barWidth * 0.6;
      
      // Gradiente para as barras
      const gradient = ctx.createLinearGradient(0, y, 0, y + animatedBarHeight);
      gradient.addColorStop(0, '#7F80AF');
      gradient.addColorStop(1, '#9a9bcc');
      
      // Sombra da barra
      ctx.shadowColor = 'rgba(127, 128, 175, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, width, animatedBarHeight);
      
      // Remove sombra para os textos
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      // Labels dos dias (aparecem gradualmente)
      ctx.fillStyle = `rgba(102, 102, 102, ${easedProgress})`;
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(dias[index], x + width/2, canvas.height - 10);
      
      // Valores das vendas (aparecem quando a barra está quase completa)
      if (easedProgress > 0.7) {
        const textOpacity = (easedProgress - 0.7) / 0.3;
        ctx.fillStyle = `rgba(51, 51, 51, ${textOpacity})`;
        ctx.font = 'bold 11px Arial';
        ctx.fillText(valor, x + width/2, y - 5);
      }
    });
    
    // Desenha linhas de grade horizontais
    ctx.strokeStyle = `rgba(200, 200, 200, ${easedProgress * 0.5})`;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = canvas.height - padding - (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Continua a animação se não terminou
    if (animationProgress < 1) {
      requestAnimationFrame(desenharGrafico);
    }
  }
  
  // Inicia a animação
  desenharGrafico();
}

function filtrarDashboard(periodo) {
  // Remove classe active de todos os botões
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  
  // Adiciona classe active ao botão clicado
  event.target.classList.add('active');
  
  // Obter dados do usuário atual
  const usuarioAtual = localStorage.getItem('usuarioLogado');
  const userData = JSON.parse(localStorage.getItem(`usuario_${usuarioAtual}_data`)) || {};
  const pontosUsuario = userData.pontos || 0;
  
  // Simula filtro por período
  let vendasPeriodo = DADOS_MOCK.vendas.hoje;
  let pontosPeriodo = pontosUsuario;
  
  switch(periodo) {
    case 'hoje':
      vendasPeriodo = 15;
      pontosPeriodo = pontosUsuario;
      break;
    case 'semana':
      vendasPeriodo = 105;
      pontosPeriodo = pontosUsuario;
      break;
    case 'mes':
      vendasPeriodo = 450;
      pontosPeriodo = pontosUsuario;
      break;
    case 'trimestre':
      vendasPeriodo = 1350;
      pontosPeriodo = pontosUsuario;
      break;
  }
  
  // Atualiza os valores
  contarAnimado("vendas-hoje", vendasPeriodo);
  animarValor("faturamento", pontosPeriodo, "points");
  
  toastInfo("Período Alterado", `Dashboard atualizado para mostrar dados de: ${periodo}`);
}

// Melhorias visuais e de UX
document.addEventListener('DOMContentLoaded', function() {
  // Aplicar melhorias visuais
  aplicarMelhoriasVisuais();
  
  // Auto-rotação de banners
  if (document.getElementById('banner-rotativo')) {
    iniciarAutoRotacao();
  }
  
  // Adicionar efeitos de parallax suave no background
  adicionarEfeitoParallax();
  
  // Carregar carrinho salvo
  carregarCarrinho();
});

// Função para aplicar melhorias visuais
function aplicarMelhoriasVisuais() {
  // Adicionar efeito de loading aos botões
  const botoes = document.querySelectorAll('button');
  botoes.forEach(botao => {
    botao.addEventListener('click', function() {
      if (!this.classList.contains('loading')) {
        this.classList.add('loading');
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
          this.classList.remove('loading');
          this.style.transform = '';
        }, 200);
      }
    });
  });
  
  // Smooth scroll para seções - REMOVIDO para evitar conflitos
  // document.querySelectorAll('button[onclick*="mostrarSecao"]').forEach(botao => {
  //   botao.addEventListener('click', function(e) {
  //     setTimeout(() => {
  //       const secaoAtiva = document.querySelector('section[style*="block"]');
  //       if (secaoAtiva) {
  //         secaoAtiva.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       }
  //     }, 100);
  //   });
  // });
  
  // Adicionar animação de entrada para elementos
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
      }
    });
  });
  
  document.querySelectorAll('.formulario, .card').forEach(el => {
    observer.observe(el);
  });
}

// Efeito parallax suave
function adicionarEfeitoParallax() {
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (document.body.classList.contains('sem-fundo')) {
      document.body.style.backgroundPosition = `center ${rate}px`;
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

// Melhorar a função de validação de login com feedback visual
function validarLoginMelhorado() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;
  const loginContainer = document.getElementById("login-container");
  
  // Adicionar efeito de loading
  loginContainer.style.transform = 'scale(0.98)';
  loginContainer.style.opacity = '0.8';
  
  setTimeout(() => {
    const usuarioValido = CONFIG_LOGIN.usuarios.find(user => 
      user.usuario === usuario && user.senha === senha
    );

    if (usuarioValido) {
      // Animação de saída suave
      loginContainer.style.animation = 'slideUp 0.5s ease-out forwards';
      
      setTimeout(() => {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("conteudo-principal").style.display = "block";
        document.body.classList.add("sem-fundo");
        
        // Exibe o nome do usuário na interface
        document.getElementById("usuario-nome").textContent = `👤 ${usuarioValido.nome}`;
        
        mostrarSecao('home');
        toastSucesso("Bem-vindo!", `Olá ${usuarioValido.nome}, login realizado com sucesso!`);
        
        // Atualizar contadores na interface
        atualizarContadoresInterface();
      }, 300);
    } else {
      // Efeito de shake para erro
      loginContainer.style.animation = 'shake 0.5s ease-in-out';
      loginContainer.style.transform = '';
      loginContainer.style.opacity = '';
      
      setTimeout(() => {
        loginContainer.style.animation = '';
      }, 500);
      
      toastErro("Erro de Login", "Usuário ou senha incorretos. Tente novamente.");
    }
  }, 200);
}

// ===============================
// MENU HAMBURGER MOBILE
// ===============================

// Função para alternar o menu mobile
function toggleMobileMenu() {
  const nav = document.getElementById('main-nav');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('mobile-overlay');
  
  if (nav.classList.contains('mobile-open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

// Função para abrir o menu mobile
function openMobileMenu() {
  const nav = document.getElementById('main-nav');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('mobile-overlay');
  const closeMobileBtn = document.getElementById('close-mobile-btn');
  
  // Primeiro remove qualquer estilo inline que possa interferir
  overlay.style.display = '';
  overlay.style.opacity = '';
  
  // Adiciona classes
  nav.classList.add('mobile-open');
  hamburgerBtn.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Previne scroll do body
  
  // Garantir que o nav e seus filhos sejam clicáveis
  nav.style.pointerEvents = 'auto';
  nav.style.zIndex = '1001';
  
  // Garantir que todos os botões sejam clicáveis e visíveis
  const buttons = nav.querySelectorAll('button');
  buttons.forEach(button => {
    button.style.pointerEvents = 'auto';
    button.style.zIndex = '1002';
    // Remove estilos que possam interferir com as animações
    button.style.animation = '';
    button.style.transform = '';
    button.style.opacity = '';
  });
  
  // Garantir que os spans de usuário também sejam acessíveis
  const userSections = nav.querySelectorAll('.user-section span');
  userSections.forEach(span => {
    span.style.pointerEvents = 'auto';
    span.style.zIndex = '1002';
  });
  
  // Garantir que o botão fechar seja visível e funcional APENAS EM MOBILE
  if (closeMobileBtn && window.innerWidth <= 768) {
    closeMobileBtn.style.display = 'flex';
    closeMobileBtn.style.visibility = 'visible';
    closeMobileBtn.style.opacity = '1';
    closeMobileBtn.style.pointerEvents = 'auto';
    closeMobileBtn.style.zIndex = '1003';
    // Forçar posicionamento correto
    closeMobileBtn.style.position = 'absolute';
    closeMobileBtn.style.top = '15px';
    closeMobileBtn.style.right = '15px';
  }
}

// Função para fechar o menu mobile
function closeMobileMenu() {
  const nav = document.getElementById('main-nav');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('mobile-overlay');
  const closeMobileBtn = document.getElementById('close-mobile-btn');
  
  // Remove classes primeiro
  nav.classList.remove('mobile-open');
  hamburgerBtn.classList.remove('active');
  overlay.classList.remove('active');
  
  // Força a remoção do estilo de display se necessário
  overlay.style.display = 'none';
  overlay.style.opacity = '0';
  
  // Remove estilos inline dos botões para permitir reabertura correta
  const buttons = nav.querySelectorAll('.nav-buttons button, .user-section button, .user-section span');
  buttons.forEach(button => {
    button.style.animation = '';
    button.style.transform = '';
    button.style.opacity = '';
    button.style.pointerEvents = '';
    button.style.zIndex = '';
  });
  
  // Limpa especificamente os estilos do botão fechar para manter posição consistente
  if (closeMobileBtn) {
    closeMobileBtn.style.animation = '';
    closeMobileBtn.style.transform = '';
    closeMobileBtn.style.opacity = '';
    closeMobileBtn.style.pointerEvents = '';
    closeMobileBtn.style.zIndex = '';
    closeMobileBtn.style.position = '';
    closeMobileBtn.style.top = '';
    closeMobileBtn.style.right = '';
  }
  
  // Remove estilos inline do nav
  nav.style.pointerEvents = '';
  nav.style.zIndex = '';
  
  document.body.style.overflow = ''; // Restaura scroll do body
}

// Função inteligente para mostrar seção (detecta automaticamente se deve fechar menu mobile)
function mostrarSecaoInteligente(secao) {
  // Primeiro fecha o menu mobile se estivermos em modo mobile
  if (window.innerWidth <= 768) {
    const nav = document.getElementById('main-nav');
    if (nav && nav.classList.contains('mobile-open')) {
      closeMobileMenu();
      
      // Aguarda um pequeno delay para garantir que o menu seja fechado antes de mostrar a seção
      setTimeout(() => {
        mostrarSecao(secao);
      }, 100);
      return;
    }
  }
  
  // Se não é mobile ou menu não está aberto, mostra seção diretamente
  mostrarSecao(secao);
}

// Função para fechar o menu ao clicar em uma opção de navegação (mantida para compatibilidade)
function mostrarSecaoEFecharMenu(secao) {
  mostrarSecaoInteligente(secao);
}

// Fechar menu ao redimensionar tela para desktop
window.addEventListener('resize', function() {
  const closeMobileBtn = document.getElementById('close-mobile-btn');
  
  if (window.innerWidth > 768) {
    closeMobileMenu();
    // Garantir que o botão close esteja oculto no desktop
    if (closeMobileBtn) {
      closeMobileBtn.style.display = 'none';
      closeMobileBtn.style.visibility = 'hidden';
      closeMobileBtn.style.opacity = '0';
      closeMobileBtn.style.pointerEvents = 'none';
    }
  }
});

// Fechar menu com tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

// Variáveis para armazenar dados do perfil
let dadosPerfilUsuario = {
  nome: '',
  nomeCompleto: '',
  telefone: '',
  cpf: '',
  endereco: '',
  loja: '',
  email: '',
  totalRegistros: 0,
  totalPontos: 0,
  totalResgates: 0,
  ultimoAcesso: new Date().toLocaleDateString()
};

// Função para inicializar o perfil do usuário
function inicializarPerfil(usuario) {
  const usuarioData = CONFIG_LOGIN.usuarios.find(u => u.usuario === usuario);
  
  if (usuarioData) {
    dadosPerfilUsuario.nome = usuarioData.nome;
    dadosPerfilUsuario.nomeCompleto = dadosPerfilUsuario.nomeCompleto || usuarioData.nomeCompleto || '';
    dadosPerfilUsuario.telefone = dadosPerfilUsuario.telefone || usuarioData.telefone || '';
    dadosPerfilUsuario.cpf = dadosPerfilUsuario.cpf || usuarioData.cpf || '';
    dadosPerfilUsuario.endereco = dadosPerfilUsuario.endereco || usuarioData.endereco || '';
    dadosPerfilUsuario.loja = dadosPerfilUsuario.loja || usuarioData.loja || '';
    dadosPerfilUsuario.email = dadosPerfilUsuario.email || usuarioData.email || '';
    
    // Carregar dados específicos do usuário do localStorage
    const userData = JSON.parse(localStorage.getItem(`usuario_${usuario}_data`)) || {};
    dadosPerfilUsuario.totalRegistros = userData.registros || dadosPerfilUsuario.totalRegistros || 0;
    dadosPerfilUsuario.totalPontos = userData.pontos || dadosPerfilUsuario.totalPontos || 0;
    dadosPerfilUsuario.totalResgates = userData.resgates || dadosPerfilUsuario.totalResgates || 0;
    
    // Mostrar indicação para usuários não-admin
    if (!usuarioData.isAdmin) {
      const adminOnlyLoja = document.getElementById('admin-only-loja');
      if (adminOnlyLoja) {
        adminOnlyLoja.style.display = 'inline';
      }
    }
    
    // Atualizar interface do perfil
    atualizarInterfacePerfil();
  }
}

// Função para atualizar a interface do perfil
function atualizarInterfacePerfil() {
  document.getElementById('profile-nome').textContent = dadosPerfilUsuario.nome;
  document.getElementById('profile-nome-completo').value = dadosPerfilUsuario.nomeCompleto;
  document.getElementById('profile-telefone').value = dadosPerfilUsuario.telefone;
  document.getElementById('profile-cpf').value = dadosPerfilUsuario.cpf;
  document.getElementById('profile-endereco').value = dadosPerfilUsuario.endereco;
  document.getElementById('profile-loja').value = dadosPerfilUsuario.loja;
  document.getElementById('profile-email').value = dadosPerfilUsuario.email;
  
  // Atualizar estatísticas
  document.getElementById('total-registros').textContent = dadosPerfilUsuario.totalRegistros;
  document.getElementById('total-pontos').textContent = dadosPerfilUsuario.totalPontos;
  document.getElementById('total-resgates').textContent = dadosPerfilUsuario.totalResgates;
  document.getElementById('ultimo-acesso').textContent = dadosPerfilUsuario.ultimoAcesso;
  
  // Inicialmente, deixar os campos como readonly
  desabilitarEdicaoPerfil();
}

// Função para habilitar edição do perfil
function editarPerfil() {
  const campos = ['profile-nome-completo', 'profile-telefone', 'profile-cpf', 'profile-endereco', 'profile-email'];
  
  // Verificar se o usuário atual é admin
  const usuarioAtual = document.getElementById("usuario").value;
  const usuarioData = CONFIG_LOGIN.usuarios.find(u => u.usuario === usuarioAtual);
  const isAdmin = usuarioData && usuarioData.isAdmin;
  
  // Se for admin, pode editar a loja também
  if (isAdmin) {
    campos.push('profile-loja');
  }
  
  campos.forEach(campo => {
    const elemento = document.getElementById(campo);
    elemento.removeAttribute('readonly');
    elemento.style.backgroundColor = '#fff';
    elemento.style.cursor = 'text';
  });
  
  // Para usuários não-admin, manter o campo loja readonly
  if (!isAdmin) {
    const campoLoja = document.getElementById('profile-loja');
    campoLoja.setAttribute('readonly', 'true');
    campoLoja.style.backgroundColor = '#f8f9fa';
    campoLoja.style.cursor = 'not-allowed';
    campoLoja.title = 'Apenas administradores podem alterar a loja';
  }
  
  // Mudar cor do botão editar para indicar modo de edição
  const btnEditar = document.querySelector('.btn-editar');
  btnEditar.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
  btnEditar.innerHTML = '❌ Cancelar Edição';
  btnEditar.setAttribute('onclick', 'cancelarEdicaoPerfil()');
  
  mostrarToast('Modo de Edição', 'Agora você pode editar seus dados pessoais', 'info');
}

// Função para cancelar edição do perfil
function cancelarEdicaoPerfil() {
  // Restaurar valores originais
  atualizarInterfacePerfil();
  
  // Restaurar botão editar
  const btnEditar = document.querySelector('.btn-editar');
  btnEditar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  btnEditar.innerHTML = '✏️ Editar Perfil';
  btnEditar.setAttribute('onclick', 'editarPerfil()');
  
  mostrarToast('Edição Cancelada', 'As alterações foram descartadas', 'warning');
}

// Função para desabilitar edição do perfil
function desabilitarEdicaoPerfil() {
  const campos = ['profile-nome-completo', 'profile-telefone', 'profile-cpf', 'profile-endereco', 'profile-loja', 'profile-email'];
  
  campos.forEach(campo => {
    const elemento = document.getElementById(campo);
    elemento.setAttribute('readonly', 'true');
    elemento.style.backgroundColor = '#f8f9fa';
    elemento.style.cursor = 'default';
  });
  
  // Verificar se o usuário atual é admin
  const usuarioAtual = document.getElementById("usuario").value;
  const usuarioData = CONFIG_LOGIN.usuarios.find(u => u.usuario === usuarioAtual);
  const isAdmin = usuarioData && usuarioData.isAdmin;
  
  // Para usuários não-admin, o campo loja sempre fica mais restrito
  if (!isAdmin) {
    const campoLoja = document.getElementById('profile-loja');
    campoLoja.style.cursor = 'not-allowed';
    campoLoja.title = 'Apenas administradores podem alterar a loja';
  }
}

// Função para salvar alterações do perfil
function salvarPerfil() {
  // Verificar se o usuário atual é admin
  const usuarioAtual = document.getElementById("usuario").value;
  const usuarioData = CONFIG_LOGIN.usuarios.find(u => u.usuario === usuarioAtual);
  const isAdmin = usuarioData && usuarioData.isAdmin;
  
  // Validar dados antes de salvar
  const nomeCompleto = document.getElementById('profile-nome-completo').value.trim();
  const telefone = document.getElementById('profile-telefone').value.trim();
  const cpf = document.getElementById('profile-cpf').value.trim();
  const endereco = document.getElementById('profile-endereco').value.trim();
  const loja = document.getElementById('profile-loja').value;
  const email = document.getElementById('profile-email').value.trim();
  
  // Validação básica
  if (!nomeCompleto) {
    mostrarToast('Erro', 'O nome completo é obrigatório', 'error');
    return;
  }
  
  if (!telefone) {
    mostrarToast('Erro', 'O telefone é obrigatório', 'error');
    return;
  }
  
  if (!cpf) {
    mostrarToast('Erro', 'O CPF é obrigatório', 'error');
    return;
  }
  
  if (!validarCPF(cpf)) {
    mostrarToast('Erro', 'Digite um CPF válido', 'error');
    return;
  }
  
  if (!loja) {
    mostrarToast('Erro', 'Selecione uma loja', 'error');
    return;
  }
  
  if (email && !validarEmail(email)) {
    mostrarToast('Erro', 'Digite um e-mail válido', 'error');
    return;
  }
  
  // Atualizar dados do perfil
  dadosPerfilUsuario.nomeCompleto = nomeCompleto;
  dadosPerfilUsuario.telefone = telefone;
  dadosPerfilUsuario.cpf = cpf;
  dadosPerfilUsuario.endereco = endereco;
  dadosPerfilUsuario.email = email;
  
  // Apenas admin pode alterar a loja
  if (isAdmin) {
    dadosPerfilUsuario.loja = loja;
  } else {
    // Para usuários não-admin, verificar se tentaram alterar a loja
    if (loja !== dadosPerfilUsuario.loja) {
      mostrarToast('Acesso Negado', 'Apenas administradores podem alterar a loja', 'error');
      return;
    }
  }
  
  // Salvar no localStorage para persistir os dados
  localStorage.setItem('perfilUsuario', JSON.stringify(dadosPerfilUsuario));
  
  // Desabilitar edição
  desabilitarEdicaoPerfil();
  
  // Restaurar botão editar
  const btnEditar = document.querySelector('.btn-editar');
  btnEditar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  btnEditar.innerHTML = '✏️ Editar Perfil';
  btnEditar.setAttribute('onclick', 'editarPerfil()');
  
  mostrarToast('Sucesso', 'Perfil atualizado com sucesso!', 'success');
}

// Função para validar e-mail
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Função para validar CPF
function validarCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

// Função para formatar CPF
function formatarCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Aplica a formatação
  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return cpf.substring(0, 3) + '.' + cpf.substring(3);
  } else if (cpf.length <= 9) {
    return cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6);
  } else {
    return cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6, 9) + '-' + cpf.substring(9, 11);
  }
}

// Função para carregar dados do perfil do localStorage
function carregarPerfilDoStorage() {
  const dadosSalvos = localStorage.getItem('perfilUsuario');
  if (dadosSalvos) {
    dadosPerfilUsuario = { ...dadosPerfilUsuario, ...JSON.parse(dadosSalvos) };
  }
}

// Função para incrementar estatísticas do perfil
function incrementarEstatisticaPerfil(tipo, valor = 1) {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  
  switch(tipo) {
    case 'registros':
      dadosPerfilUsuario.totalRegistros += valor;
      break;
    case 'pontos':
      dadosPerfilUsuario.totalPontos += valor;
      break;
    case 'resgates':
      dadosPerfilUsuario.totalResgates += valor;
      break;
  }
  
  // Salvar no localStorage
  localStorage.setItem('perfilUsuario', JSON.stringify(dadosPerfilUsuario));
  
  // Salvar também com a chave do usuário específico
  if (usuarioLogado) {
    const userData = JSON.parse(localStorage.getItem(`usuario_${usuarioLogado}_data`)) || {};
    userData[tipo] = (userData[tipo] || 0) + valor;
    localStorage.setItem(`usuario_${usuarioLogado}_data`, JSON.stringify(userData));
  }
  
  // Atualizar interface se estivermos na página de perfil
  if (document.getElementById('secao-perfil').style.display !== 'none') {
    atualizarInterfacePerfil();
  }
}

// Função para adicionar máscara ao CPF
function adicionarMascaraCPF() {
  const campoCPF = document.getElementById('profile-cpf');
  
  if (campoCPF) {
    campoCPF.addEventListener('input', function(e) {
      const valor = e.target.value;
      e.target.value = formatarCPF(valor);
    });
    
    campoCPF.addEventListener('keypress', function(e) {
      // Permite apenas números
      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
        e.preventDefault();
      }
    });
  }
}

// Inicializar máscara do CPF quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  adicionarMascaraCPF();
  carregarUsuariosSalvos();
  carregarCarrinho();
});

// ===== FUNCIONALIDADES DO PAINEL ADMIN =====

// Função para mostrar/ocultar abas do admin
function mostrarAbaAdmin(aba) {
  // Oculta todas as abas
  document.querySelectorAll('.admin-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove classe active dos botões
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Mostra a aba selecionada
  document.getElementById(`aba-${aba}`).classList.add('active');
  
  // Marca o botão como ativo
  event.target.classList.add('active');
  
  // Carrega conteúdo específico da aba
  switch(aba) {
    case 'usuarios':
      carregarListaUsuarios();
      break;
    case 'novo-usuario':
      adicionarMascaraCPFNovoUsuario();
      break;
    case 'pontos':
      carregarUsuariosParaPontos();
      break;
    case 'produtos':
      carregarProdutosCards();
      break;
    case 'configuracoes':
      carregarEstatisticasAdmin();
      carregarProdutosConfig();
      break;
  }
}

// Função para carregar lista de usuários
function carregarListaUsuarios() {
  const listaContainer = document.getElementById('usuarios-lista');
  listaContainer.innerHTML = '';
  
  CONFIG_LOGIN.usuarios.forEach((usuario, index) => {
    const usuarioCard = document.createElement('div');
    usuarioCard.className = 'usuario-card';
    usuarioCard.innerHTML = `
      <div class="usuario-header">
        <div class="usuario-info">
          <h5>${usuario.nome}</h5>
          <p>@${usuario.usuario} ${usuario.isAdmin ? '(Admin)' : ''}</p>
        </div>
        <div class="usuario-actions">
          <button class="btn-action btn-edit" onclick="editarUsuario(${index})">✏️ Editar</button>
          ${!usuario.isAdmin ? `<button class="btn-action btn-delete" onclick="excluirUsuario(${index})">🗑️ Excluir</button>` : ''}
        </div>
      </div>
      <div class="usuario-details">
        <div class="detail-item">
          <span class="detail-icon">📧</span>
          <span>${usuario.email || 'Não informado'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">📞</span>
          <span>${usuario.telefone || 'Não informado'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🏪</span>
          <span>${getNomeLoja(usuario.loja)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">📊</span>
          <span>${usuario.totalRegistros || 0} registros</span>
        </div>
      </div>
    `;
    listaContainer.appendChild(usuarioCard);
  });
}

// Função para obter nome da loja
function getNomeLoja(loja) {
  const lojas = {
    'matriz': 'DelRio - Matriz',
    'centro': 'DelRio - Centro',
    'shopping': 'DelRio - Shopping',
    'bairro': 'DelRio - Bairro'
  };
  return lojas[loja] || 'Não informado';
}

// Função para filtrar usuários
function filtrarUsuarios() {
  const filtroNome = document.getElementById('filtro-usuarios').value.toLowerCase();
  const filtroCpf = document.getElementById('filtro-cpf').value.toLowerCase().replace(/\D/g, ''); // Remove caracteres não numéricos
  const filtroLoja = document.getElementById('filtro-loja').value;
  
  const usuarios = document.querySelectorAll('.usuario-card');
  
  usuarios.forEach(usuario => {
    const nome = usuario.querySelector('h5').textContent.toLowerCase();
    const loja = usuario.querySelector('.detail-item:nth-child(3) span:last-child').textContent;
    
    // Busca pelo CPF no card do usuário
    const cpfElement = usuario.querySelector('.detail-item:nth-child(2) span:last-child');
    const cpfUsuario = cpfElement ? cpfElement.textContent.replace(/\D/g, '') : ''; // Remove formatação do CPF
    
    const matchNome = nome.includes(filtroNome);
    const matchCpf = !filtroCpf || cpfUsuario.includes(filtroCpf);
    const matchLoja = !filtroLoja || loja.includes(filtroLoja);
    
    if (matchNome && matchCpf && matchLoja) {
      usuario.style.display = 'block';
    } else {
      usuario.style.display = 'none';
    }
  });
}

// Função para formatar CPF no filtro
function formatarCpfFiltro(input) {
  let valor = input.value.replace(/\D/g, '');
  
  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  
  input.value = valor;
}

// Função para formatar CPF no filtro de pontos
function formatarCpfFiltroPontos(input) {
  let valor = input.value.replace(/\D/g, '');
  
  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  
  input.value = valor;
}

// Função para filtrar usuários na seção de pontos
function filtrarUsuariosPontos() {
  const filtroInput = document.getElementById('filtro-cpf-pontos');
  const selectUsuario = document.getElementById('usuario-pontos');
  
  if (!filtroInput || !selectUsuario) return;
  
  const filtroTexto = filtroInput.value.toLowerCase().trim();
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  
  // Limpa o select
  selectUsuario.innerHTML = '<option value="">Selecione um usuário...</option>';
  
  // Filtra usuários
  let usuariosFiltrados = usuarios;
  
  if (filtroTexto) {
    usuariosFiltrados = usuarios.filter(usuario => {
      const cpf = usuario.cpf ? usuario.cpf.toLowerCase().replace(/\D/g, '') : '';
      const filtroLimpo = filtroTexto.replace(/\D/g, '');
      return cpf.includes(filtroLimpo);
    });
  }
  
  // Popula o select com usuários filtrados
  usuariosFiltrados.forEach(usuario => {
    const option = document.createElement('option');
    option.value = usuario.usuario;
    option.textContent = `${usuario.nome} (${usuario.cpf || 'CPF não informado'})`;
    selectUsuario.appendChild(option);
  });
  
  // Se encontrou apenas um usuário, seleciona automaticamente
  if (usuariosFiltrados.length === 1) {
    selectUsuario.value = usuariosFiltrados[0].usuario;
    carregarPontosUsuario();
  }
}

// Função para cadastrar novo usuário
function cadastrarNovoUsuario(event) {
  event.preventDefault();
  
  const novoUsuario = {
    usuario: document.getElementById('novo-usuario').value.trim(),
    senha: document.getElementById('novo-senha').value,
    nome: document.getElementById('novo-nome').value.trim(),
    nomeCompleto: document.getElementById('novo-nome').value.trim(),
    telefone: document.getElementById('novo-telefone').value.trim(),
    cpf: document.getElementById('novo-cpf').value.trim(),
    endereco: document.getElementById('novo-endereco').value.trim(),
    loja: document.getElementById('novo-loja').value,
    email: document.getElementById('novo-email').value.trim(),
    totalRegistros: 0,
    totalResgates: 0,
    isAdmin: false
  };
  
  // Validações
  if (CONFIG_LOGIN.usuarios.find(u => u.usuario === novoUsuario.usuario)) {
    mostrarToast('Erro', 'Nome de usuário já existe!', 'error');
    return;
  }
  
  if (!validarCPF(novoUsuario.cpf)) {
    mostrarToast('Erro', 'CPF inválido!', 'error');
    return;
  }
  
  if (novoUsuario.email && !validarEmail(novoUsuario.email)) {
    mostrarToast('Erro', 'E-mail inválido!', 'error');
    return;
  }
  
  // Adiciona o usuário
  CONFIG_LOGIN.usuarios.push(novoUsuario);
  
  // Salva no localStorage
  localStorage.setItem('usuarios', JSON.stringify(CONFIG_LOGIN.usuarios));
  
  mostrarToast('Sucesso', 'Usuário cadastrado com sucesso!', 'success');
  
  // Limpa o formulário
  limparFormularioUsuario();
  
  // Atualiza a lista de usuários
  carregarListaUsuarios();
}

// Função para limpar formulário de usuário
function limparFormularioUsuario() {
  document.getElementById('form-novo-usuario').reset();
}

// Função para editar usuário
function editarUsuario(index) {
  const usuario = CONFIG_LOGIN.usuarios[index];
  
  // Preenche o formulário com os dados do usuário
  document.getElementById('novo-usuario').value = usuario.usuario;
  document.getElementById('novo-senha').value = usuario.senha;
  document.getElementById('novo-nome').value = usuario.nomeCompleto;
  document.getElementById('novo-telefone').value = usuario.telefone;
  document.getElementById('novo-cpf').value = usuario.cpf;
  document.getElementById('novo-endereco').value = usuario.endereco;
  document.getElementById('novo-loja').value = usuario.loja;
  document.getElementById('novo-email').value = usuario.email;
  
  // Muda o comportamento do formulário para edição
  const form = document.getElementById('form-novo-usuario');
  form.onsubmit = function(event) {
    event.preventDefault();
    salvarEdicaoUsuario(index);
  };
  
  // Muda o texto do botão
  document.querySelector('#form-novo-usuario button[type="submit"]').innerHTML = '💾 Salvar Alterações';
  
  // Vai para a aba de novo usuário
  mostrarAbaAdmin('novo-usuario');
  
  mostrarToast('Modo Edição', 'Editando usuário. Altere os dados e clique em "Salvar Alterações"', 'info');
}

// Função para salvar edição do usuário
function salvarEdicaoUsuario(index) {
  const usuario = CONFIG_LOGIN.usuarios[index];
  
  // Atualiza os dados
  usuario.usuario = document.getElementById('novo-usuario').value.trim();
  usuario.senha = document.getElementById('novo-senha').value;
  usuario.nome = document.getElementById('novo-nome').value.trim();
  usuario.nomeCompleto = document.getElementById('novo-nome').value.trim();
  usuario.telefone = document.getElementById('novo-telefone').value.trim();
  usuario.cpf = document.getElementById('novo-cpf').value.trim();
  usuario.endereco = document.getElementById('novo-endereco').value.trim();
  usuario.loja = document.getElementById('novo-loja').value;
  usuario.email = document.getElementById('novo-email').value.trim();
  
  // Validações
  if (!validarCPF(usuario.cpf)) {
    mostrarToast('Erro', 'CPF inválido!', 'error');
    return;
  }
  
  if (usuario.email && !validarEmail(usuario.email)) {
    mostrarToast('Erro', 'E-mail inválido!', 'error');
    return;
  }
  
  // Salva no localStorage
  localStorage.setItem('usuarios', JSON.stringify(CONFIG_LOGIN.usuarios));
  
  mostrarToast('Sucesso', 'Usuário atualizado com sucesso!', 'success');
  
  // Restaura o formulário para modo de cadastro
  restaurarFormularioCadastro();
  
  // Atualiza a lista de usuários
  carregarListaUsuarios();
}

// Função para restaurar formulário para modo cadastro
function restaurarFormularioCadastro() {
  const form = document.getElementById('form-novo-usuario');
  form.onsubmit = cadastrarNovoUsuario;
  document.querySelector('#form-novo-usuario button[type="submit"]').innerHTML = '💾 Cadastrar Usuário';
  limparFormularioUsuario();
}

// Função para excluir usuário
function excluirUsuario(index) {
  const usuario = CONFIG_LOGIN.usuarios[index];
  
  if (confirm(`Tem certeza que deseja excluir o usuário "${usuario.nome}"?`)) {
    CONFIG_LOGIN.usuarios.splice(index, 1);
    localStorage.setItem('usuarios', JSON.stringify(CONFIG_LOGIN.usuarios));
    mostrarToast('Sucesso', 'Usuário excluído com sucesso!', 'success');
    carregarListaUsuarios();
  }
}

// Função para carregar estatísticas do admin
function carregarEstatisticasAdmin() {
  const totalUsuarios = CONFIG_LOGIN.usuarios.length;
  const usuariosAtivos = CONFIG_LOGIN.usuarios.filter(u => !u.isAdmin).length;
  const registrosTotais = CONFIG_LOGIN.usuarios.reduce((total, u) => total + (u.totalRegistros || 0), 0);
  
  document.getElementById('total-usuarios-sistema').textContent = totalUsuarios;
  document.getElementById('usuarios-ativos').textContent = usuariosAtivos;
  document.getElementById('registros-totais-sistema').textContent = registrosTotais;
}

// Função para salvar configurações
function salvarConfiguracoes() {
  const configPontosProduto = document.getElementById('config-pontos-produto').value;
  const configPontosTshirt = document.getElementById('config-pontos-tshirt').value;
  const configPontosPantalona = document.getElementById('config-pontos-pantalona').value;
  
  // Salva as configurações
  const config = {
    pontosPorProduto: parseInt(configPontosProduto),
    pontosTshirt: parseInt(configPontosTshirt),
    pontosPantalona: parseInt(configPontosPantalona)
  };
  
  localStorage.setItem('configuracoes', JSON.stringify(config));
  
  mostrarToast('Sucesso', 'Configurações salvas com sucesso!', 'success');
}

// Funções para gerenciamento de produtos na seção configurações
function carregarProdutosConfig() {
  const produtosConfig = [
    { id: 'tshirt', nome: 'T-Shirt Delrio', pontos: 200, ativo: true },
    { id: 'pantalona', nome: 'Pantalona Delrio', pontos: 300, ativo: true },
    { id: 'produto-branca', nome: 'Produto Branca', pontos: 150, ativo: true },
    { id: 'produto-anis', nome: 'Produto Anis', pontos: 180, ativo: true },
    { id: 'produto-cappuccino', nome: 'Produto Cappuccino', pontos: 170, ativo: true },
    { id: 'pantalona-preto', nome: 'Pantalona Preto', pontos: 320, ativo: true },
    { id: 'pantalona-verde-militar', nome: 'Pantalona Verde Militar', pontos: 310, ativo: true },
    { id: 'pantalona-cappuccino', nome: 'Pantalona Cappuccino', pontos: 300, ativo: true }
  ];
  
  // Salva produtos padrão se não existirem
  const produtosSalvos = localStorage.getItem('produtosConfig');
  if (!produtosSalvos) {
    localStorage.setItem('produtosConfig', JSON.stringify(produtosConfig));
  }
  
  atualizarListaProdutosConfig();
}

function atualizarListaProdutosConfig() {
  const select = document.getElementById('produto-selecionado-config');
  const produtosConfig = JSON.parse(localStorage.getItem('produtosConfig') || '[]');
  
  select.innerHTML = '<option value="">-- Selecione um produto --</option>';
  
  produtosConfig.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.id;
    option.textContent = produto.nome;
    if (!produto.ativo) {
      option.textContent += ' (Inativo)';
    }
    select.appendChild(option);
  });
}

function filtrarProdutosConfig() {
  const filtro = document.getElementById('filtro-produto-config').value.toLowerCase();
  const select = document.getElementById('produto-selecionado-config');
  const produtosConfig = JSON.parse(localStorage.getItem('produtosConfig') || '[]');
  
  select.innerHTML = '<option value="">-- Selecione um produto --</option>';
  
  const produtosFiltrados = produtosConfig.filter(produto => 
    produto.nome.toLowerCase().includes(filtro)
  );
  
  produtosFiltrados.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.id;
    option.textContent = produto.nome;
    if (!produto.ativo) {
      option.textContent += ' (Inativo)';
    }
    select.appendChild(option);
  });
}

function carregarDadosProduto() {
  const produtoId = document.getElementById('produto-selecionado-config').value;
  const opcoesDiv = document.getElementById('produto-config-opcoes');
  
  if (!produtoId) {
    opcoesDiv.style.display = 'none';
    return;
  }
  
  const produtosConfig = JSON.parse(localStorage.getItem('produtosConfig') || '[]');
  const produto = produtosConfig.find(p => p.id === produtoId);
  
  if (produto) {
    document.getElementById('produto-nome-display').textContent = produto.nome;
    document.getElementById('produto-pontos-config').value = produto.pontos;
    document.getElementById('produto-ativo-config').value = produto.ativo.toString();
    
    // Atualiza o texto do botão de toggle
    const btnToggle = document.getElementById('btn-toggle-status');
    btnToggle.textContent = produto.ativo ? '👁️‍🗨️ Desativar' : '👁️ Ativar';
    
    opcoesDiv.style.display = 'block';
  }
}

function salvarAlteracoesProduto() {
  const produtoId = document.getElementById('produto-selecionado-config').value;
  const novosPontos = parseInt(document.getElementById('produto-pontos-config').value);
  const novoStatus = document.getElementById('produto-ativo-config').value === 'true';
  
  if (!produtoId) {
    mostrarToast('Erro', 'Nenhum produto selecionado!', 'error');
    return;
  }
  
  const produtosConfig = JSON.parse(localStorage.getItem('produtosConfig') || '[]');
  const produtoIndex = produtosConfig.findIndex(p => p.id === produtoId);
  
  if (produtoIndex !== -1) {
    produtosConfig[produtoIndex].pontos = novosPontos;
    produtosConfig[produtoIndex].ativo = novoStatus;
    
    localStorage.setItem('produtosConfig', JSON.stringify(produtosConfig));
    
    mostrarToast('Sucesso', 'Alterações salvas com sucesso!', 'success');
    atualizarListaProdutosConfig();
    
    // Atualiza o texto do botão de toggle
    const btnToggle = document.getElementById('btn-toggle-status');
    btnToggle.textContent = novoStatus ? '👁️‍🗨️ Desativar' : '👁️ Ativar';
  }
}

function toggleStatusProduto() {
  const produtoId = document.getElementById('produto-selecionado-config').value;
  
  if (!produtoId) {
    mostrarToast('Erro', 'Nenhum produto selecionado!', 'error');
    return;
  }
  
  const produtosConfig = JSON.parse(localStorage.getItem('produtosConfig') || '[]');
  const produtoIndex = produtosConfig.findIndex(p => p.id === produtoId);
  
  if (produtoIndex !== -1) {
    produtosConfig[produtoIndex].ativo = !produtosConfig[produtoIndex].ativo;
    
    localStorage.setItem('produtosConfig', JSON.stringify(produtosConfig));
    
    const novoStatus = produtosConfig[produtoIndex].ativo;
    const statusTexto = novoStatus ? 'ativado' : 'desativado';
    
    mostrarToast('Sucesso', `Produto ${statusTexto} com sucesso!`, 'success');
    
    // Atualiza os campos
    document.getElementById('produto-ativo-config').value = novoStatus.toString();
    const btnToggle = document.getElementById('btn-toggle-status');
    btnToggle.textContent = novoStatus ? '👁️‍🗨️ Desativar' : '👁️ Ativar';
    
    atualizarListaProdutosConfig();
  }
}

function excluirProduto() {
  const produtoId = document.getElementById('produto-selecionado-config').value;
  const produtoNome = document.getElementById('produto-nome-display').textContent;
  
  if (!produtoId) {
    mostrarToast('Erro', 'Nenhum produto selecionado!', 'error');
    return;
  }
  
  if (confirm(`Tem certeza que deseja excluir o produto "${produtoNome}"? Esta ação não pode ser desfeita.`)) {
    const produtosConfig = JSON.parse(localStorage.getItem('produtosConfig') || '[]');
    const produtosFiltrados = produtosConfig.filter(p => p.id !== produtoId);
    
    localStorage.setItem('produtosConfig', JSON.stringify(produtosFiltrados));
    
    mostrarToast('Sucesso', 'Produto excluído com sucesso!', 'success');
    
    // Limpa a seleção
    document.getElementById('produto-selecionado-config').value = '';
    document.getElementById('produto-config-opcoes').style.display = 'none';
    
    atualizarListaProdutosConfig();
  }
}

// Função para adicionar máscara ao CPF no formulário de novo usuário
function adicionarMascaraCPFNovoUsuario() {
  const campoCPF = document.getElementById('novo-cpf');
  
  if (campoCPF) {
    campoCPF.addEventListener('input', function(e) {
      const valor = e.target.value;
      e.target.value = formatarCPF(valor);
    });
    
    campoCPF.addEventListener('keypress', function(e) {
      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
        e.preventDefault();
      }
    });
  }
}

// Função para carregar usuários salvos do localStorage
function carregarUsuariosSalvos() {
  const usuariosSalvos = localStorage.getItem('usuarios');
  if (usuariosSalvos) {
    CONFIG_LOGIN.usuarios = JSON.parse(usuariosSalvos);
  }
}

// ========== FUNÇÕES DE GERENCIAMENTO DE PONTOS ==========

// Variáveis para controlar o estado dos pontos
let pontosOriginais = 0;
let pontosAtuais = 0;

// Função para diminuir pontos do usuário
function diminuirPontosUsuario() {
  if (pontosAtuais > 0) {
    pontosAtuais--;
    document.getElementById('pontos-atual-valor').textContent = pontosAtuais;
  }
}

// Função para aumentar pontos do usuário
function aumentarPontosUsuario() {
  pontosAtuais++;
  document.getElementById('pontos-atual-valor').textContent = pontosAtuais;
}

// Função para confirmar o ajuste de pontos
function confirmarAjustePontos() {
  const usuarioSelecionado = document.getElementById('usuario-pontos').value;
  const motivo = document.getElementById('motivo-pontos').value;
  
  if (!usuarioSelecionado) {
    toastErro('Erro', 'Selecione um usuário primeiro.');
    return;
  }
  
  if (!motivo.trim()) {
    toastErro('Erro', 'Digite o motivo da alteração.');
    return;
  }
  
  // Calcular a diferença
  const diferenca = pontosAtuais - pontosOriginais;
  
  if (diferenca === 0) {
    toastErro('Erro', 'Nenhuma alteração foi feita nos pontos.');
    return;
  }
  
  // Confirmar ação
  const acao = diferenca > 0 ? 'adicionar' : 'remover';
  const quantidade = Math.abs(diferenca);
  
  if (!confirm(`Deseja ${acao} ${quantidade} pontos ${diferenca > 0 ? 'ao' : 'do'} usuário ${usuarioSelecionado}?`)) {
    return;
  }
  
  // Obter dados atuais do usuário
  const userData = JSON.parse(localStorage.getItem(`usuario_${usuarioSelecionado}_data`)) || {};
  
  // Atualizar pontos
  userData.pontos = pontosAtuais;
  localStorage.setItem(`usuario_${usuarioSelecionado}_data`, JSON.stringify(userData));
  
  // Registrar no histórico
  const tipoHistorico = diferenca > 0 ? 'adicao' : 'remocao';
  registrarHistoricoPontos(usuarioSelecionado, tipoHistorico, quantidade, motivo);
  
  // Atualizar valores originais
  pontosOriginais = pontosAtuais;
  
  // Atualizar interface
  carregarHistoricoPontos(usuarioSelecionado);
  
  // Limpar motivo
  document.getElementById('motivo-pontos').value = '';
  
  const mensagem = diferenca > 0 ? 
    `${quantidade} pontos adicionados com sucesso!` : 
    `${quantidade} pontos removidos com sucesso!`;
  
  toastSucesso('Ajuste Realizado!', mensagem);
}

// Função para carregar usuários no select de pontos
function carregarUsuariosParaPontos() {
  const selectUsuarios = document.getElementById('usuario-pontos');
  selectUsuarios.innerHTML = '<option value="">Selecione um usuário...</option>';
  
  CONFIG_LOGIN.usuarios.forEach(usuario => {
    if (!usuario.isAdmin) { // Apenas usuários não-admin
      const option = document.createElement('option');
      option.value = usuario.usuario;
      option.textContent = `${usuario.nome} (${usuario.cpf || 'CPF não informado'})`;
      selectUsuarios.appendChild(option);
    }
  });
  
  // Limpa o filtro de CPF
  const filtroCpf = document.getElementById('filtro-cpf-pontos');
  if (filtroCpf) {
    filtroCpf.value = '';
  }
}

// Função para carregar pontos do usuário selecionado
function carregarPontosUsuario() {
  const selectUsuarios = document.getElementById('usuario-pontos');
  const usuarioSelecionado = selectUsuarios.value;
  const pontosInfo = document.getElementById('pontos-info');
  const historicoDiv = document.getElementById('historico-pontos');
  
  if (!usuarioSelecionado) {
    pontosInfo.style.display = 'none';
    historicoDiv.style.display = 'none';
    return;
  }
  
  // Obter dados do usuário
  const userData = JSON.parse(localStorage.getItem(`usuario_${usuarioSelecionado}_data`)) || {};
  const pontosUsuario = userData.pontos || 0;
  
  // Atualizar variáveis de controle
  pontosOriginais = pontosUsuario;
  pontosAtuais = pontosUsuario;
  
  // Exibir pontos atuais
  document.getElementById('pontos-atual-valor').textContent = pontosAtuais;
  pontosInfo.style.display = 'block';
  
  // Carregar histórico de pontos
  carregarHistoricoPontos(usuarioSelecionado);
  historicoDiv.style.display = 'block';
}

// Função para carregar histórico de pontos
function carregarHistoricoPontos(usuario) {
  const historicoLista = document.getElementById('historico-lista');
  const historico = JSON.parse(localStorage.getItem(`historico_pontos_${usuario}`)) || [];
  
  if (historico.length === 0) {
    historicoLista.innerHTML = '<p style="text-align: center; color: rgba(255, 255, 255, 0.7);">Nenhum histórico de alterações encontrado.</p>';
    return;
  }
  
  historicoLista.innerHTML = '';
  
  // Ordenar por data (mais recente primeiro)
  historico.sort((a, b) => new Date(b.data) - new Date(a.data));
  
  historico.forEach(item => {
    const historicoItem = document.createElement('div');
    historicoItem.className = `historico-item ${item.tipo}`;
    
    const dataFormatada = new Date(item.data).toLocaleString('pt-BR');
    
    historicoItem.innerHTML = `
      <div class="historico-info">
        <span class="historico-acao ${item.tipo}">
          ${item.tipo === 'adicao' ? '➕' : '➖'} ${item.quantidade} pontos
        </span>
        <span class="historico-data">${dataFormatada}</span>
      </div>
      ${item.motivo ? `<div class="historico-motivo">💬 Motivo: ${item.motivo}</div>` : ''}
      <div class="historico-admin">
        👤 Alterado por: ${item.admin}
      </div>
    `;
    
    historicoLista.appendChild(historicoItem);
  });
}

// Funções antigas removidas - agora usamos a nova interface com confirmarAjustePontos()

// Função para registrar histórico de pontos
function registrarHistoricoPontos(usuario, tipo, quantidade, motivo) {
  const adminAtual = localStorage.getItem('usuarioLogado');
  const historico = JSON.parse(localStorage.getItem(`historico_pontos_${usuario}`)) || [];
  
  const novoItem = {
    data: new Date().toISOString(),
    tipo: tipo,
    quantidade: quantidade,
    motivo: motivo || '',
    admin: adminAtual
  };
  
  historico.push(novoItem);
  localStorage.setItem(`historico_pontos_${usuario}`, JSON.stringify(historico));
}

// =================== GERENCIAMENTO DE PRODUTOS ===================

// Função para cadastrar novo produto
function cadastrarProduto(event) {
  event.preventDefault();
  
  const nome = document.getElementById('produto-nome').value;
  const pontos = parseInt(document.getElementById('produto-pontos').value);
  const categoria = document.getElementById('produto-categoria').value;
  const ativo = document.getElementById('produto-ativo').value === 'true';
  
  // Coleta cores selecionadas usando o novo sistema
  const coresSelecionadasIds = obterCoresSelecionadas();
  const todasCores = obterCores();
  const coresSelecionadas = coresSelecionadasIds.map(id => {
    const cor = todasCores.find(c => c.id === id);
    return cor ? { id: cor.id, nome: cor.nome, hex: cor.hex } : null;
  }).filter(Boolean);
  
  // Coleta tamanhos selecionados
  const tamanhosSelecionados = [];
  document.querySelectorAll('input[name="tamanhos"]:checked').forEach(checkbox => {
    tamanhosSelecionados.push(checkbox.value);
  });
  
  // Validações
  if (!nome || !pontos || !categoria) {
    mostrarToast('Erro', 'Por favor, preencha todos os campos obrigatórios!', 'error');
    return;
  }
  
  if (coresSelecionadas.length === 0) {
    mostrarToast('Erro', 'Selecione pelo menos uma cor!', 'error');
    return;
  }
  
  if (tamanhosSelecionados.length === 0) {
    mostrarToast('Erro', 'Selecione pelo menos um tamanho!', 'error');
    return;
  }
  
  // Gera ID único para o produto
  const produtoId = 'prod_' + Date.now();
  
  // Cria objeto do produto
  const novoProduto = {
    id: produtoId,
    nome: nome,
    pontos: pontos,
    categoria: categoria,
    cores: coresSelecionadas, // Agora inclui objetos completos das cores
    tamanhos: tamanhosSelecionados,
    ativo: ativo,
    dataCadastro: new Date().toISOString(),
    // Incluir imagens por cor
    imagensPorCor: window.produtoImagens || {}
  };
  
  // Salva no localStorage
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  produtos.push(novoProduto);
  localStorage.setItem('produtos', JSON.stringify(produtos));
  
  mostrarToast('Sucesso', 'Produto cadastrado com sucesso!', 'success');
  
  // Sincronizar com a vitrine de prêmios
  sincronizarProdutosVitrine();
  
  // Limpa o formulário
  limparFormularioProduto();
  
  // Volta para a lista
  voltarParaLista();
}

// =================== NOVA INTERFACE DE PRODUTOS ===================

// Função para mostrar formulário de cadastro
function mostrarFormularioCadastro() {
  document.getElementById('produtos-lista-principal').style.display = 'none';
  document.getElementById('produtos-form-section').style.display = 'block';
  
  // Limpa o formulário
  limparFormularioProduto();
  
  // Configura para modo cadastro
  document.getElementById('form-title').textContent = '➕ Cadastrar Novo Produto';
  document.getElementById('btn-submit-produto').textContent = '💾 Cadastrar Produto';
  
  // Remove classes de edição
  document.getElementById('btn-submit-produto').classList.remove('btn-warning');
  
  // Configura o submit
  document.getElementById('form-produto').onsubmit = function(event) {
    cadastrarProduto(event);
  };
}

// Função para voltar para a lista
function voltarParaLista() {
  // Esconder formulário e mostrar lista
  document.getElementById('produtos-form-section').style.display = 'none';
  document.getElementById('produtos-lista-principal').style.display = 'block';
  
  // Limpar formulário se estava em modo edição
  if (window.produtoEditando) {
    limparFormularioProduto();
    
    // Restaurar formulário para modo cadastro
    const form = document.getElementById('form-produto');
    if (form) {
      form.onsubmit = function(event) {
        event.preventDefault();
        cadastrarProduto(event);
      };
    }
    
    // Restaurar botão
    const btnSubmit = document.getElementById('btn-submit-produto');
    if (btnSubmit) {
      btnSubmit.innerHTML = '💾 Cadastrar Produto';
      btnSubmit.classList.remove('btn-warning');
    }
    
    // Restaurar título
    const titleElement = document.getElementById('form-title');
    if (titleElement) {
      titleElement.textContent = '📦 Cadastrar Novo Produto';
    }
    
    // Limpar estado de edição
    window.produtoEditando = null;
  }
  
  // Recarrega a lista de produtos
  carregarProdutosCadastrados();
}

// Função para processar formulário (compatibilidade)
function processarFormularioProduto(event) {
  // Esta função será redirecionada pela configuração do onsubmit
  // Permite flexibilidade entre cadastro e edição
}

// =================== FUNÇÕES UTILITÁRIAS DE PRODUTOS ===================

// Função para obter produtos do localStorage
function obterProdutos() {
  return JSON.parse(localStorage.getItem('produtos') || '[]');
}

// Função para salvar produtos no localStorage
function salvarProdutos(produtos) {
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para obter a imagem principal do produto
function obterImagemPrincipalProduto(produto) {
  // Primeiro, tentar obter imagens por cor do produto
  if (produto.imagensPorCor && Object.keys(produto.imagensPorCor).length > 0) {
    // Pegar a primeira imagem disponível
    const primeiraImagem = Object.values(produto.imagensPorCor)[0];
    if (primeiraImagem) {
      return primeiraImagem;
    }
  }
  
  // Tentar obter imagens das cores do localStorage (sistema antigo)
  const imagensCores = JSON.parse(localStorage.getItem('imagensCores') || '{}');
  
  // Se o produto tem cores, tentar encontrar a primeira imagem disponível
  if (produto.cores && produto.cores.length > 0) {
    for (const cor of produto.cores) {
      const corId = typeof cor === 'string' ? cor : cor.id;
      const corNome = typeof cor === 'string' ? cor : cor.nome;
      
      // Tentar por ID primeiro, depois por nome
      if (imagensCores[corId]) {
        return imagensCores[corId];
      }
      if (imagensCores[corNome]) {
        return imagensCores[corNome];
      }
    }
  }
  
  // Se não encontrou imagem, usar a padrão
  return 'assets/images/produtos/produto-default.jpg';
}

// Função para carregar produtos em cards
function carregarProdutosCards() {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const produtosGrid = document.getElementById('produtos-grid');
  const emptyState = document.getElementById('produtos-empty');
  
  if (produtos.length === 0) {
    produtosGrid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  produtosGrid.innerHTML = '';
  
  produtos.forEach(produto => {
    const card = criarCardProduto(produto);
    produtosGrid.appendChild(card);
  });
}

// Função para criar card de produto
function criarCardProduto(produto) {
  const card = document.createElement('div');
  card.className = 'produto-card';
  
  // Construir HTML das cores com visualizador de imagens
  let coresHtml = '';
  if (produto.cores && produto.cores.length > 0) {
    const coresItems = produto.cores.map(cor => {
      // Suporte para formato antigo (string) e novo (objeto)
      const corNome = typeof cor === 'string' ? cor : cor.nome;
      const corHex = typeof cor === 'string' ? getCorStyle(cor) : cor.hex;
      const corId = typeof cor === 'string' ? cor : cor.id;
      
      const temImagem = produto.imagensPorCor && produto.imagensPorCor[corId];
      return `<div class="cor-mini ${temImagem ? 'tem-imagem' : ''}" 
                   style="background-color: ${corHex}; ${corHex === '#ffffff' || corHex === '#FFFFFF' ? 'border: 1px solid #ddd;' : ''}" 
                   title="${corNome}${temImagem ? ' (com foto)' : ''}"
                   onclick="mostrarImagemCor('${produto.id}', '${corId}')"
                   ${temImagem ? 'data-has-image="true"' : ''}></div>`;
    }).join('');
    coresHtml = coresItems;
  } else {
    coresHtml = '<span style="color: #999; font-size: 12px;">Nenhuma</span>';
  }
  
  // Construir HTML dos tamanhos
  let tamanhosHtml = '';
  if (produto.tamanhos && produto.tamanhos.length > 0) {
    const tamanhosItems = produto.tamanhos.map(tamanho => 
      `<span class="tamanho-mini">${tamanho}</span>`
    ).join('');
    tamanhosHtml = tamanhosItems;
  } else {
    tamanhosHtml = '<span style="color: #999; font-size: 12px;">Nenhum</span>';
  }
  
  const statusClass = produto.ativo ? 'ativo' : 'inativo';
  const statusText = produto.ativo ? 'Ativo' : 'Inativo';
  const statusIcon = produto.ativo ? '✅' : '❌';
  
  card.innerHTML = `
    <div class="produto-card-header">
      <h3 class="produto-nome" title="${produto.nome || 'Sem nome'}">${produto.nome || 'Sem nome'}</h3>
      <div class="produto-status ${statusClass}">${statusIcon} ${statusText}</div>
    </div>
    
    <!-- Visualizador de imagem principal -->
    <div class="produto-imagem-principal" id="imagem-principal-${produto.id}">
      <img src="${obterImagemPrincipalProduto(produto)}" alt="${produto.nome}" class="produto-img">
      <div class="produto-imagem-overlay">
        <span class="produto-imagem-hint">Clique nas cores para ver as fotos</span>
      </div>
    </div>
    
    <div class="produto-info">
      <div class="produto-info-row">
        <span class="produto-info-label">Categoria:</span>
        <span class="produto-categoria">${produto.categoria || 'Sem categoria'}</span>
      </div>
      
      <div class="produto-info-row">
        <span class="produto-info-label">Pontos:</span>
        <span class="produto-pontos">${produto.pontos || 0}</span>
      </div>
      
      <div class="produto-info-row">
        <span class="produto-info-label">Cores:</span>
        <div class="produto-cores">${coresHtml}</div>
      </div>
      
      <div class="produto-info-row">
        <span class="produto-info-label">Tamanhos:</span>
        <div class="produto-tamanhos">${tamanhosHtml}</div>
      </div>
    </div>
    
    <div class="produto-acoes">
      <button class="btn-acao btn-editar" onclick="editarProdutoTabela('${produto.id}')">
        ✏️ Editar
      </button>
      <button class="btn-acao ${produto.ativo ? 'btn-toggle-ativo' : 'btn-toggle-inativo'}" onclick="toggleProdutoStatus('${produto.id}')">
        ${produto.ativo ? '👁️‍🗨️ Desativar' : '👁️ Ativar'}
      </button>
      <button class="btn-acao btn-excluir" onclick="excluirProdutoCompleto('${produto.id}')">
        🗑️ Excluir
      </button>
    </div>
  `;
  
  return card;
}

// Função para exibir o botão "Cadastrar Produto"
function exibirBotaoCadastrarProduto() {
  const botaoCadastrar = document.getElementById('btn-cadastrar-produto');
  if (botaoCadastrar) {
    botaoCadastrar.style.display = 'block';
  }
}
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

// Função de teste para debug
function testarEdicao() {
  console.log('=== TESTANDO EDIÇÃO ===');
  
  // Obter produtos
  const produtos = obterProdutos();
  console.log('Produtos disponíveis:', produtos);
  
  if (produtos.length === 0) {
    console.log('Nenhum produto encontrado para teste');
    return;
  }
  
  // Pegar o primeiro produto
  const primeiroId = produtos[0].id;
  console.log('Testando com produto ID:', primeiroId);
  
  // Chamar a função de edição
  editarProdutoTabela(primeiroId);
}

// Função para forçar exibição do formulário
function mostrarFormulario() {
  console.log('=== FORÇANDO EXIBIÇÃO DO FORMULÁRIO ===');
  
  const listaElement = document.getElementById('produtos-lista-principal');
  const formElement = document.getElementById('produtos-form-section');
  
  if (listaElement) {
    listaElement.style.display = 'none';
    console.log('Lista ocultada');
  }
  
  if (formElement) {
    formElement.style.display = 'block';
    formElement.style.visibility = 'visible';
    console.log('Formulário exibido');
  }
  
  // Rolar para o topo
  window.scrollTo(0, 0);
}

// Função para verificar estado dos elementos
function verificarEstadoElementos() {
  console.log('=== VERIFICANDO ESTADO DOS ELEMENTOS ===');
  
  const listaElement = document.getElementById('produtos-lista-principal');
  const formElement = document.getElementById('produtos-form-section');
  
  console.log('Lista Element:', listaElement ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
  if (listaElement) {
    console.log('  - Display:', listaElement.style.display);
    console.log('  - Altura:', listaElement.offsetHeight);
  }
  
  console.log('Form Element:', formElement ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
  if (formElement) {
    console.log('  - Display:', formElement.style.display);
    console.log('  - Altura:', formElement.offsetHeight);
    console.log('  - Visibilidade:', formElement.style.visibility);
  }
  
  console.log('=== VERIFICAÇÃO CONCLUÍDA ===');
}

// Função para filtrar produtos na tabela principal
function filtrarProdutosPrincipal() {
  const filtro = document.getElementById('filtro-produtos-busca').value.toLowerCase();
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  
  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(filtro) ||
    produto.categoria.toLowerCase().includes(filtro)
  );
  
  const produtosGrid = document.getElementById('produtos-grid');
  const emptyState = document.getElementById('produtos-empty');
  
  if (produtosFiltrados.length === 0) {
    produtosGrid.innerHTML = '';
    if (filtro.trim() === '') {
      emptyState.innerHTML = `
        <div class="empty-icon">📦</div>
        <h4>Nenhum produto cadastrado</h4>
        <p>Clique em "Cadastrar Produto" para adicionar o primeiro produto!</p>
      `;
    } else {
      emptyState.innerHTML = `
        <div class="empty-icon">🔍</div>
        <h4>Nenhum produto encontrado</h4>
        <p>Não foi encontrado nenhum produto com o filtro "${filtro}".</p>
      `;
    }
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  produtosGrid.innerHTML = '';
  
  produtosFiltrados.forEach(produto => {
    const card = criarCardProduto(produto);
    produtosGrid.appendChild(card);
  });
}

// Função para limpar formulário de produto
function limparFormularioProduto() {
  // Limpar todos os campos do formulário
  document.getElementById('form-produto').reset();
  
  // Limpar campos específicos que podem não ser limpos pelo reset()
  document.getElementById('produto-nome').value = '';
  document.getElementById('produto-pontos').value = '';
  document.getElementById('produto-ativo').selectedIndex = 0;
  document.getElementById('produto-categoria').selectedIndex = 0;
  
  // Limpar cores selecionadas do novo sistema
  localStorage.removeItem('coresSelecionadas');
  
  // Desmarca todos os checkboxes de cores (compatibilidade)
  document.querySelectorAll('input[name="cores"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // Desmarca todos os checkboxes de tamanhos
  document.querySelectorAll('input[name="tamanhos"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // Limpar a seção de fotos por cor
  const fotosContainer = document.getElementById('fotos-por-cor-section');
  if (fotosContainer) {
    fotosContainer.innerHTML = `
      <div class="cores-imagens-info">
        <p>Selecione as cores acima para fazer upload das fotos correspondentes</p>
      </div>
    `;
  }
  
  // Limpar imagens da memória
  if (window.produtoImagens) {
    window.produtoImagens = {};
  }
  
  // Limpar qualquer estado de edição
  window.produtoEditando = null;
  
  // Atualizar texto do botão para "Cadastrar"
  const btnSubmit = document.getElementById('btn-submit-produto');
  if (btnSubmit) {
    btnSubmit.textContent = '💾 Cadastrar Produto';
  }
  
  // Atualizar exibição das cores
  atualizarExibicaoCoresSelecionadas();
}

// ===== SISTEMA DE UPLOAD DE IMAGENS POR COR =====

// Função para mostrar/ocultar campos de upload quando uma cor é selecionada
function toggleImageUpload(cor) {
  const checkbox = document.getElementById(`cor-${cor}`);
  const container = document.getElementById('cores-imagens-container');
  const existingUpload = document.getElementById(`upload-${cor}`);
  
  if (checkbox.checked && !existingUpload) {
    // Criar campo de upload para esta cor
    criarCampoUploadCor(cor);
  } else if (!checkbox.checked && existingUpload) {
    // Remover campo de upload desta cor
    existingUpload.remove();
    
    // Remover imagem da memória
    if (window.produtoImagens && window.produtoImagens[cor]) {
      delete window.produtoImagens[cor];
    }
    
    // Se não há mais campos de upload, mostrar a mensagem padrão
    if (container.children.length === 0) {
      container.innerHTML = `
        <div class="cores-imagens-info">
          <p>Selecione as cores acima para fazer upload das fotos correspondentes</p>
        </div>
      `;
    }
  }
}

// Função para criar campo de upload para uma cor específica
function criarCampoUploadCor(cor) {
  const container = document.getElementById('cores-imagens-container');
  
  // Remover mensagem padrão se existir
  const infoMessage = container.querySelector('.cores-imagens-info');
  if (infoMessage) {
    infoMessage.remove();
  }
  
  const uploadDiv = document.createElement('div');
  uploadDiv.className = 'cor-imagem-upload';
  uploadDiv.id = `upload-${cor}`;
  
  const corStyle = getCorStyle(cor);
  const corNome = cor.charAt(0).toUpperCase() + cor.slice(1);
  
  uploadDiv.innerHTML = `
    <div class="cor-imagem-label">
      <div class="cor-imagem-preview" style="background-color: ${corStyle};"></div>
      <span>${corNome}</span>
    </div>
    <div class="imagem-upload-area">
      <input type="file" id="file-${cor}" class="imagem-upload-input" accept="image/*" onchange="handleImageUpload('${cor}', this)">
      <button type="button" class="imagem-upload-btn" onclick="document.getElementById('file-${cor}').click()">
        📷 Selecionar Foto
      </button>
      <div id="preview-${cor}" class="imagem-preview-container" style="display: none;">
        <img id="img-${cor}" class="imagem-preview" src="" alt="Preview ${corNome}">
        <div class="imagem-info">
          <div id="info-${cor}"></div>
        </div>
        <button type="button" class="imagem-remove-btn" onclick="removeImage('${cor}')">
          🗑️ Remover
        </button>
      </div>
    </div>
  `;
  
  container.appendChild(uploadDiv);
}

// Função para processar upload de imagem
function handleImageUpload(cor, input) {
  const file = input.files[0];
  if (!file) return;
  
  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    mostrarToast('Erro', 'Por favor, selecione apenas arquivos de imagem.', 'error');
    return;
  }
  
  // Validar tamanho do arquivo (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    mostrarToast('Erro', 'A imagem deve ter no máximo 5MB.', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewContainer = document.getElementById(`preview-${cor}`);
    const imgElement = document.getElementById(`img-${cor}`);
    const infoElement = document.getElementById(`info-${cor}`);
    
    imgElement.src = e.target.result;
    infoElement.innerHTML = `
      <strong>${file.name}</strong><br>
      <small>${formatFileSize(file.size)}</small>
    `;
    
    previewContainer.style.display = 'flex';
    
    // Armazenar a imagem no produto (será salva quando o formulário for submetido)
    if (!window.produtoImagens) {
      window.produtoImagens = {};
    }
    window.produtoImagens[cor] = e.target.result;
    
    mostrarToast('Sucesso', `Imagem para cor ${cor} carregada com sucesso!`, 'success');
  };
  
  reader.readAsDataURL(file);
}

// Função para remover imagem
function removeImage(cor) {
  const previewContainer = document.getElementById(`preview-${cor}`);
  const input = document.getElementById(`file-${cor}`);
  
  previewContainer.style.display = 'none';
  input.value = '';
  
  // Remover da memória
  if (window.produtoImagens && window.produtoImagens[cor]) {
    delete window.produtoImagens[cor];
  }
  
  mostrarToast('Info', `Imagem da cor ${cor} removida.`, 'info');
}

// Função para formatar tamanho do arquivo
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Função para mostrar imagem da cor selecionada
function mostrarImagemCor(produtoId, cor) {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const produto = produtos.find(p => p.id === produtoId);
  
  if (!produto || !produto.imagensPorCor || !produto.imagensPorCor[cor]) {
    mostrarToast('Info', `Não há imagem específica para a cor ${cor}`, 'info');
    return;
  }
  
  const imagemPrincipal = document.getElementById(`imagem-principal-${produtoId}`);
  const img = imagemPrincipal.querySelector('.produto-img');
  
  // Atualizar a imagem principal
  img.src = produto.imagensPorCor[cor];
  img.alt = `${produto.nome} - ${cor}`;
  
  // Adicionar efeito visual
  img.style.opacity = '0.7';
  setTimeout(() => {
    img.style.opacity = '1';
  }, 200);
  
  // Atualizar todas as cores para mostrar qual está selecionada
  const coresContainer = imagemPrincipal.closest('.produto-card').querySelector('.produto-cores');
  coresContainer.querySelectorAll('.cor-mini').forEach(corElement => {
    corElement.classList.remove('cor-selecionada');
  });
  
  // Marcar a cor atual como selecionada
  const corSelecionada = coresContainer.querySelector(`[title*="${cor}"]`);
  if (corSelecionada) {
    corSelecionada.classList.add('cor-selecionada');
  }
}

// Função para carregar produtos cadastrados
function carregarProdutosCadastrados() {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const container = document.getElementById('produtos-lista');
  
  if (produtos.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #6c757d;">
        <p>📦 Nenhum produto cadastrado ainda.</p>
        <p>Use o formulário acima para cadastrar o primeiro produto!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  
  produtos.forEach(produto => {
    const produtoCard = criarCardProduto(produto);
    container.appendChild(produtoCard);
  });
}

// Função para criar card do produto
function criarCardProduto(produto) {
  const card = document.createElement('div');
  card.className = `produto-card ${produto.ativo ? 'ativo' : 'inativo'}`;
  
  const coresHtml = produto.cores.map(cor => {
    const corStyle = getCorStyle(cor);
    return `<span class="produto-cor" style="background-color: ${corStyle};"></span>`;
  }).join('');
  
  const tamanhosHtml = produto.tamanhos.map(tamanho => {
    return `<span class="produto-tamanho">${tamanho}</span>`;
  }).join('');
  
  card.innerHTML = `
    <div class="produto-status">${produto.ativo ? 'Ativo' : 'Inativo'}</div>
    <div class="produto-nome">${produto.nome}</div>
    <div class="produto-info">
      <span class="produto-categoria">${produto.categoria}</span>
      <span class="produto-pontos">${produto.pontos} pontos</span>
    </div>
    <div class="produto-variacoes">
      <h6>Cores:</h6>
      <div class="produto-cores">${coresHtml}</div>
      <h6>Tamanhos:</h6>
      <div class="produto-tamanhos">${tamanhosHtml}</div>
    </div>
    <div class="produto-actions">
      <button class="btn-editar" onclick="editarProduto('${produto.id}')">✏️ Editar</button>
      <button class="btn-toggle" onclick="toggleProdutoStatus('${produto.id}')">
        ${produto.ativo ? '👁️‍🗨️ Desativar' : '👁️ Ativar'}
      </button>
      <button class="btn-excluir" onclick="excluirProdutoCompleto('${produto.id}')">🗑️ Excluir</button>
    </div>
  `;
  
  return card;
}

// Função para obter estilo da cor
function getCorStyle(cor) {
  const cores = {
    'branco': '#ffffff',
    'preto': '#000000',
    'azul': '#007bff',
    'verde': '#28a745',
    'vermelho': '#dc3545',
    'cinza': '#6c757d'
  };
  
  return cores[cor] || '#cccccc';
}

// Função para filtrar produtos na lista
function filtrarProdutosLista() {
  const filtro = document.getElementById('filtro-produtos-lista').value.toLowerCase();
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const container = document.getElementById('produtos-lista');
  
  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(filtro) ||
    produto.categoria.toLowerCase().includes(filtro)
  );
  
  if (produtosFiltrados.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #6c757d;">
        <p>🔍 Nenhum produto encontrado com o filtro "${filtro}".</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  produtosFiltrados.forEach(produto => {
    const produtoCard = criarCardProduto(produto);
    container.appendChild(produtoCard);
  });
}

// Função para editar produto
function editarProduto(produtoId) {
  console.log('=== INICIANDO EDIÇÃO DO PRODUTO ===');
  console.log('ID do produto:', produtoId);
  
  try {
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!produto) {
      mostrarToast('Erro', 'Produto não encontrado!', 'error');
      return;
    }
    
    console.log('Produto encontrado:', produto);
    
    // Primeiro, mostrar o formulário de cadastro
    const listaElement = document.getElementById('produtos-lista-principal');
    const formElement = document.getElementById('produtos-form-section');
    
    if (listaElement && formElement) {
      listaElement.style.display = 'none';
      formElement.style.display = 'block';
    }
    
    // Aguardar um pouco para garantir que o formulário está visível
    setTimeout(() => {
      // Primeiro, garantir que as cores estão carregadas
      if (typeof atualizarCoresFormulario === 'function') {
        atualizarCoresFormulario();
      }
      
      // Preenche o formulário com os dados do produto
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
      
      // Processar cores do produto
      if (produto.cores && produto.cores.length > 0) {
        console.log('=== DEBUG CORES ===');
        console.log('Cores do produto:', produto.cores);
        
        // Limpar seleções anteriores
        document.querySelectorAll('input[name="cores"]').forEach(checkbox => {
          checkbox.checked = false;
        });
        
        // Limpar localStorage de cores selecionadas
        localStorage.removeItem('coresSelecionadas');
        
        // Determinar formato das cores e selecionar
        const coresSelecionadasIds = [];
        
        // Verificar se é array de strings ou objetos
        produto.cores.forEach(cor => {
          if (typeof cor === 'string') {
            coresSelecionadasIds.push(cor);
          } else if (cor && cor.id) {
            coresSelecionadasIds.push(cor.id);
          } else if (cor && cor.nome) {
            coresSelecionadasIds.push(cor.nome.toLowerCase().replace(/\s+/g, '-'));
          }
        });
        
        console.log('IDs das cores para selecionar:', coresSelecionadasIds);
        
        // Salvar cores selecionadas no localStorage
        localStorage.setItem('coresSelecionadas', JSON.stringify(coresSelecionadasIds));
        
        // Verificar quais checkboxes existem
        const checkboxesDisponiveis = [];
        document.querySelectorAll('input[name="cores"]').forEach(checkbox => {
          checkboxesDisponiveis.push(checkbox.value);
        });
        console.log('Checkboxes de cores disponíveis:', checkboxesDisponiveis);
        
        // Marcar checkboxes das cores
        let coresSelecionadas = 0;
        document.querySelectorAll('input[name="cores"]').forEach(checkbox => {
          if (coresSelecionadasIds.includes(checkbox.value)) {
            checkbox.checked = true;
            coresSelecionadas++;
            console.log('Cor selecionada:', checkbox.value);
          }
        });
        
        console.log(`Total de cores selecionadas: ${coresSelecionadas}`);
        
        // Atualizar exibição das cores selecionadas
        if (typeof atualizarExibicaoCoresSelecionadas === 'function') {
          atualizarExibicaoCoresSelecionadas();
        }
      } else {
        // Se não há cores no produto, limpar localStorage
        localStorage.removeItem('coresSelecionadas');
        if (typeof atualizarExibicaoCoresSelecionadas === 'function') {
          atualizarExibicaoCoresSelecionadas();
        }
      }
      
      // Processar tamanhos do produto
      if (produto.tamanhos && produto.tamanhos.length > 0) {
        // Limpar seleções anteriores
        document.querySelectorAll('input[name="tamanhos"]').forEach(checkbox => {
          checkbox.checked = false;
        });
        
        // Marcar tamanhos selecionados
        document.querySelectorAll('input[name="tamanhos"]').forEach(checkbox => {
          if (produto.tamanhos.includes(checkbox.value)) {
            checkbox.checked = true;
          }
        });
      }
      
      // Configurar o formulário para edição
      const form = document.getElementById('form-produto');
      if (form) {
        form.onsubmit = function(event) {
          event.preventDefault();
          salvarEdicaoProduto(produtoId);
        };
      }
      
      // Configurar botão de submit
      const botaoSubmit = form.querySelector('button[type="submit"]');
      if (botaoSubmit) {
        botaoSubmit.innerHTML = '💾 Salvar Alterações';
        botaoSubmit.classList.add('btn-warning');
      }
      
      // Marcar que estamos editando
      window.produtoEditando = produtoId;
      
      // Scroll para o formulário
      form.scrollIntoView({ behavior: 'smooth' });
      
      console.log('=== EDIÇÃO CONFIGURADA COM SUCESSO ===');
      mostrarToast('Info', 'Produto carregado para edição!', 'info');
      
    }, 100);
    
  } catch (error) {
    console.error('=== ERRO NA EDIÇÃO ===', error);
    mostrarToast('Erro', 'Erro ao carregar produto: ' + error.message, 'error');
  }
}

// Função para salvar edição do produto
function salvarEdicaoProduto(produtoId) {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const index = produtos.findIndex(p => p.id === produtoId);
  
  if (index === -1) {
    mostrarToast('Erro', 'Produto não encontrado!', 'error');
    return;
  }
  
  const nome = document.getElementById('produto-nome').value;
  const pontos = parseInt(document.getElementById('produto-pontos').value);
  const categoria = document.getElementById('produto-categoria').value;
  const ativo = document.getElementById('produto-ativo').value === 'true';
  
  // Coleta cores selecionadas usando o novo sistema
  const coresSelecionadasIds = obterCoresSelecionadas();
  const todasCores = obterCores();
  const coresSelecionadas = coresSelecionadasIds.map(id => {
    const cor = todasCores.find(c => c.id === id);
    return cor ? { id: cor.id, nome: cor.nome, hex: cor.hex } : null;
  }).filter(Boolean);
  
  // Coleta tamanhos selecionados
  const tamanhosSelecionados = [];
  document.querySelectorAll('input[name="tamanhos"]:checked').forEach(checkbox => {
    tamanhosSelecionados.push(checkbox.value);
  });
  
  // Validações
  if (!nome || !pontos || !categoria || coresSelecionadas.length === 0 || tamanhosSelecionados.length === 0) {
    mostrarToast('Erro', 'Por favor, preencha todos os campos obrigatórios!', 'error');
    return;
  }
  
  // Atualiza o produto
  produtos[index] = {
    ...produtos[index],
    nome: nome,
    pontos: pontos,
    categoria: categoria,
    cores: coresSelecionadas, // Agora inclui objetos completos das cores
    tamanhos: tamanhosSelecionados,
    ativo: ativo,
    dataEdicao: new Date().toISOString(),
    // Manter ou atualizar imagens por cor
    imagensPorCor: window.produtoImagens || produtos[index].imagensPorCor || {}
  };
  
  localStorage.setItem('produtos', JSON.stringify(produtos));
  
  mostrarToast('Sucesso', 'Produto editado com sucesso!', 'success');
  
  // Sincronizar com a vitrine de prêmios
  sincronizarProdutosVitrine();
  
  // Volta para a lista
  voltarParaLista();
}

// Função para restaurar formulário para modo cadastro
function restaurarFormularioCadastro() {
  const form = document.getElementById('form-produto');
  form.onsubmit = function(event) {
    event.preventDefault();
    cadastrarProduto(event);
  };
  
  const botaoSubmit = form.querySelector('button[type="submit"]');
  botaoSubmit.innerHTML = '💾 Cadastrar Produto';
  botaoSubmit.classList.remove('btn-warning');
  
  limparFormularioProduto();
}

// Função para criar produtos de exemplo (para teste)
function criarProdutosExemplo() {
  const produtos = [
    {
      id: 'prod-001',
      nome: 'Camiseta Básica',
      pontos: 50,
      categoria: 'Vestuário',
      cores: [
        { id: 'branco', nome: 'Branco', hex: '#ffffff' },
        { id: 'preto', nome: 'Preto', hex: '#000000' }
      ],
      tamanhos: ['P', 'M', 'G'],
      ativo: true,
      dataCadastro: new Date().toISOString(),
      imagensPorCor: {}
    },
    {
      id: 'prod-002',
      nome: 'Calça Jeans',
      pontos: 120,
      categoria: 'Vestuário',
      cores: [
        { id: 'azul', nome: 'Azul', hex: '#1e40af' },
        { id: 'preto', nome: 'Preto', hex: '#000000' }
      ],
      tamanhos: ['36', '38', '40', '42'],
      ativo: true,
      dataCadastro: new Date().toISOString(),
      imagensPorCor: {}
    }
  ];
  
  localStorage.setItem('produtos', JSON.stringify(produtos));
  mostrarToast('Sucesso', 'Produtos de exemplo criados!', 'success');
  
  // Recarregar a lista
  if (document.getElementById('produtos-lista-principal').style.display !== 'none') {
    carregarProdutosCadastrados();
  }
}

// Função para toggle do status do produto
function toggleProdutoStatus(produtoId) {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const index = produtos.findIndex(p => p.id === produtoId);
  
  if (index === -1) {
    mostrarToast('Erro', 'Produto não encontrado!', 'error');
    return;
  }
  
  produtos[index].ativo = !produtos[index].ativo;
  localStorage.setItem('produtos', JSON.stringify(produtos));
  
  const status = produtos[index].ativo ? 'ativado' : 'desativado';
  mostrarToast('Sucesso', `Produto ${status} com sucesso!`, 'success');
  
  // Sincronizar com a vitrine de prêmios
  sincronizarProdutosVitrine();
  
  // Recarrega a tabela se estivermos na lista principal
  if (document.getElementById('produtos-lista-principal').style.display !== 'none') {
    carregarProdutosCards();
  }
}

// Função para excluir produto completo
function excluirProdutoCompleto(produtoId) {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const produto = produtos.find(p => p.id === produtoId);
  
  if (!produto) {
    mostrarToast('Erro', 'Produto não encontrado!', 'error');
    return;
  }
  
  if (confirm(`Tem certeza que deseja excluir o produto "${produto.nome}"? Esta ação não pode ser desfeita.`)) {
    const produtosFiltrados = produtos.filter(p => p.id !== produtoId);
    localStorage.setItem('produtos', JSON.stringify(produtosFiltrados));
    
    mostrarToast('Sucesso', 'Produto excluído com sucesso!', 'success');
    
    // Sincronizar com a vitrine de prêmios
    sincronizarProdutosVitrine();
    
    // Recarrega a tabela se estivermos na lista principal
    if (document.getElementById('produtos-lista-principal').style.display !== 'none') {
      carregarProdutosCards();
    }
  }
}

// =================== INICIALIZAÇÃO DO SISTEMA ===================

// Função para inicializar sistema de produtos
function inicializarSistemaProdutos() {
  // Adiciona event listener ao formulário de produto
  const formProduto = document.getElementById('form-produto');
  if (formProduto) {
    formProduto.addEventListener('submit', processarFormularioProduto);
  }
  
  // Adiciona event listener ao filtro de produtos principal
  const filtroBusca = document.getElementById('filtro-produtos-busca');
  if (filtroBusca) {
    filtroBusca.addEventListener('input', filtrarProdutosPrincipal);
  }
  
  // Carrega produtos se a aba estiver ativa
  const abaAtiva = document.querySelector('.aba.active');
  if (abaAtiva && abaAtiva.getAttribute('data-aba') === 'produtos') {
    carregarProdutosCards();
  }
  
  // Configura o formulário para modo cadastro por padrão
  if (document.getElementById('form-produto')) {
    document.getElementById('form-produto').onsubmit = function(event) {
      cadastrarProduto(event);
    };
  }
}

// Função para atualizar as abas com produtos
function atualizarAbasComProdutos() {
  const abasProdutos = document.querySelector('.aba[data-aba="produtos"]');
  if (abasProdutos) {
    abasProdutos.addEventListener('click', function() {
      setTimeout(() => {
        carregarProdutosCards();
      }, 100);
    });
  }
}

// Inicializar sistema quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Aguarda um pouco para garantir que o DOM esteja completamente carregado
  setTimeout(() => {
    inicializarSistemaProdutos();
    atualizarAbasComProdutos();
  }, 500);
});

// Observa mudanças no DOM para recarregar produtos quando necessário
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      const abaProdutos = document.querySelector('.aba[data-aba="produtos"]');
      if (abaProdutos && !abaProdutos.hasAttribute('data-listener')) {
        abaProdutos.setAttribute('data-listener', 'true');
        abaProdutos.addEventListener('click', function() {
          setTimeout(() => {
            carregarProdutosCards();
          }, 100);
        });
      }
    }
  });
});

// Observa mudanças no container principal
const containerPrincipal = document.querySelector('.container') || document.body;
observer.observe(containerPrincipal, {
  childList: true,
  subtree: true
});

// ===== GERENCIADOR DE CORES =====

// Cores padrão do sistema
const coresPadrao = [
  { id: 'preto', nome: 'Preto', hex: '#000000' },
  { id: 'branco', nome: 'Branco', hex: '#ffffff' },
  { id: 'vermelho', nome: 'Vermelho', hex: '#dc3545' },
  { id: 'azul', nome: 'Azul', hex: '#007bff' },
  { id: 'verde', nome: 'Verde', hex: '#28a745' },
  { id: 'amarelo', nome: 'Amarelo', hex: '#ffc107' },
  { id: 'rosa', nome: 'Rosa', hex: '#e83e8c' },
  { id: 'roxo', nome: 'Roxo', hex: '#6f42c1' },
  { id: 'laranja', nome: 'Laranja', hex: '#fd7e14' },
  { id: 'cinza', nome: 'Cinza', hex: '#6c757d' },
  { id: 'marrom', nome: 'Marrom', hex: '#8b4513' },
  { id: 'bege', nome: 'Bege', hex: '#f5f5dc' },
  { id: 'verde-militar', nome: 'Verde Militar', hex: '#556b2f' },
  { id: 'cappuccino', nome: 'Cappuccino', hex: '#8b7355' }
];

// Função para obter cores com retry
function obterCores() {
  try {
    const coresSalvas = localStorage.getItem('coresPersonalizadas');
    if (coresSalvas) {
      const cores = JSON.parse(coresSalvas);
      // Validar se as cores têm a estrutura correta
      if (Array.isArray(cores) && cores.length > 0) {
        return cores;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar cores personalizadas:', error);
  }
  return [...coresPadrao];
}

// Função para salvar cores com tratamento de erro
function salvarCores(cores) {
  try {
    localStorage.setItem('coresPersonalizadas', JSON.stringify(cores));
    return true;
  } catch (error) {
    console.error('Erro ao salvar cores:', error);
    alert('Erro ao salvar as cores. Tente novamente.');
    return false;
  }
}

// Função para abrir o gerenciador de cores
function abrirGerenciadorCores() {
  console.log('Abrindo gerenciador de cores...');
  
  const modal = document.getElementById('gerenciadorCoresModal');
  if (!modal) {
    console.error('Modal gerenciadorCoresModal não encontrado');
    alert('Erro: Modal não encontrado. Recarregue a página.');
    return;
  }
  
  modal.style.display = 'flex';
  
  // Carregar cores existentes
  carregarCoresExistentes();
  
  // Limpar o formulário de nova cor
  document.getElementById('nomeNovaCor').value = '';
  document.getElementById('hexNovaCor').value = '#000000';
  document.getElementById('corPicker').value = '#000000';
  
  console.log('Gerenciador de cores aberto com sucesso');
}

// Função para fechar o gerenciador de cores
function fecharGerenciadorCores() {
  const modal = document.getElementById('gerenciadorCoresModal');
  modal.style.display = 'none';
}

// Função para carregar cores existentes no modal
function carregarCoresExistentes() {
  const cores = obterCores();
  const container = document.getElementById('coresExistentes');
  
  if (!container) {
    console.error('Container coresExistentes não encontrado');
    return;
  }
  
  container.innerHTML = '';
  
  cores.forEach(cor => {
    const corDiv = document.createElement('div');
    corDiv.className = 'cor-existente';
    corDiv.innerHTML = `
      <div class="cor-existente-preview" 
           style="background-color: ${cor.hex}; border-color: ${cor.hex};" 
           onclick="editarCor('${cor.id}')" 
           title="Clique para editar"></div>
      <div class="cor-existente-info">
        <div class="cor-existente-nome">${cor.nome}</div>
        <div class="cor-existente-hex">${cor.hex}</div>
      </div>
      <div class="cor-existente-acoes">
        <button class="btn-selecionar-cor" onclick="selecionarCorParaProduto('${cor.id}')" title="Selecionar esta cor para o produto">
          ✓ Selecionar
        </button>
        <button class="btn-editar-cor" onclick="editarCor('${cor.id}')" title="Editar esta cor">
          ✏️ Editar
        </button>
        <button class="btn-excluir-cor" onclick="excluirCor('${cor.id}')" title="Excluir esta cor">
          🗑️ Excluir
        </button>
      </div>
    `;
    container.appendChild(corDiv);
  });
}

// Função para editar uma cor
function editarCor(corId) {
  const cores = obterCores();
  const cor = cores.find(c => c.id === corId);
  
  if (cor) {
    // Preencher os campos do formulário
    document.getElementById('nomeNovaCor').value = cor.nome;
    document.getElementById('hexNovaCor').value = cor.hex;
    document.getElementById('corPicker').value = cor.hex;
    
    // Remover a cor da lista (será re-adicionada quando clicar em "Adicionar Cor")
    const novasCores = cores.filter(c => c.id !== corId);
    salvarCores(novasCores);
    carregarCoresExistentes();
    atualizarCoresFormulario();
    
    // Focar no campo nome para facilitar a edição
    document.getElementById('nomeNovaCor').focus();
  }
}

// Função para excluir uma cor
function excluirCor(corId) {
  if (confirm('Tem certeza que deseja excluir esta cor?')) {
    const cores = obterCores();
    const novasCores = cores.filter(c => c.id !== corId);
    
    if (salvarCores(novasCores)) {
      carregarCoresExistentes();
      atualizarCoresFormulario();
      alert('Cor excluída com sucesso!');
    }
  }
}

// Função para adicionar nova cor
function adicionarNovaCor() {
  const nome = document.getElementById('nomeNovaCor').value.trim();
  const hex = document.getElementById('hexNovaCor').value.trim();
  
  if (!nome) {
    alert('Por favor, insira um nome para a cor.');
    return;
  }
  
  if (!hex || !hex.match(/^#[0-9A-Fa-f]{6}$/i)) {
    alert('Por favor, insira um código hexadecimal válido (exemplo: #FF0000).');
    return;
  }
  
  const cores = obterCores();
  
  // Gerar ID único baseado no nome
  let id = nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Garantir que o ID é único
  let contador = 1;
  const idOriginal = id;
  while (cores.some(c => c.id === id)) {
    id = `${idOriginal}-${contador}`;
    contador++;
  }
  
  // Verificar se já existe uma cor com o mesmo nome
  if (cores.some(c => c.nome.toLowerCase() === nome.toLowerCase())) {
    alert('Já existe uma cor com este nome.');
    return;
  }
  
  const novaCor = {
    id: id,
    nome: nome,
    hex: hex.toUpperCase()
  };
  
  cores.push(novaCor);
  
  if (salvarCores(cores)) {
    // Atualizar interface
    carregarCoresExistentes();
    atualizarCoresFormulario();
    
    // Limpar formulário
    document.getElementById('nomeNovaCor').value = '';
    document.getElementById('hexNovaCor').value = '#000000';
    document.getElementById('corPicker').value = '#000000';
    
    alert('Cor adicionada com sucesso!');
  }
}

// Função para atualizar as cores no formulário principal
function atualizarCoresFormulario() {
  const cores = obterCores();
  const container = document.getElementById('cores-container');
  
  if (container) {
    // Limpar container
    container.innerHTML = '';
    
    // Criar container para checkboxes ocultos
    let checkboxContainer = document.getElementById('cores-checkboxes-hidden');
    if (!checkboxContainer) {
      checkboxContainer = document.createElement('div');
      checkboxContainer.style.display = 'none';
      checkboxContainer.id = 'cores-checkboxes-hidden';
      container.appendChild(checkboxContainer);
    } else {
      checkboxContainer.innerHTML = '';
    }
    
    // Criar checkboxes ocultos para todas as cores
    cores.forEach(cor => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `cor-${cor.id}`;
      checkbox.name = 'cores';
      checkbox.value = cor.id;
      checkbox.onchange = () => toggleCorSelecionada(cor.id);
      checkboxContainer.appendChild(checkbox);
    });
    
    // Atualizar exibição das cores selecionadas
    atualizarExibicaoCoresSelecionadas();
  }
}

// Função para sincronizar color picker com campo hex
function sincronizarCorPicker() {
  const colorPicker = document.getElementById('corPicker');
  const hexInput = document.getElementById('hexNovaCor');
  
  if (colorPicker && hexInput) {
    // Quando o color picker muda, atualizar o campo hex
    colorPicker.addEventListener('input', function() {
      hexInput.value = this.value.toUpperCase();
    });
    
    // Quando o campo hex muda, atualizar o color picker
    hexInput.addEventListener('input', function() {
      const hex = this.value;
      if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
        colorPicker.value = hex;
      }
    });
  }
}

// Função para resetar cores para o padrão
function resetarCoresPadrao() {
  if (confirm('Tem certeza que deseja resetar todas as cores para o padrão? Esta ação não pode ser desfeita.')) {
    localStorage.removeItem('coresPersonalizadas');
    carregarCoresExistentes();
    atualizarCoresFormulario();
    alert('Cores resetadas para o padrão!');
  }
}

// Função para selecionar uma cor e aplicá-la ao produto
function selecionarCorParaProduto(corId) {
  console.log('Selecionando cor:', corId);
  
  const cores = obterCores();
  const corSelecionada = cores.find(c => c.id === corId);
  
  if (!corSelecionada) {
    console.error('Cor não encontrada:', corId);
    alert('Cor não encontrada!');
    return;
  }
  
  console.log('Cor encontrada:', corSelecionada);
  
  // Verificar se a cor já está selecionada
  const coresSelecionadas = obterCoresSelecionadas();
  if (coresSelecionadas.includes(corId)) {
    alert(`A cor "${corSelecionada.nome}" já está selecionada para este produto.`);
    fecharGerenciadorCores();
    return;
  }
  
  // Adicionar cor à lista de selecionadas
  adicionarCorSelecionada(corId);
  
  // Fechar o modal
  fecharGerenciadorCores();
  
  // Mostrar confirmação
  alert(`✅ Cor "${corSelecionada.nome}" adicionada ao produto!`);
  
  // Scroll para a seção de cores para mostrar a seleção
  const coresSection = document.querySelector('.cores-header');
  if (coresSection) {
    coresSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Função para obter cores selecionadas
function obterCoresSelecionadas() {
  return JSON.parse(localStorage.getItem('coresSelecionadas') || '[]');
}

// Função para adicionar uma cor selecionada
function adicionarCorSelecionada(corId) {
  const coresSelecionadas = obterCoresSelecionadas();
  if (!coresSelecionadas.includes(corId)) {
    coresSelecionadas.push(corId);
    localStorage.setItem('coresSelecionadas', JSON.stringify(coresSelecionadas));
    
    // Atualizar interface
    atualizarExibicaoCoresSelecionadas();
    mostrarUploadParaCor(corId);
  }
}

// Função para remover uma cor selecionada
function removerCorSelecionadaStorage(corId) {
  const coresSelecionadas = obterCoresSelecionadas();
  const index = coresSelecionadas.indexOf(corId);
  if (index > -1) {
    coresSelecionadas.splice(index, 1);
    localStorage.setItem('coresSelecionadas', JSON.stringify(coresSelecionadas));
    
    // Remover área de upload
    const uploadArea = document.getElementById(`upload-${corId}`);
    if (uploadArea) {
      uploadArea.remove();
    }
    
    // Verificar se não há mais cores selecionadas
    const uploadContainer = document.getElementById('cores-upload-container');
    if (uploadContainer && uploadContainer.children.length === 0) {
      uploadContainer.remove();
      
      // Mostrar mensagem informativa novamente
      const infoMsg = document.querySelector('.cores-imagens-info');
      if (infoMsg) {
        infoMsg.style.display = 'block';
      }
    }
    
    // Atualizar interface
    atualizarExibicaoCoresSelecionadas();
  }
}

// Função para controlar quando uma cor é selecionada/deselecionada
function toggleCorSelecionada(corId) {
  // Esta função agora é simplificada - usa o sistema de localStorage
  const coresSelecionadas = obterCoresSelecionadas();
  
  if (coresSelecionadas.includes(corId)) {
    // Cor está selecionada - mostrar área de upload
    mostrarUploadParaCor(corId);
  } else {
    // Cor foi deselecionada - remover área de upload
    const uploadArea = document.getElementById(`upload-${corId}`);
    if (uploadArea) {
      uploadArea.remove();
    }
    
    // Verificar se não há mais cores selecionadas
    const uploadContainer = document.getElementById('cores-upload-container');
    if (uploadContainer && uploadContainer.children.length === 0) {
      uploadContainer.remove();
      
      // Mostrar mensagem informativa novamente
      const infoMsg = document.querySelector('.cores-imagens-info');
      if (infoMsg) {
        infoMsg.style.display = 'block';
      }
    }
  }
}

// Função para atualizar a exibição das cores selecionadas
function atualizarExibicaoCoresSelecionadas() {
  const coresSelecionadasIds = obterCoresSelecionadas();
  const cores = obterCores();
  const coresSelecionadas = [];
  
  coresSelecionadasIds.forEach(corId => {
    const cor = cores.find(c => c.id === corId);
    if (cor) {
      coresSelecionadas.push(cor);
    }
  });
  
  // Atualizar container de cores selecionadas
  const container = document.getElementById('cores-container');
  if (container) {
    // Manter container de checkboxes ocultos
    const hiddenContainer = document.getElementById('cores-checkboxes-hidden');
    container.innerHTML = '';
    if (hiddenContainer) {
      container.appendChild(hiddenContainer);
    }
    
    if (coresSelecionadas.length === 0) {
      // Mostrar mensagem quando não há cores selecionadas
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'cores-vazias';
      emptyDiv.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 15px;">🎨</div>
        <p><strong>Nenhuma cor selecionada</strong></p>
        <p>Clique em "Gerenciar Cores" para adicionar cores ao produto.</p>
      `;
      container.appendChild(emptyDiv);
    } else {
      // Criar container para as cores selecionadas
      const coresContainer = document.createElement('div');
      coresContainer.className = 'cores-container';
      
      // Mostrar apenas as cores selecionadas
      coresSelecionadas.forEach(cor => {
        const corDiv = document.createElement('div');
        corDiv.className = 'cor-item cor-selecionada-item';
        corDiv.innerHTML = `
          <div class="cor-selecionada-display">
            <div class="cor-preview" style="background-color: ${cor.hex}; border-color: ${cor.hex};"></div>
            <span class="cor-nome">${cor.nome}</span>
            <button type="button" class="btn-remover-cor-selecionada" onclick="removerCorSelecionada('${cor.id}')" title="Remover esta cor">
              ✖
            </button>
          </div>
        `;
        coresContainer.appendChild(corDiv);
      });
      
      container.appendChild(coresContainer);
    }
  }
}

// Função para mostrar área de upload para uma cor específica
function mostrarUploadParaCor(corId) {
  const cores = obterCores();
  const cor = cores.find(c => c.id === corId);
  if (!cor) return;
  
  // Verificar se já existe área de upload para esta cor
  if (document.getElementById(`upload-${corId}`)) {
    return; // Já existe
  }
  
  // Ocultar mensagem informativa
  const infoMsg = document.querySelector('.cores-imagens-info');
  if (infoMsg) {
    infoMsg.style.display = 'none';
  }
  
  // Verificar se já existe container de upload
  let uploadContainer = document.getElementById('cores-upload-container');
  if (!uploadContainer) {
    uploadContainer = document.createElement('div');
    uploadContainer.id = 'cores-upload-container';
    uploadContainer.className = 'cores-upload-container';
    
    const fotosSection = document.querySelector('.fotos-por-cor-section');
    if (fotosSection) {
      fotosSection.appendChild(uploadContainer);
    }
  }
  
  // Criar área de upload
  const uploadArea = document.createElement('div');
  uploadArea.id = `upload-${corId}`;
  uploadArea.className = 'cor-upload-area';
  uploadArea.innerHTML = `
    <div class="cor-upload-header">
      <div class="cor-info">
        <div class="cor-preview-small" style="background-color: ${cor.hex}; border-color: ${cor.hex};"></div>
        <span class="cor-nome-upload">${cor.nome}</span>
      </div>
    </div>
    <div class="imagem-upload-area" id="imageUpload-${corId}">
      <div class="upload-placeholder" onclick="document.getElementById('imageInput-${corId}').click()">
        <span class="upload-icon">📷</span>
        <span class="upload-text">Clique para adicionar foto da cor ${cor.nome}</span>
      </div>
      <input type="file" id="imageInput-${corId}" accept="image/*" style="display: none;" onchange="handleImageUpload('${corId}', this)">
    </div>
  `;
  
  uploadContainer.appendChild(uploadArea);
}

// Função para remover uma cor selecionada
function removerCorSelecionada(corId) {
  removerCorSelecionadaStorage(corId);
}

// Função para tratar upload de imagem para uma cor específica
function handleImageUpload(corId, input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    
    // Salvar imagem no localStorage
    salvarImagemCor(corId, imageData);
    
    // Atualizar preview da imagem
    atualizarPreviewImagem(corId, imageData);
  };
  reader.readAsDataURL(file);
}

// Função para salvar imagem de uma cor no localStorage
function salvarImagemCor(corId, imageData) {
  const imagensCores = JSON.parse(localStorage.getItem('imagensCores') || '{}');
  imagensCores[corId] = imageData;
  localStorage.setItem('imagensCores', JSON.stringify(imagensCores));
}

// Função para atualizar preview da imagem
function atualizarPreviewImagem(corId, imageData) {
  const uploadArea = document.getElementById(`imageUpload-${corId}`);
  if (!uploadArea) return;
  
  uploadArea.innerHTML = `
    <div class="imagem-preview-container">
      <img src="${imageData}" alt="Imagem da cor" class="imagem-preview">
      <div class="imagem-acoes">
        <button type="button" class="btn-trocar-imagem" onclick="document.getElementById('imageInput-${corId}').click()">
          🔄 Trocar Imagem
        </button>
        <button type="button" class="btn-remover-imagem" onclick="removerImagemCor('${corId}')">
          🗑️ Remover
        </button>
      </div>
    </div>
    <input type="file" id="imageInput-${corId}" accept="image/*" style="display: none;" onchange="handleImageUpload('${corId}', this)">
  `;
}

// Função para remover imagem de uma cor
function removerImagemCor(corId) {
  if (confirm('Tem certeza que deseja remover esta imagem?')) {
    // Remover do localStorage
    const imagensCores = JSON.parse(localStorage.getItem('imagensCores') || '{}');
    delete imagensCores[corId];
    localStorage.setItem('imagensCores', JSON.stringify(imagensCores));
    
    // Restaurar área de upload
    const cores = obterCores();
    const cor = cores.find(c => c.id === corId);
    if (cor) {
      const uploadArea = document.getElementById(`imageUpload-${corId}`);
      if (uploadArea) {
        uploadArea.innerHTML = `
          <div class="upload-placeholder" onclick="document.getElementById('imageInput-${corId}').click()">
            <span class="upload-icon">📷</span>
            <span class="upload-text">Clique para adicionar foto da cor ${cor.nome}</span>
          </div>
          <input type="file" id="imageInput-${corId}" accept="image/*" style="display: none;" onchange="handleImageUpload('${corId}', this)">
        `;
      }
    }
  }
}

// Fechar modal quando clicar fora dele
window.onclick = function(event) {
  const modal = document.getElementById('gerenciadorCoresModal');
  if (event.target === modal) {
    fecharGerenciadorCores();
  }
}

// Carregar cores ao inicializar a página
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, inicializando sistema de cores...');
  
  // Aguardar um pouco para garantir que todos os elementos foram carregados
  setTimeout(() => {
    console.log('Atualizando cores do formulário...');
    atualizarCoresFormulario();
    
    console.log('Sincronizando color picker...');
    sincronizarCorPicker();
    
    console.log('Carregando cores selecionadas...');
    carregarCoresSelecionadas();
    
    console.log('Sistema de cores inicializado com sucesso');
  }, 200);
});

// Função para carregar cores já selecionadas e suas imagens
function carregarCoresSelecionadas() {
  console.log('Carregando cores selecionadas...');
  
  const coresSelecionadasIds = obterCoresSelecionadas();
  console.log('Cores selecionadas encontradas:', coresSelecionadasIds);
  
  // Aguardar um pouco para que a interface seja criada
  setTimeout(() => {
    coresSelecionadasIds.forEach(corId => {
      console.log('Processando cor:', corId);
      toggleCorSelecionada(corId);
      
      // Carregar imagem se existir
      const imagensCores = JSON.parse(localStorage.getItem('imagensCores') || '{}');
      if (imagensCores[corId]) {
        console.log('Carregando imagem para cor:', corId);
        setTimeout(() => {
          atualizarPreviewImagem(corId, imagensCores[corId]);
        }, 100);
      }
    });
  }, 100);
}

// Função de inicialização adicional para garantir que tudo funcione
function inicializarSistemaCores() {
  atualizarCoresFormulario();
  sincronizarCorPicker();
  carregarCoresSelecionadas();
}

// ===== INTEGRAÇÃO PRODUTOS - VITRINE DE PRÊMIOS =====

// Função para carregar produtos na vitrine de prêmios
function carregarProdutosNaVitrine() {
  const produtos = obterProdutos();
  const vitrine = document.getElementById('vitrine-premios');
  
  if (!vitrine) return;
  
  // Limpar vitrine atual
  vitrine.innerHTML = '';
  
  // Filtrar apenas produtos ativos
  const produtosAtivos = produtos.filter(produto => produto.ativo);
  
  if (produtosAtivos.length === 0) {
    vitrine.innerHTML = `
      <div class="vitrine-vazia">
        <div class="vitrine-vazia-icone">🎁</div>
        <h4>Nenhum produto disponível</h4>
        <p>Os produtos cadastrados na área administrativa aparecerão aqui automaticamente quando estiverem <strong>ativos</strong>.</p>
        <div class="vitrine-vazia-dica">
          <p>💡 <strong>Dica:</strong> Vá para a área <strong>Administrativa → Produtos</strong> para cadastrar novos produtos!</p>
        </div>
      </div>
    `;
    return;
  }
  
  // Criar card para cada produto ativo
  produtosAtivos.forEach(produto => {
    const cardProduto = criarCardProdutoVitrine(produto);
    vitrine.appendChild(cardProduto);
  });
  
  // Inicializar primeira cor de cada produto
  produtosAtivos.forEach(produto => {
    if (produto.cores && produto.cores.length > 0) {
      // Suportar formatos antigo e novo
      const primeiraCor = produto.cores[0];
      const corNome = typeof primeiraCor === 'string' ? primeiraCor : primeiraCor.nome;
      const corHex = typeof primeiraCor === 'string' ? getCorStyle(primeiraCor) : primeiraCor.hex;
      
      setTimeout(() => {
        selecionarCorProdutoVitrine(produto.id, corNome, corHex);
      }, 100);
    }
  });
}

// Função para criar card de produto na vitrine
function criarCardProdutoVitrine(produto) {
  const card = document.createElement('div');
  card.className = 'produto-vitrine-card';
  card.setAttribute('data-produto-id', produto.id);
  
  // Obter primeira imagem disponível
  const imagemPrincipal = obterImagemPrincipalProduto(produto);
  
  // Processar cores para suportar formatos antigo e novo
  const coresProcessadas = produto.cores.map(cor => {
    if (typeof cor === 'string') {
      // Formato antigo - converter para objeto
      return {
        id: cor,
        nome: cor,
        hex: getCorStyle(cor)
      };
    } else {
      // Formato novo - já é um objeto
      return cor;
    }
  });
  
  // Criar HTML do card
  card.innerHTML = `
    <div class="produto-imagem-container">
      <img src="${imagemPrincipal}" alt="${produto.nome}" class="produto-imagem">
    </div>
    <h4 class="produto-nome">${produto.nome.toUpperCase()}</h4>
    
    <div class="produto-cores">
      <label>Cor: <span class="nome-cor-selecionada" id="nome-cor-${produto.id}"></span></label>
      <div class="cores-produto" id="cores-${produto.id}">
        ${coresProcessadas.map(cor => `
          <span class="cor-icone" 
                title="${cor.nome}" 
                style="background-color: ${cor.hex}; ${cor.hex === '#ffffff' || cor.hex === '#FFFFFF' ? 'border: 1px solid #ddd;' : ''}"
                onclick="selecionarCorProdutoVitrine('${produto.id}', '${cor.nome}', '${cor.hex}')">
          </span>
        `).join('')}
      </div>
    </div>
    
    <div class="produto-tamanhos">
      <label for="tamanho-${produto.id}">Tamanho:</label>
      <select id="tamanho-${produto.id}" class="produto-select-tamanho">
        ${produto.tamanhos.map(tamanho => `
          <option value="${tamanho}">${tamanho}</option>
        `).join('')}
      </select>
    </div>
    
    <div class="produto-pontos">
      Valor para resgate: <strong>${produto.pontos} pontos</strong>
    </div>
    
    <button class="btn-adicionar-carrinho" onclick="adicionarProdutoAoCarrinho('${produto.id}')">
      🛒 Adicionar ao Carrinho
    </button>
  `;
  
  return card;
}

// Função para selecionar cor do produto na vitrine
function selecionarCorProdutoVitrine(produtoId, corNome, corHex) {
  const produtos = obterProdutos();
  const produto = produtos.find(p => p.id === produtoId);
  
  if (!produto) return;
  
  // Atualizar nome da cor selecionada
  const spanNomeCor = document.getElementById(`nome-cor-${produtoId}`);
  if (spanNomeCor) {
    spanNomeCor.textContent = corNome;
    spanNomeCor.style.color = corHex;
  }
  
  // Atualizar imagem se disponível
  if (produto.imagensPorCor && produto.imagensPorCor[corNome]) {
    const imgElement = document.querySelector(`[data-produto-id="${produtoId}"] .produto-imagem`);
    if (imgElement) {
      imgElement.src = produto.imagensPorCor[corNome];
    }
  }
  
  // Destacar cor selecionada
  const coresContainer = document.getElementById(`cores-${produtoId}`);
  if (coresContainer) {
    // Remover seleção anterior
    coresContainer.querySelectorAll('.cor-icone').forEach(icone => {
      icone.classList.remove('cor-selecionada');
    });
    
    // Adicionar seleção atual
    const corSelecionada = coresContainer.querySelector(`[title="${corNome}"]`);
    if (corSelecionada) {
      corSelecionada.classList.add('cor-selecionada');
    }
  }
}

// Função para adicionar produto ao carrinho
function adicionarProdutoAoCarrinho(produtoId) {
  const produtos = obterProdutos();
  const produto = produtos.find(p => p.id === produtoId);
  
  if (!produto) {
    mostrarToast('Erro', 'Produto não encontrado!', 'error');
    return;
  }
  
  // Obter cor selecionada
  const spanNomeCor = document.getElementById(`nome-cor-${produtoId}`);
  const corSelecionada = spanNomeCor ? spanNomeCor.textContent : produto.cores[0]?.nome || 'Sem cor';
  
  // Obter tamanho selecionado
  const selectTamanho = document.getElementById(`tamanho-${produtoId}`);
  const tamanhoSelecionado = selectTamanho ? selectTamanho.value : produto.tamanhos[0] || 'Único';
  
  // Verificar se cor foi selecionada
  if (!corSelecionada || corSelecionada === '') {
    mostrarToast('Atenção', 'Por favor, selecione uma cor!', 'warning');
    return;
  }
  
  // Criar item do carrinho
  const itemCarrinho = {
    id: `${produtoId}-${Date.now()}`,
    produtoId: produtoId,
    nome: produto.nome,
    cor: corSelecionada,
    tamanho: tamanhoSelecionado,
    pontos: produto.pontos,
    imagem: obterImagemProdutoPorCor(produto, corSelecionada),
    dataAdicao: new Date().toISOString()
  };
  
  // Adicionar ao carrinho
  adicionarItemCarrinho(itemCarrinho);
  
  // Feedback visual melhorado
  mostrarToast('Sucesso', `${produto.nome} adicionado ao carrinho!`, 'success');
  
  // Animação no botão
  const botao = document.querySelector(`[onclick="adicionarProdutoAoCarrinho('${produtoId}')"]`);
  if (botao) {
    botao.style.transform = 'scale(0.95)';
    botao.style.background = '#28a745';
    botao.innerHTML = '✅ Adicionado!';
    
    setTimeout(() => {
      botao.style.transform = 'scale(1)';
      botao.style.background = '';
      botao.innerHTML = '🛒 Adicionar ao Carrinho';
    }, 1500);
  }
}

// Função para obter imagem do produto por cor
function obterImagemProdutoPorCor(produto, corNome) {
  if (produto.imagensPorCor && produto.imagensPorCor[corNome]) {
    return produto.imagensPorCor[corNome];
  }
  
  // Fallback para primeira imagem disponível
  return obterImagemPrincipalProduto(produto);
}

// Função para adicionar item ao carrinho
function adicionarItemCarrinho(item) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
  carrinho.push(item);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  
  // Atualizar contador do carrinho se existir
  atualizarContadorCarrinho();
}

// Função para atualizar contador do carrinho
function atualizarContadorCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
  const contadores = document.querySelectorAll('.contador-carrinho');
  
  contadores.forEach(contador => {
    contador.textContent = carrinho.length;
    contador.style.display = carrinho.length > 0 ? 'block' : 'none';
  });
}

// Função para sincronizar produtos com a vitrine (chamada quando há alterações)
function sincronizarProdutosVitrine() {
  // Recarregar produtos na vitrine
  carregarProdutosNaVitrine();
  
  // Atualizar contador do carrinho
  atualizarContadorCarrinho();
}

// Sobrescrever funções existentes para incluir sincronização
// Interceptar mudanças no localStorage para sincronizar automaticamente
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  originalSetItem.call(localStorage, key, value);
  
  // Se alterou produtos, sincronizar vitrine
  if (key === 'produtos') {
    setTimeout(() => {
      sincronizarProdutosVitrine();
    }, 100);
  }
};

// Inicializar vitrine na carga da página
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    carregarProdutosNaVitrine();
    atualizarContadorCarrinho();
  }, 500);
});
