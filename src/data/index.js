// ============================================================
// CLIC Master Data Central Registry
// Grouped into clean domain-specific modules:
// - crops: Pests, diseases, categories, crops list, prescriptions
// - machinery: Farm machines, CHC equipment, FMC dealer inventories, orders
// - livestock: Animals, diseases, veterinary products, livestock shops
// - fisheries: Aquaculture species, fish diseases, pond treatments
// - inputs: Agri-input products, retail stores
// - weather: Weather forecasts, groundwater levels, historical data
// - master: Reference tables, dropdowns, APMC market data, govt schemes
// ============================================================

export * as CropsData from './crops';
export * as MachineryData from './machinery';
export * as LivestockData from './livestock';
export * as FisheriesData from './fisheries';
export * as InputsData from './inputs';
export * as WeatherData from './weather';
export * as MasterData from './master';

// Also re-export all for direct named imports:
export * from './crops';
export * from './machinery';
export * from './livestock';
export * from './fisheries';
export * from './inputs';
export * from './weather';
export * from './master';
