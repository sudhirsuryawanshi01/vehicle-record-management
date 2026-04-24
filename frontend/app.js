const BASE_URL = "https://vehicle-record-management.onrender.com";

let allData = [];
let deleteMode = false;
let updateMode = false;
let editId = null;

// LOAD DATA
async function loadData() {
  let res = await fetch(`${BASE_URL}/get-data`);
  let data = await res.json();
  allData = data;
  renderTable(data);
}

// RENDER TABLE
function renderTable(data) {
  let table = document.getElementById("tableBody");
  table.innerHTML = "";

  data.forEach(item => {
    table.innerHTML += `
      <tr>
        <td style="display:${deleteMode ? 'table-cell' : 'none'}">
          <input type="checkbox" name="deleteRow" value="${item.id}">
        </td>

        <td style="display:${updateMode ? 'table-cell' : 'none'}">
          <input type="radio" name="selectRow" value="${item.id}">
        </td>

        <td>${item.dl_number}</td>
        <td>${item.name}</td>
        <td>${item.dob}</td>
        <td>${item.doi}</td>
        <td>${item.mob_no}</td>
        <td>${item.address}</td>
        <td>${item.validity}</td>
        <td>${item.llr}</td>
        <td>${item.dl}</td>
        <td>${item.total}</td>
      </tr>
    `;
  });
}

// ADD / UPDATE
async function addData() {
  let data = {
    dl_number: document.getElementById("dl_number").value,
    name: document.getElementById("name").value,
    dob: document.getElementById("dob").value,
    doi: document.getElementById("doi").value,
    mob_no: document.getElementById("mob_no").value,
    address: document.getElementById("address").value,
    validity: document.getElementById("validity").value,
    llr: document.getElementById("llr").value,
    dl: document.getElementById("dl").value,
    total: document.getElementById("total").value
  };

  if (editId) {
    await fetch(`${BASE_URL}/update/${editId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
  } else {
    await fetch(`${BASE_URL}/add-data`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
  }

  resetForm();
  loadData();
}

// DELETE
async function deleteSelected() {
  let selected = document.querySelectorAll('input[name="deleteRow"]:checked');

  for (let checkbox of selected) {
    await fetch(`${BASE_URL}/delete/${checkbox.value}`, {
      method: 'DELETE'
    });
  }

  deleteMode = false;
  loadData();
}

// LOGOUT
function logout() {
  fetch(`${BASE_URL}/logout`).then(() => {
    window.location.href = "login.html";
  });
}

// RESET
function resetForm() {
  document.querySelectorAll("input").forEach(el => el.value = "");
}

// SEARCH
function filterData() {
  let search = document.getElementById("search").value.toLowerCase();

  let filtered = allData.filter(item =>
    (item.name || "").toLowerCase().includes(search) ||
    (item.dl_number || "").toLowerCase().includes(search)
  );

  renderTable(filtered);
}

loadData();
