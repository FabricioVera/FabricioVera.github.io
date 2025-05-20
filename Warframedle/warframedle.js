let warframes = [];
let warframeDelDia = null;

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("guessInput");
  const list = document.getElementById("autocompleteList");
  const submitBtn = document.getElementById("submitGuess");
  const tableBody = document.getElementById("resultsBody");
  const table = document.getElementById("resultsTable");

  let selectedIndex = -1;

  // Cargar datos
  const res = await fetch("data/warframes.json");
  warframes = await res.json();
  warframeDelDia = warframes[getWarframeDelDiaIndex()];


  // Autocompletado personalizado
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    list.innerHTML = "";
    selectedIndex = -1;
    if (!query) return;

    const matches = warframes.filter(w => w.name.toLowerCase().includes(query)).slice(0, 10);
    matches.forEach((w, i) => {
      const item = document.createElement("div");
      item.classList.add("autocomplete-item");
      item.innerHTML = `<img src="${w.wikiaThumbnail}" alt="${w.name}"/><span>${w.name}</span>`;
      item.addEventListener("click", () => {
        input.value = w.name;
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
    const guessed = warframes.find(w => w.name.toLowerCase() === guess);

    if (!guessed) {
      alert("Ese Warframe no existe en la lista.");
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
    addCell(row, guessed.name, guessed.name === warframeDelDia.name, delay * 0);
    addCell(row, guessed.sex, guessed.sex === warframeDelDia.sex, delay * 1);
    addCell(row, guessed.isPrime ? "Sí" : "No", guessed.isPrime === warframeDelDia.isPrime, delay * 2);
    addCell(row, guessed.aura, guessed.aura === warframeDelDia.aura, delay * 3);

    const guessedYear = parseInt(guessed.releaseYear);
    const correctYear = parseInt(warframeDelDia.releaseYear);
    console.log("anio guess: "+guessedYear);
    console.log(correctYear);
    let yearFeedback = guessedYear;

    if (guessedYear > correctYear) {
      yearFeedback += " 🔽";
    } else if (guessedYear < correctYear) {
      yearFeedback += " 🔼";
    } else {
      yearFeedback += " ✅";
    }

    addCell(row, yearFeedback, guessedYear === correctYear, delay * 4);





    tableBody.insertBefore(row, tableBody.firstChild);
    table.classList.remove("hidden");

    input.value = ""; // limpiar input

    // Deshabilitar si adivinó
    if (guessed.name === warframeDelDia.name) {
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


  function getWarframeDelDiaIndex() {
    const today = new Date().toISOString().slice(0, 10);
    const seed = today.replaceAll("-", "");
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
    }
    return hash % warframes.length;
  }
});
