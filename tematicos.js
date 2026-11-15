

const introHeroi = document.getElementById("intro-heroi");
const videoHeroi = document.getElementById("heroi-video");
const botaoPularHeroi = document.getElementById("heroi-pular");

if (introHeroi && videoHeroi && botaoPularHeroi) {
    document.body.classList.add("intro-ativo");

    let introEncerrada = false;

    function encerrarIntroHeroi() {
        if (introEncerrada) return;

        introEncerrada = true;

        videoHeroi.pause();
        introHeroi.classList.add("heroi-saindo");
        document.body.classList.remove("intro-ativo");

        function removerIntro() {
            introHeroi.style.display = "none";
        }

        introHeroi.addEventListener("transitionend", function finalizar(event) {
            if (event.propertyName === "opacity") {
                removerIntro();
            }
        });
        setTimeout(removerIntro, 800);
    }

    videoHeroi.addEventListener("ended", encerrarIntroHeroi);
    botaoPularHeroi.addEventListener("click", encerrarIntroHeroi);

    videoHeroi.play().catch(function () {
        console.warn("A reprodução automática não foi iniciada.");
    });
}

const button = document.getElementById("botao-mode");
const body = document.body;

const darkModeSalvo = localStorage.getItem("dark-mode");

if (darkModeSalvo === "enabled") {
    body.classList.add("dark-mode");

    if (button && button.type === "checkbox") {
        button.checked = true;
    }
}

if (button) {
    button.addEventListener("change", () => {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.setItem("dark-mode", "disabled");
        }
    });
}

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


// ======================================================
// MOSTRAR MENSAGENS
// ======================================================

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


// ======================================================
// TRATAR TEXTO
// ======================================================

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


// ======================================================
// RESPOSTAS DO CHATBOT
// ======================================================

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
        return "Sou o Cookie, assistente virtual da nossa loja! Posso ajudar com sabores, preços, pedidos, entregas, horários e formas de pagamento.";
    }

    else if (contemExpressao([
        "preco", "precos", "valor", "valores",
        "quanto custa", "quanto custam",
        "quanto e", "custa", "custam",
        "barato", "caro", "promocao"
    ])) {
        return escolher([
            "Nossos cookies começam em R$ 8 a unidade! As caixas podem sair mais baratas.",
            "Temos cookies a partir de R$ 8. Quer conhecer nossos sabores?",
            "O valor começa em R$ 8 por unidade. Me conta quantos você quer!"
        ]);
    }

    else if (contemExpressao([
        "sabor", "sabores", "cardapio",
        "chocolate", "red velvet", "doce de leite",
        "baunilha", "recheio", "ingredientes"
    ])) {
        return "Nosso cardápio tem chocolate, red velvet, doce de leite e baunilha com gotas! O red velvet é um dos favoritos.";
    }

    else if (contemExpressao([
        "entrega", "entregam", "frete", "delivery",
        "entregar", "receber em casa", "bairro", "endereco"
    ])) {
        return "Fazemos entregas sim! O valor do frete depende do bairro. Me diga sua região para conversarmos sobre a entrega.";
    }

    else if (contemExpressao([
        "horario", "horarios", "aberto",
        "funciona", "abre", "fechado",
        "fecha", "domingo", "sabado"
    ])) {
        return "Funcionamos de segunda a sábado, das 9h às 18h! 🕘";
    }

    else if (contemExpressao([
        "pagamento", "pix", "cartao",
        "credito", "debito", "pagar",
        "dinheiro", "parcelar"
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
            "pedido", "pedidos", "encomenda",
            "comprar", "compras", "pedir", "reservar"
        ]) ||
        contemPalavra(["quero", "queria"])
    ) {
        return "Oba! Vamos conversar sobre seu pedido! Temos chocolate, red velvet, doce de leite e baunilha com gotas. Qual sabor você gostaria?";
    }

    else if (contemExpressao([
        "quantidade", "caixa", "caixas",
        "unidades", "unidade", "duzia"
    ])) {
        return "Temos cookies por unidade e opções de caixas! Quantos cookies você gostaria?";
    }

    else if (contemExpressao([
        "gostoso", "gostosa", "delicioso",
        "deliciosa", "amei", "maravilhoso", "perfeito"
    ])) {
        return "Aaaah, nossos cookies são feitos com muito carinho! Qual sabor você está com vontade de experimentar?";
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


// ======================================================
// ENVIAR MENSAGEM
// ======================================================

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


// ======================================================
// ANIMAÇÃO DOS COOKIES
// ======================================================

const secao = document.querySelector("#secaoCookies");
const cookies = document.querySelectorAll(".cookie");

let animacaoIniciada = false;

if (secao && cookies.length > 0 && "IntersectionObserver" in window) {

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

    }, {
        threshold: 0.4
    });

    observador.observe(secao);
}


// ======================================================
// POP-UP DE LOGIN
// ======================================================

const modalLogin = document.getElementById("id01");
const formularioLogin = document.getElementById("formLogin");

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

