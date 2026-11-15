// ============================================================
// MODO CLARO E ESCURO
// ============================================================


const botao = document.getElementById("botao-mode");
const body = document.body;

// Aplica o tema salvo quando a página abre
function aplicarTema(escuro) {
    body.classList.toggle("dark-mode", escuro);

    if (botao) {
        botao.checked = escuro;
    }

    localStorage.setItem("dark-mode", escuro ? "enabled" : "disabled");
}

// Recupera a preferência salva
const temaSalvo = localStorage.getItem("dark-mode");
aplicarTema(temaSalvo === "enabled");

// Alterna o tema ao clicar no botão
if (botao) {
    botao.addEventListener("change", function () {
        aplicarTema(botao.checked);
    });
}



// ============================================================
// MASCOTE E CHAT
// ============================================================

const mascote = document.getElementById("mascote");
const chat = document.getElementById("chat");
const caixa = document.getElementById("mensagens");
const campo = document.getElementById("texto");
const botaoEnviar = document.getElementById("enviar");
const botaoFechar = document.getElementById("fechar");

let arrastando = false;
let moveu = false;
let difX = 0;
let difY = 0;
let primeiraVez = true;
let ponteiroAtual = null;


if (mascote) {
    mascote.style.cursor = "grab";
    mascote.style.touchAction = "none";

    mascote.addEventListener("pointerdown", function (e) {
        if (e.button !== 0 && e.pointerType === "mouse") {
            return;
        }

        arrastando = true;
        moveu = false;
        ponteiroAtual = e.pointerId;

        const rect = mascote.getBoundingClientRect();

        difX = e.clientX - rect.left;
        difY = e.clientY - rect.top;

        mascote.setPointerCapture(e.pointerId);
        mascote.style.cursor = "grabbing";
    });

    mascote.addEventListener("pointermove", function (e) {
        if (!arrastando || e.pointerId !== ponteiroAtual) {
            return;
        }

        let novoX = e.clientX - difX;
        let novoY = e.clientY - difY;

        const maxX = window.innerWidth - mascote.offsetWidth;
        const maxY = window.innerHeight - mascote.offsetHeight;

        novoX = Math.max(0, Math.min(novoX, maxX));
        novoY = Math.max(0, Math.min(novoY, maxY));

        if (
            Math.abs(novoX - mascote.getBoundingClientRect().left) > 3 ||
            Math.abs(novoY - mascote.getBoundingClientRect().top) > 3
        ) {
            moveu = true;
        }

        mascote.style.left = novoX + "px";
        mascote.style.top = novoY + "px";
        mascote.style.right = "auto";
        mascote.style.bottom = "auto";
    });

    function terminarArraste(e) {
        if (!arrastando || e.pointerId !== ponteiroAtual) {
            return;
        }

        arrastando = false;
        ponteiroAtual = null;
        mascote.style.cursor = "grab";

        if (!moveu) {
            abrirChat();
        }
    }

    mascote.addEventListener("pointerup", terminarArraste);
    mascote.addEventListener("pointercancel", terminarArraste);
}


function abrirChat() {
    if (!chat) return;

    chat.classList.add("aberto");

    if (mascote) {
        mascote.style.display = "none";
    }

    if (primeiraVez) {
        primeiraVez = false;

        mostrar(
            "Oi! Eu sou o Cookie! Me pergunte sobre sabores, preços, entregas ou horários!",
            "bot"
        );
    }

    if (campo) {
        campo.focus();
    }
}


function fecharChat() {
    if (chat) {
        chat.classList.remove("aberto");
    }

    if (mascote) {
        mascote.style.display = "block";
    }
}


if (botaoFechar) {
    botaoFechar.addEventListener("click", fecharChat);
}


