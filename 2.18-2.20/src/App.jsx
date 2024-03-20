import React, { useState, useEffect } from 'react';

const App = () => {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [countryDetails, setCountryDetails] = useState(null);
  const [weather, setWeather] = useState(null);
  const apikey = '5565d934da691ae45108192ce7e750c3';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://studies.cs.helsinki.fi/restcountries/api/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const filteredCountries = data.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()))
        setCountries(filteredCountries);
        if (filteredCountries.length === 1) {
          const [matchedCountry] = filteredCountries;
          const fullName = matchedCountry.name.common;
          console.log(fullName)
          const countryDetailsResponse = await fetchCountryDetails(fullName).json();
          setCountryDetails(countryDetailsResponse);
          console.log(countryDetails)
          const weatherData = await fetchWeather(countryDetails.name.common).json();
          setWeather(weatherData)
          console.log(weather)

        } else {
          setCountryDetails(null);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (query.length >= 1) {
      fetchData();
    } else {
      setCountries([]);
      setCountryDetails(null);
    }
  }, [query]);

  const fetchCountryDetails = async (fullName) => {
    try {
      const response = await fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${fullName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch country details');
      }
      const data = await response.json();
      setCountryDetails(data);
      console.log(data)
      const weatherData = await fetchWeather(data.name.common).json();
      setWeather(weatherData)
      console.log(weather)
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      console.log(data)
      setWeather(data);
      console.log(weather)
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <p>Search Countries</p>
      <input type="text" value={query} onChange={handleChange} />
      <div>
        {countries.length > 10 && <p>Too many matches, specify another filter.</p>}
      </div>
      <ul>
        {countries.length <= 10 && countries.length > 1 && countries.map((country, index) => (
          <li key={index}  >{country.name.common}
            <button onClick={() => fetchCountryDetails(country.name.common)}> show </button>
          </li>

        ))}
      </ul>
      <div>
        {countryDetails && (
          <div>
            <h2>{countryDetails.name.common}</h2>
            <p>Capital: {countryDetails.capital}</p>
            <p>Area: {countryDetails.area} km²</p>
            <p>Languages: {Object.values(countryDetails.languages).join(', ')}</p>
            <img src={countryDetails.flags.png} alt={`${countryDetails.name.common} flag`} />
            <h3>Weather in {countryDetails.capital}</h3>
            <p>temperature: {weather.main.temp} Celcius</p>
            <p>wind: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;


