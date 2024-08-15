const btAddTarefa = document.querySelector('.app__button--add-task');
const formAddTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescTarefa = document.querySelector('.app__section-active-task-description');
const btnRemovConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoveAll = document.querySelector('#btn-remover-todas');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

let selecionar = null;
let liSelecionar = null;

//funções para faciliatar o codigo 
function atualizarTarefa (){
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}
 function hidden() {
    formAddTarefa.classList.add('hidden');
 }
function appTarefa(tarefa) {
    const elementoTarefa = criaElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
 }

function addClasse (){
    liSelecionar.classList.add('app__section-task-list-item-complete');
}

function criaElementoTarefa(tarefa){
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description');
    paragrafo.textContent = tarefa.descricao;
    
    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        const novadescricao = prompt("qual é o novo nome da tarefa");
        paragrafo.textContent = novadescricao;
        tarefa.descricao = novadescricao;
        atualizarTarefa();
    }

    const imagemBotao = document.createElement('img');

    imagemBotao.setAttribute('src', 'imagens/edit.png');
    botao.append(imagemBotao)

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        addClasse();
        botao.setAttribute('disabled', 'disabled');
    } else {
         li.onclick = () => { 
        document.querySelectorAll('.app__section-task-list-item-active')
            .forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active');
            });

        if(selecionar == tarefa){
            paragrafoDescTarefa.textContent = '';
            selecionar = null;
            liSelecionar = null;
            return;
        }
        
        selecionar = tarefa;
        liSelecionar = li;
        paragrafoDescTarefa.textContent = tarefa.descricao;
       
        li.classList.add('app__section-task-list-item-active');
        }
    }

    return li;
}

btAddTarefa.addEventListener('click', () => {
    formAddTarefa.classList.toggle('hidden')
});

formAddTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa);
    appTarefa(tarefa);
    atualizarTarefa();
    textArea.value = '';
    hidden();
});

tarefas.forEach(tarefa => {
    appTarefa(tarefa);
})

document.addEventListener('FocoFinalizado', () => {
    if (selecionar && liSelecionar) {
        liSelecionar.classList.remove('app__section-task-list-item-active');
        addClasse();
        liSelecionar.querySelector('button').setAttribute('disabled', 'disabled');
        selecionar.completa = true;
        atualizarTarefa();
    }
});

const removerTarefas = (somenteCompletas) => {
    let seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefas = somenteCompletas ? tarefas.filter(elemento => !elemento.completa) : []
    atualizarTarefa();
}

btnRemovConcluidas.onclick = () => removerTarefas(true);
btnRemoveAll.onclick = () => removerTarefas(false);

//botão de cancelar 
 const limparForm = () => {
    textArea.value = '';
    hidden();
 }
btnCancelar.addEventListener('click', limparForm);

