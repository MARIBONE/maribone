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



    const textoLeiMEI = `
    A Lei Complementar nº 123, de 14 de dezembro de 2006, estabelece os critérios para microempreendedores individuais no Brasil.
    Segundo a legislação, para ser considerado MEI, o faturamento anual deve ser de até R$ 81.000,00.
    O número de empregados não pode ultrapassar 1.
    O MEI deve estar formalizado conforme as exigências previstas pela Receita Federal, emitindo notas fiscais e contribuindo para o INSS.
    O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei Complementar:

Art. 18-A. O Microempreendedor Individual - MEI poderá optar pelo recolhimento dos impostos e contribuições abrangidos pelo Simples Nacional em valores fixos mensais, independentemente da receita bruta por ele auferida no mês, na forma prevista neste artigo.

§ 1º Para os efeitos desta Lei Complementar, considera-se MEI quem tenha auferido receita bruta, no ano-calendário anterior, de até R$ 81.000,00 (oitenta e um mil reais), que seja optante pelo Simples Nacional e que não esteja impedido de optar pela sistemática prevista neste artigo, e seja empresário individual que se enquadre na definição do art. 966 da Lei nº 10.406, de 10 de janeiro de 2002 (Código Civil), ou o empreendedor que exerça:  (Redação dada pela Lei Complementar 188/2021)  
Redações Anteriores

I - as atividades de que trata o § 4º-A deste artigo;  (Acrescentado pela Lei Complementar 188/2021) 

II - as atividades de que trata o § 4º-B deste artigo estabelecidas pelo CGSN; e  (Acrescentado pela Lei Complementar 188/2021) 

III - as atividades de industrialização, comercialização e prestação de serviços no âmbito rural.  (Acrescentado pela Lei Complementar 188/2021) 

 Redações Anteriores

§ 2º No caso de início de atividades, o limite de que trata o § 1º será de R$ 6.750,00 (seis mil, setecentos e cinquenta reais) multiplicados pelo número de meses compreendido entre o início da atividade e o final do respectivo ano-calendário, consideradas as frações de meses como um mês inteiro. (Redação dada pela Lei Complementar 155/2016)

Redações Anteriores

§ 3º Na vigência da opção pela sistemática de recolhimento prevista no caput deste artigo:

I - não se aplica o disposto no § 18 do art. 18 desta Lei Complementar;

II - não se aplica a redução prevista no § 20 do art. 18 desta Lei Complementar ou qualquer
APRESENTAÇÃO JUSBRASIL
LEI DO MEI
  Voltar
+ | -
   
Ato: Lei Complementar 123/2006 
LEI COMPLEMENTAR Nº 123, DE 14 DE DEZEMBRO DE 2006 (*)

(Republicação em atendimento ao disposto no art. 5º da Lei Complementar nº 139, de 10 de novembro de 2011)

 

Institui o Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte; altera dispositivos das Leis nº 8.212 e 8.213, ambas de 24 de julho de 1991, da Consolidação das Leis do Trabalho - CLT, aprovada pelo Decreto-Lei nº 5.452, de 1º de maio de 1943, da Lei nº 10.189, de 14 de fevereiro de 2001, da Lei Complementar no 63, de 11 de janeiro de 1990; e revoga as Leis nº 9.317, de 5 de dezembro de 1996, e 9.841, de 5 de outubro de 1999. 
Histórico do Ato

O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei Complementar:

Art. 18-A. O Microempreendedor Individual - MEI poderá optar pelo recolhimento dos impostos e contribuições abrangidos pelo Simples Nacional em valores fixos mensais, independentemente da receita bruta por ele auferida no mês, na forma prevista neste artigo.

§ 1º Para os efeitos desta Lei Complementar, considera-se MEI quem tenha auferido receita bruta, no ano-calendário anterior, de até R$ 81.000,00 (oitenta e um mil reais), que seja optante pelo Simples Nacional e que não esteja impedido de optar pela sistemática prevista neste artigo, e seja empresário individual que se enquadre na definição do art. 966 da Lei nº 10.406, de 10 de janeiro de 2002 (Código Civil), ou o empreendedor que exerça:  (Redação dada pela Lei Complementar 188/2021)  
Redações Anteriores

I - as atividades de que trata o § 4º-A deste artigo;  (Acrescentado pela Lei Complementar 188/2021) 

II - as atividades de que trata o § 4º-B deste artigo estabelecidas pelo CGSN; e  (Acrescentado pela Lei Complementar 188/2021) 

III - as atividades de industrialização, comercialização e prestação de serviços no âmbito rural.  (Acrescentado pela Lei Complementar 188/2021) 

 Redações Anteriores

§ 2º No caso de início de atividades, o limite de que trata o § 1º será de R$ 6.750,00 (seis mil, setecentos e cinquenta reais) multiplicados pelo número de meses compreendido entre o início da atividade e o final do respectivo ano-calendário, consideradas as frações de meses como um mês inteiro. (Redação dada pela Lei Complementar 155/2016)

Redações Anteriores

§ 3º Na vigência da opção pela sistemática de recolhimento prevista no caput deste artigo:

I - não se aplica o disposto no § 18 do art. 18 desta Lei Complementar;

II - não se aplica a redução prevista no § 20 do art. 18 desta Lei Complementar ou qualquer dedução na base de cálculo;

III - não se aplicam as isenções específicas para as microempresas e empresas de pequeno porte concedidas pelo Estado, Município ou Distrito Federal a partir de 1º de julho de 2007 que abranjam integralmente a faixa de receita bruta anual até o limite previsto no § 1º;

IV - a opção pelo enquadramento como Microempreendedor Individual importa opção pelo recolhimento da contribuição referida no inciso X do § 1º do art. 13 desta Lei Complementar na forma prevista no § 2º do art. 21 da Lei nº 8.212, de 24 de julho de 1991;

V - o MEI, com receita bruta anual igual ou inferior a R$ 81.000,00 (oitenta e um mil reais), recolherá, na forma regulamentada pelo Comitê Gestor, valor fixo mensal correspondente à soma das seguintes parcelas: (Redação dada pela Lei Complementar 155/2016)

Redações Anteriores

a) R$ 45,65 (quarenta e cinco reais e sessenta e cinco centavos), a título da contribuição prevista no inciso IV deste parágrafo;

b) R$ 1,00 (um real), a título do imposto referido no inciso VII do caput do art. 13 desta Lei Complementar, caso seja contribuinte do ICMS; e

c) R$ 5,00 (cinco reais), a título do imposto referido no inciso VIII do caput do art. 13 desta Lei Complementar, caso seja contribuinte do ISS;

VI - sem prejuízo do disposto nos §§ 1º a 3º do art. 13, o MEI terá isenção dos tributos referidos nos incisos I a VI do caput daquele artigo, ressalvado o disposto no art. 18-C.

§ 4º Não poderá optar pela sistemática de recolhimento prevista no caput deste artigo o MEI:

I - cuja atividade seja tributada na forma dos Anexos V ou VI desta Lei Complementar, salvo autorização relativa a exercício de atividade isolada na forma regulamentada pelo CGSN; (Redação dada pela Lei Complementar 147/2014)

 Redações Anteriores

II - que possua mais de um estabelecimento;

III - que participe de outra empresa como titular, sócio ou administrador; ou

IV - (Revogado pela Lei Complementar 155/2016) 
Redações Anteriores

V - constituído na forma de startup.  (Acrescentado pela Lei Complementar 167/2019)

§ 4º-A. Observadas as demais condições deste artigo, poderá optar pela sistemática de recolhimento prevista no caput o empresário individual que exerça atividade de comercialização e processamento de produtos de natureza extrativista.

§ 4º-B. O CGSN determinará as atividades autorizadas a optar pela sistemática de recolhimento de que trata este artigo, de forma a evitar a fragilização das relações de trabalho, bem como sobre a incidência do ICMS e do ISS.

§ 5º A opção de que trata o caput deste artigo dar-se-á na forma a ser estabelecida em ato do Comitê Gestor, observando-se que:

I - será irretratável para todo o ano-calendário;

II - deverá ser realizada no início do ano-calendário, na forma disciplinada pelo Comitê Gestor, produzindo efeitos a partir do primeiro dia do ano-calendário da opção, ressalvado o disposto no inciso III;

III - produzirá efeitos a partir da data do início de atividade desde que exercida nos termos, prazo e condições a serem estabelecidos em ato do Comitê Gestor a que se refere o caput deste parágrafo.

§ 6º O desenquadramento da sistemática de que trata o caput deste artigo será realizado de ofício ou mediante comunicação do MEI.

§ 7º O desenquadramento mediante comunicação do MEI à Secretaria da Receita Federal do Brasil - RFB dar-se-á:

I - por opção, que deverá ser efetuada no início do anocalendário, na forma disciplinada pelo Comitê Gestor, produzindo efeitos a partir de 1º de janeiro do ano-calendário da comunicação;

II - obrigatoriamente, quando o MEI incorrer em alguma das situações previstas no § 4º deste artigo, devendo a comunicação ser efetuada até o último dia útil do mês subseqüente àquele em que ocorrida a situação de vedação, produzindo efeitos a partir do mês subseqüente ao da ocorrência da situação impeditiva;

III - obrigatoriamente, quando o MEI exceder, no ano-calendário, o limite de receita bruta previsto no § 1º deste artigo, devendo a comunicação ser efetuada até o último dia útil do mês subseqüente àquele em que ocorrido o excesso, produzindo efeitos:

a) a partir de 1º de janeiro do ano-calendário subseqüente ao da ocorrência do excesso, na hipótese de não ter ultrapassado o referido limite em mais de 20% (vinte por cento);

b) retroativamente a 1º de janeiro do ano-calendário da ocorrência do excesso, na hipótese de ter ultrapassado o referido limite em mais de 20% (vinte por cento);

IV - obrigatoriamente, quando o MEI exceder o limite de receita bruta previsto no § 2º deste artigo, devendo a comunicação ser efetuada até o último dia útil do mês subseqüente àquele em que ocorrido o excesso, produzindo efeitos:

a) a partir de 1º de janeiro do ano-calendário subseqüente ao da ocorrência do excesso, na hipótese de não ter ultrapassado o referido limite em mais de 20% (vinte por cento);

b) retroativamente ao início de atividade, na hipótese de ter ultrapassado o referido limite em mais de 20% (vinte por cento).

§ 8º O desenquadramento de ofício dar-se-á quando verificada a falta de comunicação de que trata o § 7º deste artigo.

§ 9º O Empresário Individual desenquadrado da sistemática de recolhimento prevista no caput deste artigo passará a recolher os tributos devidos pela regra geral do Simples Nacional a partir da data de início dos efeitos do desenquadramento, ressalvado o disposto no § 10 deste artigo.

§ 10. Nas hipóteses previstas nas alíneas a dos incisos III e IV do § 7º deste artigo, o MEI deverá recolher a diferença, sem acréscimos, em parcela única, juntamente com a da apuração do mês de janeiro do ano-calendário subseqüente ao do excesso, na forma a ser estabelecida em ato do Comitê Gestor.

§ 11. O valor referido na alínea a do inciso V do § 3º deste artigo será reajustado, na forma prevista em lei ordinária, na mesma data de reajustamento dos benefícios de que trata a Lei nº 8.213, de 24 de julho de 1991, de forma a manter equivalência com a contribuição de que trata o § 2º do art. 21 da Lei nº 8.212, de 24 de julho de 1991.

§ 12. Aplica-se ao MEI que tenha optado pela contribuição na forma do § 1º deste artigo o disposto no § 4º do art. 55 e no § 2º do art. 94, ambos da Lei nº 8.213, de 24 de julho de 1991, exceto se optar pela complementação da contribuição previdenciária a que se refere o § 3º do art. 21 da Lei nº 8.212, de 24 de julho de 1991.

§ 13. O MEI está dispensado, ressalvado o disposto no art. 18-C desta Lei Complementar, de:

I - atender o disposto no inciso IV do caput do art. 32 da Lei nº 8.212, de 24 de julho de 1991;

II - apresentar a Relação Anual de Informações Sociais (Rais); e

III - declarar ausência de fato gerador para a Caixa Econômica Federal para emissão da Certidão de Regularidade Fiscal perante o FGTS.

§ 14. O Comitê Gestor disciplinará o disposto neste artigo.

§ 15. A inadimplência do recolhimento do valor previsto na alínea "a" do inciso V do § 3º tem como consequência a não contagem da competência em atraso para fins de carência para obtenção dos benefícios previdenciários respectivos.

§ 15-A. Ficam autorizados os Estados, o Distrito Federal e os Municípios a promover a remissão dos débitos decorrentes dos valores previstos nas alíneas b e c do inciso V do § 3º, inadimplidos isolada ou simultaneamente. (Acrescentado pela Lei Complementar 147/2014)

§ 15-B. O MEI poderá ter sua inscrição automaticamente cancelada após período de 12 (doze) meses consecutivos sem recolhimento ou declarações, independentemente de qualquer notificação, devendo a informação ser publicada no Portal do Empreendedor, na forma regulamentada pelo CGSIM. (Acrescentado pela Lei Complementar 147/2014)

§ 16. O CGSN estabelecerá, para o MEI, critérios, procedimentos, prazos e efeitos diferenciados para desenquadramento da sistemática de que trata este artigo, cobrança, inscrição em dívida ativa e exclusão do Simples Nacional.

§ 16-A. A baixa do MEI via portal eletrônico dispensa a comunicação aos órgãos da administração pública. (Acrescentado pela Lei Complementar 155/2016)

§ 17. A alteração de dados no CNPJ informada pelo empresário à Secretaria da Receita Federal do Brasil equivalerá à comunicação obrigatória de desenquadramento da sistemática de recolhimento de que trata este artigo, nas seguintes hipóteses:

I - alteração para natureza jurídica distinta de empresário individual a que se refere o art. 966 da Lei nº 10.406, de 10 de janeiro de 2002 (Código Civil);

II - inclusão de atividade econômica não autorizada pelo CGSN;

III - abertura de filial.

§ 18. Os Municípios somente poderão realizar o cancelamento da inscrição do MEI caso tenham regulamentação própria de classificação de risco e o respectivo processo simplificado de inscrição e legalização, em conformidade com esta Lei Complementar e com as resoluções do CGSIM. (Acrescentado pela Lei Complementar 147/2014)

§ 19. Fica vedada aos conselhos representativos de categorias econômicas a exigência de obrigações diversas das estipuladas nesta Lei Complementar para inscrição do MEI em seus quadros, sob pena de responsabilidade. (Acrescentado pela  Lei Complementar 147/2014)

§ 19-A O MEI inscrito no conselho profissional de sua categoria na qualidade de pessoa física é dispensado de realizar nova inscrição no mesmo conselho na qualidade de empresário individual. (Acrescentado pela Lei Complementar 155/2016)

§ 19-B. São vedadas aos conselhos profissionais, sob pena de responsabilidade, a exigência de inscrição e a execução de qualquer tipo de ação fiscalizadora quando a ocupação do MEI não exigir registro profissional da pessoa física. (Acrescentado pela Lei Complementar 155/2016)

§ 20. Os documentos fiscais das microempresas e empresas de pequeno porte poderão ser emitidos diretamente por sistema nacional informatizado e pela internet, sem custos para o empreendedor, na forma regulamentada pelo Comitê Gestor do Simples Nacional. (Acrescentado pela Lei Complementar 147/2014)

§ 21. Assegurar-se-á o registro nos cadastros oficiais ao guia de turismo inscrito como MEI. (Acrescentado pela Lei Complementar 147/2014)

§ 22. Fica vedado às concessionárias de serviço público o aumento das tarifas pagas pelo MEI por conta da modificação da sua condição de pessoa física para pessoa jurídica. (Acrescentado pela Lei Complementar 147/2014)

§ 23. (VETADO). (Acrescentado pela Lei Complementar 147/2014)

§ 24. Aplica-se ao MEI o disposto no inciso XI do § 4º do art. 3º. (Acrescentado pela Lei Complementar 147/2014)

§ 25. O MEI poderá utilizar sua residência como sede do estabelecimento, quando não for indispensável a existência de local próprio para o exercício da atividade. (Acrescentado pela Lei Complementar 154/2016)

Art. 18-B. A empresa contratante de serviços executados por intermédio do MEI mantém, em relação a esta contratação, a obrigatoriedade de recolhimento da contribuição a que se refere o inciso III do caput e o § 1º do art. 22 da Lei nº 8.212, de 24 de julho de 1991, e o cumprimento das obrigações acessórias relativas à contratação de contribuinte individual.

§ 1º Aplica-se o disposto neste artigo exclusivamente em relação ao MEI que for contratado para prestar serviços de hidráulica, eletricidade, pintura, alvenaria, carpintaria e de manutenção ou reparo de veículos. (Redação dada pela Lei Complementar 147/2014)

 Redações Anteriores

§ 2º O disposto no caput e no § 1º não se aplica quando presentes os elementos da relação de emprego, ficando a contratante sujeita a todas as obrigações dela decorrentes, inclusive trabalhistas, tributárias e previdenciárias.

Art. 18-C. Observado o disposto no caput e nos §§ 1º a 25 do art. 18-A desta Lei Complementar, poderá enquadrar-se como MEI o empresário individual ou o empreendedor que exerça as atividades de industrialização, comercialização e prestação de serviços no âmbito rural que possua um único empregado que receba exclusivamente um salário mínimo ou o piso salarial da categoria profissional. (Redação dada pela Lei Complementar 155/2016)

 Redações Anteriores

§ 1º Na hipótese referida no caput, o MEI:

I - deverá reter e recolher a contribuição previdenciária relativa ao segurado a seu serviço na forma da lei, observados prazo e condições estabelecidos pelo CGSN;

II - é obrigado a prestar informações relativas ao segurado a seu serviço, na forma estabelecida pelo CGSN; e

III - está sujeito ao recolhimento da contribuição de que trata o inciso VI do caput do art. 13, calculada à alíquota de 3% (três por cento) sobre o salário de contribuição previsto no caput, na forma e prazos estabelecidos pelo CGSN.

§ 2º Para os casos de afastamento legal do único empregado do MEI, será permitida a contratação de outro empregado, inclusive por prazo determinado, até que cessem as condições do afastamento, na forma estabelecida pelo Ministério do Trabalho e Emprego.

§ 3º O CGSN poderá determinar, com relação ao MEI, a forma, a periodicidade e o prazo:

I - de entrega à Secretaria da Receita Federal do Brasil de uma única declaração com dados relacionados a fatos geradores, base de cálculo e valores dos tributos previstos nos arts. 18-A e 18-C, da contribuição para a Seguridade Social descontada do empregado e do Fundo de Garantia do Tempo de Serviço (FGTS), e outras informações de interesse do Ministério do Trabalho e Emprego, do Instituto Nacional do Seguro Social (INSS) e do Conselho Curador do FGTS, observado o disposto no § 7º do art. 26;

II - do recolhimento dos tributos previstos nos arts. 18-A e 18-C, bem como do FGTS e da contribuição para a Seguridade Social descontada do empregado.

§ 4º A entrega da declaração única de que trata o inciso I do § 3º substituirá, na forma regulamentada pelo CGSN, a obrigatoriedade de entrega de todas as informações, formulários e declarações a que estão sujeitas as demais empresas ou equiparados que contratam empregados, inclusive as relativas ao recolhimento do FGTS, à Relação Anual de Informações Sociais (Rais) e ao Cadastro Geral de Empregados e Desempregados (Caged).

§ 5º Na hipótese de recolhimento do FGTS na forma do inciso II do § 3º, deve-se assegurar a transferência dos recursos e dos elementos identificadores do recolhimento ao gestor desse fundo para crédito na conta vinculada do trabalhador.

§ 6º O documento de que trata o inciso I do § 3º deste artigo tem caráter declaratório, constituindo instrumento hábil e suficiente para a exigência dos tributos e dos débitos fundiários que não tenham sido recolhidos resultantes das informações nele prestadas. (Acrescentado pela Lei Complementar 147/2014)

Art. 18-D. A tributação municipal do imposto sobre imóveis prediais urbanos deverá assegurar tratamento mais favorecido ao MEI para realização de sua atividade no mesmo local em que residir, mediante aplicação da menor alíquota vigente para aquela localidade, seja residencial ou comercial, nos termos da lei, sem prejuízo de eventual isenção ou imunidade existente. (Acrescentado pela Lei Complementar 147/2014)

Art. 18-E. O instituto do MEI é uma política pública que tem por objetivo a formalização de pequenos empreendimentos e a inclusão social e previdenciária. (Acrescentado pela Lei Complementar 147/2014)

§ 1º A formalização de MEI não tem caráter eminentemente econômico ou fiscal. (Acrescentado pela Lei Complementar 147/2014)

§ 2º Todo benefício previsto nesta Lei Complementar aplicável à microempresa estende-se ao MEI sempre que lhe for mais favorável. (Acrescentado pela Lei Complementar 147/2014)

§ 3º O MEI é modalidade de microempresa. (Acrescentado pela Lei Complementar 147/2014)

§ 4º É vedado impor restrições ao MEI relativamente ao exercício de profissão ou participação em licitações, em função da sua natureza jurídica, inclusive por ocasião da contratação dos serviços previstos no § 1º do art. 18-B desta Lei Complementar. (Redação dada pela Lei Complementar 155/2016)

 Redações Anteriores

§ 5º O empreendedor que exerça as atividades de industrialização, comercialização e prestação de serviços no âmbito rural que efetuar seu registro como MEI não perderá a condição de segurado especial da Previdência Social. (Acrescentado pela Lei Complementar 155/2016)

§ 6º O disposto no § 5º e o licenciamento simplificado de atividades para o empreendedor que exerça as atividades de industrialização, comercialização e prestação de serviços no âmbito rural serão regulamentados pelo CGSIM em até cento e oitenta dias. (Acrescentado pela Lei Complementar 155/2016)

§ 7º O empreendedor que exerça as atividades de industrialização, comercialização e prestação de serviços no âmbito rural manterá todas as suas obrigações relativas à condição de produtor rural ou de agricultor familiar. (Acrescentado pela Lei Complementar 155/2016)

`;

    // Função para buscar apenas o termo relevante no contexto
    function pesquisarLei() {
      const termo = document.getElementById('campoPesquisa').value.trim().toLowerCase();
      const resultadoDiv = document.getElementById('pesquisa-resultado');
      resultadoDiv.innerHTML = '';

      if (!termo) {
        resultadoDiv.innerText = 'Digite um termo para buscar na legislação.';
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