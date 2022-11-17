var listaCiudadesIguales = [];

var form = document.getElementById("search-form");
form.addEventListener("submit", onSubmit, true);

function onSubmit(event) {
  event.preventDefault();
  var busqueda = document.getElementById("search-box");
  main(busqueda.value);
  resetCiudades();
}

function main(busqueda) {
  buscar_ciudad(busqueda);
  // verificarCiudad();
  document.activeElement?.blur();
  form.reset();
}

async function buscar_ciudad(busqueda) {
  let url = 'http://api.openweathermap.org/geo/1.0/direct?q=' + busqueda + ',AR&limit=7&lang=sp&appid=5fab11b8cdf9affc7e1236fe4909ad05'
  fetch(url)
    // Exito
    .then(response => response.json())  // convertir a json
    .then(json => transformarALista(json))    //imprimir los datos en la consola
    .catch(err => console.log('Solicitud fallida', err));
}

/*
async function buscar_clima(busqueda) {
  let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + busqueda + ',AR&lang=es&appid=5fab11b8cdf9affc7e1236fe4909ad05&units=metric'
  fetch(url)
    // Exito
    .then(response => response.json())  // convertir a json
    .then(json => mostrarDatos(json))    //imprimir los datos en la consola
    .catch(err => console.log('Solicitud fallida', err));
}
*/

function transformarALista(json) {
  for (let i = 0; i < json.length; i++) {
    listaCiudadesIguales.push(json[i]);
  }
  // console.log("NUEVA CIUDAD");
  // for(let i=0; i<listaCiudadesIguales.length; i++){
  //   console.log(listaCiudadesIguales[i]);
  // }
  // console.log(listaCiudadesIguales.length);

  let cantidadCiudades = listaCiudadesIguales.length;
  crearElementosLista(cantidadCiudades);
  //crearElementosLista(ciudadesIguales);
}
/*
function verificarCiudad() {
  // if(listaCiudadesIguales.length == 1){
  //   document.querySelector(".contenedor-datos").style.display = "flex";
  //   buscar_clima(listaCiudadesIguales[0]["name"]);
  // }
  // else if(listaCiudadesIguales[0]["state"] == listaCiudadesIguales[1]["state"]){
  //   document.querySelector(".contenedor-datos").style.display = "flex";
  //   buscar_clima(listaCiudadesIguales[0]["name"]);
  // }
  // else{
    crearElementosLista();
  //}
}*/

function crearElementosLista(cantidadCiudades) {
  // console.log("ENTRE A ELEMENTOSLISTA");
  // console.log("LARGO CIUDADES: ");
  // console.log(cantidadCiudades);
  for (let i=0; i<cantidadCiudades; i++) {
    let elementoLista = document.getElementById("lista-ciudades");
    // console.log("ENTRE AL FOR");
    let locacion = listaCiudadesIguales[i]["name"] + ", " + listaCiudadesIguales[i]["state"];
    let li = document.createElement("li");
    let liText = document.createTextNode(locacion);
    li.appendChild(liText);
    elementoLista.appendChild(li);
  }

}


function mostrarDatos(json) {
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

function getDatetime(dt) {
  let date = new Date(dt * 1000);

  let datetime = (correctDatetime(date.getDate()) +
    "/" + (correctDatetime(date.getMonth() + 1)) +
    "/" + correctDatetime(date.getFullYear()) +
    " " + correctDatetime(date.getHours()) +
    ":" + correctDatetime(date.getMinutes()) +
    ":" + correctDatetime(date.getSeconds()));

  return datetime;
}

function correctDatetime(number) {
  if (number < 10) {
    let stringDate = '0' + number.toString();
    return stringDate;
  }
  else {
    return number;
  }
}

window.addEventListener("load", () => {
  document.querySelector("body").classList.remove("cuerpo");
  document.querySelector("footer").style.display = "block";
  document.querySelector(".loader").style.opacity = 0;
  document.querySelector(".loader").style.pointerEvents = "none";
})

function resetCiudades() {

  var elementoLista = document.getElementById("lista-ciudades");

  while (elementoLista.firstChild) {
      elementoLista.removeChild(elementoLista.firstChild);
  }
  
  listaCiudadesIguales = [];
}
