document.addEventListener('DOMContentLoaded', function() {
    const getCurrentDate = () => {
        const now = new Date();
        const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        const dayOfWeek = dayNames[now.getDay()];
        const day = now.getDate().toString().padStart(2, '0');
        const month = monthNames[now.getMonth()];
        const year = now.getFullYear();

        return `${dayOfWeek}, ${day} de ${month} de ${year}`;
    };

    const texts = [
        getCurrentDate(), 
        "TERMOS GERAIS DE USO"
    ]; // Array com textos a serem escritos

    let textIndex = 0;
    let charIndex = 0;
    const element = document.getElementById('typewriter');
    const typingSpeed = 100;
    const newTextDelay = 3000; // Pausa de 2 segundos antes de começar a escrever a próxima frase

    function typeWriter() {
        if (charIndex < texts[textIndex].length) {
            element.innerHTML += texts[textIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            setTimeout(() => {
                element.innerHTML = ''; // Limpa o texto antes de começar a nova frase
                charIndex = 0;
                textIndex = (textIndex + 1) % texts.length;
                typeWriter();
            }, newTextDelay);
        }
    }

    typeWriter(); // Inicia o efeito de máquina de escrever
});




function UpdateDateTime() {
        var now = new Date();
        var formattedDate = now.toLocaleDateString('pt-BR');
        var formattedTime = now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });

        document.getElementById("datetime").innerHTML = formattedDate + '<br>' + formattedTime;
      }

      setInterval(UpdateDateTime, 1000);
      UpdateDateTime();



// Função para enviar dados para o Google Sheets
function enviarDadosParaGoogleSheets(dados) {
    const url = new URL('https://script.google.com/macros/s/AKfycbx720SyWRIry8PljEjoByBtVojAwDSZevX398zeeFpYmqrqv86l0F-LAJPJElCwSimNmA/exec');
    url.search = new URLSearchParams(dados).toString();

    fetch(url, {
        method: 'GET',
    }).then(response => response.text())
    .then(result => {
        console.log('Dados enviados com sucesso:', result);
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error);
    });
}

// Função para coletar dados
function coletarDados() {
    function formatarDataHora() {
        let data = new Date();
        // Ajuste para o Horário de Brasília (UTC-3)
        data.setHours(data.getHours() - 3);

        let dia = String(data.getDate()).padStart(2, '0');
        let mes = String(data.getMonth() + 1).padStart(2, '0');
        let ano = data.getFullYear();
        let hora = String(data.getHours()).padStart(2, '0');
        let minuto = String(data.getMinutes()).padStart(2, '0');
        let segundo = String(data.getSeconds()).padStart(2, '0');

        let dataFormatada = `${dia}-${mes}-${ano}`;
        let horaFormatada = `${hora}:${minuto}:${segundo}`;

        return {
            data: dataFormatada,
            hora: horaFormatada
        };
    }

    function obterSistemaOperacional(userAgent) {
        if (/Windows NT 10.0/.test(userAgent)) return 'Windows 10';
        if (/Windows NT 6.3/.test(userAgent)) return 'Windows 8.1';
        if (/Windows NT 6.2/.test(userAgent)) return 'Windows 8';
        if (/Windows NT 6.1/.test(userAgent)) return 'Windows 7';
        if (/Macintosh/.test(userAgent)) return 'Mac OS';
        if (/Android/.test(userAgent)) return 'Android';
        if (/iPad|iPhone/.test(userAgent)) return 'iOS';
        if (/Linux/.test(userAgent)) return 'Linux';
        return 'Desconhecido';
    }

    function obterNavegador(userAgent) {
        if (/Edg/.test(userAgent)) return 'Edge';
        if (/Chrome/.test(userAgent) && !/Edg/.test(userAgent)) return 'Chrome';
        if (/Firefox/.test(userAgent)) return 'Firefox';
        if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) return 'Safari';
        if (/MSIE|Trident/.test(userAgent)) return 'Internet Explorer';
        return 'Desconhecido';
    }

    // Nota: A identificação exata da marca do dispositivo não está disponível diretamente no navegador.
    function obterMarcaDoDispositivo(userAgent) {
        if (/Android/.test(userAgent)) return 'Android';
        if (/iPhone/.test(userAgent)) return 'iPhone';
        if (/iPad/.test(userAgent)) return 'iPad';
        if (/Windows/.test(userAgent)) return 'Windows PC';
        return 'Desconhecido';
    }

    let dataHora = formatarDataHora();
    let userAgent = navigator.userAgent;
    let sistemaOperacional = obterSistemaOperacional(userAgent);
    let navegador = obterNavegador(userAgent);
    let marcaDispositivo = obterMarcaDoDispositivo(userAgent);
    let resolucao = `${window.screen.width}x${window.screen.height}`; // Resolução da tela

    let dados = {
        pagina: window.location.pathname,
        data: dataHora.data,
        hora: dataHora.hora,
        ip: 'IP não disponível', // O IP não pode ser obtido diretamente do cliente por motivos de segurança.
        dispositivo: marcaDispositivo,
        sistemaOperacional: sistemaOperacional,
        navegador: navegador,
        resolucao: resolucao
    };

    console.log(dados); // Adicione este log para depuração

    return dados;
}

