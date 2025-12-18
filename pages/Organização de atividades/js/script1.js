const frm = document.querySelector("form");
const outDiv = document.querySelector("#out");

const tarefasMensais = [
    { texto: "Enviar Contador da Impressora para Katiuscia", dia_do_mes: 25 },
    { texto: "ZAP TAXI", dia_do_mes: 15 },
    { texto: "M2E", dia_do_mes: 28 },
    { texto: "TKS", dia_do_mes: 1 },
    { texto: "SAMM(Internet)", dia_do_mes: 1 }
];

// 1. ADICIONAR TAREFA NA TELA (Com botões de mover)
function adicionarTarefaNaTela(texto, concluida = false) {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add('item-tarefa');

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = concluida;

    const atividadeTexto = document.createElement("span");
    atividadeTexto.innerText = texto;
    if (concluida) atividadeTexto.classList.add('concluida');

    // Botões de Movimentação
    const btnSubir = document.createElement("button");
    btnSubir.innerHTML = "↑";
    btnSubir.classList.add('btn-mover');
    
    const btnDescer = document.createElement("button");
    btnDescer.innerHTML = "↓";
    btnDescer.classList.add('btn-mover');

    const btnExcluir = document.createElement("button");
    btnExcluir.innerText = "Excluir";
    btnExcluir.classList.add('btn-excluir', concluida ? 'visivel' : 'oculto');

    // Lógica de Mover para Cima
    btnSubir.onclick = () => {
        const anterior = itemContainer.previousElementSibling;
        if (anterior) {
            outDiv.insertBefore(itemContainer, anterior);
            salvarTarefas();
        }
    };

    // Lógica de Mover para Baixo
    btnDescer.onclick = () => {
        const proximo = itemContainer.nextElementSibling;
        if (proximo) {
            outDiv.insertBefore(proximo, itemContainer);
            salvarTarefas();
        }
    };

    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            atividadeTexto.classList.add('concluida');
            btnExcluir.classList.replace('oculto', 'visivel');
        } else {
            atividadeTexto.classList.remove('concluida');
            btnExcluir.classList.replace('visivel', 'oculto');
        }
        salvarTarefas();
    });

    btnExcluir.addEventListener('click', () => {
        itemContainer.remove();
        salvarTarefas();
    });

    itemContainer.append(checkbox, atividadeTexto, btnSubir, btnDescer, btnExcluir);
    outDiv.appendChild(itemContainer);
}

// 2. SALVAR ESTADO (Mantém a ordem atual da tela)
function salvarTarefas() {
    const tarefas = [];
    document.querySelectorAll(".item-tarefa").forEach(item => {
        tarefas.push({
            texto: item.querySelector('span').innerText,
            concluida: item.querySelector('input').checked
        });
    });
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
}

// 3. TAREFAS MENSAIS
function verificarEAdicionarTarefasMensais() {
    const hoje = new Date();
    const diaHoje = hoje.getDate();
    const anoMesAtual = `${hoje.getFullYear()}_${hoje.getMonth() + 1}`;

    let historico = JSON.parse(localStorage.getItem('historicoMensal')) || { ano_mes: "", adicionadas: [] };

    if (historico.ano_mes !== anoMesAtual) {
        historico = { ano_mes: anoMesAtual, adicionadas: [] };
    }

    tarefasMensais.forEach(tarefa => {
        if (tarefa.dia_do_mes === diaHoje && !historico.adicionadas.includes(tarefa.texto)) {
            const tarefasAtuais = Array.from(document.querySelectorAll(".item-tarefa span")).map(s => s.innerText);
            if (!tarefasAtuais.includes(tarefa.texto)) {
                adicionarTarefaNaTela(tarefa.texto, false);
                salvarTarefas();
            }
            historico.adicionadas.push(tarefa.texto);
            localStorage.setItem('historicoMensal', JSON.stringify(historico));
        }
    });
}

// 4. CARREGAR AO INICIAR
function carregarTarefas() {
    outDiv.innerHTML = "";
    const salvas = JSON.parse(localStorage.getItem('minhasTarefas')) || [];
    salvas.forEach(t => adicionarTarefaNaTela(t.texto, t.concluida));
    verificarEAdicionarTarefasMensais();
}

frm.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = frm.desc.value.trim();
    if (texto) {
        adicionarTarefaNaTela(texto);
        salvarTarefas();
        frm.desc.value = "";
    }
});

document.addEventListener('DOMContentLoaded', carregarTarefas);