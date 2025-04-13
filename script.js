const APIKEY = "9c8778b9a7b9f840a2eb89aaf2bab6a5";
const TIMEZONE_APIKEY = "6N67GZOS8ZNQ"; // clé API TimezoneDB

let localTimeInterval;

// Fonction pour appeler l'API météo et mettre à jour les résultats
let apiCall = function(city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric&lang=fr`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Mise à jour des éléments HTML avec les données météo
            document.querySelector('#cityName').innerHTML = `<i class="fas fa-city"></i> ${data.name}`;
            document.querySelector('#temp').innerHTML = `<i class="fas fa-thermometer-half"></i> ${data.main.temp}°C`;
            document.querySelector('#humidity').innerHTML = `<i class="fas fa-tint"></i> ${data.main.humidity}%`;
            document.querySelector('#wind').innerHTML = `<i class="fas fa-wind"></i> ${data.wind.speed} km/h`;

            // Mise à jour de l'icône météo en fonction des conditions
            let weatherIcon = getWeatherIcon(data.weather[0].main);
            document.querySelector('#conditions').innerHTML = `<i class="${weatherIcon}"></i> ${data.weather[0].description}`;

            // Obtenir l'heure locale en fonction de la ville
            getLocalTime(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.log('Erreur lors de la récupération des données : ' + error.message));
};

// Fonction pour gérer la recherche
function handleSearch() {
    let ville = document.querySelector("#cityInput").value;
    if (ville) {
        apiCall(ville);
    } else {
        alert("Veuillez entrer un nom de ville !");
    }
}

// Ajout d'un écouteur d'événement sur le bouton de recherche
document.querySelector("#searchButton").addEventListener("click", handleSearch);

// Ajout d'un écouteur d'événement pour détecter la touche "Entrée"
document.querySelector("#cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

// Fonction pour obtenir l'heure locale en fonction des coordonnées
function getLocalTime(lat, lon) {
    let url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_APIKEY}&format=json&by=position&lat=${lat}&lng=${lon}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let timeZone = data.zoneName;
            let gmtOffset = data.gmtOffset;

            // Arrêter l'intervalle précédent si existant
            if (localTimeInterval) {
                clearInterval(localTimeInterval);
            }

            // Mettre à jour l'heure locale toutes les secondes
            localTimeInterval = setInterval(() => {
                let localTime = new Date((new Date()).getTime() + gmtOffset * 1000);
                let h = localTime.getUTCHours();
                let m = localTime.getUTCMinutes();
                let s = localTime.getUTCSeconds();
                m = checkTime(m);
                s = checkTime(s);
                document.getElementById('time').innerHTML = `Heure locale (${timeZone}): ${h}:${m}:${s}`;
            }, 1000);
        })
        .catch(error => console.log('Erreur lors de la récupération des données : ' + error.message));
}

// Fonction pour ajouter un zéro devant les nombres inférieurs à 10
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // ajoute des 0 si le chiffre < 10
    return i;
}

// Fonction pour obtenir l'icône météo en fonction des conditions
function getWeatherIcon(weatherCondition) {
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            return 'fas fa-sun';
        case 'clouds':
            return 'fas fa-cloud';
        case 'rain':
            return 'fas fa-cloud-rain';
        case 'snow':
            return 'fas fa-snowflake';
        case 'thunderstorm':
            return 'fas fa-bolt';
        case 'drizzle':
            return 'fas fa-cloud-showers-heavy';
        case 'mist':
            return 'fas fa-smog';
        default:
            return 'fas fa-cloud';
    }
}
