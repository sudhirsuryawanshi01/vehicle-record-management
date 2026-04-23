async function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let res = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  });

  let data = await res.json();

  if (data.success) {
    window.location.href = "/dashboard";
  } else {
    document.getElementById("msg").innerText = "Invalid login";
  }
}