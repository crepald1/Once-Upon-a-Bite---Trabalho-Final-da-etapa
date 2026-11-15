
const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));

const imagem = document.getElementById("produtoImagem");
const nome = document.getElementById("produtoNome");
const preco = document.getElementById("produtoPreco");
const descricao = document.getElementById("produtoDescricao");
const ingredientes = document.getElementById("produtoIngredientes");
const informacoes = document.getElementById("produtoInformacoes");
const categoria = document.getElementById("produtoCategoria");

const botaoCarrinho = document.getElementById("adicionarCarrinho");
const mensagem = document.getElementById("mensagem");
const contadorCarrinho = document.getElementById("contadorCarrinho");

const CHAVE_CARRINHO = "onceUponABite_carrinho";

let quantidade = 1;

// Lê os produtos já salvos no carrinho
function lerCarrinho() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
    } catch (erro) {
        console.error("Erro ao carregar carrinho:", erro);
        return [];
    }
}

// Salva o carrinho
function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

// Atualiza o contador do ícone
function atualizarContador() {
    const carrinho = lerCarrinho();

    const total = carrinho.reduce(
        (soma, item) => soma + Number(item.quantidade || 0),
        0
    );

    if (contadorCarrinho) {
        contadorCarrinho.textContent = total;
    }
}

// Exibe os detalhes do produto
if (produto) {
    imagem.src = produto.imagem || "";
    imagem.alt = produto.nome || "Cookie";

    nome.textContent = produto.nome || "Cookie";

    descricao.textContent =
        produto.descricao || "Um cookie delicioso, preparado especialmente para você.";

    ingredientes.textContent =
        produto.ingredientes || "Consulte os ingredientes com nossa equipe.";

    informacoes.textContent =
        produto.informacoes || "Produto artesanal. Consulte a disponibilidade.";

    categoria.textContent = produto.categoria || "COOKIE ESPECIAL";

    const valor = Number(produto.preco);

    preco.textContent = Number.isFinite(valor)
        ? valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        : "Preço indisponível";

    if (!Number.isFinite(valor)) {
        botaoCarrinho.disabled = true;
    }

} else {
    nome.textContent = "Produto não encontrado";

    descricao.textContent =
        "Volte à página de produtos e escolha um cookie para visualizar os detalhes.";

    preco.textContent = "";
    botaoCarrinho.disabled = true;
}

// Aumentar quantidade
document.getElementById("aumentar").addEventListener("click", function () {
    quantidade++;

    document.getElementById("quantidade").textContent = quantidade;
});

// Diminuir quantidade
document.getElementById("diminuir").addEventListener("click", function () {
    if (quantidade > 1) {
        quantidade--;

        document.getElementById("quantidade").textContent = quantidade;
    }
});

// Adicionar ao carrinho
botaoCarrinho.addEventListener("click", function () {
    if (!produto) return;

    const valor = Number(produto.preco);

    if (!Number.isFinite(valor)) {
        mensagem.textContent = "Não foi possível identificar o preço deste produto.";
        return;
    }

    const carrinho = lerCarrinho();

    // Usa o mesmo padrão de identificação do script.js
    const id = String(produto.nome)
        .toLowerCase()
        .replace(/\s+/g, "-");

    // Verifica se o produto já está no carrinho
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: id,
            nome: produto.nome,
            preco: valor,
            quantidade: quantidade,
            imagem: produto.imagem || ""
        });
    }

    salvarCarrinho(carrinho);

    atualizarContador();

    mensagem.textContent = "✓ Produto adicionado ao carrinho!";

    // Feedback visual no botão
    botaoCarrinho.textContent = "✓ Adicionado!";
    botaoCarrinho.disabled = true;

    setTimeout(function () {
        botaoCarrinho.textContent = "Adicionar ao carrinho";
        botaoCarrinho.disabled = false;
    }, 1200);
});

// Atualiza o contador assim que a página abre
atualizarContador();
