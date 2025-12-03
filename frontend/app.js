// ===============================
// AETHERWEATHER ULTIMATE - FRONTEND
// Securely connects to your Render proxy
// ===============================

// ✅ REPLACE THIS WITH YOUR RENDER SERVICE URL
const PROXY_URL = 'https://weather-me4g.onrender.com'; // ← UPDATE THIS!

// =============== ERROR HANDLING ===============
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('message channel closed')) {
    event.preventDefault(); // Suppress browser extension noise
  }
});

// =============== PARTICLE SYSTEM ===============
class RainDrop {
  constructor(w, h, wind) {
    this.x = Math.random() * w;
    this.y = Math.random() * -h;
    this.len = Math.random() * 20 + 14;
    this.speed = Math.random() * 10 + 8;
    this.wind = (Math.random() - 0.5) * 3 * wind;
  }
  update(ctx, w, h) {
    this.y += this.speed;
    this.x += this.wind;
    if (this.y > h || this.x < -25 || this.x > w + 25) {
      this.y = -25;
      this.x = Math.random() * w;
    }
    ctx.strokeStyle = 'rgba(175, 215, 255, 0.85)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.len);
    ctx.stroke();
  }
}

class SnowFlake {
  constructor(w, h, wind) {
    this.x = Math.random() * w;
    this.y = Math.random() * -h;
    this.radius = Math.random() * 3 + 1.5;
    this.speed = Math.random() * 1.8 + 0.7;
    this.wind = (Math.random() - 0.25) * 2 * wind;
  }
  update(ctx, w, h) {
    this.y += this.speed;
    this.x += this.wind;
    if (this.y > h || this.x < -20 || this.x > w + 20) {
      this.y = -20;
      this.x = Math.random() * w;
    }
    ctx.fillStyle = 'rgba(248, 250, 255, 0.99)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class StormRain {
  constructor(w, h, wind) {
    this.x = Math.random() * w;
    this.y = Math.random() * -h;
    this.len = Math.random() * 25 + 18;
    this.speed = Math.random() * 14 + 10;
    this.wind = (Math.random() - 0.5) * 5 * wind;
  }
  update(ctx, w, h) {
    this.y += this.speed;
    this.x += this.wind;
    if (this.y > h || this.x < -30 || this.x > w + 30) {
      this.y = -30;
      this.x = Math.random() * w;
    }
    ctx.strokeStyle = 'rgba(160, 190, 220, 0.9)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.len);
    ctx.stroke();
  }
}

class SkyCloud {
  constructor(w, h, isDay, wind) {
    this.x = Math.random() * w;
    this.y = Math.random() * h * 0.55;
    this.size = Math.random() * 100 + 80;
    this.speed = (Math.random() * 0.4 + 0.2) * (1 + wind);
    this.opacity = isDay ? 0.82 : 0.88;
    this.sway = 0;
    this.swayDir = Math.random() > 0.5 ? 1 : -1;
  }
  update(ctx, w, h) {
    this.x -= this.speed;
    this.sway += 0.025 * this.swayDir;
    if (Math.abs(this.sway) > 0.6) this.swayDir *= -1;
    if (this.x < -this.size * 3) {
      this.x = w + this.size * 3;
      this.y = Math.random() * h * 0.55;
    }
    ctx.save();
    ctx.translate(this.x, this.y + Math.sin(this.sway) * 5);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
    ctx.arc(this.size * 0.42, -this.size * 0.12, this.size * 0.52, 0, Math.PI * 2);
    ctx.arc(this.size * 0.78, 0, this.size * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class SunDust {
  constructor(w, h, wind) {
    this.x = Math.random() * w;
    this.y = Math.random() * h * 0.8;
    this.size = Math.random() * 2.5 + 0.8;
    this.speed = (Math.random() * 0.3 + 0.1) * (1 + wind * 0.9);
  }
  update(ctx, w, h) {
    this.x += this.speed;
    if (this.x > w) {
      this.x = -15;
      this.y = Math.random() * h * 0.8;
    }
    ctx.fillStyle = 'rgba(255, 248, 220, 0.75)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class NightStar {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h * 0.9;
    this.size = Math.random() * 1.4 + 0.5;
    this.blink = Math.random() * 300 + 80;
    this.timer = 0;
  }
  update(ctx, w, h) {
    this.timer++;
    const alpha = 0.5 + 0.5 * Math.sin(this.timer / this.blink);
    ctx.fillStyle = `rgba(240, 248, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class HazeParticle {
  constructor(w, h, windInfluence) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 3 + 0.5;
    this.opacity = Math.random() * 0.12 + 0.06;
    this.speed = (Math.random() * 0.15 + 0.05) * (1 + windInfluence);
    this.drift = (Math.random() - 0.5) * 0.3 * windInfluence;
  }
  update(ctx, w, h) {
    this.x += this.drift;
    this.y -= this.speed;
    if (this.y < -10 || this.x < -10 || this.x > w + 10) {
      this.y = h + 10;
      this.x = Math.random() * w;
    }
    ctx.fillStyle = `rgba(240, 245, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// =============== SKY ENGINE ===============
class UltimateSky {
  constructor() {
    this.canvas = document.getElementById('weatherCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.weather = 'Clear';
    this.sunrise = 0;
    this.sunset = 0;
    this.now = 0;
    this.timezone = 0;
    this.windSpeed = 0;
    this.particles = [];
    this.sunPos = null;
    this.moonPos = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.spawnParticles();
  }

  setWeather(weather, sunrise, sunset, now, timezone, windSpeed = 0) {
    this.weather = weather;
    this.sunrise = sunrise;
    this.sunset = sunset;
    this.now = now;
    this.timezone = timezone;
    this.windSpeed = windSpeed;
    this.particles = [];
    this.sunPos = null;
    this.moonPos = null;
    this.spawnParticles();
  }

  getSkyState() {
    const now = this.now;
    const sunrise = this.sunrise;
    const sunset = this.sunset;
    const isDay = now > sunrise && now < sunset;
    const isTwilight = (now > sunset && now < sunset + 3600) || (now < sunrise && now > sunrise - 3600);
    const showSun = isDay;
    const showMoon = !isDay && !isTwilight;
    return { isDay, isTwilight, showSun, showMoon };
  }

  spawnParticles() {
    this.particles = [];
    const w = this.canvas.width;
    const h = this.canvas.height;
    const { showSun, showMoon, isDay } = this.getSkyState();
    const windInfluence = Math.min(1, this.windSpeed / 12);

    if (['Mist', 'Haze', 'Fog'].includes(this.weather)) {
      if (isDay) this.sunPos = { x: w * 0.8, y: h * 0.3, radius: 80 };
      for (let i = 0; i < 120; i++) this.particles.push(new HazeParticle(w, h, windInfluence));
    } else if (this.weather === 'Rain' || this.weather === 'Drizzle') {
      for (let i = 0; i < 400; i++) this.particles.push(new RainDrop(w, h, windInfluence));
    } else if (this.weather === 'Snow') {
      for (let i = 0; i < 250; i++) this.particles.push(new SnowFlake(w, h, windInfluence));
    } else if (this.weather === 'Thunderstorm') {
      for (let i = 0; i < 300; i++) this.particles.push(new StormRain(w, h, windInfluence));
      this.lightningTimer = 0;
    } else if (this.weather === 'Clouds') {
      for (let i = 0; i < 7; i++) this.particles.push(new SkyCloud(w, h, isDay, windInfluence));
    } else if (this.weather === 'Clear') {
      if (showSun) {
        this.sunPos = { x: w * 0.8, y: h * 0.3, radius: 70 };
        for (let i = 0; i < 70; i++) this.particles.push(new SunDust(w, h, windInfluence));
      } else if (showMoon) {
        this.moonPos = { x: w * 0.2, y: h * 0.3, radius: 50 };
        for (let i = 0; i < 280; i++) this.particles.push(new NightStar(w, h));
      }
    }
  }

  getSkyGradient(w, h, isDay, isTwilight, weather) {
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    if (['Mist', 'Haze', 'Fog'].includes(weather)) {
      const top = isDay ? '#D0E0F0' : '#4A5568';
      const bottom = isDay ? '#F0F8FF' : '#2D3748';
      grad.addColorStop(0, top);
      grad.addColorStop(1, bottom);
    } else if (weather === 'Clear') {
      if (isDay) { grad.addColorStop(0, '#87CEEB'); grad.addColorStop(1, '#1E90FF'); }
      else if (isTwilight) { grad.addColorStop(0, '#FF7E5F'); grad.addColorStop(1, '#FEB47B'); }
      else { grad.addColorStop(0, '#0c0c24'); grad.addColorStop(1, '#000428'); }
    } else if (weather === 'Clouds') {
      if (isDay) { grad.addColorStop(0, '#D3D3D3'); grad.addColorStop(1, '#A9A9A9'); }
      else { grad.addColorStop(0, '#4A4A5A'); grad.addColorStop(1, '#2A2A3A'); }
    } else if (['Rain', 'Drizzle'].includes(weather)) {
      grad.addColorStop(0, isDay ? '#A0B0C0' : '#3A4A5A');
      grad.addColorStop(1, isDay ? '#708090' : '#1A2A3A');
    } else if (weather === 'Thunderstorm') {
      grad.addColorStop(0, '#3A3A5A');
      grad.addColorStop(1, '#121224');
    } else if (weather === 'Snow') {
      grad.addColorStop(0, isDay ? '#E0E8F0' : '#4A5A6A');
      grad.addColorStop(1, isDay ? '#B0C0D0' : '#2A3A4A');
    } else {
      grad.addColorStop(0, isDay ? '#B0D0F0' : '#202040');
      grad.addColorStop(1, isDay ? '#80A0D0' : '#101030');
    }
    return grad;
  }

  animate() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const { isDay, isTwilight, showSun, showMoon } = this.getSkyState();
    const ctx = this.ctx;

    const skyGrad = this.getSkyGradient(w, h, isDay, isTwilight, this.weather);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    if (['Mist', 'Haze', 'Fog'].includes(this.weather) && isDay) {
      const x = w * 0.8, y = h * 0.3, radius = 80;
      const glow = ctx.createRadialGradient(x, y, radius, x, y, radius * 3);
      glow.addColorStop(0, 'rgba(255, 240, 200, 0.2)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }

    if (showSun && this.sunPos) {
      const { x, y, radius } = this.sunPos;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 235, 140, 0.97)';
      ctx.fill();
      const glow = ctx.createRadialGradient(x, y, radius, x, y, radius * 3);
      glow.addColorStop(0, 'rgba(255, 235, 140, 0.6)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }

    if (showMoon && this.moonPos) {
      const { x, y, radius } = this.moonPos;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240, 245, 255, 0.99)';
      ctx.fill();
      const mglow = ctx.createRadialGradient(x, y, radius, x, y, radius * 2.2);
      mglow.addColorStop(0, 'rgba(240, 245, 255, 0.3)');
      mglow.addColorStop(1, 'transparent');
      ctx.fillStyle = mglow;
      ctx.fillRect(0, 0, w, h);
    }

    if (this.weather === 'Thunderstorm') {
      this.lightningTimer = (this.lightningTimer || 0) + 1;
      if (this.lightningTimer > 100 && Math.random() < 0.04) {
        ctx.fillStyle = 'rgba(255, 255, 250, 0.25)';
        ctx.fillRect(0, 0, w, h);
        this.lightningTimer = 0;
      }
    }

    this.particles.forEach(p => p.update(ctx, w, h));
    requestAnimationFrame(() => this.animate());
  }
}

const skyEngine = new UltimateSky();

// =============== UTILITIES ===============
const getFlagEmoji = (code) => {
  if (!code) return '';
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + 127397));
};

const format12HourTime = (utc, offset) => {
  const localMs = (utc + offset) * 1000;
  const d = new Date(localMs);
  let h = d.getUTCHours();
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

const mpsToKph = (v) => (v * 3.6).toFixed(1);

const dewPoint = (T, RH) => {
  if (RH <= 0 || RH > 100) return null;
  const a = 17.27, b = 237.7;
  const alpha = ((a * T) / (b + T)) + Math.log(RH / 100);
  return (b * alpha) / (a - alpha);
};

// =============== WEATHER LOGIC ===============
async function fetchWeatherAndForecast(lat, lon) {
  try {
    // ✅ SECURE: Call your Render proxy, NOT OpenWeatherMap directly
    const weatherRes = await fetch(`${PROXY_URL}/weather?lat=${lat}&lon=${lon}`);
    if (!weatherRes.ok) throw new Error(`Weather: ${weatherRes.status}`);
    const weatherData = await weatherRes.json();

    const forecastRes = await fetch(`${PROXY_URL}/forecast?lat=${lat}&lon=${lon}`);
    if (!forecastRes.ok) throw new Error(`Forecast: ${forecastRes.status}`);
    const forecastData = await forecastRes.json();

    renderCurrentWeather(weatherData);
    renderForecast(forecastData, weatherData.timezone);
  } catch (err) {
    console.error("Fetch failed:", err);
    alert("Weather data unavailable. Try again.");
  }
}

function renderCurrentWeather(data) {
  const { dt, timezone, sys, main, clouds, visibility = 10000, wind = {}, weather, name } = data;
  const { country, sunrise, sunset } = sys;
  const weatherMain = weather[0].main;

  skyEngine.setWeather(weatherMain, sunrise, sunset, dt, timezone, wind.speed || 0);

  const T = main.temp;
  const RH = main.humidity;
  const dew = dewPoint(T, RH);
  const indoorHumidity = Math.min(65, Math.round(RH * 0.75));

  document.getElementById('locationHeader').innerHTML = `${name} ${getFlagEmoji(country)} &nbsp; • &nbsp; ${country}`;
  document.getElementById('mainWeatherIcon').src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  document.getElementById('conditions').textContent = weather[0].description.replace(/\b\w/g, l => l.toUpperCase());
  document.getElementById('tempDisplay').textContent = `${T.toFixed(1)}°C`;

  const safe = (val, unit = "") => val !== undefined ? `${val}${unit}` : "N/A";

  const atmosphere = [
    { label: "Humidity", value: `${RH}%` },
    { label: "Dew Point", value: dew !== null ? `${dew.toFixed(1)}°C` : "N/A" },
    { label: "Cloud Cover", value: safe(clouds?.all, "%") },
    { label: "Visibility", value: `${(visibility / 1000).toFixed(1)} km` },
    { label: "Indoor Humidity", value: `${indoorHumidity}%` }
  ];

  const windData = [
    { label: "Wind Speed", value: wind.speed ? `${mpsToKph(wind.speed)} km/h` : "N/A" },
    { label: "Wind Gust", value: wind.gust ? `${mpsToKph(wind.gust)} km/h` : "N/A" },
    { label: "Wind Direction", value: safe(wind.deg, "°") },
    { label: "Pressure", value: `${main.pressure} mb` },
    { label: "Sea Level", value: safe(main.sea_level, " mb") },
    { label: "Ground Level", value: safe(main.grnd_level, " mb") }
  ];

  const timeData = [
    { label: "Local Time", value: format12HourTime(dt, timezone) },
    { label: "Timezone", value: `UTC${timezone / 3600 >= 0 ? '+' : ''}${timezone / 3600}` },
    { label: "Sunrise", value: format12HourTime(sunrise, timezone) },
    { label: "Sunset", value: format12HourTime(sunset, timezone) },
    { label: "Phase", value: dt > sunrise && dt < sunset ? "Day" : "Night" }
  ];

  const comfort = [{ label: "Feels Like", value: `${main.feels_like.toFixed(1)}°C` }];

  const render = (id, items) => {
    document.getElementById(id).innerHTML = items.map(i => 
      `<div class="metric-card"><div class="metric-label">${i.label}</div><div class="metric-value">${i.value}</div></div>`
    ).join('');
  };

  render('atmosphereGrid', atmosphere);
  render('windGrid', windData);
  render('timeGrid', timeData);
  render('comfortGrid', comfort);

  document.getElementById('weatherCard').classList.remove('hidden');
  setTimeout(() => document.getElementById('weatherCard').classList.add('visible'), 70);
}

function renderForecast(forecastData, timezone) {
  const { list } = forecastData;
  
  const daily = {};
  list.forEach(item => {
    const date = new Date((item.dt + timezone) * 1000);
    const dayKey = date.toDateString();
    if (!daily[dayKey]) {
      daily[dayKey] = { date, temps: [], icons: [], descriptions: [], precip: [] };
    }
    daily[dayKey].temps.push(item.main.temp);
    daily[dayKey].icons.push(item.weather[0].icon);
    daily[dayKey].descriptions.push(item.weather[0].main);
    if (item.pop) daily[dayKey].precip.push(item.pop);
  });

  const dailyArray = Object.values(daily).slice(0, 5);
  
  const forecastGrid = document.getElementById('forecastGrid');
  forecastGrid.innerHTML = dailyArray.map(day => {
    const min = Math.min(...day.temps).toFixed(0);
    const max = Math.max(...day.temps).toFixed(0);
    const icon = day.icons[0];
    const desc = day.descriptions[0];
    const pop = day.precip.length ? Math.max(...day.precip) : 0;
    const dayName = day.date.toLocaleDateString('en-US', { weekday: 'long' });
    return `
      <div class="forecast-card">
        <div class="forecast-day">${dayName}</div>
        <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" />
        <div class="forecast-temp">${min}° / ${max}°</div>
        <div class="forecast-desc">${desc}</div>
        ${pop > 0 ? `<div class="forecast-precip">${(pop * 100).toFixed(0)}% rain</div>` : ''}
      </div>
    `;
  }).join('');

  const next24 = list.slice(0, 8);
  const hourlyGrid = document.getElementById('hourlyGrid');
  hourlyGrid.innerHTML = next24.map(item => {
    const time = format12HourTime(item.dt, timezone);
    const temp = item.main.temp.toFixed(0);
    const icon = item.weather[0].icon;
    return `
      <div class="hourly-card">
        <div class="hour-time">${time}</div>
        <img class="hour-icon" src="https://openweathermap.org/img/wn/${icon}.png" />
        <div class="hour-temp">${temp}°</div>
      </div>
    `;
  }).join('');

  document.getElementById('forecastSection').classList.remove('hidden');
}

// =============== EVENT HANDLERS ===============
async function searchCity() {
  const query = document.getElementById('cityInput').value.trim();
  if (!query) return;
  try {
    // ✅ SECURE: Use proxy for geocoding
    const res = await fetch(`${PROXY_URL}/geo?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!data || data.length === 0) {
      alert("City not found. Please try another.");
      return;
    }
    await fetchWeatherAndForecast(data[0].lat, data[0].lon);
  } catch (err) {
    console.error("Search failed:", err);
    alert("Search failed. Try again.");
  }
}

document.getElementById('searchBtn').addEventListener('click', searchCity);
document.getElementById('cityInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') searchCity();
});