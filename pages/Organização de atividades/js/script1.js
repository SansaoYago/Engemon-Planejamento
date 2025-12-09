const frm = document.querySelector("form");
const outDiv = document.querySelector("#out");

// ==========================================================
// 0. DEFINIÇÃO DAS TAREFAS MENSAIS (SIMULANDO O ARQUIVO JSON)
// ==========================================================
/**
 * Lista de tarefas que devem ser adicionadas automaticamente uma vez por mês.
 * dia_do_mes: O dia do mês em que a tarefa deve ser adicionada (1 a 31).
 */
const tarefasMensais = [
    { texto: "Enviar Contador da Impressora para Katiuscia", dia_do_mes: 25 },
    { texto: "ZAP TAXI", dia_do_mes: 15 },
    { texto: "M2E", dia_do_mes: 28 },
    { texto: "TKS", dia_do_mes: 1 },
    { texto: "SAMM(Internet)", dia_do_mes: 1 }
    // Adicione suas próprias tarefas recorrentes aqui:
    // { texto: "Exemplo de Atividade", dia_do_mes: 1 } 
];


// ==========================================================
// 1. FUNÇÃO REUTILIZÁVEL PARA ADICIONAR A TAREFA À TELA
// ==========================================================
/**
 * Cria os elementos HTML de uma tarefa e os insere na div de saída.
 * @param {string} texto - O texto da atividade.
 * @param {boolean} [concluida=false] - O estado inicial da checkbox.
 */
function adicionarTarefaNaTela(texto, concluida = false) {
    // Cria o contêiner principal para o item da tarefa
    const itemContainer = document.createElement("div");
    itemContainer.classList.add('item-tarefa');

    // Cria a Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "15px";
    checkbox.checked = concluida; // Define o estado inicial

    // Cria o elemento de texto (Span)
    const atividadeTexto = document.createElement("span");
    atividadeTexto.innerText = texto;

    // Cria o botão de exclusão
    const btnExcluir = document.createElement("button");
    btnExcluir.innerText = "Excluir";
    btnExcluir.classList.add('btn-excluir');

    // === Lógica de Visibilidade do Botão e Risco no Texto ===
    if (concluida) {
        atividadeTexto.classList.add('concluida');
        // Se a tarefa já está concluída ao carregar, o botão aparece
        btnExcluir.classList.add('visivel');
    } else {
        // Se a tarefa NÃO está concluída, o botão é escondido por padrão
        btnExcluir.classList.add('oculto');
    }

    // === Event Listeners ===

    // Listener para a Checkbox (Marcação de Conclusão)
    checkbox.addEventListener('change', (event) => {
        if (event.target.checked) {
            atividadeTexto.classList.add('concluida');
            // Mostra o botão quando marcado
            btnExcluir.classList.remove('oculto');
            btnExcluir.classList.add('visivel');
        } else {
            atividadeTexto.classList.remove('concluida');
            // Esconde o botão quando desmarcado
            btnExcluir.classList.remove('visivel');
            btnExcluir.classList.add('oculto');
        }
        salvarTarefas(); // Salva após mudança de status
    });

    // Listener para o botão de exclusão
    btnExcluir.addEventListener('click', () => {
        outDiv.removeChild(itemContainer); // Remove o contêiner do DOM
        salvarTarefas(); // Salva após exclusão
    });

    // Anexa todos os elementos ao contêiner
    itemContainer.appendChild(checkbox);
    itemContainer.appendChild(atividadeTexto);
    itemContainer.appendChild(btnExcluir);
    
    // Adiciona o novo contêiner à div de saída
    outDiv.appendChild(itemContainer);
}

// ==========================================================
// 2. FUNÇÃO PARA SALVAR O ESTADO ATUAL NO LOCALSTORAGE
// ==========================================================
function salvarTarefas() {
    const tarefas = [];
    // Seleciona todos os contêineres de itens
    const itens = document.querySelectorAll(".item-tarefa");

    itens.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const textoSpan = item.querySelector('span');

        // Cria um objeto para cada tarefa
        tarefas.push({
            texto: textoSpan.innerText,
            concluida: checkbox.checked
        });
    });

    // Converte o array de objetos para string JSON e salva no localStorage
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
}

