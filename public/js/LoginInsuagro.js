async function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    //fetch

    await fetch("/CowFood/API/Users/loginUser",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            email:user,
            password:pass
        })
    }).then((res=>res.json()))
    .then((res)=>{
        
        console.log(res)
        if(res.login == null){
            alert("Usuario o contraseña erroneos");
        }else{
            console.log("Usuario logueado:",res.login);
            localStorage.setItem("idUser", res.login._id);
            localStorage.setItem("idFarm", res.login.idFarm);
            localStorage.setItem("Permissions", res.login.Permissions);
            localStorage.setItem("session", "active");
            
            if (localStorage.getItem("session") === "active") {
              window.location.href = "/insuagroApp/Dashboard";
            }
        }
        
    })

    /* if (user === validUser && pass === validPass) {
      localStorage.setItem("session", "active");
      window.location.href = "/insuagroApp/dashboard";
    } else {
      document.getElementById("error").innerText = "Credenciales incorrectas";
    } */
  }


  async function register() {
    const name = document.getElementById("name").value;
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;
    const passConfirm = document.getElementById("passConfirm").value;
    const idFarm = document.getElementById("idFarm").value;

    //validate passwords
    if (pass !== passConfirm) {
        alert("Las contraseñas no coinciden");
        return;
    }
    if (name === "" || user === "" || pass === "" || passConfirm === "" || idFarm === "") {
        alert("Por favor, complete todos los campos");
        return;
    }
    //fetch

    await fetch("/CowFood/API/Users/addUser",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            name:name,
            email:user,
            password:pass,
            idFarm:idFarm
        })
    }).then((res=>res.json()))
    .then((res)=>{
        
        console.log(res)
        if(res.status === 200){
            alert("Usuario registrado correctamente");
            window.location.href = "/insuagroApp/login";
        }
        if(res.status === 201){
            alert("El usuario ya existe");
        } 
        
    })

    /* if (user === validUser && pass === validPass) {
      localStorage.setItem("session", "active");
      window.location.href = "/insuagroApp/dashboard";
    } else {
      document.getElementById("error").innerText = "Credenciales incorrectas";
    } */
  }

  // Redirección si ya está logueado
  if (localStorage.getItem("session") === "active") {
    window.location.href = "/insuagroApp/Dashboard";
  } 