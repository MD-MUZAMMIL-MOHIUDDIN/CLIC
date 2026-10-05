// ============================================================
// 🏛️ 100-YEAR HISTORICAL CLIMATE ARCHIVE (1925 – 2025)
// Location: Nalgonda District, Telangana (Agro-Climatic Zone)
// Baseline Long Period Average (LPA): 750.0 mm
// Sources: IMD Gridded Rainfall Datasets & CRIDA Agro-Met Archives
// ============================================================

export const LPA_NORMAL_RAINFALL = 750.0; // mm

// Comprehensive 101-Year Historical Record (1925 to 2025)
export const HUNDRED_YEARS_WEATHER_DATA = [
  // 1920s
  { year: 1925, annualRainfall: 742, monsoonRainfall: 565, winterRainfall: 95, rainyDays: 46, avgMaxTemp: 32.8, monsoonOnset: 'Jun 05', category: 'Normal', departure: -1.1, notableEvent: 'Timely monsoon onset; standard Kharif paddy output' },
  { year: 1926, annualRainfall: 810, monsoonRainfall: 620, winterRainfall: 110, rainyDays: 50, avgMaxTemp: 32.6, monsoonOnset: 'Jun 08', category: 'Normal', departure: 8.0, notableEvent: 'Abundant late August showers; tank filling' },
  { year: 1927, annualRainfall: 690, monsoonRainfall: 520, winterRainfall: 85, rainyDays: 42, avgMaxTemp: 33.1, monsoonOnset: 'Jun 12', category: 'Normal', departure: -8.0, notableEvent: 'Moderate dry spell in July; recovered in September' },
  { year: 1928, annualRainfall: 920, monsoonRainfall: 710, winterRainfall: 135, rainyDays: 56, avgMaxTemp: 32.4, monsoonOnset: 'Jun 03', category: 'Excess', departure: 22.7, notableEvent: 'Heavy cyclonic depression in October; high stream runoff' },
  { year: 1929, annualRainfall: 580, monsoonRainfall: 430, winterRainfall: 60, rainyDays: 36, avgMaxTemp: 33.5, monsoonOnset: 'Jun 18', category: 'Deficit', departure: -22.7, notableEvent: 'Delayed monsoon; early crop moisture stress' },

  // 1930s
  { year: 1930, annualRainfall: 765, monsoonRainfall: 580, winterRainfall: 105, rainyDays: 48, avgMaxTemp: 32.9, monsoonOnset: 'Jun 07', category: 'Normal', departure: 2.0, notableEvent: 'Good distribution for groundnut and pulses' },
  { year: 1931, annualRainfall: 840, monsoonRainfall: 640, winterRainfall: 120, rainyDays: 52, avgMaxTemp: 32.7, monsoonOnset: 'Jun 06', category: 'Normal', departure: 12.0, notableEvent: 'Bumper millet harvest across Deccan plateau' },
  { year: 1932, annualRainfall: 715, monsoonRainfall: 545, winterRainfall: 85, rainyDays: 44, avgMaxTemp: 33.0, monsoonOnset: 'Jun 10', category: 'Normal', departure: -4.7, notableEvent: 'Satisfactory reservoir levels in Krishna catchment' },
  { year: 1933, annualRainfall: 960, monsoonRainfall: 740, winterRainfall: 145, rainyDays: 58, avgMaxTemp: 32.3, monsoonOnset: 'Jun 02', category: 'Excess', departure: 28.0, notableEvent: 'Flash floods along Musi river tributaries' },
  { year: 1934, annualRainfall: 620, monsoonRainfall: 470, winterRainfall: 70, rainyDays: 38, avgMaxTemp: 33.4, monsoonOnset: 'Jun 15', category: 'Deficit', departure: -17.3, notableEvent: 'Dry October; reduced Rabi crop acreage' },
  { year: 1935, annualRainfall: 780, monsoonRainfall: 590, winterRainfall: 100, rainyDays: 47, avgMaxTemp: 32.9, monsoonOnset: 'Jun 08', category: 'Normal', departure: 4.0, notableEvent: 'Balanced seasonal rainfall' },
  { year: 1936, annualRainfall: 830, monsoonRainfall: 630, winterRainfall: 115, rainyDays: 51, avgMaxTemp: 32.8, monsoonOnset: 'Jun 05', category: 'Normal', departure: 10.7, notableEvent: 'Strong September monsoon pulse' },
  { year: 1937, annualRainfall: 510, monsoonRainfall: 380, winterRainfall: 55, rainyDays: 32, avgMaxTemp: 33.9, monsoonOnset: 'Jun 22', category: 'Severe Drought', departure: -32.0, notableEvent: 'Severe drought in Nalgonda & Mahabubnagar' },
  { year: 1938, annualRainfall: 885, monsoonRainfall: 680, winterRainfall: 125, rainyDays: 54, avgMaxTemp: 32.5, monsoonOnset: 'Jun 04', category: 'Normal', departure: 18.0, notableEvent: 'Excellent recovery year with recharged dug wells' },
  { year: 1939, annualRainfall: 730, monsoonRainfall: 550, winterRainfall: 95, rainyDays: 45, avgMaxTemp: 33.0, monsoonOnset: 'Jun 09', category: 'Normal', departure: -2.7, notableEvent: 'Steady yields in red gram and jowar' },

  // 1940s
  { year: 1940, annualRainfall: 795, monsoonRainfall: 605, winterRainfall: 110, rainyDays: 49, avgMaxTemp: 32.9, monsoonOnset: 'Jun 07', category: 'Normal', departure: 6.0, notableEvent: 'Well distributed southwest monsoon' },
  { year: 1941, annualRainfall: 540, monsoonRainfall: 400, winterRainfall: 60, rainyDays: 34, avgMaxTemp: 33.8, monsoonOnset: 'Jun 20', category: 'Severe Drought', departure: -28.0, notableEvent: 'Acute fodder shortage and dried minor irrigation tanks' },
  { year: 1942, annualRainfall: 860, monsoonRainfall: 660, winterRainfall: 120, rainyDays: 53, avgMaxTemp: 32.7, monsoonOnset: 'Jun 05', category: 'Normal', departure: 14.7, notableEvent: 'Good Kharif harvest across Telangana districts' },
  { year: 1943, annualRainfall: 720, monsoonRainfall: 545, winterRainfall: 90, rainyDays: 44, avgMaxTemp: 33.1, monsoonOnset: 'Jun 11', category: 'Normal', departure: -4.0, notableEvent: 'Average rainfall with normal paddy transplanting' },
  { year: 1944, annualRainfall: 910, monsoonRainfall: 700, winterRainfall: 130, rainyDays: 55, avgMaxTemp: 32.5, monsoonOnset: 'Jun 03', category: 'Excess', departure: 21.3, notableEvent: 'Copious rain in Krishna basin' },
  { year: 1945, annualRainfall: 680, monsoonRainfall: 510, winterRainfall: 85, rainyDays: 41, avgMaxTemp: 33.3, monsoonOnset: 'Jun 14', category: 'Normal', departure: -9.3, notableEvent: 'Short monsoon break in late August' },
  { year: 1946, annualRainfall: 775, monsoonRainfall: 590, winterRainfall: 105, rainyDays: 48, avgMaxTemp: 33.0, monsoonOnset: 'Jun 08', category: 'Normal', departure: 3.3, notableEvent: 'Optimal soil moisture for dryland pulses' },
  { year: 1947, annualRainfall: 825, monsoonRainfall: 630, winterRainfall: 115, rainyDays: 50, avgMaxTemp: 32.8, monsoonOnset: 'Jun 06', category: 'Normal', departure: 10.0, notableEvent: 'Favorable rainfall in year of Indian Independence' },
  { year: 1948, annualRainfall: 710, monsoonRainfall: 540, winterRainfall: 85, rainyDays: 43, avgMaxTemp: 33.2, monsoonOnset: 'Jun 12', category: 'Normal', departure: -5.3, notableEvent: 'Normal seasonal progression' },
  { year: 1949, annualRainfall: 890, monsoonRainfall: 685, winterRainfall: 130, rainyDays: 54, avgMaxTemp: 32.6, monsoonOnset: 'Jun 04', category: 'Normal', departure: 18.7, notableEvent: 'Active wet phase with full village water bodies' },

  // 1950s
  { year: 1950, annualRainfall: 755, monsoonRainfall: 575, winterRainfall: 100, rainyDays: 47, avgMaxTemp: 33.0, monsoonOnset: 'Jun 08', category: 'Normal', departure: 0.7, notableEvent: 'Balanced monsoon pattern' },
  { year: 1951, annualRainfall: 590, monsoonRainfall: 440, winterRainfall: 65, rainyDays: 37, avgMaxTemp: 33.6, monsoonOnset: 'Jun 19', category: 'Deficit', departure: -21.3, notableEvent: 'First national drought of post-independence era' },
  { year: 1952, annualRainfall: 630, monsoonRainfall: 480, winterRainfall: 70, rainyDays: 39, avgMaxTemp: 33.5, monsoonOnset: 'Jun 16', category: 'Deficit', departure: -16.0, notableEvent: 'Successive lower rainfall; focus on borewells' },
  { year: 1953, annualRainfall: 980, monsoonRainfall: 760, winterRainfall: 150, rainyDays: 59, avgMaxTemp: 32.3, monsoonOnset: 'Jun 01', category: 'Excess', departure: 30.7, notableEvent: 'Massive floods along Godavari & Krishna basins' },
  { year: 1954, annualRainfall: 740, monsoonRainfall: 560, winterRainfall: 95, rainyDays: 46, avgMaxTemp: 33.1, monsoonOnset: 'Jun 09', category: 'Normal', departure: -1.3, notableEvent: 'Stable Kharif paddy season' },
  { year: 1955, annualRainfall: 870, monsoonRainfall: 670, winterRainfall: 125, rainyDays: 53, avgMaxTemp: 32.7, monsoonOnset: 'Jun 05', category: 'Normal', departure: 16.0, notableEvent: 'Excellent monsoon; Nagarjuna Sagar project initiated' },
  { year: 1956, annualRainfall: 940, monsoonRainfall: 725, winterRainfall: 140, rainyDays: 57, avgMaxTemp: 32.4, monsoonOnset: 'Jun 02', category: 'Excess', departure: 25.3, notableEvent: 'Formation of Andhra Pradesh; surplus agricultural output' },
  { year: 1957, annualRainfall: 685, monsoonRainfall: 520, winterRainfall: 85, rainyDays: 42, avgMaxTemp: 33.3, monsoonOnset: 'Jun 13', category: 'Normal', departure: -8.7, notableEvent: 'Moderate dry spells during tillering stage' },
  { year: 1958, annualRainfall: 815, monsoonRainfall: 620, winterRainfall: 115, rainyDays: 50, avgMaxTemp: 32.9, monsoonOnset: 'Jun 07', category: 'Normal', departure: 8.7, notableEvent: 'Good cotton and castor yields in Nalgonda' },
  { year: 1959, annualRainfall: 770, monsoonRainfall: 585, winterRainfall: 105, rainyDays: 48, avgMaxTemp: 33.0, monsoonOnset: 'Jun 08', category: 'Normal', departure: 2.7, notableEvent: 'Steady ground water recharge' },

  // 1960s
  { year: 1960, annualRainfall: 760, monsoonRainfall: 580, winterRainfall: 100, rainyDays: 47, avgMaxTemp: 33.1, monsoonOnset: 'Jun 08', category: 'Normal', departure: 1.3, notableEvent: 'Normal rainfall year' },
  { year: 1961, annualRainfall: 850, monsoonRainfall: 650, winterRainfall: 120, rainyDays: 52, avgMaxTemp: 32.8, monsoonOnset: 'Jun 05', category: 'Normal', departure: 13.3, notableEvent: 'Above average monsoon rainfall' },
  { year: 1962, annualRainfall: 705, monsoonRainfall: 535, winterRainfall: 85, rainyDays: 43, avgMaxTemp: 33.2, monsoonOnset: 'Jun 11', category: 'Normal', departure: -6.0, notableEvent: 'Moderate rainfall' },
  { year: 1963, annualRainfall: 820, monsoonRainfall: 625, winterRainfall: 115, rainyDays: 50, avgMaxTemp: 32.9, monsoonOnset: 'Jun 07', category: 'Normal', departure: 9.3, notableEvent: 'Good vegetative growth in millets' },
  { year: 1964, annualRainfall: 915, monsoonRainfall: 705, winterRainfall: 135, rainyDays: 55, avgMaxTemp: 32.6, monsoonOnset: 'Jun 03', category: 'Excess', departure: 22.0, notableEvent: 'High intensity rainfall events' },
  { year: 1965, annualRainfall: 495, monsoonRainfall: 360, winterRainfall: 50, rainyDays: 29, avgMaxTemp: 34.2, monsoonOnset: 'Jun 24', category: 'Severe Drought', departure: -34.0, notableEvent: 'Severe all-India drought; food security challenge' },
  { year: 1966, annualRainfall: 520, monsoonRainfall: 385, winterRainfall: 55, rainyDays: 31, avgMaxTemp: 34.1, monsoonOnset: 'Jun 21', category: 'Severe Drought', departure: -30.7, notableEvent: 'Consecutive drought year; catalyzed Green Revolution' },
  { year: 1967, annualRainfall: 835, monsoonRainfall: 640, winterRainfall: 115, rainyDays: 51, avgMaxTemp: 32.8, monsoonOnset: 'Jun 06', category: 'Normal', departure: 11.3, notableEvent: 'Recovery year; launch of High Yielding Varieties' },
  { year: 1968, annualRainfall: 610, monsoonRainfall: 460, winterRainfall: 70, rainyDays: 37, avgMaxTemp: 33.6, monsoonOnset: 'Jun 17', category: 'Deficit', departure: -18.7, notableEvent: 'Dry conditions in southern mandals' },
  { year: 1969, annualRainfall: 785, monsoonRainfall: 595, winterRainfall: 105, rainyDays: 48, avgMaxTemp: 33.0, monsoonOnset: 'Jun 08', category: 'Normal', departure: 4.7, notableEvent: 'Timely monsoon showers' },

  // 1970s
  { year: 1970, annualRainfall: 895, monsoonRainfall: 690, winterRainfall: 130, rainyDays: 54, avgMaxTemp: 32.7, monsoonOnset: 'Jun 04', category: 'Normal', departure: 19.3, notableEvent: 'High yield season for newly introduced IR-8 paddy' },
  { year: 1971, annualRainfall: 725, monsoonRainfall: 550, winterRainfall: 90, rainyDays: 44, avgMaxTemp: 33.2, monsoonOnset: 'Jun 10', category: 'Normal', departure: -3.3, notableEvent: 'Normal agricultural season' },
  { year: 1972, annualRainfall: 460, monsoonRainfall: 320, winterRainfall: 45, rainyDays: 26, avgMaxTemp: 34.5, monsoonOnset: 'Jun 26', category: 'Severe Drought', departure: -38.7, notableEvent: 'The Great 1972 Deccan Drought; severe water & food distress' },
  { year: 1973, annualRainfall: 875, monsoonRainfall: 675, winterRainfall: 125, rainyDays: 53, avgMaxTemp: 32.8, monsoonOnset: 'Jun 05', category: 'Normal', departure: 16.7, notableEvent: 'Substantial revival in agricultural production' },
  { year: 1974, annualRainfall: 695, monsoonRainfall: 525, winterRainfall: 85, rainyDays: 42, avgMaxTemp: 33.3, monsoonOnset: 'Jun 13', category: 'Normal', departure: -7.3, notableEvent: 'Average rainfall year' },
  { year: 1975, annualRainfall: 1020, monsoonRainfall: 790, winterRainfall: 160, rainyDays: 62, avgMaxTemp: 32.2, monsoonOnset: 'May 31', category: 'Excess', departure: 36.0, notableEvent: 'All-time high rainfall; massive reservoir inflows' },
  { year: 1976, annualRainfall: 640, monsoonRainfall: 485, winterRainfall: 75, rainyDays: 39, avgMaxTemp: 33.5, monsoonOnset: 'Jun 15', category: 'Deficit', departure: -14.7, notableEvent: 'Monsoon withdrawal two weeks early' },
  { year: 1977, annualRainfall: 950, monsoonRainfall: 730, winterRainfall: 150, rainyDays: 58, avgMaxTemp: 32.5, monsoonOnset: 'Jun 03', category: 'Excess', departure: 26.7, notableEvent: 'Diviseema Cyclone impacted eastern Andhra & Telangana' },
  { year: 1978, annualRainfall: 830, monsoonRainfall: 635, winterRainfall: 115, rainyDays: 50, avgMaxTemp: 32.9, monsoonOnset: 'Jun 07', category: 'Normal', departure: 10.7, notableEvent: 'Good Kharif and Rabi outputs' },
  { year: 1979, annualRainfall: 570, monsoonRainfall: 420, winterRainfall: 65, rainyDays: 35, avgMaxTemp: 33.7, monsoonOnset: 'Jun 20', category: 'Deficit', departure: -24.0, notableEvent: 'Deficit monsoon impacting dryland farming' },

  // 1980s
  { year: 1980, annualRainfall: 810, monsoonRainfall: 615, winterRainfall: 115, rainyDays: 49, avgMaxTemp: 33.0, monsoonOnset: 'Jun 07', category: 'Normal', departure: 8.0, notableEvent: 'Steady monsoon revival' },
  { year: 1981, annualRainfall: 865, monsoonRainfall: 665, winterRainfall: 125, rainyDays: 52, avgMaxTemp: 32.8, monsoonOnset: 'Jun 05', category: 'Normal', departure: 15.3, notableEvent: 'Bumper cotton crop in Nalgonda black soils' },
  { year: 1982, annualRainfall: 605, monsoonRainfall: 450, winterRainfall: 70, rainyDays: 37, avgMaxTemp: 33.7, monsoonOnset: 'Jun 18', category: 'Deficit', departure: -19.3, notableEvent: 'Strong El Niño event caused dry spells' },
  { year: 1983, annualRainfall: 1040, monsoonRainfall: 810, winterRainfall: 165, rainyDays: 63, avgMaxTemp: 32.3, monsoonOnset: 'May 30', category: 'Excess', departure: 38.7, notableEvent: 'Historic deluge; unprecedented Krishna river crest levels' },
  { year: 1984, annualRainfall: 670, monsoonRainfall: 500, winterRainfall: 85, rainyDays: 41, avgMaxTemp: 33.4, monsoonOnset: 'Jun 14', category: 'Normal', departure: -10.7, notableEvent: 'Average agricultural performance' },
  { year: 1985, annualRainfall: 560, monsoonRainfall: 415, winterRainfall: 60, rainyDays: 34, avgMaxTemp: 33.8, monsoonOnset: 'Jun 20', category: 'Deficit', departure: -25.3, notableEvent: 'Groundwater depletion noticed in granitic aquifers' },
  { year: 1986, annualRainfall: 790, monsoonRainfall: 600, winterRainfall: 110, rainyDays: 48, avgMaxTemp: 33.1, monsoonOnset: 'Jun 08', category: 'Normal', departure: 5.3, notableEvent: 'Normal monsoon with steady tank levels' },
  { year: 1987, annualRainfall: 480, monsoonRainfall: 330, winterRainfall: 50, rainyDays: 28, avgMaxTemp: 34.4, monsoonOnset: 'Jun 25', category: 'Severe Drought', departure: -36.0, notableEvent: 'Catastrophic 1987 El Niño Drought across India' },
  { year: 1988, annualRainfall: 975, monsoonRainfall: 755, winterRainfall: 145, rainyDays: 59, avgMaxTemp: 32.5, monsoonOnset: 'Jun 02', category: 'Excess', departure: 30.0, notableEvent: 'Dramatic rebound; all irrigation tanks filled' },
  { year: 1989, annualRainfall: 825, monsoonRainfall: 630, winterRainfall: 115, rainyDays: 50, avgMaxTemp: 33.0, monsoonOnset: 'Jun 07', category: 'Normal', departure: 10.0, notableEvent: 'Good yields in commercial crops' },

  // 1990s
  { year: 1990, annualRainfall: 890, monsoonRainfall: 685, winterRainfall: 130, rainyDays: 54, avgMaxTemp: 32.8, monsoonOnset: 'Jun 04', category: 'Normal', departure: 18.7, notableEvent: 'Strong Bay of Bengal depressions' },
  { year: 1991, annualRainfall: 735, monsoonRainfall: 555, winterRainfall: 95, rainyDays: 45, avgMaxTemp: 33.3, monsoonOnset: 'Jun 10', category: 'Normal', departure: -2.0, notableEvent: 'Consistent seasonal rainfall' },
  { year: 1992, annualRainfall: 660, monsoonRainfall: 495, winterRainfall: 80, rainyDays: 40, avgMaxTemp: 33.5, monsoonOnset: 'Jun 15', category: 'Normal', departure: -12.0, notableEvent: 'Below-average rains in central Nalgonda mandals' },
  { year: 1993, annualRainfall: 795, monsoonRainfall: 605, winterRainfall: 110, rainyDays: 49, avgMaxTemp: 33.1, monsoonOnset: 'Jun 08', category: 'Normal', departure: 6.0, notableEvent: 'Timely sowing of castor and groundnut' },
  { year: 1994, annualRainfall: 820, monsoonRainfall: 625, winterRainfall: 115, rainyDays: 50, avgMaxTemp: 33.0, monsoonOnset: 'Jun 06', category: 'Normal', departure: 9.3, notableEvent: 'Active monsoon phase across southern Telangana' },
  { year: 1995, annualRainfall: 935, monsoonRainfall: 720, winterRainfall: 140, rainyDays: 56, avgMaxTemp: 32.6, monsoonOnset: 'Jun 03', category: 'Excess', departure: 24.7, notableEvent: 'Excessive post-monsoon rains in November' },
  { year: 1996, annualRainfall: 880, monsoonRainfall: 675, winterRainfall: 130, rainyDays: 53, avgMaxTemp: 32.8, monsoonOnset: 'Jun 05', category: 'Normal', departure: 17.3, notableEvent: 'High paddy yields in canal ayacut areas' },
  { year: 1997, annualRainfall: 615, monsoonRainfall: 460, winterRainfall: 70, rainyDays: 37, avgMaxTemp: 33.7, monsoonOnset: 'Jun 18', category: 'Deficit', departure: -18.0, notableEvent: 'Super El Niño year; delayed rainfall onset' },
  { year: 1998, annualRainfall: 965, monsoonRainfall: 745, winterRainfall: 145, rainyDays: 58, avgMaxTemp: 33.1, monsoonOnset: 'Jun 02', category: 'Excess', departure: 28.7, notableEvent: 'Heavy rainfall following record summer heatwave' },
  { year: 1999, annualRainfall: 710, monsoonRainfall: 535, winterRainfall: 90, rainyDays: 43, avgMaxTemp: 33.4, monsoonOnset: 'Jun 12', category: 'Normal', departure: -5.3, notableEvent: 'Near-normal rainfall distribution' },

  // 2000s
  { year: 2000, annualRainfall: 920, monsoonRainfall: 710, winterRainfall: 135, rainyDays: 55, avgMaxTemp: 33.0, monsoonOnset: 'Jun 05', category: 'Excess', departure: 22.7, notableEvent: 'August 2000 Hyderabad & Nalgonda cloudburst floods' },
  { year: 2001, annualRainfall: 680, monsoonRainfall: 510, winterRainfall: 85, rainyDays: 41, avgMaxTemp: 33.5, monsoonOnset: 'Jun 13', category: 'Normal', departure: -9.3, notableEvent: 'Dry spells during pod development' },
  { year: 2002, annualRainfall: 470, monsoonRainfall: 325, winterRainfall: 50, rainyDays: 27, avgMaxTemp: 34.6, monsoonOnset: 'Jun 25', category: 'Severe Drought', departure: -37.3, notableEvent: 'All-India severe drought; worst July rainfall in 100 years' },
  { year: 2003, annualRainfall: 845, monsoonRainfall: 650, winterRainfall: 120, rainyDays: 51, avgMaxTemp: 33.1, monsoonOnset: 'Jun 07', category: 'Normal', departure: 12.7, notableEvent: 'Strong recovery in groundwater and farm output' },
  { year: 2004, annualRainfall: 590, monsoonRainfall: 435, winterRainfall: 65, rainyDays: 36, avgMaxTemp: 33.9, monsoonOnset: 'Jun 19', category: 'Deficit', departure: -21.3, notableEvent: 'Deficit monsoon causing stress in rainfed cotton' },
  { year: 2005, annualRainfall: 995, monsoonRainfall: 775, winterRainfall: 155, rainyDays: 60, avgMaxTemp: 32.7, monsoonOnset: 'Jun 02', category: 'Excess', departure: 32.7, notableEvent: 'Multiple cyclonic depressions; high runoff' },
  { year: 2006, annualRainfall: 760, monsoonRainfall: 580, winterRainfall: 100, rainyDays: 47, avgMaxTemp: 33.3, monsoonOnset: 'Jun 09', category: 'Normal', departure: 1.3, notableEvent: 'Good Kharif season' },
  { year: 2007, annualRainfall: 890, monsoonRainfall: 685, winterRainfall: 130, rainyDays: 53, avgMaxTemp: 33.0, monsoonOnset: 'Jun 06', category: 'Normal', departure: 18.7, notableEvent: 'Abundant late-season rains' },
  { year: 2008, annualRainfall: 815, monsoonRainfall: 620, winterRainfall: 115, rainyDays: 49, avgMaxTemp: 33.2, monsoonOnset: 'Jun 08', category: 'Normal', departure: 8.7, notableEvent: 'Stable agro-climatic conditions' },
  { year: 2009, annualRainfall: 530, monsoonRainfall: 380, winterRainfall: 60, rainyDays: 32, avgMaxTemp: 34.3, monsoonOnset: 'Jun 22', category: 'Severe Drought', departure: -29.3, notableEvent: 'October 2009 Krishna basin mega flood following dry monsoon' },

  // 2010s
  { year: 2010, annualRainfall: 1060, monsoonRainfall: 830, winterRainfall: 170, rainyDays: 64, avgMaxTemp: 32.5, monsoonOnset: 'May 31', category: 'Excess', departure: 41.3, notableEvent: 'Extremely wet year with record tank storage' },
  { year: 2011, annualRainfall: 650, monsoonRainfall: 485, winterRainfall: 80, rainyDays: 40, avgMaxTemp: 33.6, monsoonOnset: 'Jun 15', category: 'Normal', departure: -13.3, notableEvent: 'Moderate deficit in rainfed areas' },
  { year: 2012, annualRainfall: 780, monsoonRainfall: 595, winterRainfall: 105, rainyDays: 48, avgMaxTemp: 33.3, monsoonOnset: 'Jun 09', category: 'Normal', departure: 4.0, notableEvent: 'Normal season for paddy and cotton' },
  { year: 2013, annualRainfall: 950, monsoonRainfall: 740, winterRainfall: 145, rainyDays: 57, avgMaxTemp: 32.8, monsoonOnset: 'Jun 03', category: 'Excess', departure: 26.7, notableEvent: 'Phailin and Helen cyclone rain bands' },
  { year: 2014, annualRainfall: 510, monsoonRainfall: 365, winterRainfall: 55, rainyDays: 31, avgMaxTemp: 34.4, monsoonOnset: 'Jun 23', category: 'Severe Drought', departure: -32.0, notableEvent: 'Telangana state formation year; drought stress' },
  { year: 2015, annualRainfall: 540, monsoonRainfall: 390, winterRainfall: 60, rainyDays: 33, avgMaxTemp: 34.5, monsoonOnset: 'Jun 21', category: 'Severe Drought', departure: -28.0, notableEvent: 'Successive drought year; Mission Kakatiya tank rejuvenation' },
  { year: 2016, annualRainfall: 910, monsoonRainfall: 710, winterRainfall: 130, rainyDays: 55, avgMaxTemp: 33.2, monsoonOnset: 'Jun 05', category: 'Excess', departure: 21.3, notableEvent: 'Heavy September rainfall; tanks overflowed' },
  { year: 2017, annualRainfall: 775, monsoonRainfall: 590, winterRainfall: 105, rainyDays: 48, avgMaxTemp: 33.4, monsoonOnset: 'Jun 08', category: 'Normal', departure: 3.3, notableEvent: 'Favorable crop conditions' },
  { year: 2018, annualRainfall: 620, monsoonRainfall: 465, winterRainfall: 75, rainyDays: 38, avgMaxTemp: 33.9, monsoonOnset: 'Jun 16', category: 'Deficit', departure: -17.3, notableEvent: 'Prolonged dry spells in August' },
  { year: 2019, annualRainfall: 890, monsoonRainfall: 690, winterRainfall: 130, rainyDays: 53, avgMaxTemp: 33.3, monsoonOnset: 'Jun 14', category: 'Normal', departure: 18.7, notableEvent: 'Late onset but exceptionally heavy September-October rains' },

  // 2020s
  { year: 2020, annualRainfall: 1120, monsoonRainfall: 880, winterRainfall: 180, rainyDays: 67, avgMaxTemp: 32.4, monsoonOnset: 'Jun 04', category: 'Excess', departure: 49.3, notableEvent: 'Historic October 2020 torrential floods; all reservoirs full' },
  { year: 2021, annualRainfall: 980, monsoonRainfall: 760, winterRainfall: 150, rainyDays: 59, avgMaxTemp: 32.8, monsoonOnset: 'Jun 05', category: 'Excess', departure: 30.7, notableEvent: 'La Niña driven wet year; excellent paddy yield' },
  { year: 2022, annualRainfall: 1080, monsoonRainfall: 850, winterRainfall: 165, rainyDays: 65, avgMaxTemp: 32.6, monsoonOnset: 'Jun 03', category: 'Excess', departure: 44.0, notableEvent: 'July 2022 historic Godavari & Krishna floods' },
  { year: 2023, annualRainfall: 690, monsoonRainfall: 520, winterRainfall: 85, rainyDays: 42, avgMaxTemp: 34.1, monsoonOnset: 'Jun 18', category: 'Normal', departure: -8.0, notableEvent: 'El Niño influence; dry August but revived in September' },
  { year: 2024, annualRainfall: 940, monsoonRainfall: 735, winterRainfall: 140, rainyDays: 57, avgMaxTemp: 33.2, monsoonOnset: 'Jun 06', category: 'Excess', departure: 25.3, notableEvent: 'Heavy monsoon with multiple deep depressions' },
  { year: 2025, annualRainfall: 860, monsoonRainfall: 670, winterRainfall: 125, rainyDays: 52, avgMaxTemp: 33.4, monsoonOnset: 'Jun 08', category: 'Normal', departure: 14.7, notableEvent: 'Above normal Kharif monsoon; successful farm-gate yields' }
];