function mostrar(texto, quem) {
    if (!caixa) return null;

    const linha = document.createElement("div");
    linha.className = "linha " + quem;

    if (quem === "bot") {
        const foto = document.createElement("img");

        foto.src = "images/msbiscuits.png";
        foto.alt = "Cookie, assistente virtual";

        foto.onerror = function () {
            this.style.display = "none";
        };

        linha.appendChild(foto);
    }

    const fala = document.createElement("div");
    fala.className = "fala";
    fala.textContent = texto;

    linha.appendChild(fala);
    caixa.appendChild(linha);

    caixa.scrollTop = caixa.scrollHeight;

    return fala;
}


function limpar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[?!,.;:]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


function escolher(respostas) {
    return respostas[
        Math.floor(Math.random() * respostas.length)
    ];
}


function responder(mensagem) {
    const texto = limpar(mensagem);
    const palavras = texto.split(/\s+/);

    const contemPalavra = lista =>
        lista.some(p => palavras.includes(p));

    const contemExpressao = lista =>
        lista.some(p => texto.includes(p));


    if (
        contemPalavra(["oi", "ola", "opa", "eai", "hey", "oie"]) ||
        contemExpressao(["bom dia", "boa tarde", "boa noite"])
    ) {
        return escolher([
            "Oii! Tudo bem? Como posso te ajudar?",
            "Olá! Seja bem-vindo(a) à nossa loja de cookies!",
            "Opa! Quer conhecer nossos cookies deliciosos?"
        ]);
    }

    else if (contemExpressao([
        "quem e voce",
        "seu nome",
        "ajuda",
        "o que voce faz"
    ])) {
        return (
            "Sou o Cookie, assistente virtual da nossa loja! " +
            "Posso ajudar com sabores, preços, pedidos, entregas, " +
            "horários e formas de pagamento."
        );
    }

    else if (contemExpressao([
        "preco",
        "precos",
        "valor",
        "valores",
        "quanto custa",
        "quanto custam",
        "quanto e",
        "custa",
        "custam",
        "barato",
        "caro",
        "promocao"
    ])) {
        return escolher([
            "Nossos cookies começam em R$ 8 a unidade! As caixas podem sair mais baratas.",
            "Temos cookies a partir de R$ 8. Quer conhecer nossos sabores?",
            "O valor começa em R$ 8 por unidade. Me conta quantos você quer!"
        ]);
    }

    else if (contemExpressao([
        "sabor",
        "sabores",
        "cardapio",
        "chocolate",
        "red velvet",
        "doce de leite",
        "baunilha",
        "recheio",
        "ingredientes"
    ])) {
        return (
            "Nosso cardápio tem chocolate, red velvet, " +
            "doce de leite e baunilha com gotas! " +
            "O red velvet é um dos favoritos."
        );
    }

    else if (contemExpressao([
        "entrega",
        "entregam",
        "frete",
        "delivery",
        "entregar",
        "receber em casa",
        "bairro",
        "endereco"
    ])) {
        return (
            "Fazemos entregas sim! O valor do frete depende " +
            "do bairro. Me diga sua região para conversarmos " +
            "sobre a entrega."
        );
    }

    else if (contemExpressao([
        "horario",
        "horarios",
        "aberto",
        "funciona",
        "abre",
        "fechado",
        "fecha",
        "domingo",
        "sabado"
    ])) {
        return "Funcionamos de segunda a sábado, das 9h às 18h!";
    }

    else if (contemExpressao([
        "pagamento",
        "pix",
        "cartao",
        "credito",
        "debito",
        "pagar",
        "dinheiro",
        "parcelar"
    ])) {
        return "Aceitamos Pix e cartões de crédito e débito!";
    }

    else if (
        contemPalavra(["obrigado", "obrigada", "valeu"]) ||
        contemExpressao(["agradeco"])
    ) {
        return "Imagina! Obrigado pelo carinho! Estou por aqui.";
    }

    else if (
        contemExpressao([
            "pedido",
            "pedidos",
            "encomenda",
            "comprar",
            "compras",
            "pedir",
            "reservar"
        ]) ||
        contemPalavra(["quero", "queria"])
    ) {
        return (
            "Oba! Vamos conversar sobre seu pedido! " +
            "Temos chocolate, red velvet, doce de leite " +
            "e baunilha com gotas. Qual sabor você gostaria?"
        );
    }

    else if (contemExpressao([
        "quantidade",
        "caixa",
        "caixas",
        "unidades",
        "unidade",
        "duzia"
    ])) {
        return (
            "Temos cookies por unidade e opções de caixas! " +
            "Quantos cookies você gostaria?"
        );
    }

    else if (contemExpressao([
        "gostoso",
        "gostosa",
        "delicioso",
        "deliciosa",
        "amei",
        "maravilhoso",
        "perfeito"
    ])) {
        return (
            "Aaaah, nossos cookies são feitos com muito carinho! " +
            "Qual sabor você está com vontade de experimentar?"
        );
    }

    else if (
        contemPalavra(["tchau", "adeus", "falou"]) ||
        contemExpressao(["ate mais"])
    ) {
        return "Até mais! Volte sempre para comer cookies deliciosos!";
    }


    return escolher([
        "Posso ajudar com preços, sabores, pedidos, entregas e pagamentos. O que gostaria de saber?",
        "Oii! Me explica um pouquinho melhor o que você precisa. Quero te ajudar!",
        "Que tal conhecer nosso cardápio? Temos chocolate, red velvet, doce de leite e baunilha com gotas!",
        "Estou aqui para te ajudar! Você quer saber sobre preços, sabores, encomendas ou entregas?"
    ]);
}


