
(function () {
    const CHAVE_CARRINHO = "onceUponABite_carrinho";

    const carrinhoItens = document.getElementById("carrinhoItens");
    const carrinhoVazio = document.getElementById("carrinhoVazio");
    const carrinhoConteudo = document.getElementById("carrinhoConteudo");

    const contadorItens = document.getElementById("contadorItensCarrinho");
    const subtotalElemento = document.getElementById("subtotalCarrinho");
    const totalElemento = document.getElementById("totalCarrinho");

    const botaoFinalizar = document.getElementById("finalizarCompra");

    let carrinho = JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];

    function salvarCarrinho() {
        localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    }

    function formatarPreco(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function atualizarCarrinho() {
        carrinhoItens.innerHTML = "";

        const quantidadeTotal = carrinho.reduce(
            (total, item) => total + Number(item.quantidade || 1), 0
        );

        const subtotal = carrinho.reduce(
            (total, item) => total + Number(item.preco) * Number(item.quantidade || 1), 0
        );

        contadorItens.textContent = quantidadeTotal + 
            (quantidadeTotal === 1 ? " item" : " itens");

        subtotalElemento.textContent = formatarPreco(subtotal);
        totalElemento.textContent = formatarPreco(subtotal);

        if (carrinho.length === 0) {
            carrinhoVazio.style.display = "block";
            carrinhoConteudo.style.display = "none";
            return;
        }

        carrinhoVazio.style.display = "none";
        carrinhoConteudo.style.display = "grid";

        carrinho.forEach((item, index) => {
            const produto = document.createElement("div");
            produto.className = "item-carrinho";

            const imagem = document.createElement("img");
            imagem.className = "imagem-item-carrinho";
            imagem.src = item.imagem || "images/msbiscuits.png";
            imagem.alt = item.nome;
            imagem.onerror = function () {
                this.src = "images/msbiscuits.png";
            };

            const informacoes = document.createElement("div");
            informacoes.className = "informacoes-item";

            const nome = document.createElement("h3");
            nome.textContent = item.nome;

            const preco = document.createElement("p");
            preco.textContent = formatarPreco(item.preco);

            const controles = document.createElement("div");
            controles.className = "controles-quantidade";

            const diminuir = document.createElement("button");
            diminuir.textContent = "−";
            diminuir.dataset.acao = "diminuir";
            diminuir.dataset.index = index;

            const quantidade = document.createElement("span");
            quantidade.textContent = item.quantidade;

            const aumentar = document.createElement("button");
            aumentar.textContent = "+";
            aumentar.dataset.acao = "aumentar";
            aumentar.dataset.index = index;

            const remover = document.createElement("button");
            remover.textContent = "Remover";
            remover.className = "remover-item";
            remover.dataset.acao = "remover";
            remover.dataset.index = index;

            controles.append(diminuir, quantidade, aumentar);

            informacoes.append(nome, preco, controles, remover);

            produto.append(imagem, informacoes);

            carrinhoItens.appendChild(produto);
        });
    }

    carrinhoItens.addEventListener("click", function (event) {
        const botao = event.target.closest("button[data-acao]");

        if (!botao) return;

        const index = Number(botao.dataset.index);
        const acao = botao.dataset.acao;

        if (!carrinho[index]) return;

        if (acao === "aumentar") {
            carrinho[index].quantidade++;
        }

        if (acao === "diminuir") {
            carrinho[index].quantidade--;

            if (carrinho[index].quantidade <= 0) {
                carrinho.splice(index, 1);
            }
        }

        if (acao === "remover") {
            carrinho.splice(index, 1);
        }

        salvarCarrinho();
        atualizarCarrinho();
    });

    if (botaoFinalizar) {
 
        botaoFinalizar.addEventListener("click", function () {
    
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

            const json = JSON.stringify(pedido, null, 4);

            const blob = new Blob(
                [json],
                { type: "application/json;charset=utf-8" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
    
            link.href = url;
            link.download = "pedido-once-upon-a-bite.json";
    
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(url), 1000);
    
            alert("Seu pedido foi finalizado com sucesso!");
    
        });
    
    }

    atualizarCarrinho();
})();


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

        const ativado = body.classList.contains("dark-mode");

        localStorage.setItem(
            "dark-mode",
            ativado ? "enabled" : "disabled"
        );
    });
}



 