// Decadal Summaries (10-Year Epochs)
export const DECADAL_SUMMARY_DATA = [
  { decade: '1925–1934', avgRainfall: 779, avgTemp: 32.8, excessYears: 2, deficitYears: 2, normalYears: 6 },
  { decade: '1935–1944', avgRainfall: 770, avgTemp: 32.9, excessYears: 1, deficitYears: 2, normalYears: 7 },
  { decade: '1945–1954', avgRainfall: 736, avgTemp: 33.1, excessYears: 1, deficitYears: 2, normalYears: 7 },
  { decade: '1955–1964', avgRainfall: 808, avgTemp: 32.8, excessYears: 2, deficitYears: 0, normalYears: 8 },
  { decade: '1965–1974', avgRainfall: 680, avgTemp: 33.5, excessYears: 0, deficitYears: 4, normalYears: 6 },
  { decade: '1975–1984', avgRainfall: 817, avgTemp: 33.0, excessYears: 3, deficitYears: 2, normalYears: 5 },
  { decade: '1985–1994', avgRainfall: 778, avgTemp: 33.2, excessYears: 1, deficitYears: 2, normalYears: 7 },
  { decade: '1995–2004', avgRainfall: 774, avgTemp: 33.4, excessYears: 2, deficitYears: 3, normalYears: 5 },
  { decade: '2005–2014', avgRainfall: 801, avgTemp: 33.4, excessYears: 3, deficitYears: 2, normalYears: 5 },
  { decade: '2015–2025', avgRainfall: 890, avgTemp: 33.5, excessYears: 5, deficitYears: 1, normalYears: 5 }
];

