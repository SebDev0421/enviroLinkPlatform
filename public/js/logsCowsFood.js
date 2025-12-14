
if (localStorage.getItem("session") !== "active") {
    window.location.href = "/insuagroApp/Login";
} 

//get information user
const userId = localStorage.getItem("idUser");
const idFarm = localStorage.getItem("idFarm");



console.log(userId)
console.log(idFarm)



function logout(){
    localStorage.setItem("session","");
    localStorage.setItem("idUser", "");
    localStorage.setItem("idFarm", "");
    if (localStorage.getItem("session") !== "active") {
        window.location.href = "/insuagroApp/Login";
    } 
}


function getLocalDateISO() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    }

async function getAPiCows(){



    fetch("/CowFood/API/Cows/consultFoodLog",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({
            idFarm:idFarm,
            dateConsult:getLocalDateISO()
        })
    }
    ).then((res=>res.json()))
    .then((res)=>{

        console.log(res.logFood)
        document.getElementById("selectedDateDisplay").innerHTML = res.logFood.length.toString();
        let html = ""
        res.logFood.forEach(log => {
            html += `
            <li>Tag: ${log.tag} - Fecha y hora: ${log.dateLog} - Controlador: ${log.controllerId} - Puerto: ${log.port}</li>
            `  
        })
        document.getElementById("cowList").innerHTML = html
    }).catch((err)=>{
        console.log(err)
    });

    /* await fetch("/CowFood/API/Cows/consultCows",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            idFarm:idFarm
        })
    }
).then((res=>res.json()))
    .then((res)=>{

        console.log(res.cows)
        let html = ""
        res.cows.forEach(cow => {
            html += `
            <li onclick="window.location.href = '/insuagroApp/Vaca?tag=${cow.tag}'">Tag ${cow.tag} - ${cow.name}</li>
            `  
        })
        document.getElementById("cowList").innerHTML = html
    })
    .catch((err)=>{
        console.log(err)
    }) */
}

getAPiCows();


document.addEventListener('DOMContentLoaded', function () {
    console.log("cows information loaded...");

});

document.getElementById('feedingDate').addEventListener('change', (e) => {
  const selectedDate = e.target.value;
  console.log("Fecha seleccionada:", selectedDate);

  // Ejemplo:
  // loadCowsByDate(selectedDate);
  // fetch a la API para obtener las vacas alimentadas en la fecha seleccionada
    fetch("/CowFood/API/Cows/consultFoodLog",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({
            idFarm:idFarm,
            dateConsult:selectedDate
        })
    }
    ).then((res=>res.json()))
    .then((res)=>{

        console.log(res.logFood)
        document.getElementById("selectedDateDisplay").innerHTML = res.logFood.length.toString();
    }).catch((err)=>{
        console.log(err)
    });

});