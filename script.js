// Landing page button functionality
document.getElementById("play-button").addEventListener("click", () => {
  const landingPage = document.getElementById("landing-page");
  const gamePage = document.getElementById("game-page");

  if (landingPage && gamePage) {
    landingPage.style.display = "none"; // Hide the landing page
    gamePage.style.display = "block"; // Show the game page
  } else {
    console.error("Missing elements: Check your HTML structure.");
  }
});
const words = [
  "absorb", "accept", "across", "acting", "animal", "artist", "attack", "author",
  "beauty", "better", "bottle", "budget", "camera", "cancer", "castle", "casual",
  "chance", "church", "circle", "client", "coffee", "couple", "damage", "danger",
  "decide", "demand", "device", "differ", "escape", "estate", "expand", "export",
  "fabric", "family", "farmer", "figure", "finger", "forest", "format", "friend",
  "garden", "gather", "gender", "golden", "gospel", "growth", "guitar", "handle",
  "health", "island", "junior", "laptop", "leader", "little", "manual", "mother",
  "motion", "nature", "office", "orange", "parent", "people", "police", "powder",
  "random", "remove", "repair", "reward", "rocket", "ruler", "secret", "server",
  "shadow", "simple", "silver", "social", "socket", "stable", "status", "string",
  "summer", "supply", "switch", "system", "travel", "tunnel", "turtle", "velvet",
  "volume", "weekly", "window", "yellow", "zipper"
];

const targetWord = words[Math.floor(Math.random() * words.length)];
let attempts = 6;
let currentRowIndex = attempts - 1; // Start at the top row (index 5)

// Initialize the game board
const gameBoard = document.getElementById("game-board");
for (let i = 0; i < attempts; i++) {
  const row = document.createElement("div");
  row.className = "guess-row";
  row.dataset.rowIndex = (attempts - 1 - i).toString(); // Reverse row indexing for top-to-bottom logic

  for (let j = 0; j < 6; j++) {
    const cell = document.createElement("input");
    cell.className = "guess-cell";
    cell.style.border = "1px solid #444444"; // Subtle border for dark theme
    cell.style.width = "2em";
    cell.style.height = "2em";
    cell.style.margin = "0.2em";
    cell.style.textAlign = "center";
    cell.style.lineHeight = "2em";
    cell.style.backgroundColor = "#ffffff"; // Background color
    cell.style.color = "#3f3f3f"; // Text color for visibility
    cell.maxLength = 1; // Limit input to one character
    cell.disabled = (i !== 0); // Only the top row is enabled initially
    row.appendChild(cell);
  }

  gameBoard.appendChild(row); // Append rows top-down logically
}

// Define QWERTY rows and add DLT and SUB keys to the bottom row
// Generate the keyboard using your qwertyRows setting
const qwertyRows = [
  "qwertyuiop",  // Row 1
  "asdfghjkl",   // Row 2
  ["DLT", "z", "x", "c", "v", "b", "n", "m", "SUB"] // Row 3 with DLT and SUB keys
];

const keyboard = document.getElementById("keyboard");

qwertyRows.forEach(row => {
  const rowDiv = document.createElement("div");
  rowDiv.style.display = "flex";
  rowDiv.style.justifyContent = "center";

  // Convert row to array if it's a string
  const keys = typeof row === "string" ? row.split("") : row;

  keys.forEach(letter => {
    const key = document.createElement("div");
    key.className = "key";

    // Handle special keys
    if (letter === "DLT") {
      key.innerText = "DLT";
      key.dataset.action = "delete";
      key.classList.add("key-special");  // Add special class to emphasize
      key.addEventListener("click", handleBackspace);
    } else if (letter === "SUB") {
      key.innerText = "SUB";
      key.dataset.action = "submit";
      key.classList.add("key-special");  // Add special class for extra width
      key.addEventListener("click", () => {
        const currentRow = document.querySelector(`.guess-row[data-row-index='${currentRowIndex}']`);
        const cells = currentRow.getElementsByClassName("guess-cell");
        let isRowComplete = true;
        for (let i = 0; i < cells.length; i++) {
          if (!cells[i].value) {
            isRowComplete = false;
            break;
          }
        }
        if (isRowComplete) {
          submitRow(currentRowIndex);
        }
      });
    } else {
      key.innerText = letter.toUpperCase();
      key.dataset.letter = letter;
      key.addEventListener("click", () => handleKeyClick(letter));
    }

    // Common styling (the rest will be in CSS)
    key.style.boxSizing = "border-box";

    rowDiv.appendChild(key);
  });

  keyboard.appendChild(rowDiv);
});






