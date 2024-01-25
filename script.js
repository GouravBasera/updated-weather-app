const apiKey = '8c79088745dfe4b1b08ddcb9351e779b'
const weatherDataEl = document.getElementById('weather-data')
const cityInputEl = document.getElementById('city-input')
const formEl = document.querySelector('form')
const locateMeBtn = document.getElementById('locateMe')

formEl.addEventListener('submit', (event)=>{
    event.preventDefault()
    const cityValue = cityInputEl.value;
    getWeatherData(cityValue)
});

locateMeBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    navigator.geolocation.getCurrentPosition((position)=>{
        if(position.coords){
        const latitude =  position.coords.latitude
        const longitude = position.coords.longitude
        geoCodetoLoc(latitude, longitude)
    } else {throw new Error('Error Getting user location' , error)}
    })
})

function geoCodetoLoc(lat, lon){
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    fetch(url).then(response=> response.json()).then((data)=>{
        getWeatherData(data[0].name)
    })
}

async function getWeatherData(cityValue){
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`)
        if(!response.ok){
            throw new Error("Network resoponse was not okay")
        }

        const data = await response.json()

        const temperature = Math.round(data.main.temp)
        const description = data.weather[0].description
        const icon = data.weather[0].icon
        const details = [
            `Feels like: ${Math.round(data.main.feels_like)}`,
            `Humidity: ${data.main.humidity}%`,
            `Wind Speed: ${data.wind.speed}m/s`,
        ];

        weatherDataEl.querySelector(".icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png">`
        weatherDataEl.querySelector(".temprature").textContent = `${temperature} °C`
        weatherDataEl.querySelector('.description').textContent = `${description}`
        weatherDataEl.querySelector(".add-info").innerHTML = details.map((detail)=>`<div>${detail}</div>`).join('')
    } catch (error) {
        weatherDataEl.querySelector(".icon").innerHTML = ''
        weatherDataEl.querySelector(".temprature").textContent = ''
        weatherDataEl.querySelector('.description').textContent = 'An Error Occured, Please try again'
        weatherDataEl.querySelector(".add-info").innerHTML = ''
    }
}