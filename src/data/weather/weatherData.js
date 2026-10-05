// ============================================================
// Mock Data – Weather, Forecasts, Groundwater, Soil Moisture
// Default location: Nalgonda District, Telangana
// ============================================================

export const currentWeather = {
  location: 'Nalgonda, Telangana',
  date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  temp: 34,
  feelsLike: 37,
  humidity: 72,
  rainfall: 8.4,
  windSpeed: 14,
  windDir: 'SW',
  uvIndex: 9,
  visibility: 8,
  condition: 'Partly Cloudy',
  conditionCode: 'partly-cloudy',
  pressure: 1008,
};

export const weeklyForecast = [
  { day: 'Today',  date: 'Jul 17', high: 34, low: 26, rain: 60, condition: 'Rainy',         icon: 'cloud-rain' },
  { day: 'Thu',    date: 'Jul 18', high: 36, low: 27, rain: 20, condition: 'Partly Cloudy', icon: 'cloud' },
  { day: 'Fri',    date: 'Jul 19', high: 38, low: 28, rain: 10, condition: 'Sunny',         icon: 'sun' },
  { day: 'Sat',    date: 'Jul 20', high: 35, low: 26, rain: 75, condition: 'Heavy Rain',    icon: 'cloud-rain' },
  { day: 'Sun',    date: 'Jul 21', high: 31, low: 24, rain: 90, condition: 'Thunderstorm',  icon: 'zap' },
  { day: 'Mon',    date: 'Jul 22', high: 33, low: 25, rain: 40, condition: 'Cloudy',        icon: 'cloud' },
  { day: 'Tue',    date: 'Jul 23', high: 35, low: 26, rain: 25, condition: 'Partly Cloudy', icon: 'cloud' },
];

export const seasonalOutlook = {
  season: 'Kharif 2025',
  prediction: 'Above Normal',
  confidence: 78,
  description: 'IMD forecasts above-normal monsoon rainfall for Nalgonda this Kharif season. Cumulative seasonal rainfall expected to be 110-120% of LPA. Favorable conditions for paddy and cotton sowing.',
  onset: 'June 8 (Actual)',
  withdrawal: 'October 15 (Predicted)',
  totalExpected: 650,
  totalSoFar: 312,
  lpa: 598,
};

// 30-day rainfall trend
export const rainfallTrend = [
  { date: 'Jun 17', rainfall: 12 }, { date: 'Jun 19', rainfall: 0  }, { date: 'Jun 21', rainfall: 45 },
  { date: 'Jun 23', rainfall: 8  }, { date: 'Jun 25', rainfall: 22 }, { date: 'Jun 27', rainfall: 5  },
  { date: 'Jun 29', rainfall: 0  }, { date: 'Jul 01', rainfall: 18 }, { date: 'Jul 03', rainfall: 67 },
  { date: 'Jul 05', rainfall: 42 }, { date: 'Jul 07', rainfall: 15 }, { date: 'Jul 09', rainfall: 0  },
  { date: 'Jul 11', rainfall: 30 }, { date: 'Jul 13', rainfall: 55 }, { date: 'Jul 15', rainfall: 8  },
  { date: 'Jul 17', rainfall: 8  },
];

// Groundwater levels (meters below ground level)
export const groundwaterData = [
  { month: 'Jan', level: 18.2, safe: 15 }, { month: 'Feb', level: 19.4, safe: 15 },
  { month: 'Mar', level: 21.1, safe: 15 }, { month: 'Apr', level: 22.8, safe: 15 },
  { month: 'May', level: 24.2, safe: 15 }, { month: 'Jun', level: 20.1, safe: 15 },
  { month: 'Jul', level: 14.8, safe: 15 }, { month: 'Aug', level: 10.2, safe: 15 },
  { month: 'Sep', level: 8.6,  safe: 15 }, { month: 'Oct', level: 9.4,  safe: 15 },
  { month: 'Nov', level: 12.3, safe: 15 }, { month: 'Dec', level: 15.7, safe: 15 },
];

// Soil moisture index (0-100)
export const soilMoistureData = [
  { day: 'Mon', topsoil: 62, subsoil: 74 }, { day: 'Tue', topsoil: 58, subsoil: 72 },
  { day: 'Wed', topsoil: 54, subsoil: 70 }, { day: 'Thu', topsoil: 70, subsoil: 76 },
  { day: 'Fri', topsoil: 75, subsoil: 78 }, { day: 'Sat', topsoil: 68, subsoil: 75 },
  { day: 'Sun', topsoil: 63, subsoil: 73 },
];

export const tempHumidityData = [
  { time: '6am', temp: 27, humidity: 88 }, { time: '9am',  temp: 30, humidity: 80 },
  { time: '12pm',temp: 34, humidity: 72 }, { time: '3pm',  temp: 36, humidity: 65 },
  { time: '6pm', temp: 34, humidity: 70 }, { time: '9pm',  temp: 31, humidity: 78 },
  { time: '12am',temp: 28, humidity: 85 },
];

export const alerts = [
  { id: 1, type: 'danger',  icon: 'alert-triangle', title: 'Heavy Rainfall Warning', message: 'IMD Alert: Heavy to very heavy rainfall expected in Nalgonda on Jul 20-21. Avoid going to fields.', time: '2 hours ago' },
  { id: 2, type: 'warning', icon: 'thermometer',     title: 'Heatwave Advisory',    message: 'Temperatures above 40°C expected Jul 18-19. Ensure livestock have shade and water.', time: '5 hours ago' },
  { id: 3, type: 'info',    icon: 'droplets',        title: 'Sowing Window Alert',  message: 'Optimal paddy sowing window opens in 3 days. Prepare nursery beds now.', time: '1 day ago' },
  { id: 4, type: 'warning', icon: 'bug',             title: 'Pest Alert – FAW',     message: 'Fall Armyworm incidence reported in neighboring villages. Scout maize fields regularly.', time: '2 days ago' },
];
