let imagen = document.querySelector("img");
imagen.onclick = function () {
    let source = imagen.getAttribute("src");
    if(source==="images/chisato.jpg"){
        imagen.setAttribute("src","images/chisato_esquivandobala.png");
    }else{
        imagen.setAttribute("src","images/chisato.jpg");
    }
};

let miBoton = document.querySelector("button");
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
  
  