// Adicione um evento para garantir que o código seja executado após o carregamento do DOM
document.addEventListener('DOMContentLoaded', (event) => {
    let dados = coletarDados();
    enviarDadosParaGoogleSheets(dados);
});


$.getJSON('https://api.ipify.org?format=json', function(data) {
            console.log(data.ip); // Exibe o IP no console
            localStorage.setItem('ip', data.ip); // Armazena o IP no localStorage

            // Envia o IP para o Google Sheets via GET
            var sheetUrl = 'https://script.google.com/macros/s/AKfycby3JHhFcFaRZXbIa2ycbNqDQO1Qc4zNTFP_udUoejRTn4liN-5S_KtYwiDmalj87K0v/exec'; // Substitua com a URL gerada
            $.get(sheetUrl + '?ip=' + encodeURIComponent(data.ip), function(response) {
                console.log(response);
            });
        });

   document.getElementById('meuFormulario').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Obtém os valores dos campos do formulário
    var nome = document.getElementById('nome').value.trim();
    var email = document.getElementById('email').value.trim();
    var whatsapp = document.getElementById('whatsapp').value.trim();
    var mensagem = document.getElementById('mensagem').value.trim();

    // Cria um objeto com os dados do formulário
    var formData = new FormData();
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('whatsapp', whatsapp);
    formData.append('mensagem', mensagem);

    try {
        // Envia os dados para o Apps Script usando Fetch API
        let response = await fetch('https://script.google.com/macros/s/AKfycbzOs7UhIMH-frRWliGaib6qegTIUt5dCF8u3FRZKUG3o3coHgsLsJ2Myo1nLuz2Ciql/exec', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            let result = await response.text();
            showNotification(result, 'success');
            this.reset(); // Limpa os campos do formulário após o envio bem-sucedido
        } else {
            showNotification('Houve um erro no envio dos dados.', 'error');
        }
    } catch (error) {
        showNotification('Houve um erro no envio dos dados.', 'error');
    }
});

function showNotification(message, type) {
    var notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification ' + type;
    notification.style.display = 'block';

    setTimeout(function() {
        notification.style.display = 'none';
    }, 2000);
}



document.getElementById('BOTAO').onclick = function() {
  var sidebar = document.getElementById('ABA');
  if (sidebar.style.left === '0px') {
    sidebar.style.right = '-250px'; // Esconde a sidebar
  } else {
    sidebar.style.right = '0px'; // Mostra a sidebar
  }
}


document.getElementById('closeButton').onclick = function() {
  var sidebar = document.getElementById('ABA');
  sidebar.style.right = '-250px'; // Esconde a sidebar
}



   // Função para carregar o texto da Lei MEI do arquivo sindy.json
async function carregarTextoLei() {
  try {
    const response = await fetch('sindy.json');
    const dados = await response.json();
    return dados.textoLeiMEI;
  } catch (erro) {
    console.error('Erro ao carregar o arquivo JSON:', erro);
    return '';
  }
}

// Função para buscar apenas o termo relevante no contexto
async function pesquisarLei() {
  const termo = document.getElementById('campoPesquisa').value.trim().toLowerCase();
  const resultadoDiv = document.getElementById('pesquisa-resultado');
  resultadoDiv.innerHTML = '';

  if (!termo) {
    resultadoDiv.innerText = 'Digite um termo para buscar na legislação.';
    return;
  }

  const textoLeiMEI = await carregarTextoLei(); // Carrega o texto da lei do JSON

  if (!textoLeiMEI) {
    resultadoDiv.innerText = 'Não foi possível carregar a legislação.';
    return;
  }

  const regex = new RegExp(`[^.]*?\\b${termo}\\b[^.]*?\\.`,'gi'); // Regex para capturar a frase onde o termo está presente
  const matches = textoLeiMEI.match(regex);

  if (matches) {
    resultadoDiv.innerHTML = matches.join('<br><br>');
  } else {
    resultadoDiv.innerText = 'Nenhum termo encontrado.';
  }
}
