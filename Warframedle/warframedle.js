let warframes = [];
let warframeDelDia = null;

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("guessInput");
const list = document.getElementById("autocompleteList");

input.addEventListener("input", () => {
  const query = input.value.toLowerCase();
  list.innerHTML = "";
  if (!query) return;

    const matches = warframes.filter(w => w.name.toLowerCase().includes(query)).slice(0, 10);
    matches.forEach(w => {
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

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#guessInput") && !e.target.closest("#autocompleteList")) {
      list.innerHTML = "";
    }
  });

  const res = await fetch("data/warframes.json");
  warframes = await res.json();

  // Warframe del día según la fecha
  const today = new Date().toISOString().slice(0, 10);
  const seed = today.replaceAll("-", "");
  const index = parseInt(seed) % warframes.length;
  warframeDelDia = warframes[index];

  // Autocompletado
  const datalist = document.getElementById("warframeList");
  warframes.forEach(w => {
    const option = document.createElement("option");
    option.value = w.name;
    datalist.appendChild(option);
  });

  // Eventos
  document.getElementById("submitGuess").addEventListener("click", handleGuess);
  document.getElementById("guessInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleGuess();
  });
});

function handleGuess() {
  const input = document.getElementById("guessInput").value.trim().toLowerCase();
  const guessed = warframes.find(w => w.name.toLowerCase() === input);

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
  addCell(row, guessed.name, guessed.name === warframeDelDia.name);
  addCell(row, guessed.sex, guessed.sex === warframeDelDia.sex);
  addCell(row, guessed.isPrime ? "Sí" : "No", guessed.isPrime === warframeDelDia.isPrime);
  addCell(row, guessed.aura, guessed.aura === warframeDelDia.aura);
  addCell(row, guessed.releaseDate, guessed.releaseDate === warframeDelDia.releaseDate);

  document.getElementById("resultsBody").appendChild(row);
  document.getElementById("resultsTable").classList.remove("hidden");

  document.getElementById("guessInput").value = ""; // limpiar input
}

function addCell(row, value, isCorrect) {
  const cell = document.createElement("td");
  cell.textContent = value;
  cell.classList.add(isCorrect ? "correct" : "incorrect");
  row.appendChild(cell);
}
