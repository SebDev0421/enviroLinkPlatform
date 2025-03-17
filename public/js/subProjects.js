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
                    <p><strong>Numero de subproyecto:</strong> <span class="valor">`+idProject+`</span></p>
                </div>
        `;

        card.addEventListener('click',()=>{
            const params = new URLSearchParams({
                id: idProject
            });
            //open subproject

            window.location.href = `/estaciones?${params.toString()}`;
        })

        estacionesContainer.appendChild(card);
        
        mapboxgl.accessToken = 'pk.eyJ1IjoiY2lyY3VpdGxvZ2ljZGV2IiwiYSI6ImNtMGVuZ2JvbzBybngyaW9oNjNhaWI3ZmsifQ.gdlu6SOdT5eiGQb8ERXT6Q';
        const map = new mapboxgl.Map({
            container: 'map'+idProject,
            style: 'mapbox://styles/mapbox/streets-v9',
            zoom: 12,
            center: [parseFloat(lat),parseFloat(lng)],
            interactive: false
        });

        const el = document.createElement('div');
        el.className = 'marker';
        new mapboxgl.Marker(el).setLngLat([parseFloat(lat),parseFloat(lng)]).addTo(map);
        // Agregar la tarjeta al contenedor
        
    }


    //read api for get projects
    async function getAPiprojects(){

        const urlParams = new URLSearchParams(window.location.search);
        const params = {
            id: urlParams.get("id")
        };

        console.log(params)
        projectId = params.id
            

        await fetch("/Envirolink/API/Projects/getSubProjects",{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                numberProject: projectId,
            })
        }).then((res=>res.json()))
        .then((res)=>{
            res.subprojects.map((obj)=>{
                console.log(obj)
                createCard(obj.name,obj.create,obj.createDate,obj.numberId,obj.location[0],obj.location[1])
            })
            

        })
    }


    

    //read api for get projects
    async function addAPiprojects(create,name,numberId,lat,lng,createDate){
        await fetch("/Envirolink/API/Projects/addSubProject",{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                create: create,
                name: name,
                numberProject: projectId,
                numberId: numberId,
                location: [lat,lng],
                createDate: createDate
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
        const latInput = latField.value;
        const lngInput = lngField.value;
        if (nameInput && createdInput && numberIdInput && latInput && lngInput){
            //conect api
            const now = new Date();
            const createdDateInput = now.toISOString()
            addAPiprojects(createdInput,nameInput,numberIdInput,latInput,lngInput,createdDateInput)
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