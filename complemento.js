document.addEventListener('DOMContentLoaded', function() {
    const getCurrentDate = () => {
        const now = new Date();
        const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        const dayOfWeek = dayNames[now.getDay()];
        const day = now.getDate().toString().padStart(2, '0');
        const month = monthNames[now.getMonth()];
        const year = now.getFullYear();

        return `${dayOfWeek}, ${day} de ${month} de ${year}`;
    };

    const texts = [
        getCurrentDate(), 
        "Tecnologia de Alto Nível",
        "Seu sistema com a raiz Maribone", 
        "Leve sua Marca mais Longe!"
    ]; // Array com textos a serem escritos

    let textIndex = 0;
    let charIndex = 0;
    const element = document.getElementById('typewriter');
    const typingSpeed = 100;
    const newTextDelay = 2000; // Pausa de 2 segundos antes de começar a escrever a próxima frase

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

    




document.getElementById('BOX').addEventListener('click', function() {
var card = document.getElementById('card');

card.classList.toggle('show');
});


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


    
 
const startButton = document.getElementById('startButton');
    const options = document.getElementById('options');
    const optionsNext = document.getElementById('options-next');
    const contactInfo = document.getElementById('contact-info');
    const confirmation = document.getElementById('confirmation');
    const radioButtons = document.querySelectorAll('input[name="option"]');
    const nextOptions = document.querySelectorAll('input[name="goal"]');

    // Quando o botão inicial é clicado
    startButton.addEventListener('click', () => {
      startButton.classList.add('hidden'); // Esconde o botão
      options.classList.remove('hidden'); // Mostra o primeiro card
    });

    // Quando uma opção do primeiro card é selecionada
    radioButtons.forEach(radio => {
      radio.addEventListener('change', () => {
        options.classList.add('hidden'); // Esconde o primeiro card
        optionsNext.classList.remove('hidden'); // Mostra o segundo card
      });
    });

    // Quando uma opção do segundo card é selecionada
    nextOptions.forEach(option => {
      option.addEventListener('change', () => {
        optionsNext.classList.add('hidden'); // Esconde o segundo card
        contactInfo.classList.remove('hidden'); // Mostra o terceiro card
      });
    });

    // Quando os dados são enviados
    document.getElementById('submit').addEventListener('click', () => {
      contactInfo.classList.add('hidden'); // Esconde o terceiro card
      confirmation.classList.remove('hidden'); // Mostra o quarto card
    });
