var listaCiudadesIguales = [];
var listaProvinciasCiudades = [];
var listaCoordernadasCiudadesIguales = [];
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
  document.activeElement?.blur();
  form.reset();
}

async function buscar_ciudad(busqueda) {
  let url = 'https://api.openweathermap.org/geo/1.0/direct?q=' + busqueda + ',AR&limit=7&lang=sp&appid=5fab11b8cdf9affc7e1236fe4909ad05'
  fetch(url)
    .then(response => response.json())  
    .then(json => transformarALista(json, busqueda))   
    .catch(err => console.log('Solicitud fallida', err));
}


// async function buscar_clima_por_nombre(busqueda) {
//   let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + busqueda + ',AR&lang=es&appid=5fab11b8cdf9affc7e1236fe4909ad05&units=metric'
//   fetch(url)
//     .then(response => response.json())  
//     .then(json => mostrarDatos(json))   
//     .catch(err => console.log('Solicitud fallida', err));
// }

async function buscar_clima_por_coord(lat, lon, busqueda, prov) {
  let url = 'https://api.openweathermap.org/data/2.5/weather?' + 'lat=' + lat + '&lon=' + lon + '&lang=es&appid=5fab11b8cdf9affc7e1236fe4909ad05&units=metric';
  fetch(url)
    .then(response => response.json())  
    .then(json => mostrarDatos(json, busqueda, prov))   
    .catch(err => console.log('Solicitud fallida', err));
}

function transformarALista(json, busqueda) {
  for (let i = 0; i < json.length; i++) {
    listaCiudadesIguales.push(json[i]);
  }
  let cantidadCiudades = listaCiudadesIguales.length;
  verificarCiudad(cantidadCiudades, busqueda);
}

function verificarCiudad(cantidadCiudades, busqueda) {
  if (cantidadCiudades == 1) {
    document.querySelector("#lista-ciudades").style.display = "none";
    document.querySelector(".contenedor-datos").style.display = "flex";
    buscar_clima_por_coord(listaCiudadesIguales[0]["lat"], listaCiudadesIguales[0]["lon"], busqueda, listaCiudadesIguales[0]["state"]);
  }
  else if (listaCiudadesIguales[0]["state"] == listaCiudadesIguales[1]["state"]) {
    document.querySelector("#lista-ciudades").style.display = "none";
    document.querySelector(".contenedor-datos").style.display = "flex";
    buscar_clima_por_coord(listaCiudadesIguales[0]["lat"], listaCiudadesIguales[0]["lon"], busqueda, listaCiudadesIguales[0]["state"]);
  }
  else {
    guardarCoordenadasYProvincias(cantidadCiudades);
    crearElementosLista(cantidadCiudades, busqueda);
  }
}

function crearElementosLista(cantidadCiudades, busqueda) {
  document.getElementById("map").innerHTML = '';
  document.querySelector("#lista-ciudades").style.display = "flex";
  document.querySelector(".contenedor-datos").style.display = "none";
  let tituloBusqueda = document.getElementById("ciudad");
  tituloBusqueda.innerHTML = "Ciudades";

  for (let i = 0; i < cantidadCiudades; i++) {
    let elementoLista = document.getElementById("lista-ciudades");
    let locacion = listaCiudadesIguales[i]["name"] + ", " + correctProvinceName(listaCiudadesIguales[i]["state"]);
    let botonCiudad = document.createElement("button");
    let textoBoton = document.createTextNode(locacion);
    botonCiudad.classList.add("botones-ciudades");
    let valorId = "boton-" + i;
    botonCiudad.setAttribute("id", valorId);
    botonCiudad.appendChild(textoBoton);
    elementoLista.appendChild(botonCiudad);
  }
  tomarBotonCiudad(busqueda);
}

function guardarCoordenadasYProvincias(cantidadCiudades) {
  for (let i = 0; i < cantidadCiudades; i++) {
    let coord = { "lat": listaCiudadesIguales[i]["lat"], "lon": listaCiudadesIguales[i]["lon"] };
    listaCoordernadasCiudadesIguales.push(coord);
    let province = listaCiudadesIguales[i]["state"];
    listaProvinciasCiudades.push(province);
  }
}

function tomarBotonCiudad(busqueda) {
  let listabotonesCiudades = document.querySelectorAll(".botones-ciudades");

  listabotonesCiudades.forEach(boton => {
    let idBoton = boton.getAttribute("id");
    boton.addEventListener("click", () => comprobarClickBoton(idBoton, busqueda));
  });
}

function comprobarClickBoton(idBoton, busqueda) {
  document.querySelector("#lista-ciudades").style.display = "none";
  let posicionBoton = idBoton.slice("6");
  let pos = parseInt(posicionBoton);

  let lat = listaCoordernadasCiudadesIguales[pos]["lat"];
  let lon = listaCoordernadasCiudadesIguales[pos]["lon"];
  let prov = listaProvinciasCiudades[pos];
  
  document.querySelector(".contenedor-datos").style.display = "flex";
  buscar_clima_por_coord(lat, lon, busqueda, prov);
  
}

function mostrarDatos(json, busqueda, prov) {
  let city = correctCityName(busqueda, prov);

  let time = json["dt"];

  let temp = json["main"]["temp"];
  let feels_like = json["main"]["feels_like"];
  let hum = json["main"]["humidity"];
  let windSpeed = json["wind"]["speed"];
  let cloud = json["clouds"]["all"];

  let latitude = json["coord"]["lat"];
  latitude = latitude.toFixed(2);
  let longitude = json["coord"]["lon"];
  longitude = longitude.toFixed(2);

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

function correctCityName(city, prov){
  let correctCity = city.toString();

  if(correctCity.includes(" ")){
    let aux = correctCity.split(" ");
    let cityPartName1 = aux[0][0].toUpperCase() + aux[0].slice(1);
    let cityPartName2 = aux[1][0].toUpperCase() + aux[1].slice(1);
    correctCity = cityPartName1 + " " + cityPartName2;
  }
  else{
    correctCity = correctCity[0].toUpperCase() + correctCity.slice(1);
  }
  
  correctCity = correctCity + ", " + correctProvinceName(prov);

  return correctCity;
}

function correctProvinceName(prov){
  let correctProvince = "";
  let provinceName = prov.split(" Province");
  
  correctProvince = provinceName[0]

  return correctProvince;
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
  document.querySelector("footer").style.display = "flex";
  document.querySelector(".loader").style.opacity = 0;
  document.querySelector(".loader").style.pointerEvents = "none";
})

function resetCiudades() {

  var listItem = document.getElementById("lista-ciudades");

  while (listItem.firstChild) {
    listItem.removeChild(listItem.firstChild);
  }

  listaCiudadesIguales = [];
  listaCoordernadasCiudadesIguales = [];
  listaProvinciasCiudades = [];
}