function enviar() {
    if (!campo || !caixa) return;

    const texto = campo.value.trim();

    if (texto === "") return;

    mostrar(texto, "user");
    campo.value = "";

    const espera = mostrar("", "bot");

    if (!espera) return;

    espera.classList.add("digitando");
    espera.innerHTML = "<span></span><span></span><span></span>";

    setTimeout(function () {
        const resposta = responder(texto);

        espera.classList.remove("digitando");
        espera.textContent = resposta;

        caixa.scrollTop = caixa.scrollHeight;

        if (campo && chat && chat.classList.contains("aberto")) {
            campo.focus();
        }
    }, 900);
}


if (botaoEnviar) {
    botaoEnviar.addEventListener("click", enviar);
}

if (campo) {
    campo.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            enviar();
        }
    });
}


// ============================================================
// ANIMAÇÃO DOS COOKIES NA PÁGINA
// ============================================================

const secao = document.querySelector("#secaoCookies");
const cookies = document.querySelectorAll(".cookie");

if (secao && "IntersectionObserver" in window) {
    let animacaoIniciada = false;

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting && !animacaoIniciada) {
                animacaoIniciada = true;

                cookies.forEach((cookie, indice) => {
                    cookie.style.animationDelay = `${indice * 0.8}s`;
                    cookie.classList.add("cair");
                });

                observador.unobserve(secao);
            }
        });
    }, { threshold: 0.4 });

    observador.observe(secao);
}


// ============================================================
// LOGIN
// ============================================================

const modalLogin = document.getElementById("id01");


function abrirLogin() {
    if (!modalLogin) return;

    modalLogin.style.display = "flex";
    document.body.style.overflow = "hidden";
}


function fecharLogin() {
    if (!modalLogin) return;

    modalLogin.style.display = "none";
    document.body.style.overflow = "";
}


window.addEventListener("click", function(event) {
    if (event.target === modalLogin) {
        fecharLogin();
    }
});


window.addEventListener("keydown", function(event) {
    if (
        event.key === "Escape" &&
        modalLogin &&
        modalLogin.style.display === "flex"
    ) {
        fecharLogin();
    }
});



// ============================================================
// PESQUISA DE PRODUTOS - ABRIR DETALHES
// ============================================================

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

