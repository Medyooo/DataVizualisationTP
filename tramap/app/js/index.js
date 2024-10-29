const map = L.map('map').setView([47.218371, -1.553621
], 13) // Coordonnées pour Nantes

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

const apiUrl = 'https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_tan-arrets-horaires-circuits'
let stops = [] // Stockage des arrêts pour filtrage

// Fonction pour récupérer les arrêts via l'API
async function fetchStops () {
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(response)
    stops = data.records
    displayStops(stops)
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error)
  }
}

// Affichage des arrêts sur la carte
function displayStops (data) {
  data.forEach(stop => {
    const coords = stop.fields.geo_point_2d
    const name = stop.fields.nom
    const line = stop.fields.lignes
    const color = line === '1' ? 'blue' : line === '2' ? 'red' : 'gray'

    // Création d'un marqueur coloré pour chaque arrêt
    const marker = L.circleMarker([coords[0], coords[1]], {
      colors: color,
      radius: 8
    }).addTo(map)

    // Popup d'information
    marker.bindPopup(`
      <strong>${name}</strong><br>
      Ligne : ${line || 'Non spécifié'}
    `)
  })
}

// Filtrer les arrêts selon la ligne sélectionnée
document.getElementById('lineFilter').addEventListener('change', function () {
  const selectedLine = this.value

  // Supprimer les anciens marqueurs
  map.eachLayer(layer => {
    if (layer instanceof L.CircleMarker) {
      map.removeLayer(layer)
    }
  })

  // Afficher les arrêts filtrés par ligne
  const filteredStops = selectedLine ? stops.filter(stop => stop.fields.lignes === selectedLine) : stops
  displayStops(filteredStops)
})

// Appel de la fonction pour charger et afficher les arrêts
fetchStops()