window.addEventListener("click", function (event) {
    if (modalLogin && event.target === modalLogin) {
        fecharLogin();
    }
});

window.addEventListener("keydown", function (event) {
    if (
        event.key === "Escape" &&
        modalLogin &&
        modalLogin.style.display === "flex"
    ) {
        fecharLogin();
    }
});

if (formularioLogin) {
    formularioLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        alert("Interface de login funcionando! A autenticação ainda precisa ser conectada.");
    });
}



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

// Pesquisa enquanto digita
if (campoPesquisa) {
    campoPesquisa.addEventListener("input", abrirPesquisa);

    // Também permite pesquisar apertando Enter
    campoPesquisa.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            abrirPesquisa();
        }
    });
}
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


// ========================================
// CARRINHO DE COMPRAS - TEMÁTICOS
// ========================================

// Carregar produtos salvos
let carrinhoTematicos = JSON.parse(
    localStorage.getItem("onceUponABite_carrinho")
) || [];


// Salvar carrinho
function salvarCarrinhoTematicos() {
    localStorage.setItem(
        "onceUponABite_carrinho",
        JSON.stringify(carrinhoTematicos)
    );
}


// Atualizar contador
function atualizarContadorTematicos() {
    const contador = document.getElementById("contadorCarrinho");

    if (!contador) return;

    const quantidade = carrinhoTematicos.reduce(
        (total, produto) => total + (produto.quantidade || 0),
        0
    );

    contador.textContent = quantidade;
}


// Animação do cookie voando
function animarCookieTematicos(botao) {
    const produto = botao.closest(".produto");

    if (!produto) return;

    const imagem = produto.querySelector(".imagem-detalhes");
    const carrinhoIcone = document.getElementById("iconeCarrinho");

    if (!imagem || !carrinhoIcone) return;

    const imagemVoando = imagem.cloneNode(true);

    const inicio = imagem.getBoundingClientRect();
    const destino = carrinhoIcone.getBoundingClientRect();

    imagemVoando.removeAttribute("onclick");

    imagemVoando.style.position = "fixed";
    imagemVoando.style.left = inicio.left + "px";
    imagemVoando.style.top = inicio.top + "px";
    imagemVoando.style.width = inicio.width + "px";
    imagemVoando.style.height = inicio.height + "px";
    imagemVoando.style.objectFit = "contain";
    imagemVoando.style.zIndex = "99999";
    imagemVoando.style.pointerEvents = "none";
    imagemVoando.style.transition =
        "all 0.8s cubic-bezier(0.5, -0.3, 0.8, 0.5)";

    document.body.appendChild(imagemVoando);

    imagemVoando.getBoundingClientRect();

    imagemVoando.style.left =
        destino.left + destino.width / 2 - 15 + "px";

    imagemVoando.style.top =
        destino.top + destino.height / 2 - 15 + "px";

    imagemVoando.style.width = "30px";
    imagemVoando.style.height = "30px";
    imagemVoando.style.opacity = "0.2";
    imagemVoando.style.transform =
        "rotate(360deg) scale(0.3)";

    setTimeout(() => {
        imagemVoando.remove();
    }, 850);

    // Animação do carrinho
    if (carrinhoIcone.animate) {
        carrinhoIcone.animate(
            [
                { transform: "scale(1)" },
                { transform: "scale(1.3) rotate(-10deg)" },
                { transform: "scale(0.9) rotate(10deg)" },
                { transform: "scale(1)" }
            ],
            {
                duration: 500,
                easing: "ease"
            }
        );
    }
}


// Adicionar produto ao carrinho
function adicionarAoCarrinhoTematicos(botao) {
    const produto = botao.closest(".produto");

    if (!produto) return;

    const imagem = produto.querySelector(".imagem-detalhes");

    if (!imagem) return;

    const nome = imagem.dataset.nome;
    const preco = Number(imagem.dataset.preco);
    const caminhoImagem =
        imagem.dataset.imagem || imagem.getAttribute("src");

    if (!nome || !Number.isFinite(preco)) {
        console.error("Dados do produto não encontrados.");
        return;
    }

    // Verificar se já existe no carrinho
    const produtoExistente = carrinhoTematicos.find(
        item => item.nome === nome
    );

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinhoTematicos.push({
            nome: nome,
            preco: preco,
            quantidade: 1,
            imagem: caminhoImagem
        });
    }

    salvarCarrinhoTematicos();
    atualizarContadorTematicos();

    // Fazer animação
    animarCookieTematicos(botao);

    // Mudar o + para ✓
    const textoOriginal = botao.textContent;

    botao.textContent = "✓";
    botao.disabled = true;

    setTimeout(() => {
        botao.textContent = textoOriginal;
        botao.disabled = false;
    }, 650);
}


// Configurar os botões
document.querySelectorAll(
    ".produto .adicionar-carrinho"
).forEach(botao => {

    botao.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();

        adicionarAoCarrinhoTematicos(this);
    });

});


// Atualizar contador ao abrir a página
atualizarContadorTematicos();
