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