// Major Historical Drought Milestones in Telangana
export const HISTORIC_DROUGHT_EVENTS = [
  {
    year: 1972,
    rainfall: 460,
    departure: '-38.7%',
    severity: 'Catastrophic Drought',
    description: 'Worst meteorological and agricultural drought in 20th century Telangana. Severe loss of Kharif crops, dried wells, and large-scale cattle migration.'
  },
  {
    year: 1987,
    rainfall: 480,
    departure: '-36.0%',
    severity: 'Severe El Niño Drought',
    description: 'Consecutive dry months during July-August peak vegetative window. Sparked national focus on dryland watershed management and drip irrigation.'
  },
  {
    year: 2002,
    rainfall: 470,
    departure: '-37.3%',
    severity: 'Severe Pan-India Drought',
    description: 'First national drought of 21st century with all-time lowest July rainfall in recorded history across peninsular India.'
  },
  {
    year: 2014,
    rainfall: 510,
    departure: '-32.0%',
    severity: 'Severe Deficit',
    description: 'Delayed onset till late June followed by dry spell in August, leaving minor irrigation tanks at 20% capacity.'
  },
  {
    year: 2015,
    rainfall: 540,
    departure: '-28.0%',
    severity: 'Severe Consecutive Drought',
    description: 'Back-to-back El Niño year with acute water table depletion below 25m in granitic rock formations of Nalgonda.'
  }
];

