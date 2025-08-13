const map = L.map('map').setView([51.32, -0.14], 10); // Coulsdon area

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Prompt user for API key
const apiKey = prompt("Please enter your Met Office API key:");
const baseUrl = 'https://api-metoffice.apiconnect.ibmcloud.com/metoffice/production/v0/map-images/precipitation-rate';

const getRadarUrls = async () => {
  const now = new Date();
  const urls = [];

  for (let i = 0; i < 6; i++) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000).toISOString();
    const url = `${baseUrl}?time=${time}&resolution=1km&format=png`;
    urls.push(url);
  }

  return urls;
};

const displayRadar = async () => {
  const urls = await getRadarUrls();

  urls.forEach((url, index) => {
    const overlay = L.imageOverlay(url, [[49.5, -8.5], [61, 2.1]], {
      opacity: 0.3 + index * 0.1
    }).addTo(map);
  });
};

displayRadar();
