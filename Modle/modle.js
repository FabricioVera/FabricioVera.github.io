let mods = [];
let modDelDia = null;

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("guessInput");
  const list = document.getElementById("autocompleteList");
  const submitBtn = document.getElementById("submitGuess");
  const tableBody = document.getElementById("resultsBody");
  const table = document.getElementById("resultsTable");

  let selectedIndex = -1;

  // Cargar datos
  const res = await fetch("data/mods_con_tags.json");
  mods = await res.json();
  modDelDia = mods[getModDelDiaIndex()];


  // Autocompletado personalizado
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    list.innerHTML = "";
    selectedIndex = -1;
    if (!query) return;

    const matches = mods.filter(m => m.name.toLowerCase().includes(query)).slice(0, 10);
    matches.forEach((m, i) => {
      const item = document.createElement("div");
      item.classList.add("autocomplete-item");
      item.innerHTML = `<img src="${m.wikiaThumbnail}" alt="${m.name}"/><span>${m.name}</span>`;
      item.addEventListener("click", () => {
        input.value = m.name;
        list.innerHTML = "";
        handleGuess();
      });
      list.appendChild(item);
    });
  });

  // Navegación con teclado
  input.addEventListener("keydown", (e) => {
    const items = list.querySelectorAll(".autocomplete-item");
    if (!items.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection(items);
        break;
      case "ArrowUp":
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection(items);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          items[selectedIndex].click();
        } else {
          handleGuess();
        }
        list.innerHTML = "";
        break;
      case "Escape":
        list.innerHTML = "";
        selectedIndex = -1;
        break;
    }
  });

  function updateSelection(items) {
    items.forEach((item, i) => {
      item.style.backgroundColor = (i === selectedIndex) ? "#444" : "transparent";
    });

    if (selectedIndex >= 0 && items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: "nearest" });
    }
  }

  // Cerrar autocompletado si se hace clic fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#guessInput") && !e.target.closest("#autocompleteList")) {
      list.innerHTML = "";
    }
  });

  // Envío con botón o enter
  submitBtn.addEventListener("click", handleGuess);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleGuess();
  });

  function handleGuess() {
    const guess = input.value.trim().toLowerCase();
    const guessed = mods.find(w => w.name.toLowerCase() === guess);

    if (!guessed) {
      alert("Ese mod no existe en la lista.");
      return;
    }

    const row = document.createElement("tr");

    // Imagen
    const imgCell = document.createElement("td");
    const img = document.createElement("img");
    img.src = guessed.wikiaThumbnail;
    img.alt = guessed.name;
    img.style.width = "64px";
    img.style.height = "64px";
    img.style.objectFit = "cover";
    imgCell.appendChild(img);
    row.appendChild(imgCell);

    // Comparaciones
    const delay = 100;
    addCell(row, guessed.name, guessed.name === modDelDia.name, delay * 0);
    addCell(row, guessed.sex, guessed.sex === modDelDia.sex, delay * 1);
    addCell(row, guessed.isPrime ? "Sí" : "No", guessed.isPrime === modDelDia.isPrime, delay * 2);
    addCell(row, guessed.aura, guessed.aura === modDelDia.aura, delay * 3);
    addCell(row, guessed.releaseDate, guessed.releaseDate === modDelDia.releaseDate, delay * 4);


    tableBody.insertBefore(row, tableBody.firstChild);
    table.classList.remove("hidden");

    input.value = ""; // limpiar input

    // Deshabilitar si adivinó
    if (guessed.name === modDelDia.name) {
      input.disabled = true;
      submitBtn.disabled = true;
    }
  }

  function addCell(row, value, isCorrect, delayMs = 0) {
    const cell = document.createElement("td");
    cell.textContent = value;
    cell.classList.add(isCorrect ? "correct" : "incorrect");
    cell.style.opacity = "0";
    cell.style.transition = "opacity 0.3s ease";
    row.appendChild(cell);

    setTimeout(() => {
      cell.style.opacity = "1";
    }, delayMs);
  }


  function getModDelDiaIndex() {
    const today = new Date().toISOString().slice(0, 10);
    const seed = today.replaceAll("-", "");
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
    }
    return hash % mods.length;
  }
});
