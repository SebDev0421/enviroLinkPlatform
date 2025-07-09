
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


async function getAPiCows(){
    await fetch("/CowFood/API/Cows/consultCows",{
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
    })
}

getAPiCows();


document.addEventListener('DOMContentLoaded', function () {
    console.log("cows information loaded...");
    //here code

    const searchInput = document.getElementById('searchInput');
    const cowList = document.getElementById('cowList');
    const items = cowList.getElementsByTagName('li');

    searchInput.addEventListener('keyup', function () {
        const filter = searchInput.value.toLowerCase();
        Array.from(items).forEach(function (item) {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? '' : 'none';
        });
    });



});