/* ===========================================
   Sistema de Escola Conectada - MED Angola
   Professor Specific JavaScript
   =========================================== */

/**
 * Controlador da Mini-Pauta
 */
const MiniPautaController = {
  alunosData: [],
  notasData: {},
  
  /**
   * Inicializar Mini-Pauta
   */
  init: function() {
    this.bindEvents();
  },
  
  /**
   * Vincular eventos
   */
  bindEvents: function() {
    const self = this;
    
    // Turma change
    const turmaSelect = document.getElementById('selectTurma');
    if (turmaSelect) {
      turmaSelect.addEventListener('change', function() {
        self.carregarAlunos(this.value);
      });
    }
    
    // Form submission
    const form = document.getElementById('formMiniPauta');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        self.guardarNotas();
      });
    }
    
    // Print button
    const printBtn = document.getElementById('btnImprimir');
    if (printBtn) {
      printBtn.addEventListener('click', function() {
        window.print();
      });
    }
    
    // Calcular médias on input change
    document.addEventListener('input', function(e) {
      if (e.target.classList.contains('nota-input')) {
        self.calcularMediasLinha(e.target);
      }
    });
  },
  
  /**
   * Carregar alunos da turma
   */
  carregarAlunos: function(turmaKey) {
    const tbody = document.getElementById('miniPautaBody');
    if (!tbody) return;
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    if (!turmaKey) {
      tbody.innerHTML = '<tr><td colspan="18" class="text-center text-muted py-4">Selecione uma turma para carregar os alunos</td></tr>';
      return;
    }
    
    // Obter alunos da turma (dados fictícios)
    const DadosFicticios = { alunos: { 'turma1': [{ numero: 1, nome: 'João', sexo: 'M' }, { numero: 2, nome: 'Maria', sexo: 'F' }] } };
    const alunos = DadosFicticios.alunos[turmaKey] || [];
    
    if (alunos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="18" class="text-center text-muted py-4">Nenhum aluno encontrado nesta turma</td></tr>';
      return;
    }
    
    this.alunosData = alunos;
    
    // Gerar linhas
    alunos.forEach(function(aluno, index) {
      const row = MiniPautaController.gerarLinhaAluno(aluno, index);
      tbody.appendChild(row);
    });
    
    // Atualizar info
    const infoText = document.querySelector('.mini-pauta-info');
    if (infoText) {
      infoText.textContent = `Total de alunos: ${alunos.length}`;
    }
  },
  
  /**
   * Gerar linha de aluno na tabela
   */
  gerarLinhaAluno: function(aluno, index) {
    const tr = document.createElement('tr');
    tr.dataset.alunoId = aluno.numero;
    
    // Colunas fixas
    tr.innerHTML = `
      <td class="col-fixed col-numero">${aluno.numero}</td>
      <td class="col-fixed col-nome">${aluno.nome}</td>
      <td class="col-fixed col-sexo">${aluno.sexo}</td>
      
      <!-- I Trimestre -->
      <td class="col-nota"><input type="number" class="nota-input" data-tipo="mac1" min="0" max="20" placeholder="-"></td>
      <td class="col-nota"><input type="number" class="nota-input" data-tipo="npp1" min="0" max="20" placeholder="-"></td>
      <td class="col-nota"><input type="number" class="nota-input" data-tipo="npt1" min="0" max="20" placeholder="-"></td>
      <td class="col-media"><span class="computed-value mt1">-</span></td>
      
      <!-- II Trimestre -->
      <td class="col-nota"><input type="number" class="nota-input" data-tipo="mac2" min="0" max="20" placeholder="-"></td>
      <td class="col-nota"><input type="number" class="nota-input" data-tipo="npp2" min="0" max="20" placeholder="-"></td>
      <td class="col-nota"><input type="number" class="nota-input" data-tipo="npt2" min="0" max="20" placeholder="-"></td>
      <td class="col-media"><span class="computed-value mt2">-</span></td>
      
      <!-- III Trimestre -->
      <td class="col-nota"><input type="number" class="nota-input" data-tipo="mac3" min="0" max="20" placeholder="-"></td>
      <td class="col-nota"><input type="number" class="nota-input" data-tipo="npp3" min="0" max="20" placeholder="-"></td>
      <td class="col-nota"><input type="number" class="nota-input" data-tipo="npt3" min="0" max="20" placeholder="-"></td>
      <td class="col-media"><span class="computed-value mt3">-</span></td>
      
      <!-- Média Final -->
      <td class="col-mf"><span class="computed-value mf">-</span></td>
    `;
    
    return tr;
  },
  
  /**
   * Calcular médias de uma linha
   */
  calcularMediasLinha: function(inputElement) {
    const row = inputElement.closest('tr');
    if (!row) return;
    
    // Obter todas as notas da linha
    const getValue = function(tipo) {
      const input = row.querySelector(`input[data-tipo="${tipo}"]`);
      return input && input.value !== '' ? parseInt(input.value) : null;
    };
    
    // I Trimestre
    const mac1 = getValue('mac1');
    const npp1 = getValue('npp1');
    const npt1 = getValue('npt1');
    const mt1 = this.calcularMediaTrimestral(mac1, npp1, npt1);
    this.atualizarMedia(row, 'mt1', mt1);
    
    // II Trimestre
    const mac2 = getValue('mac2');
    const npp2 = getValue('npp2');
    const npt2 = getValue('npt2');
    const mt2 = this.calcularMediaTrimestral(mac2, npp2, npt2);
    this.atualizarMedia(row, 'mt2', mt2);
    
    // III Trimestre
    const mac3 = getValue('mac3');
    const npp3 = getValue('npp3');
    const npt3 = getValue('npt3');
    const mt3 = this.calcularMediaTrimestral(mac3, npp3, npt3);
    this.atualizarMedia(row, 'mt3', mt3);
    
    // Média Final
    const mf = this.calcularMediaFinal(mt1, mt2, mt3);
    this.atualizarMedia(row, 'mf', mf);
  },
  
  /**
   * Atualizar display da média
   */
  atualizarMedia: function(row, classe, valor) {
    const span = row.querySelector(`.${classe}`);
    if (!span) return;
    
    if (valor === null) {
      span.textContent = '-';
      span.className = 'computed-value ' + classe;
    } else {
      span.textContent = valor;
      span.className = 'computed-value ' + classe + ' ' + this.getCorNota(valor);
    }
  },
  
  /**
   * Guardar notas (simulação)
   */
  guardarNotas: function() {
    const disciplina = document.getElementById('selectDisciplina')?.value;
    const turma = document.getElementById('selectTurma')?.value;
    
    if (!disciplina || !turma) {
      this.mostrarNotificacao('Por favor, selecione a disciplina e turma.', 'warning');
      return;
    }
    
    // Coletar dados
    const rows = document.querySelectorAll('#miniPautaBody tr');
    const notasCollection = [];
    
    rows.forEach(function(row) {
      if (!row.dataset.alunoId) return;
      
      const notas = {};
      row.querySelectorAll('input.nota-input').forEach(function(input) {
        notas[input.dataset.tipo] = input.value !== '' ? parseInt(input.value) : null;
      });
      
      notasCollection.push({
        alunoId: row.dataset.alunoId,
        notas: notas
      });
    });
    
    // Simular save
    console.log('Notas a guardar:', notasCollection);
    this.mostrarNotificacao('Mini-pauta guardada com sucesso!', 'success');
  },
  
  /**
   * Validar todas as notas
   */
  validarNotas: function() {
    let valido = true;
    const inputs = document.querySelectorAll('.nota-input');
    
    inputs.forEach(function(input) {
      if (input.value !== '' && !this.validarNota(input.value)) {
        input.classList.add('is-invalid');
        valido = false;
      } else {
        input.classList.remove('is-invalid');
      }
    }.bind(this));
    
    return valido;
  },
  
  calcularMediaTrimestral: function(mac, npp, npt) {
    const validValues = [mac, npp, npt].filter(value => value !== null);
    return validValues.length > 0 ? Math.round(validValues.reduce((sum, value) => sum + value, 0) / validValues.length) : null;
  },
  
  calcularMediaFinal: function(mt1, mt2, mt3) {
    const validValues = [mt1, mt2, mt3].filter(value => value !== null);
    return validValues.length > 0 ? Math.round(validValues.reduce((sum, value) => sum + value, 0) / validValues.length) : null;
  },
  
  getCorNota: function(valor) {
    return valor >= 16 ? 'bg-success' : valor >= 10 ? 'bg-warning' : 'bg-danger';
  },
  
  mostrarNotificacao: function(mensagem, tipo) {
    alert(`${tipo.toUpperCase()}: ${mensagem}`);
  }
};

