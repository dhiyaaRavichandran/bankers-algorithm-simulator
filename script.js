// GENERATE TABLES
function generateTables() {

  let n = parseInt(document.getElementById("processes").value);
  let m = parseInt(document.getElementById("resources").value);

  if (!n || !m || n <= 0 || m <= 0) {
    alert("Enter valid numbers");
    return;
  }

  localStorage.setItem("n", n);
  localStorage.setItem("m", m);

  let html = "";

  // Allocation
  html += "<h3 class='mt-4 font-semibold text-slate-600'>Allocation</h3>";
  html += "<table class='border border-slate-300 mt-2'>";

  for (let i = 0; i < n; i++) {
    html += "<tr><td class='pr-2'>P" + i + "</td>";
    for (let j = 0; j < m; j++) {
      html += `<td><input type='number' id='a_${i}_${j}' class='border border-slate-300 w-12 p-1 rounded'></td>`;
    }
    html += "</tr>";
  }
  html += "</table>";

  // Max
  html += "<h3 class='mt-4 font-semibold text-slate-600'>Max</h3>";
  html += "<table class='border border-slate-300 mt-2'>";

  for (let i = 0; i < n; i++) {
    html += "<tr><td class='pr-2'>P" + i + "</td>";
    for (let j = 0; j < m; j++) {
      html += `<td><input type='number' id='m_${i}_${j}' class='border border-slate-300 w-12 p-1 rounded'></td>`;
    }
    html += "</tr>";
  }
  html += "</table>";

  // Available
  html += "<h3 class='mt-4 font-semibold text-slate-600'>Available</h3>";
  for (let j = 0; j < m; j++) {
    html += `<input type='number' id='v_${j}' class='border border-slate-300 w-12 p-1 mr-2 rounded'>`;
  }

  document.getElementById("tables").innerHTML = html;
}


// SAVE DATA
function saveData() {

  let n = parseInt(localStorage.getItem("n"));
  let m = parseInt(localStorage.getItem("m"));

  if (!n || !m) {
    alert("Click Generate first!");
    return;
  }

  let alloc = [], max = [], avail = [];

  for (let i = 0; i < n; i++) {
    alloc[i] = [];
    max[i] = [];

    for (let j = 0; j < m; j++) {
      let a = document.getElementById(`a_${i}_${j}`).value;
      let b = document.getElementById(`m_${i}_${j}`).value;

      if (a === "" || b === "") {
        alert("Fill all values!");
        return;
      }

      alloc[i][j] = parseInt(a);
      max[i][j] = parseInt(b);
    }
  }

  for (let j = 0; j < m; j++) {
    let v = document.getElementById(`v_${j}`).value;

    if (v === "") {
      alert("Fill available values!");
      return;
    }

    avail[j] = parseInt(v);
  }

  localStorage.setItem("data", JSON.stringify({ alloc, max, avail }));
  window.location.href = "result.html";
}


// RESULT PAGE
window.onload = function () {

  if (!window.location.pathname.includes("result.html")) return;

  let n = parseInt(localStorage.getItem("n"));
  let m = parseInt(localStorage.getItem("m"));
  let data = JSON.parse(localStorage.getItem("data"));

  if (!data) return;

  let need = [], work = [...data.avail], finish = new Array(n).fill(false);
  let seq = [], steps = "";

  for (let i = 0; i < n; i++) {
    need[i] = [];
    for (let j = 0; j < m; j++) {
      need[i][j] = data.max[i][j] - data.alloc[i][j];
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (!finish[i]) {
        let ok = true;

        for (let j = 0; j < m; j++) {
          if (need[i][j] > work[j]) ok = false;
        }

        if (ok) {
          steps += `<p class='text-green-600'>✔ P${i} executed</p>`;
          for (let j = 0; j < m; j++) work[j] += data.alloc[i][j];
          finish[i] = true;
          seq.push("P" + i);
        }
      }
    }
  }

  document.getElementById("steps").innerHTML = steps;

  let result = document.getElementById("result");

  if (seq.length === n) {
    result.innerText = "Safe Sequence: " + seq.join(" → ");
    result.classList.add("text-green-600");
  } else {
    result.innerText = "System is NOT in safe state";
    result.classList.add("text-red-600");
  }
};