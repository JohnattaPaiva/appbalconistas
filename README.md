# Portal Balconista DelRio v2

## 📋 Descrição
Portal interno para balconista### 📊 Dashboard Analytics
- **Métricas em Tempo Real:**
  - Registros de hoje
  - Pontos acumulados (últimos 30 dias)
  - Progresso da meta mensal
  - Classificação de performance

- **Gráficos Interativos:**
  - Registros por dia (últimos 7 dias)
  - Top 5 produtos mais registrados
  - Filtros por período (hoje, 7 dias, 30 dias, 90 dias)cos Interativos:**
  - Vendas por dia (últimos 7 dias)
  - Top 5 produtos mais vendidos
  - Filtros por período (hoje, 7 dias, 30 dias, 90 dias)

### 🎯 Sistema de Notificaçõesma de login, registro de produtos, sistema de pontos e catálogo de prêmios.

## 🗂️ Estrutura do Projeto

```
Portal Balconista-v2/
├── index.html          # Arquivo HTML principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidades JavaScript
├── config.js           # Configurações centralizadas
├── README.md           # Documentação do projeto
│
└── 📁 assets/
    └── 📁 images/
        ├── 📁 banners/
        │   ├── banner1.jpg         # Banner rotativo 1
        │   ├── banner2.jpg         # Banner rotativo 2
        │   └── banner3.jpg         # Banner rotativo 3 (configurado no JS)
        │
        ├── 📁 branding/
        │   ├── logo.png            # Logo da empresa
        │   └── fundo.jpg           # Imagem de fundo da tela de login
        │
        ├── � icones/
        │   ├── icone-barcode.png     # Ícone código de barras
        │   ├── icone-quantidade.png  # Ícone quantidade
        │   └── icone-referencia.png  # Ícone referência
        │
        └── � produtos/
            ├── produto-anis.jpg           # T-shirt cor Anís
            ├── produto-branca.jpg         # T-shirt cor Branca
            ├── produto-cappuccino.jpg     # T-shirt cor Cappuccino
            ├── pantalona-preto.jpg        # Pantalona cor Preta
            ├── pantalona-cappuccino.jpg   # Pantalona cor Cappuccino
            └── pantalona-verde-militar.jpg # Pantalona cor Verde Militar
```

## 🚀 Funcionalidades

### 🔐 Sistema de Login
- **Usuário:** Johnatta
- **Senha:** 1234
- Validação de credenciais
- Transição suave entre telas

### 🏠 Seções Principais
1. **Home** - Banner rotativo e boas-vindas
2. **Registro** - Cadastro de produtos vendidos
3. **Prêmios** - Catálogo de produtos para resgate
4. **📊 Dashboard** - Analytics de vendas e performance
5. **Contato** - Informações e formulário de contato

### 📊 Sistema de Pontos
- Visualização de pontos acumulados
- Contador animado
- Próximo prêmio disponível

### 🎁 Catálogo de Prêmios
- **T-SHIRT EM SENSITIVE** (200 pontos)
  - Cores: Anís, Branca, Cappuccino
  - Tamanhos: P, M, G, GG
  
- **CALÇA PANTALONA BASIC FIT** (300 pontos)
  - Cores: Preto, Cappuccino, Verde Militar
  - Tamanhos: P, M, G, GG

### 📱 Contato
- E-mail direto
- WhatsApp integrado
- Formulário de contato modal
- Informações da empresa

### 📊 Dashboard Analytics
- **Métricas em Tempo Real:**
  - Vendas do dia
  - Faturamento mensal
  - Progresso da meta
  - Classificação de performance

- **Gráficos Interativos:**
  - Vendas por dia (últimos 7 dias)
  - Top 5 produtos mais vendidos
  - Filtros por período (hoje, 7 dias, 30 dias, 90 dias)

### 🔍 Busca Avançada
- **Filtros Múltiplos:**
  - Nome do produto
  - Categoria (Roupas, Calçados, Acessórios, Esportes)
  - Marca (DelRio, Nike, Adidas, Puma)
  - Faixa de preço

- **Funcionalidades:**
  - Paginação inteligente
  - Exportação para CSV
  - Visualização em grade
  - Busca em tempo real

## 💻 Tecnologias Utilizadas
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos e responsividade
- **JavaScript Vanilla** - Interatividade
- **Font Awesome** - Ícones

## 🎨 Características do Design
- Design responsivo (mobile-first)
- Animações suaves (fade-in-up)
- Cores corporativas (#7F80AF)
- Interface intuitiva
- Componentes modulares

## 🔧 Como Usar

1. **Abrir o projeto:**
   ```
   Abra o arquivo index.html em qualquer navegador
   ```

2. **Login:**
   - Usuário: Johnatta
   - Senha: 1234

3. **Navegação:**
   - Use os botões do menu superior
   - Todas as funcionalidades são acessíveis via interface

## 📝 Estrutura de Arquivos

### index.html
- Estrutura HTML principal
- Seções organizadas por funcionalidade
- Elementos semânticos

### styles.css
- Estilos globais e componentes
- Media queries para responsividade
- Animações e transições

### script.js
- Lógica de autenticação
- Navegação entre seções
- Gerenciamento de produtos
- Formulários e validações

## 🔄 Funcionalidades JavaScript

### Principais Funções:
- `validarLogin()` - Autenticação
- `mostrarSecao()` - Navegação entre seções
- `registrarProduto()` - Cadastro de produtos
- `selecionarCorProduto()` - Seleção de cores
- `resgatarPremio()` - Resgate de prêmios
- `contarAnimado()` - Animação de números
- `carregarDashboard()` - Carrega analytics do dashboard
- `filtrarProdutos()` - Sistema de busca avançada
- `exportarResultados()` - Exportação de dados para CSV

## 📱 Responsividade

### Breakpoints:
- **Desktop:** > 900px
- **Tablet:** 600px - 900px
- **Mobile:** < 600px
- **Mobile Pequeno:** < 400px

## 🚧 Próximas Melhorias
- [x] Sistema de notificações Toast
- [x] Dashboard Analytics - Gráficos de vendas e performance
- [x] Busca Avançada - Filtrar produtos por categoria/marca
- [ ] Scanner QR/Código de Barras - Usar câmera do dispositivo
- [ ] Modo Escuro - Alternar entre temas claro/escuro
- [ ] Cache Local - Salvar dados offline
- [ ] Push Notifications - Notificações em tempo real
- [ ] PWA - Instalar como app no celular
- [ ] Metas e Conquistas - Gamificação do sistema
- [ ] Relatórios PDF - Exportar dados de vendas
- [ ] 2FA - Autenticação de dois fatores

## 👨‍💻 Desenvolvedor
**Criado por:** Johnatta  
**Ano:** 2025  
**Versão:** 2.0

---

### 📞 Suporte
Para dúvidas ou melhorias, entre em contato através dos canais disponíveis na seção Contato do portal.
