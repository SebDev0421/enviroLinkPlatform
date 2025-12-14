if (localStorage.getItem("session") !== "active") {
    window.location.href = "/insuagroApp/Login";
} 

//get information user
const userId = localStorage.getItem("idUser");
const idFarm = localStorage.getItem("idFarm");



console.log(userId)// informacion editada por el usuario
console.log(idFarm)


// Cargar datos de la vaca al abrir la vista
document.addEventListener('DOMContentLoaded', async () => {
  const cowId = new URLSearchParams(window.location.search).get('tag');
  if (cowId) {
    document.getElementById("cowDetailPhoto").src = `/photoCows/cow-${idFarm}${cowId}.png`;
    fetchCowData(cowId); // Implementa esta función para obtener los datos de la vaca

    initProductionChart({items: ['hoy',11.5]}); // Inicializar gráfico vacío
  }

  async function getApiFoodLog(tag) {
    await fetch("/CowFood/API/Cows/consultFoodLogCow", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tag: tag
        })
    })
    .then((res) => res.json())
    .then((res) => {
        console.log(res.logFood);
        let html = "";
        res.logFood.forEach(log => {
            log.dateLog = new Date(log.dateLog).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            html += `
                <li>📅 <strong>${log.dateLog}</li>
            `;
        })
        document.getElementById("feedingLogList").innerHTML = html;
    })
    .catch((err) => {
        console.log(err);
    });
    }

    getApiFoodLog(cowId); // Cargar el log de alimentación al cargar la página
});

async function fetchCowData(tag) {
  const response = await fetch('/CowFood/API/Cows/getCow', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idFarm, tag })
    });
    const data = await response.json();
    if (data.status === 200) {
        
        renderCowDetail(data.cow);
    }

    else {
        console.error('Error fetching cow data:', data.msg);
        alert('Error al obtener los datos de la vaca: ' + data.msg);
    }    
};

//fetch groups productive
async function getAPiGroupsProductive(){
    const idFarm= localStorage.getItem("idFarm");
    console.log("idFarm en groups productive:",idFarm);
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
            console.log(html)
        })
        document.getElementById("cowGroup").innerHTML = html
        console.log("Grupos de producción cargados correctamente");
    })
    .catch((err)=>{
        console.log(err)
    })
} 

getAPiGroupsProductive();




// Ejemplo de función para renderizar datos
function renderCowDetail(cow) {
    console.log('Vaca encontrada:', cow);

    document.getElementById('cowName').textContent = cow.name;
    document.getElementById('cowTag').textContent = cow.tag;
    document.getElementById('cowBreed').textContent = cow.breed;
    document.getElementById('cowWeight').textContent = cow.weight;
    document.getElementById('cowGroupShow').textContent = cow.nameGroup || 'Sin grupo';
    document.getElementById('cowPortionsPerDay').textContent = cow.portionsPerDay;
    document.getElementById('cowFood').textContent = cow.food;
    // Calcular edad
    const age = calculateAge(cow.dateBorn);
    document.getElementById('cowAge').textContent = age;

    // load modal with cow data
    
    const portionContainer = document.getElementById('portionWeightContainer');
    const groupContainer = document.getElementById('groupContainer');
    if( cow.idGroup) {
        document.getElementById('hasGroup').value = 'yes';
        document.getElementById('cowGroup').value = cow.idGroup;
    }else {
        document.getElementById('hasGroup').value = 'no';
        document.getElementById('cowGroup').value = '';
        groupContainer.style.display = 'none';
        document.getElementById('cowGroup')
        portionContainer.style.display = 'block';
        document.getElementById('editPortionWeight').setAttribute('required', ''); // Hacerlo obligatorio
    }

    document.getElementById('editCowTag').value = cow.tag;
    document.getElementById('editCowCountry').value = cow.country;
    document.getElementById('editCowWeight').value = cow.weight;
    document.getElementById('editCowPortionsPerDay').value = cow.portionsPerDay;
    document.getElementById('editPortionWeight').value = cow.food;
}

function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  return age;
}

