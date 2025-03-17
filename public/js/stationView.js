document.addEventListener('DOMContentLoaded', function () {
    const titleTableContainer = document.getElementById('headTable');
    const bodyTableContainer = document.getElementById('bodyTable');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const filterButton = document.getElementById('filterButton');
    const dateInput = document.getElementById('date');
    const stationSelect = document.getElementById('station');
    let projectId = ""

    let stations = []
    // Llenar el select picker con las estaciones
    

    // Función para filtrar la tabla
    filterButton.addEventListener('click', function () {
        const selectedDate = dateInput.value;
        const selectedStation = stationSelect.value;
        //read content serial
        var date = new Date(selectedDate);
        date.setDate(date.getDate()+1);
        const isoDateEnd = date.toISOString();
        const isoDateInit = `${selectedDate}T00:00:00.000Z`;

        getAPiMachineInfo(selectedStation)
        readAPiStation(selectedStation,isoDateInit,isoDateEnd)

    });


    function graphContent(){
        const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico
        data: {
            labels: ['Centro', 'Suburbio', 'Zona Industrial', 'Área Residencial'],
            datasets: [{
                label: 'Temperatura (°C)',
                data: [22.5, 20.3, 25.0, 21.8],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    }

    graphContent();
    
    function createHeader(paramters){
        const contentHead = document.createElement("tr");
        titleTableContainer.innerHTML = '';
        // Contenido de la tarjeta
        contentHead.innerHTML = `
                    <th>Registro</th>
                    <th>Flags</th>
                    `+paramters+`
                    <th>Unidades</th>
        `;


        titleTableContainer.appendChild(contentHead);
        
        // Agregar la tarjeta al contenedor
        
    }


    function createBodyTable(register,flags,reads,units){
        const contentBody = document.createElement("tr");
        // Contenido de la tarjeta
        contentBody.innerHTML = `
                    <td>`+register+`</td>
                    <td>`+flags+`</td>
                    `+reads+`
                    <td>`+units+`</td>
        `;


        bodyTableContainer.appendChild(contentBody);
        
        // Agregar la tarjeta al contenedor
        
    }




    //read api for get station info
    async function getAPiprojects(){

        const urlParams = new URLSearchParams(window.location.search);
        const params = {
            id: urlParams.get("id")
        };

        console.log(params)
        projectId = params.id
            

        await fetch("/Envirolink/API/Projects/getStationInfo",{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                numberId: projectId,
            })
        }).then((res=>res.json()))
        .then((res)=>{
            console.log(res)
            res.station.map((obj)=>{
                console.log(obj.machines)
                stations = obj.machines
                stations.forEach(station => {
                    const option = document.createElement('option');
                    option.value = station;
                    option.textContent = station;
                    stationSelect.appendChild(option);
                });
            
                //createCard(obj.name,obj.create,obj.createDate,obj.numberId,obj.location[0],obj.location[1])
            })
            

        })
    }
    

    let parameters = []
    //read api for get projects
    async function getAPiMachineInfo(serial){

        await fetch("/Envirolink/API/Projects/getMachineInfo",{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                serial: serial,
            })
        }).then((res=>res.json()))
        .then((res)=>{
            console.log(res)
            
            res.machine.map((obj)=>{
                console.log(obj.parameters)
                parameters = obj.parameters
                let addHead = ""
                parameters.forEach(parameter => {
                    addHead = addHead+"<th>"+parameter+"</th>"
                });
                createHeader(addHead)
                //createCard(obj.name,obj.create,obj.createDate,obj.numberId,obj.location[0],obj.location[1])
            })
            

        })
    }


    

    //read api for get projects
    async function readAPiStation(serial,DateInit,DateEnd){
        await fetch("/Envirolink/API/Projects/getStationData",{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                serial: serial,
                DateInit:DateInit,
                DateEnd:DateEnd
            })
        }).then((res=>res.json()))
        .then((res)=>{

            bodyTableContainer.innerHTML='';
            let reads = ""
            console.log(res.station)
            res.station.map((obj)=>{
                let reads = ""
                parameters.forEach(parameter => {
                    reads = reads+'<td>'+obj[parameter]+'</td>'
                })
                
                createBodyTable(obj.DateTime,obj.Flags,reads,obj.Units)    
            })
            
        })
    }



    getAPiprojects()

    // Manejar la navegación entre secciones
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remover la clase 'active' de todos los enlaces y secciones
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Agregar la clase 'active' al enlace y sección seleccionados
            this.classList.add('active');
            const targetSection = document.getElementById(this.dataset.section);
            targetSection.classList.add('active');
        });
    });
});