async function abrirPesquisa() {

    const campo = document.getElementById("campoPesquisa");

    if (!campo) return;

    const pesquisa = normalizarTexto(campo.value);

    if (pesquisa === "") {
        alert("Digite o nome de um cookie para pesquisar!");
        return;
    }

    // Páginas onde estão cadastrados os cookies
    const paginas = [
        "index.html",
        "halloween.html",
        "natal.html",
        "tematicos.html"
    ];

    let produtoEncontrado = null;

    for (const pagina of paginas) {

        try {

            const resposta = await fetch(pagina);

            if (!resposta.ok) continue;

            const html = await resposta.text();

            const documento = new DOMParser().parseFromString(
                html,
                "text/html"
            );

            const imagens = documento.querySelectorAll(
                ".imagem-detalhes"
            );

            for (const imagem of imagens) {

                const nome = normalizarTexto(
                    imagem.dataset.nome || ""
                );

                if (nome === pesquisa || nome.includes(pesquisa)) {

                    produtoEncontrado = {
                        id: imagem.dataset.id,
                        nome: imagem.dataset.nome,
                        preco: imagem.dataset.preco,
                        imagem: imagem.dataset.imagem,
                        descricao: imagem.dataset.descricao,
                        ingredientes: imagem.dataset.ingredientes,
                        informacoes: imagem.dataset.informacoes,
                        categoria: imagem.dataset.categoria
                    };

                    break;
                }
            }

            if (produtoEncontrado) break;

        } catch (erro) {

            console.error("Erro ao pesquisar na página:", pagina, erro);

        }
    }

    if (produtoEncontrado) {

        // Salva o cookie escolhido
        localStorage.setItem(
            "produtoSelecionado",
            JSON.stringify(produtoEncontrado)
        );

        // Abre a página de detalhes
        window.location.href = "detalhes.html";

    } else {

        alert("Não encontramos esse cookie. Tente outro nome!");

    }
}


// ============================================================
// CARRINHO
// ============================================================

const CHAVE_CARRINHO = "onceUponABite_carrinho";


function lerCarrinho() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
    } catch (erro) {
        console.error("Não foi possível ler o carrinho salvo:", erro);
        return [];
    }
}


let carrinho = lerCarrinho();


function salvarCarrinho() {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}


function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


function converterPreco(valor) {
    if (typeof valor === "number") {
        return valor;
    }

    if (!valor) {
        return NaN;
    }

    valor = valor.replace("R$", "").trim();

    // Se tiver vírgula, considera o ponto como separador de milhar.
    if (valor.includes(",")) {
        valor = valor.replace(/\./g, "").replace(",", ".");
    }

    return Number(valor);
}
// ============================================================
// ANIMAÇÃO DO PRODUTO INDO PARA O CARRINHO
// ============================================================

function animarCookie(botao) {
    const produto = botao.closest(".produto");

    if (!produto) return;

    const imagem = produto.querySelector(".foto-produto img");

    const carrinhoIcone =
        document.getElementById("iconeCarrinho") ||
        document.querySelector(".link-carrinho");

    if (!imagem || !carrinhoIcone) return;

    const imagemVoando = imagem.cloneNode(true);

    imagemVoando.classList.add("cookie-voando");

    const inicio = imagem.getBoundingClientRect();
    const destino = carrinhoIcone.getBoundingClientRect();

    imagemVoando.style.position = "fixed";
    imagemVoando.style.left = inicio.left + "px";
    imagemVoando.style.top = inicio.top + "px";
    imagemVoando.style.width = inicio.width + "px";
    imagemVoando.style.height = inicio.height + "px";
    imagemVoando.style.objectFit = "contain";
    imagemVoando.style.zIndex = "99999";
    imagemVoando.style.pointerEvents = "none";
    imagemVoando.style.transition = "all 0.8s cubic-bezier(0.5, -0.3, 0.8, 0.5)";

    document.body.appendChild(imagemVoando);

    imagemVoando.getBoundingClientRect();

    imagemVoando.style.left =
        destino.left + destino.width / 2 - 15 + "px";

    imagemVoando.style.top =
        destino.top + destino.height / 2 - 15 + "px";

    imagemVoando.style.width = "30px";
    imagemVoando.style.height = "30px";
    imagemVoando.style.opacity = "0.2";
    imagemVoando.style.transform = "rotate(360deg) scale(0.3)";

    setTimeout(() => {
        imagemVoando.remove();
    }, 850);

    carrinhoIcone.classList.add("animar-carrinho");

    setTimeout(() => {
        carrinhoIcone.classList.remove("animar-carrinho");
    }, 500);
}


