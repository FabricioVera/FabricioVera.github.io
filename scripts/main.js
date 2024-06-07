const requestOptions = {
    method: "GET",
    redirect: "follow"
  };



let imagen = document.querySelector("#imagenes");
/*
imagen.onclick = function () {
    let source = imagen.getAttribute("src");
    if(source==="images/chisato.jpg"){
        imagen.setAttribute("src","images/chisato_esquivandobala.png");
    }else{
        imagen.setAttribute("src","images/chisato.jpg");
    }
};
*/



let miBoton = document.querySelector("pasar");
let miTitulo = document.querySelector("h1");

function estableceNombreUsuario() {
    let miNombre = prompt("Introduzca su nombre.");
    if (miNombre) {
        localStorage.setItem("nombre", miNombre);
        miTitulo.innerHTML = "Sabías que Chisato es muy linda, " + miNombre + "???";
    }
}

if (!localStorage.getItem("nombre")) {
    estableceNombreUsuario();
} else {
    let nombreAlmacenado = localStorage.getItem("nombre");
    miTitulo.textContent = "Sabías que Chisato es muy linda, " + nombreAlmacenado + "?";
}
/*
miBoton.onclick = function () {
    estableceNombreUsuario();
  };
*/



//json url
let url='../jsons/animenames.json'
//funcion obtiene el json de los datos
async function getData(url, heads) {
    url=url.replace(new RegExp(' ', 'g'), '%20');
    console.log(url);
    const response = await fetch(url, heads);
    console.log(response);
    return response.json();
}

let data = await getData(url,requestOptions);
console.log({ data });

// lista de nombres de animes
let animes=data["animenames"];

console.log(animes);

const datalist = document.getElementById('anime-names')
animes.forEach((obj) => {
    const option = document.createElement('option');
    option.value = obj;
    datalist.appendChild(option);
})

 //1. espera a que se presione el boton

const btnpasar=document.querySelector("#pasar");
const maxanime = 1000;
let numeroaleatorio=Math.floor(Math.random() * maxanime);

let randomanimename=String(animes[numeroaleatorio]);


  
url="https://api.jikan.moe/v4/anime?q="+randomanimename

data = await getData(url,requestOptions);
console.log({ data });
let randomanimeid = data["data"][0]["mal_id"];
console.log(randomanimeid);


// 2. guardar el nombre y obtener su anime y la imagen

url="https://api.jikan.moe/v4/anime/"+randomanimeid+"/characters";
data = await getData(url,requestOptions);
console.log({data});
let maxcharacter=Object.keys(data["data"]).length;
numeroaleatorio=Math.floor(Math.random() * maxcharacter);
let randomcharactername=data["data"][numeroaleatorio]["character"]["name"];

let randomcharacterimage=data["data"][numeroaleatorio]["character"]["name"]["images"];
console.log(data["data"][numeroaleatorio]["character"]["images"]["webp"]["image_url"]);

// 3. reemplazar la imagen en el medio
imagen.setAttribute("src",data["data"][numeroaleatorio]["character"]["images"]["webp"]["image_url"]);
// 4. esperar respuesta
