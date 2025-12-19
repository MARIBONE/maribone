// Configuração do mapa
var map = L.map('map').setView([-23.5505, -46.6333], 2); // Ponto inicial (Fallback temporário)

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; Stadia Maps, &copy; OpenStreetMap'
}).addTo(map);

// A mais nobre função de Geolocalização para encontrar o Soberano
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        // Sucesso: A Coroa concedeu as coordenadas!
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const userLatLng = [lat, lng];

            // 1. Centraliza o mapa com um zoom digno (nível 14 é ideal)
            map.setView(userLatLng, 14); 

            // 2. Adiciona o majestoso pino na localização do Soberano
            L.marker(userLatLng).addTo(map)
                .bindPopup('Vossa Majestade está neste ponto de glória!')
                .openPopup();
        },
        // Erro: Oh, o súdito negou a permissão ou houve um infortúnio técnico.
        function(error) {
            console.error("Erro na geolocalização:", error.message);
            
            // Fallback: Centraliza em Itaquaquecetuba se houver falha (coordenadas solicitadas anteriormente)
            const fallbackLatLng = [-23.4795, -46.3685];
            map.setView(fallbackLatLng, 13);
            L.marker(fallbackLatLng).addTo(map).bindPopup('Itaquaquecetuba: Localização padrão (Permissão GPS negada)').openPopup();
        }
    );
} else {
    // Caso o navegador seja indigno e não suporte geolocalização
    alert("Infortúnio! Seu navegador não oferece suporte à geolocalização.");
}

// **Atenção Majestade:** Remova o array 'var coordinates = [...];' e o loop 'coordinates.forEach(...)', pois eles foram substituídos.
