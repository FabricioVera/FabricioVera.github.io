let warframes = [];
let warframeDelDia = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Cargar JSON de warframes
  const res = await fetch("data/warframes.json");
  warframes = await res.json();

  // Elegir el Warframe del día de forma determinista según la fecha
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const seed = today.split("-").join(""); // "20250509"
  const index = parseInt(seed) % warframes.length;
  warframeDelDia = warframes[index];

  document.getElementById("submitGuess").addEventListener("click", handleGuess);
});

function handleGuess() {
  const input = document.getElementById("guessInput").value.trim().toLowerCase();
  const guessed = warframes.find(w => w.name.toLowerCase() === input);

  if (!guessed) {
    alert("Ese Warframe no existe en la lista.");
    return;
  }

  const row = document.createElement("tr");
  addCell(row, guessed.name, guessed.name === warframeDelDia.name);
  addCell(row, guessed.sex, guessed.sex === warframeDelDia.sex);
  addCell(row, guessed.isPrime ? "Sí" : "No", guessed.isPrime === warframeDelDia.isPrime);
  addCell(row, guessed.aura, guessed.aura === warframeDelDia.aura);
  addCell(row, guessed.releaseDate, guessed.releaseDate === warframeDelDia.releaseDate);

  document.getElementById("resultsBody").appendChild(row);
  document.getElementById("resultsTable").classList.remove("hidden");
}

function addCell(row, value, isCorrect) {
  const cell = document.createElement("td");
  cell.textContent = value;
  cell.classList.add(isCorrect ? "correct" : "incorrect");
  row.appendChild(cell);
}
