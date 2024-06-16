// utils/fetchWeather.ts
export async function fetchWeather(city: string) {
    const apiKey = 'ad47c109e79c91844edaf602af5ec00f';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&cnt=56`;
  
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
  
    const data = await response.json();
    return data;
  }
  