// ============================================================
// ATUALIZAR CARRINHO
// ============================================================

function atualizarCarrinho() {
    const contador = document.getElementById("contadorCarrinho");

    const vazio = document.getElementById("carrinhoVazio");
    const conteudo = document.getElementById("carrinhoConteudo");
    const itens = document.getElementById("carrinhoItens");

    const totalElemento =
        document.getElementById("subtotalCarrinho") ||
        document.getElementById("totalCarrinho") ||
        document.getElementById("carrinhoTotal");

    const contadorItens = document.getElementById("contadorItensCarrinho");

    const quantidadeTotal = carrinho.reduce(
        (soma, item) => soma + item.quantidade,
        0
    );

    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    if (contador) {
        contador.textContent = quantidadeTotal;
    }

    if (contadorItens) {
        contadorItens.textContent =
            quantidadeTotal + (quantidadeTotal === 1 ? " item" : " itens");
    }

    if (!itens || !vazio || !conteudo) return;

    vazio.hidden = carrinho.length > 0;
    conteudo.hidden = carrinho.length === 0;

    itens.innerHTML = "";

    carrinho.forEach(item => {
        const linha = document.createElement("article");
        linha.className = "item-carrinho";

        const imagem = document.createElement("img");
        imagem.className = "imagem-item-carrinho";
        imagem.src = item.imagem || "images/cookies.png";
        imagem.alt = item.nome;

        const informacoes = document.createElement("div");
        informacoes.className = "informacoes-item-carrinho";

        const nome = document.createElement("strong");
        nome.textContent = item.nome;

        const preco = document.createElement("span");
        preco.textContent = formatarMoeda(item.preco) + " cada";

        const subtotal = document.createElement("span");
        subtotal.className = "subtotal-item";
        subtotal.textContent = formatarMoeda(item.preco * item.quantidade);

        const controles = document.createElement("div");
        controles.className = "controles-quantidade";

        const diminuir = document.createElement("button");
        diminuir.type = "button";
        diminuir.textContent = "−";
        diminuir.setAttribute("aria-label", "Diminuir quantidade");
        diminuir.dataset.acao = "diminuir";
        diminuir.dataset.id = item.id;

        const quantidade = document.createElement("span");
        quantidade.textContent = item.quantidade;

        const aumentar = document.createElement("button");
        aumentar.type = "button";
        aumentar.textContent = "+";
        aumentar.setAttribute("aria-label", "Aumentar quantidade");
        aumentar.dataset.acao = "aumentar";
        aumentar.dataset.id = item.id;

        const remover = document.createElement("button");
        remover.type = "button";
        remover.textContent = "Remover";
        remover.className = "remover-item";
        remover.dataset.acao = "remover";
        remover.dataset.id = item.id;

        controles.append(diminuir, quantidade, aumentar, remover);

        informacoes.append(nome, preco, subtotal, controles);

        linha.append(imagem, informacoes);

        itens.appendChild(linha);
    });

    if (totalElemento) {
        totalElemento.textContent = formatarMoeda(total);
    }

    const entregaElemento = document.getElementById("entregaCarrinho");
    const totalFinalElemento = document.getElementById("totalCarrinho");

    if (entregaElemento && totalFinalElemento) {
        entregaElemento.textContent = "A combinar";
        totalFinalElemento.textContent = formatarMoeda(total);
    }
}


// ============================================================
// ADICIONAR PRODUTO AO CARRINHO
// ============================================================

