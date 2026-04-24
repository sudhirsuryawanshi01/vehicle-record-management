const BASE_URL = "https://vehicle-record-management.onrender.com";

let allData = [];
let deleteMode = false;
let updateMode = false;
let editId = null;

// LOAD
async function loadData() {
  let res = await fetch(`${BASE_URL}/get-data`);
  let data = await res.json();

  allData = data;
  renderTable(data);
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
  document.getElementById("deleteBtn").innerText = "Delete";
  document.getElementById("confirmDeleteBtn").style.display = "none";
  document.getElementById("deleteHeader").style.display = "none";

  loadData();
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

// LOGOUT
function logout() {
  fetch(`${BASE_URL}/logout`).then(() => {
    window.location.href = "/";
  });
}

loadData();
