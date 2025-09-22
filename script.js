// Global variables
let currentLocation = null;
let weatherData = null;
let capturedImageData = null;

// Camera functionality
async function startCamera() {
    try {
        const video = document.getElementById('video');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        video.srcObject = stream;
        document.getElementById('captureBtn').disabled = false;
        showStatus('Camera started successfully!', 'success');
    } catch (error) {
        showStatus('Camera access denied or not available.', 'error');
        console.error('Camera error:', error);
    }
}

function captureImage() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const capturedImage = document.getElementById('capturedImage');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    capturedImageData = canvas.toDataURL('image/jpeg');
    capturedImage.src = capturedImageData;
    capturedImage.style.display = 'block';
    
    // Stop camera
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.style.display = 'none';
    
    showStatus('Image captured successfully!', 'success');
}

// Location functionality
function getLocation() {
    const locationBtn = document.getElementById('locationBtn');
    locationBtn.innerHTML = '<span class="loading"></span>Getting Location...';
    locationBtn.disabled = true;

    if (!navigator.geolocation) {
        showStatus('Geolocation is not supported by this browser.', 'error');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            currentLocation = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            
            document.getElementById('locationInfo').innerHTML = `
                <div class="info-card">
                    <h3>📍 Location Captured</h3>
                    <p><strong>Latitude:</strong> ${currentLocation.lat.toFixed(6)}</p>
                    <p><strong>Longitude:</strong> ${currentLocation.lon.toFixed(6)}</p>
                    <p><strong>Accuracy:</strong> ${position.coords.accuracy.toFixed(0)} meters</p>
                </div>
            `;
            
            locationBtn.innerHTML = '✅ Location Captured';
            showStatus('Location captured successfully!', 'success');
            
            // Automatically fetch weather data
            getWeatherData();
            
            // Activate step 2
            document.getElementById('step2').classList.add('active');
        },
        error => {
            locationBtn.innerHTML = '📍 Get Location';
            locationBtn.disabled = false;
            showStatus('Location access denied or failed.', 'error');
            console.error('Location error:', error);
        }
    );
}

// Weather functionality (simulated)
async function getWeatherData() {
    const weatherStatus = document.getElementById('weatherStatus');
    weatherStatus.innerHTML = '<div class="loading"></div>Fetching weather data...';

    // Simulate weather API call with realistic data
    setTimeout(() => {
        // Generate realistic weather data based on location
        weatherData = {
            temperature: Math.round(Math.random() * 15 + 20), // 20-35°C
            humidity: Math.round(Math.random() * 40 + 40), // 40-80%
            rainfall: Math.round(Math.random() * 200 + 50), // 50-250mm
            soilMoisture: Math.round(Math.random() * 30 + 30), // 30-60%
            windSpeed: Math.round(Math.random() * 10 + 5), // 5-15 km/h
            uvIndex: Math.round(Math.random() * 8 + 2) // 2-10
        };

        document.getElementById('weatherInfo').innerHTML = `
            <div class="info-card">
                <h3>🌤️ Weather & Environmental Data</h3>
                <div class="weather-info">
                    <div class="weather-item">
                        <div style="font-size: 1.5em;">🌡️</div>
                        <div><strong>${weatherData.temperature}°C</strong></div>
                        <div>Temperature</div>
                    </div>
                    <div class="weather-item">
                        <div style="font-size: 1.5em;">💧</div>
                        <div><strong>${weatherData.humidity}%</strong></div>
                        <div>Humidity</div>
                    </div>
                    <div class="weather-item">
                        <div style="font-size: 1.5em;">🌧️</div>
                        <div><strong>${weatherData.rainfall}mm</strong></div>
                        <div>Monthly Rainfall</div>
                    </div>
                    <div class="weather-item">
                        <div style="font-size: 1.5em;">🌱</div>
                        <div><strong>${weatherData.soilMoisture}%</strong></div>
                        <div>Soil Moisture</div>
                    </div>
                    <div class="weather-item">
                        <div style="font-size: 1.5em;">💨</div>
                        <div><strong>${weatherData.windSpeed} km/h</strong></div>
                        <div>Wind Speed</div>
                    </div>
                    <div class="weather-item">
                        <div style="font-size: 1.5em;">☀️</div>
                        <div><strong>${weatherData.uvIndex}</strong></div>
                        <div>UV Index</div>
                    </div>
                </div>
            </div>
        `;

        weatherStatus.innerHTML = '';
        showStatus('Weather data fetched successfully!', 'success');
        
        // Activate step 3
        document.getElementById('step3').classList.add('active');
        document.getElementById('predictBtn').disabled = false;
    }, 2000);
}

