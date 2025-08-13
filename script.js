
const map = L.map('map').setView([51.32, -0.14], 10); // Coulsdon area

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Prompt user for API key and order ID in a single input
const apiKey = prompt("Enter your Met Office API key:");
const orderId = "o224043244432"
const fileId = "total_precipitation_rate_ts0_+00"
const baseUrl = `https://data.hub.api.metoffice.gov.uk/map-images/1.0.0/${orderId}/latest/${fileId}`;

const getRadarUrls = async () => {
  const urls = [];
  const response = await fetch(`${baseUrl}`, {
    headers: {
      'apikey': apiKey
    }
  });

  if (response.ok) {
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    urls.push(imageUrl);
  } else {
    console.error(`Failed to fetch radar image`);
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