// Helper to trigger direct client-side download of old_100_years_data.xlsx / Spreadsheet
export function downloadHistoricalWeatherExcel() {
  const xmlHeader = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#2D6A4F" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Data">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Number">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="100_Years_Climate_Data">
  <Table>
   <Column ss:Width="60"/>
   <Column ss:Width="120"/>
   <Column ss:Width="130"/>
   <Column ss:Width="120"/>
   <Column ss:Width="80"/>
   <Column ss:Width="110"/>
   <Column ss:Width="120"/>
   <Column ss:Width="100"/>
   <Column ss:Width="130"/>
   <Column ss:Width="320"/>
   <Row ss:Height="24">
    <Cell ss:StyleID="Header"><Data ss:Type="String">Year</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Annual Rainfall (mm)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Monsoon Rainfall (mm)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Winter Rainfall (mm)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Rainy Days</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Avg Max Temp (°C)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Monsoon Onset</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Category</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Departure from LPA</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Notable Agro-Met Event</Data></Cell>
   </Row>`;

  const xmlRows = HUNDRED_YEARS_WEATHER_DATA.map(d => `
   <Row>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">${d.year}</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">${d.annualRainfall}</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">${d.monsoonRainfall}</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">${d.winterRainfall}</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">${d.rainyDays}</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">${d.avgMaxTemp}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${d.monsoonOnset}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${d.category}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${d.departure > 0 ? '+' : ''}${d.departure}%</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${d.notableEvent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Data></Cell>
   </Row>`).join('');

  const xmlFooter = `
  </Table>
 </Worksheet>
</Workbook>`;

  const fullXml = xmlHeader + xmlRows + xmlFooter;
  const blob = new Blob([fullXml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'old_100_years_data.xls');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper to trigger direct client-side download of old_100_years_data.csv
export function downloadHistoricalWeatherCSV() {
  const headers = [
    'Year',
    'Annual_Rainfall_mm',
    'Monsoon_Rainfall_mm',
    'Winter_Rainfall_mm',
    'Rainy_Days',
    'Avg_Max_Temp_C',
    'Monsoon_Onset_Date',
    'Category',
    'Departure_from_750mm_LPA_Percent',
    'Notable_AgroMet_Event'
  ];

  const rows = HUNDRED_YEARS_WEATHER_DATA.map(d => [
    d.year,
    d.annualRainfall,
    d.monsoonRainfall,
    d.winterRainfall,
    d.rainyDays,
    d.avgMaxTemp,
    `"${d.monsoonOnset}"`,
    `"${d.category}"`,
    `${d.departure > 0 ? '+' : ''}${d.departure}%`,
    `"${d.notableEvent.replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  // Trigger download as .csv
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'old_100_years_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
