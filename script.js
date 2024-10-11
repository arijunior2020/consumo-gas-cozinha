function calcularPrevisao() {
    const horasManha = parseFloat(document.getElementById("horasManha").value) || 0;
    const horasTarde = parseFloat(document.getElementById("horasTarde").value) || 0;
    const horasNoite = parseFloat(document.getElementById("horasNoite").value) || 0;
    const dataCompra = document.getElementById("dataCompra").value;

    if (!dataCompra) {
        alert("Por favor, selecione a data da última compra.");
        return;
    }

    const ultimaCompra = new Date(dataCompra);
    const taxaConsumoPorHora = 0.2; // kg/hora de uso
    const capacidadeBotijao = 13; // kg de um botijão de gás
    const diasNoMes = 30;

    const horasDiariasTotais = horasManha + horasTarde + horasNoite;
    const consumoDiario = horasDiariasTotais * taxaConsumoPorHora;
    const consumoMensal = (consumoDiario * diasNoMes) / capacidadeBotijao;
    const diasDuracao = capacidadeBotijao / consumoDiario;

    const previsaoFimGas = new Date(ultimaCompra);
    previsaoFimGas.setDate(previsaoFimGas.getDate() + Math.round(diasDuracao));

    document.getElementById("resultadoConsumo").innerText = `A família consome aproximadamente ${consumoMensal.toFixed(2)} botijões por mês.`;
    document.getElementById("previsaoCompra").innerText = `O gás deve acabar ou acabou em: ${previsaoFimGas.toLocaleDateString()}`;

    // Atualiza a barra de progresso
    atualizarBarraProgresso(ultimaCompra, diasDuracao);
}

function atualizarBarraProgresso(ultimaCompra, diasDuracao) {
    const hoje = new Date(); // Data atual
    const dataCompra = new Date(ultimaCompra); // Data da última compra

    // Calcula a diferença exata em milissegundos entre hoje e a data da última compra
    const diffTime = Math.abs(hoje - dataCompra); 
    const diasPassados = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Diferença em dias (arredondando para cima)

    // Garante que o valor de dias passados não ultrapasse a duração total
    const diasValidos = Math.min(diasPassados, diasDuracao); // Evita progresso acima de 100%

    // Cálculo do progresso: proporção de dias passados em relação aos dias totais de duração do gás
    let progresso = (diasValidos / diasDuracao) * 100;
    
    // Garante que se o gás estiver acabando hoje, o progresso será 100%
    if (diasValidos >= diasDuracao) {
        progresso = 100;
    }

    // Atualiza a barra de progresso
    const barraProgresso = document.getElementById("barraProgresso");
    barraProgresso.style.width = `${progresso}%`;
    barraProgresso.innerText = `${Math.round(progresso)}%`;

    // Atualiza a cor da barra de progresso com base nos thresholds
    if (progresso <= 80) {
        barraProgresso.classList.remove('bg-warning', 'bg-danger');
        barraProgresso.classList.add('bg-success'); // Verde até 80%
    } else if (progresso > 80 && progresso <= 90) {
        barraProgresso.classList.remove('bg-success', 'bg-danger');
        barraProgresso.classList.add('bg-warning'); // Amarela de 80% a 90%
    } else {
        barraProgresso.classList.remove('bg-success', 'bg-warning');
        barraProgresso.classList.add('bg-danger'); // Vermelha acima de 90%
    }

    // Verifica se o gás está prestes a acabar
    if (diasDuracao - diasValidos < 5) {
        document.getElementById("alerta").classList.remove("d-none");
    } else {
        document.getElementById("alerta").classList.add("d-none");
    }
}




