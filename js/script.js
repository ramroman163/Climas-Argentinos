var form = document.getElementById("search-form");
form.addEventListener("submit", onSubmit, true);

function onSubmit(event) {
  event.preventDefault();
  var search = document.getElementById("search-box");
  buscar_ciudad(search.value);
  form.reset();
}

async function buscar_ciudad(search) {
  let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + search + ',AR&lang=sp&appid=5fab11b8cdf9affc7e1236fe4909ad05&units=metric'
  fetch(url)
    // Exito
    .then(response => response.json())  // convertir a json
    .then(json => mostrar_datos_pantalla(json))    //imprimir los datos en la consola
    .catch(err => console.log('Solicitud fallida', err));
}


function mostrar_datos_pantalla(json) {
  let city = json["name"];

  let time = json["dt"];

  let temp = json["main"]["temp"];
  let feels_like = json["main"]["feels_like"];
  let hum = json["main"]["humidity"];
  let windSpeed = json["wind"]["speed"];
  let cloud = json["clouds"]["all"];

  let latitude = json["coord"]["lat"];
  let longitude = json["coord"]["lon"];

  let desc = json["weather"][0]["description"];
  let description = desc[0].toUpperCase() + desc.slice(1);

  let tituloCiudad = document.getElementById("ciudad");
  tituloCiudad.innerHTML = city;

  let spanTemperatura = document.getElementById("temperatura");
  spanTemperatura.innerHTML = temp;

  let spanSensacion = document.getElementById("sensaciont");
  spanSensacion.innerHTML = feels_like;

  let spanHumedad = document.getElementById("humedad");
  spanHumedad.innerHTML = hum;

  let spanNubes = document.getElementById("nubes");
  spanNubes.innerHTML = cloud;

  let spanVelocidadViento = document.getElementById("velocidad-viento");
  spanVelocidadViento.innerHTML = windSpeed;

  let spanDescripcion = document.getElementById("descripcion-clima");
  spanDescripcion.innerHTML = description;

  let spanLatitud = document.getElementById("latitud");
  spanLatitud.innerHTML = latitude;

  let spanLongitud = document.getElementById("longitud");
  spanLongitud.innerHTML = longitude;

  let spanFecha = document.getElementById("fecha");
  spanFecha.innerHTML = getDatetime(time);

  let mapa = document.getElementById("map");
  mapa.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13131.311590395051!2d' + longitude + '!3d' + latitude + '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1667420484794!5m2!1ses-419!2sar" id="mapaIframe" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

}

function getDatetime(dt){
  let date = new Date(dt*1000);


  let datetime = (correctDatetime(date.getDate())+
          "/"+(correctDatetime(date.getMonth()+1))+
          "/"+correctDatetime(date.getFullYear())+
          " "+correctDatetime(date.getHours())+
          ":"+correctDatetime(date.getMinutes())+
          ":"+correctDatetime(date.getSeconds()));

  return datetime;
}

function correctDatetime(number){
  if (number < 10){
    let stringDate = '0' + number.toString();
    return stringDate;
  }
  else{
    return number;
  }
}