// Yield prediction
function predictYield() {
    const cropType = document.getElementById('cropType').value;
    const fertilizerAmount = parseFloat(document.getElementById('fertilizerAmount').value);
    const fieldSize = parseFloat(document.getElementById('fieldSize').value);

    if (!fertilizerAmount || !fieldSize) {
        showStatus('Please fill in all required fields.', 'error');
        return;
    }

    // Activate step 4
    document.getElementById('step4').classList.add('active');
    
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="loading"></div>Calculating yield prediction...';

    // Simulate AI prediction calculation
    setTimeout(() => {
        const prediction = calculateYield(cropType, fertilizerAmount, weatherData, fieldSize);
        
        resultsDiv.innerHTML = `
            <div class="result-card">
                <h3>🌾 Predicted Crop Yield</h3>
                <div class="result-value">${prediction.yieldPerHectare} tons/ha</div>
                <p><strong>Total Expected Yield:</strong> ${prediction.totalYield} tons</p>
                <p><strong>Confidence Level:</strong> ${prediction.confidence}%</p>
                
                <div style="margin-top: 20px; text-align: left;">
                    <h4>📊 Analysis Factors:</h4>
                    <ul style="margin-top: 10px;">
                        <li><strong>Crop Type:</strong> ${cropType.charAt(0).toUpperCase() + cropType.slice(1)}</li>
                        <li><strong>Fertilizer Impact:</strong> ${prediction.fertilizerImpact}</li>
                        <li><strong>Weather Conditions:</strong> ${prediction.weatherImpact}</li>
                        <li><strong>Environmental Score:</strong> ${prediction.environmentalScore}/10</li>
                    </ul>
                </div>
                
                <div style="margin-top: 20px;">
                    <h4>💡 Recommendations:</h4>
                    <p style="text-align: left; margin-top: 10px;">${prediction.recommendations}</p>
                </div>
            </div>
        `;
        
        showStatus('Yield prediction completed!', 'success');
    }, 3000);
}

// Yield calculation algorithm
function calculateYield(cropType, fertilizer, weather, fieldSize) {
    // Base yields for different crops (tons/hectare)
    const baseYields = {
        wheat: 3.5,
        rice: 4.2,
        corn: 6.8,
        soybean: 2.8,
        cotton: 1.5,
        barley: 3.2
    };

    let baseYield = baseYields[cropType] || 3.0;
    
    // Fertilizer impact (optimal around 150-200 kg/ha)
    let fertilizerFactor = 1.0;
    if (fertilizer < 50) fertilizerFactor = 0.7;
    else if (fertilizer < 100) fertilizerFactor = 0.85;
    else if (fertilizer <= 200) fertilizerFactor = 1.0 + (fertilizer - 100) * 0.002;
    else fertilizerFactor = 1.2 - (fertilizer - 200) * 0.001;

    // Weather impact
    let weatherFactor = 1.0;
    
    // Temperature impact
    if (weather.temperature < 15 || weather.temperature > 35) weatherFactor *= 0.8;
    else if (weather.temperature >= 20 && weather.temperature <= 30) weatherFactor *= 1.1;
    
    // Rainfall impact
    if (weather.rainfall < 100) weatherFactor *= 0.7;
    else if (weather.rainfall > 300) weatherFactor *= 0.8;
    else weatherFactor *= 1.0 + (weather.rainfall - 100) * 0.001;
    
    // Humidity impact
    if (weather.humidity < 40 || weather.humidity > 85) weatherFactor *= 0.9;
    
    // Calculate final yield
    const yieldPerHectare = (baseYield * fertilizerFactor * weatherFactor).toFixed(2);
    const totalYield = (yieldPerHectare * fieldSize).toFixed(2);
    
    // Generate recommendations
    let recommendations = [];
    if (fertilizer < 100) recommendations.push("Consider increasing fertilizer application.");
    if (fertilizer > 250) recommendations.push("Reduce fertilizer to avoid over-application.");
    if (weather.rainfall < 100) recommendations.push("Implement irrigation systems for better water management.");
    if (weather.humidity > 85) recommendations.push("Monitor for fungal diseases due to high humidity.");
    
    const recommendationText = recommendations.length > 0 ? 
        recommendations.join(" ") : 
        "Current conditions and inputs appear optimal for good yield.";

    return {
        yieldPerHectare: parseFloat(yieldPerHectare),
        totalYield: parseFloat(totalYield),
        confidence: Math.round(85 + Math.random() * 10),
        fertilizerImpact: fertilizer < 150 ? "Below optimal" : fertilizer > 200 ? "Above optimal" : "Optimal",
        weatherImpact: weatherFactor > 1.05 ? "Favorable" : weatherFactor < 0.9 ? "Challenging" : "Moderate",
        environmentalScore: Math.round(weatherFactor * 8),
        recommendations: recommendationText
    };
}

// Utility function for status messages
function showStatus(message, type) {
    const status = document.createElement('div');
    status.className = `status ${type}`;
    status.textContent = message;
    
    // Remove existing status messages
    document.querySelectorAll('.status').forEach(el => el.remove());
    
    // Add new status message to active step
    const activeStep = document.querySelector('.step.active');
    if (activeStep) {
        activeStep.appendChild(status);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            status.remove();
        }, 5000);
    }
}

// Initialize app when page loads
window.addEventListener('load', function() {
    showStatus('Welcome! Start by capturing an image and getting your location.', 'info');
});