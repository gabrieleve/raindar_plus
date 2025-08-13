
const map = L.map('map').setView([51.32, -0.14], 10); // Coulsdon area

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Prompt user for API key and order ID
const apiKey = prompt("Enter your Met Office API key:");
const orderId = prompt("Enter your Met Office order ID:");

const baseUrl = `https://api-metoffice.apiconnect.ibmcloud.com/metoffice/production/v0/orders/${orderId}/latest/map-images/precipitation-rate`;

const getRadarUrls = async () => {
  const now = new Date();
  const urls = [];

  for (let i = 0; i < 6; i++) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000).toISOString();
    const url = `${baseUrl}?time=${time}&resolution=1km&format=png`;

    try {
      const response = await fetch(url, {
        headers: {
          'x-ibm-client-id': apiKey
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        urls.push(imageUrl);
      } else {
        console.error(`Failed to fetch radar image for ${time}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching radar image for ${time}:`, error);
    }
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