document.getElementById('editCowForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tag = document.getElementById('editCowTag').value;
    const country = document.getElementById('editCowCountry').value;
    const weight = document.getElementById('editCowWeight').value;
    const portionsPerDay = document.getElementById('editCowPortionsPerDay').value;
    const hasGroup = document.getElementById('hasGroup').value;
    let food = document.getElementById('editPortionWeight').value;
    let idGroup = document.getElementById('cowGroup').value;
    let nameGroup = "";
    if (hasGroup === 'no') {
        // Si no tiene grupo, valida el peso de la porción
        if (food === '') {
            alert('Por favor, ingresa el peso de la porción.');
            return;
        } else {
        // Si no tiene grupo, asigna la porción de alimento
        food = parseFloat(food);
        idGroup = ""; // No hay grupo asignado
        nameGroup = ""; // No hay nombre de grupo asignado
        }
    }else {
        // Si tiene grupo, no valida el peso de la porción
        document.getElementById('editPortionWeight').value = '';
        groupSelect = document.getElementById('cowGroup').value;
    }
    
    // Enviar datos al servidor
    await fetch('/CowFood/API/Cows/editCow', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idFarm,
            tag,
            country,
            weight,
            portionsPerDay,
            food,
            idGroup,
            nameGroup
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            alert('Vaca actualizada correctamente');
            closeEditCowModal(); // Cerrar modal
            // Actualizar los datos de la vaca en la vista
            //reload page
            window.location.reload();
        } else {            
            alert('Error al actualizar la vaca: ' + data.msg);
        }
    })
    .catch(error => {
        console.error('Error al actualizar la vaca:', error);
        alert('Error al actualizar la vaca: ' + error.message);
    });
});




// Inicializar gráfico (requiere Chart.js)
//conectar con el log de producción de la vaca
function initProductionChart(data) {
  const ctx = document.getElementById('productionChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["hoy", "ayer", "anteayer"], // Puedes ajustar las etiquetas según tus datos
      datasets: [{
        label: 'Producción (litros)',
        data: [11.5, 10, 9], // Datos de ejemplo, reemplaza con tus datos reales
        borderColor: '#4CAF50',
        tension: 0.1
      }]
    }
  });
}

// Añadir nueva producción
async function addProduction() {
  const liters = document.getElementById('milkProduction').value;
  if (!liters) return;
  
  await fetch('/api/production', {
    method: 'POST',
    body: JSON.stringify({ cowId, liters, date: new Date().toISOString() })
  });
  
  // Actualizar gráfico y limpiar input
  document.getElementById('milkProduction').value = '';
}

function logout() {
    localStorage.setItem("session", "");
    localStorage.setItem("idUser", "");
    localStorage.setItem("idFarm", "");
    if (localStorage.getItem("session") !== "active") {
        window.location.href = "/insuagroApp/Login";
    }
}

// Añadir evento de logout
document.getElementById('logoutButton').addEventListener('click', logout);

function openTab(tabName) {
    console.log("Opening tab:", tabName);
    if( tabName === 'production') {
        document.getElementById('tab-production').classList.add('active');
        document.getElementById('tab-feeding').classList.remove('active');
        document.getElementById('production').style.display = 'block';
        document.getElementById('feeding').style.display = 'none';
    }
    else if (tabName === 'feeding') {
        document.getElementById('tab-production').classList.remove('active');
        document.getElementById('tab-feeding').classList.add('active');
        document.getElementById('production').style.display = 'none';
        document.getElementById('feeding').style.display = 'block';
    }   
}

// abrir modal para editar la vaca
function openEditCowModal() {
    if (localStorage.getItem("Permissions") !== "admin") {
        alert("No tienes permisos para editar una vaca.");
        return;
    }
    document.getElementById('editCowModal').style.display = 'flex';
}
// cerrar modal para editar la vaca
function closeEditCowModal() {
    document.getElementById('editCowModal').style.display = 'none';
}

 // Cerrar al hacer clic fuera del modal
  window.onclick = function(event) {
    const modal = document.getElementById('editCowModal');
    if (event.target === modal) {
      closeEditCowModal();
    }
  };


  function deleteCow() {
    if (localStorage.getItem("Permissions") !== "admin") {
        alert("No tienes permisos para editar una vaca.");
        return;
    }
    const cowId = new URLSearchParams(window.location.search).get('tag');
    if (confirm('¿Estás seguro de que deseas eliminar esta vaca?')) {
        fetch('/CowFood/API/Cows/deleteCow', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idFarm, tag: cowId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                alert('Vaca eliminada correctamente');
                // Redirigir a la lista de vacas o actualizar la vista
                window.location.href = '/insuagroApp/Dashboard'; // Cambia a la ruta que desees
            } else {

                alert('Error al eliminar la vaca: ' + data.msg);
            }
        })
        .catch(error => {
            console.error('Error al eliminar la vaca:', error);
            alert('Error al eliminar la vaca: ' + error.message);
        });
    }
}

 

function togglePortionWeight() {
  const hasGroup = document.getElementById('hasGroup').value;
  const portionContainer = document.getElementById('portionWeightContainer');
  const groupContainer = document.getElementById('groupContainer');

  if (hasGroup === 'no') {
    groupContainer.style.display = 'none';
    portionContainer.style.display = 'block';
    document.getElementById('editPortionWeight').setAttribute('required', ''); // Hacerlo obligatorio
  } else {
    groupContainer.style.display = 'block';
    portionContainer.style.display = 'none';
    document.getElementById('editPortionWeight').removeAttribute('required'); // Opcional
  }
}