function adicionarAoCarrinho(produto, botao) {
    const nomeElemento = produto.querySelector(".produto-info h3");
    const precoElemento = produto.querySelector(".produto-final strong");
    const imagemElemento = produto.querySelector(".foto-produto img");

    const nome =
        botao.dataset.nome ||
        produto.dataset.nome ||
        produto.dataset.name ||
        nomeElemento?.textContent.trim();

    const preco = converterPreco(
        botao.dataset.preco ||
        produto.dataset.preco ||
        produto.dataset.price ||
        precoElemento?.textContent
    );

    if (!nome || !Number.isFinite(preco)) {
        console.error("Não foi possível identificar o nome ou preço do produto.");
        return;
    }

    const id = nome.toLowerCase().replace(/\s+/g, "-");

    const imagem = imagemElemento ? imagemElemento.getAttribute("src") : "";

    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: preco,
            quantidade: 1,
            imagem: imagem
        });
    }

    salvarCarrinho();
    atualizarCarrinho();

    animarCookie(botao);

    botao.textContent = "✓";

    setTimeout(() => {
        botao.textContent = "+";
    }, 650);
}


// ============================================================
// EVENTOS DOS BOTÕES DE ADICIONAR
// ============================================================

document.querySelectorAll(".produto").forEach(produto => {
    const botao =
        produto.querySelector(".adicionar-carrinho") ||
        produto.querySelector(".produto-final button");

    if (!botao) return;

    botao.addEventListener("click", function() {
        adicionarAoCarrinho(produto, botao);
    });
});


// ============================================================
// AUMENTAR, DIMINUIR E REMOVER PRODUTOS
// ============================================================

const listaCarrinho = document.getElementById("carrinhoItens");

if (listaCarrinho) {
    listaCarrinho.addEventListener("click", function(event) {
        const botao = event.target.closest("button[data-acao]");

        if (!botao) return;

        const item = carrinho.find(
            produto => produto.id === botao.dataset.id
        );

        if (!item) return;

        if (botao.dataset.acao === "aumentar") {
            item.quantidade += 1;
        }

        else if (botao.dataset.acao === "diminuir") {
            item.quantidade -= 1;

            if (item.quantidade <= 0) {
                carrinho = carrinho.filter(
                    produto => produto.id !== item.id
                );
            }
        }

        else if (botao.dataset.acao === "remover") {
            carrinho = carrinho.filter(
                produto => produto.id !== item.id
            );
        }

        salvarCarrinho();
        atualizarCarrinho();
    });
}



 // ============================================================
 // EXPORTAR PEDIDO EM JSON
 // ============================================================

 const botaoExportar = document.getElementById("exportarPedido");

 if (botaoExportar) {
 
     botaoExportar.addEventListener("click", function () {
 
         if (carrinho.length === 0) {
             alert("Adicione pelo menos um cookie antes de finalizar!");
             return;
         }
 
         const valorTotal = carrinho.reduce(
             (soma, item) => soma + item.preco * item.quantidade,
             0
         );
 
         const pedido = {
 
             sistema: "Once Upon a Bite",
 
             id_pedido: Date.now(),
 
             data_pedido: new Date().toISOString(),
 
             status: "Pendente",
 
             itens: carrinho.map(item => ({
                 id_produto: item.id,
                 nome: item.nome,
                 preco_unitario: Number(item.preco.toFixed(2)),
                 quantidade: item.quantidade,
                 subtotal: Number(
                     (item.preco * item.quantidade).toFixed(2)
                 )
             })),
 
             valor_total: Number(valorTotal.toFixed(2)),
 
             observacao: "Pedido realizado pelo cliente"
 
         };
 
         // Transformar objeto em JSON
         const json = JSON.stringify(pedido, null, 4);
 
         // Criar arquivo JSON
         const blob = new Blob(
             [json],
             { type: "application/json;charset=utf-8" }
         );
 
         // Criar endereço temporário
         const url = URL.createObjectURL(blob);
 
         // Criar link de download
         const link = document.createElement("a");
 
         link.href = url;
         link.download = "pedido-once-upon-a-bite.json";
 
         document.body.appendChild(link);
 
         // Baixar arquivo
         link.click();
 
         // Remover link
         document.body.removeChild(link);
 
         // Liberar memória após o download
         setTimeout(() => URL.revokeObjectURL(url), 1000);
 
         alert("Seu pedido foi exportado com sucesso!");
 
     });
 
 }
 


