document.addEventListener('DOMContentLoaded', async function() {



if (localStorage.getItem("session") !== "active") {
    window.location.href = "/insuagroApp/Login";
} 

//get information user
const userId = localStorage.getItem("idUser");
const idFarm = localStorage.getItem("idFarm");




console.log(userId)
console.log(idFarm)

//fetch user information
async function getAPiUser(){
    await fetch("/CowFood/API/Users/consultUser",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            idUser:userId,
    })
}
).then((res=>res.json()))
    .then((res)=>{

        console.log(res.user)
        document.getElementById("userName").innerHTML = res.user.name
       // document.getElementById("userEmail").innerHTML = res.user.email
    })
}

//fetch data farm{name,location}
async function getAPiFarm(){
    await fetch("/CowFood/API/Farms/consultFarm",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            idFarm:idFarm,
    })
}
).then((res=>res.json()))
    .then((res)=>{

        console.log(res.farm)
        localStorage.setItem("farmName", res.farm.name);
        document.getElementById("farmName").innerHTML = res.farm.name
    
        //document.getElementById("farmLocation").innerHTML = res.farm.location

    })
}

//fetch cows cards
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
            <div class="card" style="width: 18rem;" onclick="window.location.href = '/insuagroApp/Vaca?tag=${cow.tag}'">
                <img src="/photoCows/cow-${idFarm}${cow.tag}.png" style="width: 90%;height: 200px;" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${cow.name}</h5>
                    <p class="card-text">TAG: ${cow.tag}</p>
                    <p class="card-text">Fecha de nacimiento: ${cow.dateBorn}</p>
                    <p class="card-text">Peso: ${cow.weight}</p>
                    <p class="card-text">Raza: ${cow.breed}</p>
                    <p class="card-text">porcion(Kg): ${cow.food}</p>
                    <p class="card-text">cantidad de porciones por dia: ${cow.portionsPerDay}</p>
                    <p class="card-text">Grupo de produccion: ${cow.nameGroup}</p>
                </div>
            </div>
            `  
        })
        document.getElementById("cowsCards").innerHTML = html
    })
    .catch((err)=>{
        console.log(err)
    })
}

//fetch groups productive
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
             <option value=${groups._id}>${groups.name}</option>
            `
        })
        document.getElementById("cowGroup").innerHTML = html
    })
    .catch((err)=>{
        console.log(err)
    })
} 

await getAPiUser();
await getAPiFarm();
await getAPiCows();
await getAPiGroupsProductive();

})

function logout(){
    localStorage.setItem("session","");
    localStorage.setItem("idUser", "");
    localStorage.setItem("idFarm", "");
    if (localStorage.getItem("session") !== "active") {
        window.location.href = "/insuagroApp/Login";
    }
}

// Abrir modal
  function openModal() {
    //read permissions
    const permissions = localStorage.getItem("Permissions");
    console.log("Permissions:",permissions);
    if (permissions !== "admin") {
        alert("No tienes permisos para agregar una vaca.");
        return;
    }
    console.log("Abrir modal");
    document.getElementById('addCowModal').style.display = 'flex';
  }
  
  // Cerrar modal
  function closeModal() {
    document.getElementById('addCowModal').style.display = 'none';
  }
  
  // Cerrar al hacer clic fuera del modal
  window.onclick = function(event) {
    const modal = document.getElementById('addCowModal');
    if (event.target === modal) {
      closeModal();
    }
  };
  
  // Manejar el formulario (ejemplo)
  document.getElementById('cowForm').addEventListener('submit', function(e) {
    e.preventDefault();
    //alert('Vaca agregada (aquí iría tu lógica para guardar en BD)');
    //valida si hace parte de un grupo o no

    let groupSelect = "";

    const hasGroup = document.getElementById('hasGroup').value;
    if (hasGroup === 'no') {
      // Si no tiene grupo, valida el peso de la porción
      const portionWeight = document.getElementById('portionWeight').value;
      if (portionWeight === '') {
        alert('Por favor, ingresa el peso de la porción.');
        return;
      }
    } else {
      // Si tiene grupo, no valida el peso de la porción
      document.getElementById('portionWeight').value = '';
      groupSelect = document.getElementById('cowGroup').value;
    }
    //add to database
    addAPiCows(
      document.getElementById('cowName').value,
      document.getElementById('cowTag').value,
      document.getElementById('cowCountry').value,
      document.getElementById('cowBreed').value,
      document.getElementById('cowBirthDate').value,
      document.getElementById('cowWeight').value,
      localStorage.getItem("idFarm"),
      document.getElementById('portionWeight').value,
      document.getElementById('portionsPerDay').value,
      groupSelect,
      document.getElementById('cowNotes').value
    )
    closeModal();
  });


  // select other breed
