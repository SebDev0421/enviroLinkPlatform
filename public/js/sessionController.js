if (localStorage.getItem("session") !== "active") {
    window.location.href = "/insuagroApp/Login";
} 

//get information user
const userId = localStorage.getItem("idUser");
const idFarm = localStorage.getItem("idFarm");



function logout(){
    localStorage.setItem("session","");
    localStorage.setItem("idUser", "");
    localStorage.setItem("idFarm", "");
    if (localStorage.getItem("session") !== "active") {
        window.location.href = "/insuagroApp/Login";
    } 
}

