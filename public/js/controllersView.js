

const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  });


if (localStorage.getItem("session") !== "active") {
    window.location.href = "/insuagroApp/Login";
} 

//get information user
const userId = localStorage.getItem("idUser");
const idFarm = localStorage.getItem("idFarm");



console.log(userId)
console.log(idFarm)



// fetch controllers
async function getAPiControllers(){
    await fetch("/CowFood/API/Devices/getDevicesFarm",{
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
        console.log(res.devices)
        let html = ""
        res.devices.map(controller => {
            html += `
            <div class="card" style="width: 18rem;" onclick="openModal(${controller.idController},${controller.timeMotor1},${controller.timeMotor1Off},${controller.pulsesKg1},${controller.timeMotor2},${controller.timeMotor2Off},${controller.pulsesKg2})">
                <img src="/images/device.png" style="width: 90%;height: 200px;" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">Dispositivo de control</h5>
                    <p class="card-text">S/N controlador: ${controller.idController}</p>
                    <p class="card-text">Tiempo Encendido de Motor salida 1: ${controller.timeMotor1} Seg</p>
                    <p class="card-text">Tiempo apagado de Motor salida 1: ${controller.timeMotor1Off} Seg</p>
                    <p class="card-text">Pulsos por Kg salida 1: ${controller.pulsesKg1}</p>
                    <p class="card-text">Tiempo Encendido de Motor salida 2: ${controller.timeMotor2} Seg</p>
                    <p class="card-text">Tiempo apagado de Motor salida 2: ${controller.timeMotor2Off} Seg</p>
                    <p class="card-text">Pulsos por Kg salida 2: ${controller.pulsesKg2}</p>
                    
                </div>
            </div>
            `  
        })
        document.getElementById("controllerList").innerHTML = html
    })
    .catch((err)=>{
        console.log(err)
    })
}

getAPiControllers();

function logout(){
    localStorage.setItem("session","");
    localStorage.setItem("idUser", "");
    localStorage.setItem("idFarm", "");
    localStorage.setItem("farmName", "");
    if (localStorage.getItem("session") !== "active") {
        window.location.href = "/insuagroApp/Login";
    } 
}

function openModal(serialController, timeMotor1,timeMotor1Off, pulsesKg1, timeMotor2,timeMotor2Off, pulsesKg2) {
    document.getElementById("modifyControllerModal").style.display = "block";
    document.getElementById("controllerSerial").textContent = serialController;
    document.getElementById("timeMotor1").value = timeMotor1;
    document.getElementById("timeMotor1Off").value = timeMotor1Off;
    document.getElementById("pulsesKg1").value = pulsesKg1;
    document.getElementById("timeMotor2").value = timeMotor2;
    document.getElementById("timeMotor2Off").value = timeMotor2Off;
    document.getElementById("pulsesKg2").value = pulsesKg2;
}
function closeModal() {
    document.getElementById("modifyControllerModal").style.display = "none";
}

document.getElementById("modifyControllerForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const serialController = document.getElementById("controllerSerial").textContent;
    const timeMotor1 = document.getElementById("timeMotor1").value;
    const timeMotor1Off = document.getElementById("timeMotor1Off").value;
    const pulsesKg1 = document.getElementById("pulsesKg1").value;
    const timeMotor2 = document.getElementById("timeMotor2").value;
    const timeMotor2Off = document.getElementById("timeMotor2Off").value;
    const pulsesKg2 = document.getElementById("pulsesKg2").value;
    const data = {
        idController: serialController,
        farmId: localStorage.getItem("idFarm"),
        timeMotor1: parseFloat(timeMotor1),
        timeMotor1Off: parseFloat(timeMotor1Off),
        pulsesKg1: parseFloat(pulsesKg1),
        timeMotor2: parseFloat(timeMotor2),
        timeMotor2Off: parseFloat(timeMotor2Off),
        pulsesKg2: parseFloat(pulsesKg2)
    };
    try {
        const response = await fetch("/CowFood/API/Devices/calibrateDevice", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.status === 200) {

            socket.emit('configDevice', JSON
            .stringify({
                idController: document.getElementById("controllerSerial").textContent,
                status: "reset"
            }));
            alert("Controlador modificado correctamente");
            closeModal();

            // Emitir evento para actualizar la lista de controladores en tiempo real
            //reload page or refresh controller list
            window.location.reload(); // Uncomment this line to reload the page
            
        }
    } catch (error) {
        console.error("Error al modificar el controlador:", error);
        alert("Error al modificar el controlador");
    }
    closeModal();
    document.getElementById("modifyControllerForm").reset();
});
