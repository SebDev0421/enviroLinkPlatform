document.addEventListener('DOMContentLoaded', function () {
    const estacionesContainer = document.getElementById('estaciones');
    const agregarEstacionBtn = document.getElementById('agregarEstacion');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const popup = document.getElementById("popup");
    const closePopupButton = document.getElementById("closePopup");
    const submitButton = document.getElementById("submitButton");
    let projectId = ""
    
    function createCard(title,create,dateCrated,idProject,lat,lng){
        const card = document.createElement("div");
        card.id = "estacion"
        card.classList.add(idProject);
        


        // Contenido de la tarjeta
        card.innerHTML = `
                <h2>`+title+`</h2>
                <div class="datos">
                    <div id="map`+idProject+`" class="map"></div>
                    <p><strong>Creado por:</strong><span class="valor">`+create+`</span></p>
                    <p><strong>Fecha de creacion:</strong> <span class="valor">`+dateCrated+`</span></p>
                    <p><strong>Numero de estacion:</strong> <span class="valor">`+idProject+`</span></p>
                </div>
        `;

        card.addEventListener('click',()=>{
            const params = new URLSearchParams({
                id: idProject
            });
            //open subproject

            window.location.href = `/estacion?${params.toString()}`;
        })

        estacionesContainer.appendChild(card);
        
        mapboxgl.accessToken = 'pk.eyJ1IjoiY2lyY3VpdGxvZ2ljZGV2IiwiYSI6ImNtMGVuZ2JvbzBybngyaW9oNjNhaWI3ZmsifQ.gdlu6SOdT5eiGQb8ERXT6Q';
        const map = new mapboxgl.Map({
            container: 'map'+idProject,
            style: 'mapbox://styles/mapbox/streets-v12',
            zoom: 12,
            center: [parseFloat(lat),parseFloat(lng)],
            interactive: false
        });

        const el = document.createElement('div');
        el.className = 'marker';
        new mapboxgl.Marker(el).setLngLat([parseFloat(lat),parseFloat(lng)]).addTo(map);
        // Agregar la tarjeta al contenedor

        /* // Inicializar mapa
                mapboxgl.accessToken = 'pk.eyJ1IjoiY2lyY3VpdGxvZ2ljZGV2IiwiYSI6ImNtMGVuZ2JvbzBybngyaW9oNjNhaWI3ZmsifQ.gdlu6SOdT5eiGQb8ERXT6Q';
                const map = new mapboxgl.Map({
                  container: 'map',
                  style: 'mapbox://styles/mapbox/streets-v12',
                  center: [data.location[0], data.location[1]], // Bogotá
                  zoom: 15
                });

                const el = document.createElement('div');
                el.className = 'marker';
                new mapboxgl.Marker(el).setLngLat([parseFloat(data.location[0]),parseFloat(data.location[1])]).addTo(map); */
        
    }


    //read api for get projects
    async function getAPiprojects(){

        const urlParams = new URLSearchParams(window.location.search);
        const params = {
            id: urlParams.get("id")
        };

        console.log(params)
        projectId = params.id
            

        await fetch("/Envirolink/API/Projects/getStations",{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                numberSubProject: projectId,
            })
        }).then((res=>res.json()))
        .then((res)=>{
            res.stations.map((obj)=>{
                console.log(obj)
                //convert date to colombia format
                const date = new Date(obj.createDate);
                const formatter = new Intl.DateTimeFormat("es-CO", {
                    timeZone: "America/Bogota",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                });
                const formattedDate = formatter.format(date);

                createCard(obj.name,obj.create,formattedDate,obj.numberId,obj.location[0],obj.location[1])
            })
            

        })
    }


    

    //read api for get projects
    async function addAPiprojects(create,name,numberId,serialController,lat,lng,createDate){
        await fetch("/Envirolink/API/Projects/addStations",{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                create: create,
                name: name,
                numberSubProject: projectId,
                numberId: numberId,
                serialController:serialController,
                location: [lat,lng],
                createDate: createDate,
                
            })
        }).then((res=>res.json()))
        .then((res)=>{
            console.log(res)
            if(res.status == 200){
                //reload 
            }
        })
    }



    getAPiprojects()


    // Función para agregar una nueva estación
    function agregarEstacion() {
        console.log("open pop up")
        popup.style.display = "flex";
    }

    closePopupButton.addEventListener("click", () => {
        popup.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });

    submitButton.addEventListener("click", () => {
        const nameInput = nameField.value;
        const createdInput = createdField.value;
        const numberIdInput = numberIdField.value;
        const serialControllerInput = serialControllerField.value;
        const latInput = latField.value;
        const lngInput = lngField.value;
        if (nameInput && createdInput && numberIdInput && serialControllerInput && latInput && lngInput){
            //conect api
            const now = new Date();

            // Usamos Intl.DateTimeFormat para formatear en zona Colombia
            const formatter = new Intl.DateTimeFormat("sv-SE", {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
            });

            // Obtenemos las partes de fecha/hora
            const parts = formatter.formatToParts(now);
            const getPart = type => parts.find(p => p.type === type).value;

            const colombiaDateTime = `${getPart("year")}-${getPart("month")}-${getPart("day")}T${getPart("hour")}:${getPart("minute")}:${getPart("second")}`;

            // Y le añadimos la zona horaria de Colombia
            const createdDateInput = colombiaDateTime + ".000-05:00";

            console.log(createdDateInput);
            addAPiprojects(createdInput,nameInput,numberIdInput,serialControllerInput,latInput,lngInput,createdDateInput)
            //alert("You entered: " + nameInput);
            popup.style.display = "none"; // Close the popup after submission
        } else {
            alert("Por favor llenar los campos");
        }

    });

    

    // Evento para agregar una estación al hacer clic en el botón
    agregarEstacionBtn.addEventListener('click', agregarEstacion);

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