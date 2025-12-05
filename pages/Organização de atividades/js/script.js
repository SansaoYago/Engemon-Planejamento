const frm = document.querySelector("form");
const outDiv = document.querySelector("#out");

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
// 3. FUNÇÃO PARA CARREGAR AS TAREFAS
// ==========================================================
function carregarTarefas() {
    // Tenta obter a string JSON do localStorage
    const tarefasJSON = localStorage.getItem('minhasTarefas');

    // Se existir algo salvo
    if (tarefasJSON) {
        // Converte a string JSON de volta para um array de objetos
        const tarefas = JSON.parse(tarefasJSON); 

        // Itera sobre o array e cria os elementos na tela
        tarefas.forEach(tarefa => {
            adicionarTarefaNaTela(tarefa.texto, tarefa.concluida);
        });
    }
}

// ==========================================================
// 4. LISTENER PRINCIPAL DO FORMULÁRIO (NOVO REGISTRO)
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
// 5. CHAMA A FUNÇÃO DE CARREGAMENTO QUANDO O SCRIPT INICIA
// ==========================================================
document.addEventListener('DOMContentLoaded', carregarTarefas);