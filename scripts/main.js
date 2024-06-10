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

/*

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
 document.getElementById("pasar").onclick = async function ObtenerPersonajeAleatorio(){
    const maxanime = 1000;
    let data;
    let randomanimeid;
    let numeroaleatorio;
    let randomanimename;
    let randomcharacterimage;
    let randomcharactername;
    const re = new RegExp("questionmark");
    do{
        do{
            numeroaleatorio=Math.floor(Math.random() * maxanime);

            randomanimename=String(animes[numeroaleatorio]);
            url="https://api.jikan.moe/v4/anime?q="+randomanimename;

            data = await getData(url,requestOptions);
            console.log({ data });
            randomanimeid = data["data"][0]["mal_id"];
            console.log(randomanimeid);
            // 2. guardar el nombre y obtener su anime y la imagen

            url="https://api.jikan.moe/v4/anime/"+randomanimeid+"/characters";
            data = await getData(url,requestOptions);
            console.log({data});
            
            setTimeout(() => {
                console.log("0.5 Segundo esperado")
            }, 1000);
        }while (Object.keys(data['data']).length===0);
        let maxcharacter=Object.keys(data["data"]).length -1;
        
        numeroaleatorio=Math.floor(Math.random() * maxcharacter);
        randomcharactername=data["data"][numeroaleatorio]["character"]["name"];

        randomcharacterimage=data["data"][numeroaleatorio]["character"]["images"];
        
        console.log(numeroaleatorio);
        console.log(randomcharacterimage["webp"]["image_url"]);
        setTimeout(() => {
            console.log("0.5 Segundo esperado :imagen");
        }, 1000);
    }while ((re.exec(randomcharacterimage["webp"]["image_url"])) !== null);


    // 3. reemplazar la imagen en el medio
    imagen.setAttribute("src",data["data"][numeroaleatorio]["character"]["images"]["webp"]["image_url"]);
    // 4. esperar respuesta
}



/*
const btnpasar = document.getElementById("pasar");
btnpasar.addEventListener("click", await ObtenerPersonajeAleatorio);

*/