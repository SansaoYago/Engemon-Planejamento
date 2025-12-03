const frm = document.querySelector("form")
const outDiv = document.querySelector("#out") 

frm.addEventListener('submit', (e)=> {
    e.preventDefault()
    
    const inpt = frm.desc.value

    if (inpt.trim() === "") {
        alert("Por favor, insira a descrição da atividade.")
        return
    }

    // 1. Cria a Checkbox
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"

    // 2. Cria o elemento de texto (Span)
    const atividadeTexto = document.createElement("span")
    atividadeTexto.innerText = " " + inpt // Adiciona um espaço para separar da checkbox
    
    // 3. Cria um contêiner (Div) para agrupar checkbox e texto e garantir nova linha
    const itemContainer = document.createElement("div")
    itemContainer.style.marginBottom = "5px" // Espaçamento entre os itens
    
    // Anexa a checkbox e o texto ao contêiner
    itemContainer.appendChild(checkbox)
    itemContainer.appendChild(atividadeTexto)

    // 4. Adiciona o Event Listener à Checkbox
    checkbox.addEventListener('change', (event) => {
        // Verifica se a checkbox foi marcada
        if (event.target.checked) {
            // Se marcada, adiciona a classe 'concluida' ao texto para riscar
            atividadeTexto.classList.add('concluida')
        } else {
            // Se desmarcada, remove a classe 'concluida'
            atividadeTexto.classList.remove('concluida')
        }
    })

    // 5. Adiciona o novo contêiner à div de saída
    outDiv.appendChild(itemContainer) 
    
    // Limpa o campo de entrada
    frm.desc.value = ""
})