document.addEventListener('DOMContentLoaded', () => {
  const tarefaInput = document.getElementById('tarefa-input');
  const btnAdicionar = document.getElementById('btn-adicionar');
  const listaTarefasEl = document.getElementById('lista-tarefas');

  const botoesFiltro = document.querySelectorAll('.filtro');
  const btnLimparConcluidas = document.getElementById(
    'btn-limpar-concluidas'
  );

  const contadorTarefas = document.getElementById('contador-tarefas');
  const mensagemVazia = document.getElementById('mensagem-vazia');

  let filtroAtual = 'todas';

  let tarefas = carregarTarefas();

  function carregarTarefas() {
    try {
      const dados = JSON.parse(
        localStorage.getItem('tarefas_lista')
      );

      if (!Array.isArray(dados)) {
        return [];
      }

      return dados.map((tarefa, index) => ({
        id: tarefa.id ?? Date.now() + index,
        texto: tarefa.texto ?? '',
        completa: Boolean(tarefa.completa)
      }));
    } catch (erro) {
      console.error('Erro ao carregar tarefas:', erro);
      return [];
    }
  }

  function salvarTarefas() {
    localStorage.setItem(
      'tarefas_lista',
      JSON.stringify(tarefas)
    );
  }

  function obterTarefasFiltradas() {
    if (filtroAtual === 'pendentes') {
      return tarefas.filter((tarefa) => !tarefa.completa);
    }

    if (filtroAtual === 'concluidas') {
      return tarefas.filter((tarefa) => tarefa.completa);
    }

    return tarefas;
  }

  function atualizarContador() {
    const total = tarefas.length;

    const pendentes = tarefas.filter(
      (tarefa) => !tarefa.completa
    ).length;

    contadorTarefas.textContent =
      `${total} tarefa(s) cadastrada(s) • ${pendentes} pendente(s)`;
  }

  function atualizarMensagemVazia(listaFiltrada) {
    if (listaFiltrada.length > 0) {
      mensagemVazia.style.display = 'none';
      return;
    }

    mensagemVazia.style.display = 'block';

    if (filtroAtual === 'pendentes') {
      mensagemVazia.textContent =
        'Nenhuma tarefa pendente.';
    } else if (filtroAtual === 'concluidas') {
      mensagemVazia.textContent =
        'Nenhuma tarefa concluída.';
    } else {
      mensagemVazia.textContent =
        'Nenhuma tarefa cadastrada.';
    }
  }

  function renderizarTarefas() {
    listaTarefasEl.innerHTML = '';

    const tarefasFiltradas =
      obterTarefasFiltradas();

    tarefasFiltradas.forEach((tarefa) => {
      const li = document.createElement('li');

      if (tarefa.completa) {
        li.classList.add('completed');
      }

      const texto = document.createElement('span');

      texto.textContent = tarefa.texto;
      texto.className = 'texto-tarefa';
      texto.title =
        'Clique para marcar ou desmarcar como concluída';

      texto.addEventListener('click', () => {
        alternarStatusTarefa(tarefa.id);
      });

      const acoes = document.createElement('div');
      acoes.className = 'acoes-tarefa';

      const editBtn =
        document.createElement('button');

      editBtn.textContent = 'Editar';
      editBtn.className = 'edit-btn';
      editBtn.type = 'button';

      editBtn.setAttribute(
        'aria-label',
        `Editar tarefa: ${tarefa.texto}`
      );

      editBtn.addEventListener('click', () => {
        editarTarefa(tarefa.id);
      });

      const deleteBtn =
        document.createElement('button');

      deleteBtn.textContent = 'Excluir';
      deleteBtn.className = 'delete-btn';
      deleteBtn.type = 'button';

      deleteBtn.setAttribute(
        'aria-label',
        `Excluir tarefa: ${tarefa.texto}`
      );

      deleteBtn.addEventListener('click', () => {
        excluirTarefa(tarefa.id);
      });

      acoes.appendChild(editBtn);
      acoes.appendChild(deleteBtn);

      li.appendChild(texto);
      li.appendChild(acoes);

      listaTarefasEl.appendChild(li);
    });

    atualizarContador();
    atualizarMensagemVazia(tarefasFiltradas);
  }

  function adicionarTarefa() {
    const textoTarefa =
      tarefaInput.value.trim();

    if (!textoTarefa) {
      tarefaInput.focus();
      return;
    }

    const novaTarefa = {
      id: Date.now(),
      texto: textoTarefa,
      completa: false
    };

    tarefas.push(novaTarefa);

    tarefaInput.value = '';

    salvarTarefas();
    renderizarTarefas();

    tarefaInput.focus();
  }

  function alternarStatusTarefa(id) {
    tarefas = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        return {
          ...tarefa,
          completa: !tarefa.completa
        };
      }

      return tarefa;
    });

    salvarTarefas();
    renderizarTarefas();
  }

  function editarTarefa(id) {
    const tarefa = tarefas.find(
      (item) => item.id === id
    );

    if (!tarefa) {
      return;
    }

    const novoTexto = window.prompt(
      'Edite a tarefa:',
      tarefa.texto
    );

    if (novoTexto === null) {
      return;
    }

    const textoTratado = novoTexto.trim();

    if (!textoTratado) {
      return;
    }

    tarefa.texto = textoTratado;

    salvarTarefas();
    renderizarTarefas();
  }

  function excluirTarefa(id) {
    tarefas = tarefas.filter(
      (tarefa) => tarefa.id !== id
    );

    salvarTarefas();
    renderizarTarefas();
  }

  function limparConcluidas() {
    const possuiConcluidas = tarefas.some(
      (tarefa) => tarefa.completa
    );

    if (!possuiConcluidas) {
      return;
    }

    tarefas = tarefas.filter(
      (tarefa) => !tarefa.completa
    );

    salvarTarefas();
    renderizarTarefas();
  }

  botoesFiltro.forEach((botao) => {
    botao.addEventListener('click', () => {
      botoesFiltro.forEach((item) => {
        item.classList.remove('ativo');
      });

      botao.classList.add('ativo');

      filtroAtual = botao.dataset.filtro;

      renderizarTarefas();
    });
  });

  btnAdicionar.addEventListener(
    'click',
    adicionarTarefa
  );

  tarefaInput.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Enter') {
        adicionarTarefa();
      }
    }
  );

  btnLimparConcluidas.addEventListener(
    'click',
    limparConcluidas
  );

  renderizarTarefas();
});
