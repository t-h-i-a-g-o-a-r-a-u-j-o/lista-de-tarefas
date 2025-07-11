document.addEventListener('DOMContentLoaded', () => {
  // --- SELEÇÃO DOS ELEMENTOS ---
  const tarefaInput = document.getElementById('tarefa-input');
  const btnAdicionar = document.getElementById('btn-adicionar');
  const listaTarefasEl = document.getElementById('lista-tarefas');

  // --- LÓGICA PRINCIPAL ---

  // Carrega as tarefas salvas no navegador ou começa com uma lista vazia
  let tarefas = JSON.parse(localStorage.getItem('tarefas_lista')) || [];

  // Função para salvar a lista de tarefas no armazenamento do navegador
  function salvarTarefas() {
    localStorage.setItem('tarefas_lista', JSON.stringify(tarefas));
  }

  // Função que renderiza (desenha) a lista de tarefas na tela
  function renderizarTarefas() {
    listaTarefasEl.innerHTML = ''; // Limpa a lista atual na tela

    tarefas.forEach((tarefa, index) => {
      const li = document.createElement('li');
      li.textContent = tarefa.texto;
      
      // Adiciona a classe 'completed' se a tarefa estiver marcada como concluída
      if (tarefa.completa) {
        li.classList.add('completed');
      }

      // Evento para MARCAR/DESMARCAR como concluída
      li.addEventListener('click', () => {
        tarefas[index].completa = !tarefas[index].completa;
        salvarTarefas();
        renderizarTarefas();
      });
      
      // Cria e adiciona o botão de DELETAR
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'X';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique no botão também marque a tarefa
        tarefas.splice(index, 1); // Remove a tarefa da lista
        salvarTarefas();
        renderizarTarefas();
      });

      li.appendChild(deleteBtn);
      listaTarefasEl.appendChild(li);
    });
  }

  // Função para adicionar uma nova tarefa
  function adicionarTarefa() {
    const textoTarefa = tarefaInput.value.trim();
    if (textoTarefa) {
      tarefas.push({ texto: textoTarefa, completa: false });
      tarefaInput.value = '';
      salvarTarefas();
      renderizarTarefas();
      tarefaInput.focus();
    }
  }

  // --- EVENT LISTENERS ---
  btnAdicionar.addEventListener('click', adicionarTarefa);
  tarefaInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      adicionarTarefa();
    }
  });

  // Renderiza a lista pela primeira vez quando a página carrega
  renderizarTarefas();
});