function toggleBreedInput() {
     const cowBreed = document.getElementById('cowBreed').value; 
     const breedOtherContainer = document.getElementById('breed-other');
     
     if (cowBreed === 'Otra') {
        breedOtherContainer.style.display = 'block';
        document.getElementById('otherBreed').setAttribute('required', ''); // Hacerlo obligatorio
     }else{
        breedOtherContainer.style.display = 'none';
        document.getElementById('otherBreed').removeAttribute('required'); // Opcional
     }
}

function togglePortionWeight() {
  const hasGroup = document.getElementById('hasGroup').value;
  const portionContainer = document.getElementById('portionWeightContainer');
  const groupContainer = document.getElementById('groupContainer');

  if (hasGroup === 'no') {
    groupContainer.style.display = 'none';
    document.getElementById('cowGroup')
    portionContainer.style.display = 'block';
    document.getElementById('portionWeight').setAttribute('required', ''); // Hacerlo obligatorio
  } else {

    groupContainer.style.display = 'block';
    document.getElementById('cowGroup')
    portionContainer.style.display = 'none';
    document.getElementById('portionWeight').removeAttribute('required'); // Opcional
  }
}

// 1. Mostrar vista previa de la foto al seleccionar/tomar una
document.getElementById('cowPhoto').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    if (file && !file.type.match('image.*')) {
    alert('¡Solo se permiten imágenes!');
    return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
      const preview = document.getElementById('photoPreview');
      preview.src = event.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

async function savecowPhoto() {
    const formData = new FormData();
    const photoFile = document.getElementById('cowPhoto').files[0];
    const cowTag = document.getElementById('cowTag').value;
    const idFarm = localStorage.getItem("idFarm"); 
    if (photoFile) {
        const filename =  `cow-${idFarm}${cowTag}.${photoFile.name.split('.').pop()}`; // Cambia el nombre del archivo para incluir el tag de la vaca y el id de la granja
        formData.append('photo', photoFile,filename);
        try {
        const response = await fetch('/upload-cow-photo', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log('Foto guardada en:', data.photoUrl);
        // Guarda data.photoUrl en tu BD junto a los demás datos de la vaca
        } catch (error) {
        console.error('Error al subir la foto:', error);
        }
    }
}

async function addAPiCows(name,tag,country,breed,dateBorn,weight,farmId,food, portionsPerDay,idGroup,comment){
    await fetch("/CowFood/API/Cows/addCow",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            name:name,
            tag:tag,
            country:country,
            breed:breed,
            dateBorn:dateBorn,
            weight:weight,
            farmId:farmId,
            food:food,
            portionsPerDay:portionsPerDay,
            idGroup:idGroup,
            Comments:[
                comment ? { comment: comment, date: new Date() } : { comment: "Sin notas en la creacion", date: new Date() }
            ]
        })
    }
    ).then((res=>res.json()))
    .then((res)=>{
        console.log(res)
        if(res.status==200){
            savecowPhoto();
            alert(res.msg);
            window.location.reload();
        }
        if(res.status==201){
            alert(res.msg);
        }
    })
    .catch((err)=>{
        console.log(err)
    })

    
}