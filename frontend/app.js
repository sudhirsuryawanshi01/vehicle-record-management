const BASE_URL = "https://vehicle-record-management.onrender.com";

let allData = [];
let deleteMode = false;
let updateMode = false;
let editId = null;

async function loadData() {
  let res = await fetch(`${BASE_URL}/get-data`, {
    credentials: "include"
  });
  let data = await res.json();

  allData = data;
  renderTable(data);
}

let data = {
  dl_number: document.getElementById("dl_number").value || null,
  name: document.getElementById("name").value || null,
  dob: document.getElementById("dob").value || null,
  doi: document.getElementById("doi").value || null,
  mob_no: document.getElementById("mob_no").value || null,
  address: document.getElementById("address").value || null,
  validity: document.getElementById("validity").value || null,
  llr: document.getElementById("llr").value || null,
  dl: document.getElementById("dl").value || null,
  total: document.getElementById("total").value || null
};

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

function toggleUpdate() {
  updateMode = !updateMode;

  let btn = document.getElementById("updateBtn");
  let header = document.getElementById("radioHeader");

  if (updateMode) {
    btn.innerText = "Cancel";
    header.style.display = "table-cell";
  } else {
    btn.innerText = "Update";
    header.style.display = "none";
    editId = null;
    resetForm();
  }

  loadData();
}

function handleDelete() {
  deleteMode = !deleteMode;

  let btn = document.getElementById("deleteBtn");
  let confirmBtn = document.getElementById("confirmDeleteBtn");
  let header = document.getElementById("deleteHeader");

  if (deleteMode) {
    btn.innerText = "Cancel";
    btn.style.background = "#ef4444";

    confirmBtn.style.display = "inline-block";
    header.style.display = "table-cell";

  } else {
    btn.innerText = "Delete";
    btn.style.background = "#2563eb";

    confirmBtn.style.display = "none";
    header.style.display = "none";
  }

  loadData();
}

async function deleteSelected() {
  let selected = document.querySelectorAll('input[name="deleteRow"]:checked');

  if (selected.length === 0) {
    alert("Select at least one record");
    return;
  }

  if (!confirm("Delete selected records?")) return;

  for (let checkbox of selected) {
    let id = checkbox.value;

    await fetch(`${BASE_URL}/delete/${id}`, {
      method: 'DELETE',
      credentials: "include"
    });
  }

  deleteMode = false;

  document.getElementById("deleteBtn").innerText = "Delete";
  document.getElementById("deleteBtn").style.background = "#2563eb";
  document.getElementById("confirmDeleteBtn").style.display = "none";
  document.getElementById("deleteHeader").style.display = "none";

  loadData();
}

document.addEventListener("change", function(e) {
  if (e.target.name === "selectRow") {
    let id = parseInt(e.target.value);
    let item = allData.find(d => d.id === id);

    document.getElementById("dl_number").value = item.dl_number;
    document.getElementById("name").value = item.name;
    document.getElementById("dob").value = item.dob;
    document.getElementById("doi").value = item.doi;
    document.getElementById("mob_no").value = item.mob_no;
    document.getElementById("address").value = item.address;
    document.getElementById("validity").value = item.validity;
    document.getElementById("llr").value = item.llr;
    document.getElementById("dl").value = item.dl;
    document.getElementById("total").value = item.total;

    editId = id;
  }
});

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
      credentials: "include",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });

    updateMode = false;
    editId = null;
    document.getElementById("updateBtn").innerText = "Update";
    document.getElementById("radioHeader").style.display = "none";
  } else {
    await fetch(`${BASE_URL}/add-data`, {
      method: 'POST',
      credentials: "include",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
  }

  if (!data.dl_number || !data.name) {
    alert("Fill required fields");
    return;
  }

  resetForm();
  loadData();
}

function resetForm() {
  document.querySelectorAll("input, textarea").forEach(el => el.value = "");
}

function filterData() {
  let search = document.getElementById("search").value.toLowerCase();

  let filtered = allData.filter(item =>
    (item.name || "").toLowerCase().includes(search) ||
    (item.dl_number || "").toLowerCase().includes(search)
  );

  renderTable(filtered);
}

loadData();

function logout() {
  fetch(`${BASE_URL}/logout`, {
    credentials: "include"
  }).then(() => {
    window.location.href = "login.html";  
  });
}

function checkDuplicate() {
  let nameInput = document.getElementById("name").value.toLowerCase().trim();
  let dlInput = document.getElementById("dl_number").value.toLowerCase().trim();

  let nameHint = document.getElementById("nameHint");
  let dlHint = document.getElementById("dlHint");

  nameHint.style.display = "none";
  dlHint.style.display = "none";

  if (nameInput) {
    let found = allData.some(item =>
      (item.name || "").toLowerCase().trim() === nameInput
    );

    if (found) {
      nameHint.innerText = "⚠ Name already exists";
      nameHint.style.display = "block";
    }
  }

  if (dlInput) {
    let found = allData.some(item =>
      (item.dl_number || "").toLowerCase().trim() === dlInput
    );

    if (found) {
      dlHint.innerText = "⚠ DL already exists";
      dlHint.style.display = "block";
    }
  }
}

function toUppercase(id) {
  let el = document.getElementById(id);
  el.value = el.value.toUpperCase();
}
