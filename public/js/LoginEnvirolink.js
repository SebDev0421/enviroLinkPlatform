async function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    //fetch

    await fetch("/Envirolink/API/Users/loginUser",{
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
            localStorage.setItem("idUser", res.login._id);
            localStorage.setItem("idCompany", res.login.idCompany);
            localStorage.setItem("sessionEnvirolink", "active");
            if (localStorage.getItem("sessionEnvirolink") === "active") {
              window.location.href = "/Dashboard";
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


  async function registerOpen() {
    window.location.href = "/registerEnvirolink";
  }


  async function register() {
    const name = document.getElementById("name").value;
    const user = document.getElementById("user").value;
    const confirmUser = document.getElementById("userConfirm").value;
    if (user !== confirmUser) {
        alert("Los correos electrónicos no coinciden");
        return;
    }
    const pass = document.getElementById("pass").value;
    const passConfirm = document.getElementById("passConfirm").value;
    if (pass !== passConfirm) {
        alert("Las contraseñas no coinciden");
        return;
    }
    const idCompany = document.getElementById("idCompany").value;

    if (name === "" || user === "" || pass === "" || passConfirm === "" || idCompany === "") {
        alert("Por favor, complete todos los campos");
        return;
    }
    //fetch

    await fetch("/Envirolink/API/Users/addUser",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            name:name,
            email:user,
            password:pass,
            idCompany:idCompany
        })
    }).then((res=>res.json()))
    .then((res)=>{
        
        console.log(res)
        if(res.status === 200){
            alert("Usuario registrado correctamente");
            window.location.href = "/loginEnvirolink";
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
  if (localStorage.getItem("sessionEnvirolink") === "active") {
    window.location.href = "/Dashboard";
  } 