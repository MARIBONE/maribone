
$(document).ready(function() {
        // Configuração do mapa
        var map = L.map('map').setView([-23.5505, -46.6333], 2); // Ajuste a localização inicial e o nível de zoom

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        // Adicionar pinos com base nas coordenadas fornecidas na tabela
        var coordinates = [
            { lat: -23.5505, lng: -46.6333 }
            // Adicione mais coordenadas conforme necessário
        ];

        coordinates.forEach(function(coord) {
            L.marker([coord.lat, coord.lng]).addTo(map)
                .bindPopup('Localização: ' + coord.lat + ', ' + coord.lng)
                .openPopup();
        });























        // Função para atualizar o relógio
        function updateTime() {
            var now = new Date();
            var formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            $('#datetime').text(formattedTime);
        }
        setInterval(updateTime, 1000);
        updateTime(); // Atualiza imediatamente na carga da página

        // Função para atualizar o velocímetro
        function updateSpeedometer() {
            var speedometerValue = Math.floor(Math.random() * 101); // Exemplo de valor aleatório
            $('.speedometer').css('background', 'conic-gradient(#4caf50 0% ' + speedometerValue + '%, #dcdcdc ' + speedometerValue + '% 100%)');
        }
        updateSpeedometer(); // Atualiza na carga da página
    });












 function fetchData() {
    fetch('https://script.google.com/macros/s/AKfycbwImFxSlckTM7-lgIVninep7aRWhedB-P1d2fyNvX2d7GDEJdtlP7pzgEy8a2DTBfso/exec')
        .then(response => response.json())
        .then(data => {
            populateDataTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function populateDataTable(data) {
    let table = '<tr>';
    // Adicionar o cabeçalho
    for (let i = 0; i < data[0].length; i++) {
        table += `<th>${data[0][i]}</th>`;
    }
    table += '</tr>';

    // Inverter a ordem dos dados e remover o cabeçalho da primeira linha (índice 0)
    let reversedData = data.slice(1).reverse(); // Remove o cabeçalho e inverte os dados

    // Adicionar as linhas de dados
    for (let i = 0; i < reversedData.length; i++) {
        table += '<tr>';
        for (let j = 0; j < reversedData[i].length; j++) {
            table += `<td>${reversedData[i][j]}</td>`;
        }
        table += '</tr>';
    }

    document.getElementById('data-table').innerHTML = table;
}

document.addEventListener('DOMContentLoaded', function() {
    fetchData();
});