// ============================================================
// INICIALIZAÇÃO
// ============================================================

atualizarCarrinho();

function abrirDetalhes(botao) {
    const produto = {
        id: botao.dataset.id,
        nome: botao.dataset.nome,
        preco: botao.dataset.preco,
        imagem: botao.dataset.imagem,
        descricao: botao.dataset.descricao,
        ingredientes: botao.dataset.ingredientes,
        informacoes: botao.dataset.informacoes,
        categoria: botao.dataset.categoria
    };

    localStorage.setItem("produtoSelecionado", JSON.stringify(produto));

    window.location.href = "detalhes.html";
}

// ======================================================
// DOWNLOAD DE ARQUIVOS JSON COM BLOB
// ======================================================

function baixarComprovante(texto, nomeArquivo) {

    const blob = new Blob(
        [texto],
        { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = nomeArquivo;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    atualizarInterfaceLogin();

    aplicarMascaras();

});


// ======================================================
// ABRIR E FECHAR MODAIS
// ======================================================

function abrirLogin() {

    const modalLogin = document.getElementById("id01");
    const modalCadastro = document.getElementById("modalCadastro");

    if (modalCadastro) {
        modalCadastro.style.display = "none";
    }

    if (modalLogin) {
        modalLogin.style.display = "flex";
    }

}


function fecharLogin() {

    const modalLogin = document.getElementById("id01");

    if (modalLogin) {
        modalLogin.style.display = "none";
    }

}


function abrirCadastro() {

    const modalLogin = document.getElementById("id01");
    const modalCadastro = document.getElementById("modalCadastro");

    if (modalLogin) {
        modalLogin.style.display = "none";
    }

    if (modalCadastro) {
        modalCadastro.style.display = "flex";
    }

}


function fecharCadastro() {

    const modalCadastro = document.getElementById("modalCadastro");

    if (modalCadastro) {
        modalCadastro.style.display = "none";
    }

}


function voltarParaLogin() {

    fecharCadastro();

    abrirLogin();

}


// ======================================================
// LOGIN DO USUÁRIO
// ======================================================


const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        const senha = document.getElementById("psw").value;

        if (senha.length < 8) {
            alert("A senha precisa ter pelo menos 8 caracteres!");
            return;
        }

        // Captura os dados
        const dadosLogin = {
            email: document.getElementById("uname").value,

            data_login: new Date().toISOString()
        };

        // Converte para JSON
        const json = JSON.stringify(dadosLogin, null, 4);

        // Cria o Blob
        const blob = new Blob(
            [json],
            { type: "application/json;charset=utf-8" }
        );

        // Cria URL temporária
        const url = URL.createObjectURL(blob);

        // Cria link de download
        const link = document.createElement("a");

        link.href = url;
        link.download = "login_usuario.json";

        // Inicia o download
        document.body.appendChild(link);
        link.click();

        // Limpa os recursos
        document.body.removeChild(link);

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);

        alert("Arquivo de login exportado com sucesso!");

        fecharLogin();
        formLogin.reset();
    });
}



// ======================================================
// ATUALIZAR INTERFACE DE LOGIN
// ======================================================

