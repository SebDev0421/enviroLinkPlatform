//fetch groups productive get
async function getAPiGroupsProductive(){
    await fetch("/CowFood/API/Cows/consultProductionGroup",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            idFarm:localStorage.getItem("idFarm")
        })
    }
).then((res=>res.json()))
    .then((res)=>{

        let html = ""
        res.groups.forEach(groups => {
            html += `
            <div class="group-card">
            <div class="group-header">
              <h3>${groups.name}</h3>
              <span class="group-cow-count">8 vacas</span>
            </div>
            <div class="group-range">
              <strong>Rango:</strong> ${groups.minProduction}L - ${groups.maxProduction}L por día
            </div>
            <div class="group-range">
              <strong>Cantidad de porcion:</strong> ${groups.food}(Kg)
            </div>
            <div class="group-actions">
              <button class="action-btn edit-btn">Editar</button>
              <button class="action-btn delete-btn">Eliminar</button>
            </div>
          </div>
            `  
        })
        document.getElementById("groups-container").innerHTML = html
    })
    .catch((err)=>{
        console.log(err)
    })
}


getAPiGroupsProductive();