// ==========================================================
// 3. NOVA FUNÇÃO PARA VERIFICAR E ADICIONAR TAREFAS MENSAIS
// ==========================================================
function verificarEAdicionarTarefasMensais() {
    const hoje = new Date();
    const diaHoje = hoje.getDate();
    // Cria uma chave única por Mês e Ano (Ex: 2025_12)
    const anoMesAtual = `${hoje.getFullYear()}_${hoje.getMonth() + 1}`;

    // 1. Carrega o histórico de tarefas mensais adicionadas
    let historicoJSON = localStorage.getItem('historicoMensal');
    let historico = historicoJSON ? JSON.parse(historicoJSON) : { ano_mes: "", adicionadas: [] };

    // 2. Verifica se o mês mudou. Se sim, reseta o histórico para o novo ciclo.
    if (historico.ano_mes !== anoMesAtual) {
        historico = { ano_mes: anoMesAtual, adicionadas: [] };
    }

    let houveAlteracao = false; // Flag para salvar o estado

    tarefasMensais.forEach(tarefaMensal => {
        // Verifica se é o dia correto E se a tarefa ainda não foi marcada como 'adicionada' neste mês
        if (tarefaMensal.dia_do_mes === diaHoje &&
            !historico.adicionadas.includes(tarefaMensal.texto)) {

            // Obtém todas as tarefas atualmente no DOM para checar duplicidade
            const tarefasAtuais = document.querySelectorAll("#out span");
            // Verifica se a tarefa já existe na lista principal (minhasTarefas)
            const jaExiste = Array.from(tarefasAtuais).some(span => span.innerText === tarefaMensal.texto);

            if (!jaExiste) {
                // Se NÃO existe, adiciona a nova tarefa à tela
                adicionarTarefaNaTela(tarefaMensal.texto, false);
                houveAlteracao = true;
            }
            
            // Em ambos os casos (adicionada agora OU já existia e está persistindo da última vez),
            // marca a tarefa como 'adicionada' no histórico mensal para evitar nova adição
            // até o próximo ciclo (mês).
            historico.adicionadas.push(tarefaMensal.texto);
            houveAlteracao = true; // Força o salvamento do histórico atualizado
        }
    });

    // 4. Salva o estado se houveram mudanças (novas tarefas ou histórico atualizado)
    if (houveAlteracao) {
        // Se novas tarefas foram adicionadas ao DOM, salva a lista principal
        if (document.querySelectorAll("#out span").length > JSON.parse(localStorage.getItem('minhasTarefas') || '[]').length) {
            salvarTarefas();
        }
        // Salva o histórico mensal para manter a recorrência
        localStorage.setItem('historicoMensal', JSON.stringify(historico));
    }
}


// ==========================================================
// 4. FUNÇÃO PARA CARREGAR AS TAREFAS
// (MODIFICADA PARA CARREGAR PRIMEIRO AS TAREFAS SALVAS E DEPOIS ADICIONAR AS MENSAIS)
// ==========================================================
function carregarTarefas() {
    // Tenta obter a string JSON do localStorage
    const tarefasJSON = localStorage.getItem('minhasTarefas');

    // 1. Carrega e exibe as tarefas salvas pelo usuário
    if (tarefasJSON) {
        // Converte a string JSON de volta para um array de objetos
        const tarefas = JSON.parse(tarefasJSON);

        // Itera sobre o array e cria os elementos na tela
        tarefas.forEach(tarefa => {
            adicionarTarefaNaTela(tarefa.texto, tarefa.concluida);
        });
    }

    // 2. Verifica e adiciona tarefas mensais se for o dia
    verificarEAdicionarTarefasMensais();
}

// ==========================================================
// 5. LISTENER PRINCIPAL DO FORMULÁRIO (NOVO REGISTRO)
// ==========================================================
frm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inpt = frm.desc.value.trim();

    if (inpt === "") {
        alert("Por favor, insira a descrição da atividade.");
        return;
    }

    // Adiciona a nova tarefa à tela (por padrão, não concluída)
    adicionarTarefaNaTela(inpt, false); 
    
    // Salva o novo estado da lista no localStorage
    salvarTarefas();

    // Limpa o campo de entrada
    frm.desc.value = "";
});

// ==========================================================
// 6. CHAMA A FUNÇÃO DE CARREGAMENTO QUANDO O SCRIPT INICIA
// ==========================================================
document.addEventListener('DOMContentLoaded', carregarTarefas);