/**
 * Controlador de Faltas
 */
const FaltasController = {
  init: function() {
    this.bindEvents();
  },
  
  bindEvents: function() {
    const self = this;
    
    // Turma change
    const turmaSelect = document.getElementById('selectTurmaFaltas');
    if (turmaSelect) {
      turmaSelect.addEventListener('change', function() {
        self.carregarAlunosFaltas(this.value);
      });
    }
    
    // Date range
    const mesSelect = document.getElementById('selectMes');
    if (mesSelect) {
      mesSelect.addEventListener('change', function() {
        self.atualizarDatas();
      });
    }
    
    // Save button
    const saveBtn = document.getElementById('btnGuardarFaltas');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        self.guardarFaltas();
      });
    }
  },
  
  carregarAlunosFaltas: function(turmaKey) {
    const tbody = document.getElementById('faltasBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!turmaKey) {
      tbody.innerHTML = '<tr><td colspan="12" class="text-center text-muted py-4">Selecione uma turma</td></tr>';
      return;
    }
    
    const DadosFicticios = { alunos: { 'turma1': [{ numero: 1, nome: 'João', sexo: 'M' }, { numero: 2, nome: 'Maria', sexo: 'F' }] } };
    const alunos = DadosFicticios.alunos[turmaKey] || [];
    
    alunos.forEach(function(aluno) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${aluno.numero}</td>
        <td class="text-start">${aluno.nome}</td>
        <td><input type="checkbox" class="faltas-checkbox" data-dia="1"></td>
        <td><input type="checkbox" class="faltas-checkbox" data-dia="2"></td>
        <td><input type="checkbox" class="faltas-checkbox" data-dia="3"></td>
        <td><input type="checkbox" class="faltas-checkbox" data-dia="4"></td>
        <td><input type="checkbox" class="faltas-checkbox" data-dia="5"></td>
        <td><input type="checkbox" class="faltas-checkbox" data-dia="6"></td>
        <td><input type="checkbox" class="faltas-checkbox" data-dia="7"></td>
        <td><input type="checkbox" class="faltas-checkbox" data-dia="8"></td>
        <td><span class="badge badge-danger total-faltas">0</span></td>
      `;
      
      // Add event listeners for checkboxes
      tr.querySelectorAll('.faltas-checkbox').forEach(function(cb) {
        cb.addEventListener('change', function() {
          FaltasController.atualizarTotalFaltas(tr);
        });
      });
      
      tbody.appendChild(tr);
    });
  },
  
  atualizarTotalFaltas: function(row) {
    const total = row.querySelectorAll('.faltas-checkbox:checked').length;
    const badge = row.querySelector('.total-faltas');
    if (badge) {
      badge.textContent = total;
      badge.className = 'badge ' + (total > 0 ? 'badge-danger' : 'badge-success');
    }
  },
  
  atualizarDatas: function() {
    // Update date headers based on selected month
  },
  
  guardarFaltas: function() {
    alert('Faltas registadas com sucesso!');
  }
};

/**
 * Inicializar quando DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', function() {
  MiniPautaController.init();
  FaltasController.init();
});

// Exportar para uso global
window.MiniPautaController = MiniPautaController;
window.FaltasController = FaltasController;