// Function to handle typing directly into the leftmost empty cell
document.addEventListener("keydown", (event) => {
  if (event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
    const currentRow = document.querySelector(`.guess-row[data-row-index='${currentRowIndex}']`);
    const cells = currentRow.getElementsByClassName("guess-cell");

    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].value) {
        cells[i].value = event.key.toUpperCase(); // Populate the first empty cell
        break; // Exit loop once a cell is filled
      }
    }
  } else if (event.key === "Backspace") {
    handleBackspace();
  } else if (event.key === "Enter") {
    const currentRow = document.querySelector(`.guess-row[data-row-index='${currentRowIndex}']`);
    const cells = currentRow.getElementsByClassName("guess-cell");
    let isRowComplete = true;

    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].value) {
        isRowComplete = false;
        break;
      }
    }

    if (isRowComplete) {
      submitRow(currentRowIndex);
    }
  }
});

// Function to handle backspace within the row
function handleBackspace() {
  const currentRow = document.querySelector(`.guess-row[data-row-index='${currentRowIndex}']`);
  const cells = currentRow.getElementsByClassName("guess-cell");

  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].value) {
      cells[i].value = ""; // Clear the last filled cell
      break;
    }
  }
}

// Function to handle keyboard clicks
function handleKeyClick(letter) {
  const currentRow = document.querySelector(`.guess-row[data-row-index='${currentRowIndex}']`);
  const cells = currentRow.getElementsByClassName("guess-cell");

  // Find the left-most empty cell in the current row
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].value) {
      cells[i].value = letter.toUpperCase(); // Populate the cell with the clicked letter
      break;
    }
  }
}

// Function to submit a row and unlock the next one
function submitRow(rowIndex) {
  const row = document.querySelector(`.guess-row[data-row-index='${rowIndex}']`);
  const cells = row.getElementsByClassName("guess-cell");
  let guess = "";

  for (let i = 0; i < cells.length; i++) {
    const letter = cells[i].value.trim();
    guess += letter.toLowerCase();
    cells[i].disabled = true; // Lock the current row
  }

  if (guess.length !== 6) {
    console.warn(`Row ${rowIndex} is incomplete. No submission occurred.`);
    return;
  }

  for (let i = 0; i < 6; i++) {
    if (guess[i] === targetWord[i]) {
      cells[i].style.backgroundColor = "green";
    } else if (targetWord.includes(guess[i])) {
      cells[i].style.backgroundColor = "yellow";
    } else {
      cells[i].style.backgroundColor = "lightgray";
    }
  }

  if (guess === targetWord) {
    alert("Congratulations! You guessed the word!");
    return;
  }

  attempts--;
  if (attempts === 0) {
    alert(`Out of attempts! The word was: ${targetWord}`);
    return;
  }

  currentRowIndex--;
  const nextRow = document.querySelector(`.guess-row[data-row-index='${currentRowIndex}']`);
  if (nextRow) {
    const nextCells = nextRow.getElementsByClassName("guess-cell");
    for (let i = 0; i < nextCells.length; i++) {
      nextCells[i].disabled = false; // Enable the cells in the next row
    }
  }
}


