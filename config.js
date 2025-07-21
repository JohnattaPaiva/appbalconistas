/**
 * Arquivo de configuração do Portal Balconista DelRio
 * Centralize aqui as configurações principais do sistema
 */

// Configurações de Login
const CONFIG_LOGIN = {
    usuarios: [
        {
            usuario: "Johnatta",
            senha: "1234",
            nome: "Johnatta",
            nomeCompleto: "Johnatta Paiva",
            telefone: "(11) 99999-9999",
            cpf: "123.456.789-00",
            endereco: "Rua dos Desenvolvedores, 123",
            loja: "matriz",
            email: "johnatta@delrio.com.br",
            totalRegistros: 150,
            totalResgates: 3
        },
        {
            usuario: "admin",
            senha: "admin123",
            nome: "Administrador",
            nomeCompleto: "Administrador do Sistema",
            telefone: "(11) 88888-8888",
            cpf: "987.654.321-00",
            endereco: "Rua Principal, 456",
            loja: "centro",
            email: "admin@delrio.com.br",
            totalRegistros: 89,
            totalResgates: 1,
            isAdmin: true
        }
    ]
};

// Configurações de Pontos e Prêmios
const CONFIG_PREMIOS = {
    pontosUsuario: 232,
    proximoPremio: 521,
    produtos: {
        tshirt: {
            nome: "T-SHIRT EM SENSITIVE",
            pontos: 200,
            cores: ["Anís", "Branca", "Cappuccino"],
            tamanhos: ["P", "M", "G", "GG"],
            imagens: {
                "Anís": "assets/images/produtos/produto-anis.jpg",
                "Branca": "assets/images/produtos/produto-branca.jpg",
                "Cappuccino": "assets/images/produtos/produto-cappuccino.jpg"
            }
        },
        pantalona: {
            nome: "CALÇA PANTALONA BASIC FIT",
            pontos: 300,
            cores: ["Preto", "Cappuccino", "Verde Militar"],
            tamanhos: ["P", "M", "G", "GG"],
            imagens: {
                "Preto": "assets/images/produtos/pantalona-preto.jpg",
                "Cappuccino": "assets/images/produtos/pantalona-cappuccino.jpg",
                "Verde Militar": "assets/images/produtos/pantalona-verde-militar.jpg"
            }
        }
    }
};

// Configurações de Banner
const CONFIG_BANNER = {
    imagens: ["assets/images/banners/banner1.jpg", "assets/images/banners/banner2.jpg"],
    autoRotate: true, // Rotação automática ativada
    intervalo: 5000 // 5 segundos
};

// Configurações de Contato
const CONFIG_CONTATO = {
    email: "contato@delrio.com.br",
    whatsapp: "https://w.app/delrio",
    telefone: "(11) 3333-3333",
    whatsappNumero: "(11) 99999-9999",
    endereco: {
        rua: "Rua das Flores, 123",
        cidade: "São Paulo - SP"
    },
    horario: {
        semana: "Segunda a Sexta: 8h às 18h",
        sabado: "Sábado: 8h às 12h"
    }
};

// Configurações de Animação
const CONFIG_ANIMACAO = {
    duracaoContador: 1500, // milissegundos
    duracaoFadeIn: 700 // milissegundos
};

// Configurações de Produtos para Registro
const CONFIG_PRODUTOS = {
    produtos: [
        {
            referencia: "50509-K22",
            nome: "T-Shirt Básica Algodão",
            codigoBarras: "7891434892216",
            estoqueAtual: 45,
            categoria: "Camisetas"
        },
        {
            referencia: "51210-M15",
            nome: "Calça Jeans Slim Fit",
            codigoBarras: "7891434892223",
            estoqueAtual: 32,
            categoria: "Calças"
        },
        {
            referencia: "52105-P08",
            nome: "Blusa Social Feminina",
            codigoBarras: "7891434892230",
            estoqueAtual: 28,
            categoria: "Blusas"
        },
        {
            referencia: "53120-G30",
            nome: "Tênis Esportivo Running",
            codigoBarras: "7891434892247",
            estoqueAtual: 21,
            categoria: "Calçados"
        },
        {
            referencia: "54085-R12",
            nome: "Vestido Casual Verão",
            codigoBarras: "7891434892254",
            estoqueAtual: 18,
            categoria: "Vestidos"
        },
        {
            referencia: "55200-A25",
            nome: "Jaqueta Jeans Oversized",
            codigoBarras: "7891434892261",
            estoqueAtual: 15,
            categoria: "Jaquetas"
        },
        {
            referencia: "56150-B40",
            nome: "Short Moletom Masculino",
            codigoBarras: "7891434892278",
            estoqueAtual: 35,
            categoria: "Shorts"
        },
        {
            referencia: "57080-C18",
            nome: "Camisa Polo Piquet",
            codigoBarras: "7891434892285",
            estoqueAtual: 42,
            categoria: "Camisas"
        }
    ]
};

// Exporta as configurações (para uso futuro se o projeto virar módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG_LOGIN,
        CONFIG_PREMIOS,
        CONFIG_BANNER,
        CONFIG_CONTATO,
        CONFIG_ANIMACAO,
        CONFIG_PRODUTOS
    };
}
