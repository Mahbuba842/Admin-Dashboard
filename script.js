let users = JSON.parse(localStorage.getItem("users")) || [];
let userId = users.length ? users[users.length-1]?.id + 1 : 1;

/* CHECK LOGIN STATUS ON LOAD */
window.onload = function() {
  if(sessionStorage.getItem("isLoggedIn") === "true"){
    document.getElementById("loginPage").style.display="none";
    document.getElementById("dashboard").style.display="block";
    renderUsers();
  }
}

/* LOGIN */
function login(){
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if(user === "admin" && pass === "1234"){
    sessionStorage.setItem("isLoggedIn","true");
    document.getElementById("loginPage").style.display="none";
    document.getElementById("dashboard").style.display="block";
    renderUsers();
  }else{
    document.getElementById("loginError").textContent="Invalid Credentials!";
  }
}

/* LOGOUT */
function logout(){
  sessionStorage.removeItem("isLoggedIn");
  document.getElementById("dashboard").style.display="none";
  document.getElementById("loginPage").style.display="flex";
}

/* SIDEBAR */
function toggleSidebar(){
  document.getElementById("sidebar").classList.toggle("active");
}

/* SAVE USER */
function saveUser(){
  const name=document.getElementById("name").value.trim();
  const email=document.getElementById("email").value.trim();
  const editId=document.getElementById("editId").value;

  if(!name || !email){
    document.getElementById("formError").textContent="All fields required!";
    return;
  }

  if(editId){
    users=users.map(u=>u.id==editId?{...u,name,email}:u);
    document.getElementById("editId").value="";
  }else{
    users.push({id:userId++,name,email});
  }

  localStorage.setItem("users",JSON.stringify(users));
  document.getElementById("name").value="";
  document.getElementById("email").value="";
  document.getElementById("formError").textContent="";
  renderUsers();
}

/* RENDER USERS */
function renderUsers(){
  const table=document.getElementById("userTable");
  table.innerHTML="";

  users.forEach(user=>{
    table.innerHTML+=`
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <button class="edit" onclick="editUser(${user.id})">Edit</button>
          <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("totalUsers").textContent=users.length;
  document.getElementById("activeUsers").textContent=users.length;
}

/* EDIT */
function editUser(id){
  const user=users.find(u=>u.id==id);
  document.getElementById("name").value=user.name;
  document.getElementById("email").value=user.email;
  document.getElementById("editId").value=id;
}

/* DELETE */
function deleteUser(id){
  users=users.filter(u=>u.id!=id);
  localStorage.setItem("users",JSON.stringify(users));
  renderUsers();
}

/* SEARCH */
function searchUser(){
  const value=document.getElementById("search").value.toLowerCase();
  const rows=document.querySelectorAll("#userTable tr");

  rows.forEach(row=>{
    const name=row.cells[1].innerText.toLowerCase();
    row.style.display=name.includes(value)?"":"none";
  });
}