function atualizarInterfaceLogin() {

    const token = sessionStorage.getItem("token");

    const nome = sessionStorage.getItem("nome_usuario");

    const botao = document.querySelector(".botao-abrir-login");

    if (!botao) return;

    if (token) {

        botao.textContent = nome;

        botao.onclick = function () {

            if (confirm("Deseja sair da sua conta?")) {

                logout();

            }

        };

        botao.classList.add("logado");

    } else {

        botao.textContent = "Login";

        botao.onclick = abrirLogin;

        botao.classList.remove("logado");

    }

}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    sessionStorage.removeItem("token");

    sessionStorage.removeItem("nome_usuario");

    alert("Você saiu da sua conta. Até logo!");

    window.location.reload();

}


// ======================================================
// MÁSCARA DINÂMICA DE TELEFONE
// ======================================================



function aplicarMascaras() {
    const telInput = document.getElementById("tel");

    if (!telInput) return;

    function formatarTelefone(valor) {
        let numeros = valor.replace(/\D/g, "");

        // Remove o DDI 55 quando estiver presente
        if (numeros.startsWith("55")) {
            numeros = numeros.substring(2);
        }

        numeros = numeros.substring(0, 11);

        if (!numeros) return "";

        let formatado = "+55";

        if (numeros.length > 0) {
            formatado += " (" + numeros.substring(0, 2);
        }

        if (numeros.length >= 3) {
            formatado += ") ";

            const telefone = numeros.substring(2);

            if (numeros.length === 11) {
                formatado += telefone.substring(0, 1);

                if (telefone.length > 1) {
                    formatado += " " + telefone.substring(1, 5);
                }

                if (telefone.length > 5) {
                    formatado += "-" + telefone.substring(5, 9);
                }
            } else {
                formatado += telefone.substring(0, 4);

                if (telefone.length > 4) {
                    formatado += "-" + telefone.substring(4, 8);
                }
            }
        }

        return formatado;
    }

    telInput.addEventListener("input", function () {
        const numeros = this.value.replace(/\D/g, "");

        // Evita duplicação do DDI
        let limpo = numeros;

        if (limpo.startsWith("55")) {
            limpo = limpo.substring(2);
        }

        this.value = formatarTelefone(limpo);
    });

    telInput.addEventListener("keydown", function (event) {
        const permitidas = [
            "Backspace", "Delete", "Tab",
            "ArrowLeft", "ArrowRight",
            "Home", "End"
        ];

        if (
            permitidas.includes(event.key) ||
            event.ctrlKey ||
            event.metaKey
        ) return;

        if (!/^[0-9]$/.test(event.key)) {
            event.preventDefault();
        }
    });

    telInput.addEventListener("paste", function (event) {
        event.preventDefault();

        const texto = event.clipboardData.getData("text");
        this.value = formatarTelefone(texto);
    });
}



// ======================================================
// CADASTRO DE CLIENTES
// BANCO: once_upon_a_bite
// TABELA: cliente
// ======================================================


const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", function (event) {
        event.preventDefault();

        const campoSenha = formCadastro.querySelector('input[type="password"]');

        if (!campoSenha || campoSenha.value.length < 8) {
            alert("A senha precisa ter pelo menos 8 caracteres!");
            return;
        }

        // Captura os dados do formulário
        const formData = new FormData(formCadastro);
        const dadosCadastro = Object.fromEntries(formData.entries());

        // Limpa a máscara do telefone
        dadosCadastro.telefone = dadosCadastro.telefone.replace(/\D/g, "");

        // Adiciona a data do cadastro
        dadosCadastro.data_cadastro = new Date()
            .toISOString()
            .split("T")[0];

        // Converte os dados para JSON
        const json = JSON.stringify(dadosCadastro, null, 4);

        // Cria o Blob
        const blob = new Blob(
            [json],
            { type: "application/json;charset=utf-8" }
        );

        // Cria uma URL temporária
        const url = URL.createObjectURL(blob);

        // Cria o link de download
        const link = document.createElement("a");
        link.href = url;
        link.download = "cadastro_cliente.json";

        // Inicia o download
        document.body.appendChild(link);
        link.click();

        // Limpa os recursos
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Finaliza
        alert("Cadastro exportado com sucesso!");

        fecharCadastro();
        formCadastro.reset();
    });
}
