export const validCities = [
  // North America
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Mississauga", "Winnipeg",
  "Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez",

  // Europe
  "London", "Berlin", "Paris", "Madrid", "Rome", "Barcelona", "Amsterdam", "Munich", "Milan", "Prague",
  "Vienna", "Brussels", "Copenhagen", "Stockholm", "Oslo", "Helsinki", "Dublin", "Lisbon", "Athens", "Warsaw",
  "Budapest", "Bucharest", "Sofia", "Belgrade", "Zagreb", "Bratislava", "Ljubljana", "Tallinn", "Riga", "Vilnius",

  // Asia
  "Tokyo", "Delhi", "Shanghai", "Mumbai", "Beijing", "Osaka", "Karachi", "Dhaka", "Manila", "Seoul",
  "Jakarta", "Bangkok", "Hong Kong", "Singapore", "Kuala Lumpur", "Taipei", "Bangalore", "Chennai", "Hyderabad", "Kolkata",
  "Shenzhen", "Guangzhou", "Chengdu", "Chongqing", "Tianjin", "Wuhan", "Hangzhou", "Xi'an", "Nanjing", "Dubai",
  "Riyadh", "Istanbul", "Tehran", "Baghdad", "Jeddah", "Doha", "Abu Dhabi", "Kuwait City", "Muscat",

  // Africa
  "Cairo", "Lagos", "Kinshasa", "Johannesburg", "Nairobi", "Casablanca", "Cape Town", "Accra", "Addis Ababa", "Dar es Salaam",
  "Algiers", "Khartoum", "Abidjan", "Dakar", "Tunis", "Luanda", "Douala", "Kampala", "Bamako", "Lusaka",

  // South America
  "São Paulo", "Rio de Janeiro", "Buenos Aires", "Lima", "Bogotá", "Santiago", "Caracas", "Belo Horizonte", "Guayaquil", "Medellín",
  "Quito", "Fortaleza", "Recife", "Salvador", "Montevideo", "Asunción", "Córdoba", "Rosario", "Valparaíso", "Manaus",

  // Oceania
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Auckland", "Wellington", "Christchurch", "Gold Coast", "Canberra",
  "Hobart", "Darwin", "Suva", "Port Moresby", "Nouméa", "Honolulu"
].toSorted();

// Function to check if a city is valid (case-insensitive)
export function isValidCity(cityName: string): boolean {
  return validCities.some(city => 
    city.toLowerCase() === cityName.trim().toLowerCase()
  );
}