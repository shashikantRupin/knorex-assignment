// JSX
import React, { useState, useEffect } from 'react';
import { WiDaySunny, WiDayCloudy, WiCloudy } from 'react-icons/wi';
import './WeatherInformation.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WeatherInformation = () => {
    const [cityName, setCityName] = useState('Singapore');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiKey = 'e29a9aa1c5adc08b5f5d73f9d4af2362';

    useEffect(() => {
        setLoading(true);

        const fetchWeatherData = async () => {
            try {
                const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
                const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
                 

                if (!weatherResponse.ok || !forecastResponse.ok) {
                  throw new Error("Network response was not ok");
                }

                const weatherData = await weatherResponse.json();
                const forecastData = await forecastResponse.json();

                setWeatherData(weatherData);
                setForecastData(forecastData);
                setLoading(false);
            } catch (error) {
                toast.error('Please Select a City');
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [cityName]);

    const handleCityChange = (e) => {
        setCityName(e.target.value);
    };

    const getCurrentDateWeather = () => {
        if (!forecastData) return null;

        const currentDate = new Date();
        const todayDate = currentDate.toISOString().split('T')[0];
        const todayWeather = forecastData.list.find(item => item.dt_txt.includes(todayDate));

        return todayWeather;
    };

    const getNextThreeDaysForecast = () => {
      if (!forecastData) return [];

      const currentDate = new Date();
      const todayDate = currentDate.toISOString().split("T")[0];

      const nextThreeDaysForecast = forecastData.list.filter((item, index) => {
        const itemDate = item.dt_txt.split(" ")[0];
        return index % 8 === 0 && itemDate !== todayDate && index <= 24; 
      });

      return nextThreeDaysForecast;
    };




    const getWeatherIcon = (weather) => {
        if (!weather) return null;

        const iconId = weather[0].icon;

        switch (iconId) {
            case '01d':
                return <WiDaySunny color="#FF5733" />;
            case '01n':
                return <WiDaySunny color="#FF5733" />;
            case '02d':
                return <WiDayCloudy color="#FF5733" />;
            case '02n':
                return <WiDayCloudy color="#FF5733" />;
            default:
                return <WiCloudy color="#FF5733" />;
        }
    };

    return (
        <div className="weather-app">
            <h1>Weather App</h1>
            <div className="select-container">
                <select onChange={handleCityChange} value={cityName}>
                    <option value="">Select a city</option>
                    <option value="Ho Chi Minh">Ho Chi Minh</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                    <option value="Tokyo">Tokyo</option>
                    <option value="Athens">Athens</option>
                </select>
            </div>
            <ToastContainer />
            {loading && <div className="loading-indicator"></div>}
            <div className="weather-container">
                <div className="weather-cards">
                    <div className="current-weather">
                        <h2 className="weather-heading">Today's Weather</h2>
                        {getCurrentDateWeather() && (
                            <div className="weather-card">
                                <div className="weather-icon">
                                    {getWeatherIcon(getCurrentDateWeather().weather)}
                                </div>
                                <div className="weather-details">
                                    <p className="weather-date">Date: {getCurrentDateWeather().dt_txt}</p>
                                    <p className="weather-temperature">Temperature: {getCurrentDateWeather().main.temp} °C</p>
                                    <p className="weather-description">Description: {getCurrentDateWeather().weather[0].description}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="forecast">
                        <h2 className="weather-heading">Next Three Days Forecast</h2>
                        <div className="forecast-cards">
                            {getNextThreeDaysForecast().map((forecast, index) => (
                                <div key={index} className="weather-card">
                                    <div className="weather-icon">
                                        {getWeatherIcon(forecast.weather)}
                                    </div>
                                    <div className="weather-details">
                                        <p className="weather-date">Date: {forecast.dt_txt.split(" ")[0]}</p>
                                        <p className="weather-temperature">Temperature: {forecast.main.temp} °C</p>
                                        <p className="weather-description">Description: {forecast.weather[0].description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherInformation;
