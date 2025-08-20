document.addEventListener('DOMContentLoaded', function () {

    //get if active session
    const activeSession = localStorage.getItem('sessionEnvirolink');
    if (!activeSession) {
        window.location.href = '/loginEnvirolink';
    }

    const estacionesContainer = document.getElementById('estaciones');
    const agregarEstacionBtn = document.getElementById('agregarEstacion');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const popup = document.getElementById("popup");
    const closePopupButton = document.getElementById("closePopup");
    const submitButton = document.getElementById("submitButton");
    
    
    function createCard(title,create,dateCrated,Client,idProject){
        const card = document.createElement("div");
        card.id = "estacion"
        card.classList.add(idProject);
        


        // Contenido de la tarjeta
        card.innerHTML = `
                <h2>`+title+`</h2>
                <div class="datos">
                    <p><strong>Creado por:</strong><span class="valor">`+create+`</span></p>
                    <p><strong>Fecha de creacion:</strong> <span class="valor">`+dateCrated+`</span></p>
                    <p><strong>Cliente:</strong> <span class="valor">`+Client+`</span></p>
                    <p><strong>Numero de proyecto:</strong> <span class="valor">`+idProject+`</span></p>
                </div>
        `;

        card.addEventListener('click',()=>{
            const params = new URLSearchParams({
                id: idProject
            });

            window.location.href = `/subproyecto?${params.toString()}`;
            //open subproject
        })

        // Agregar la tarjeta al contenedor
        estacionesContainer.appendChild(card);
    }
    //read api for get projects
    async function getAPiprojects(){
        await fetch("/Envirolink/API/Projects/getProjects",{
            method:'GET'
        }).then((res=>res.json()))
        .then((res)=>{
           
            res.projects.map((obj)=>{
                console.log(obj)
                createCard(obj.name,obj.create,obj.createDate,obj.client,obj.numberId)
            })

        })
    }


    

    //read api for get projects
    async function addAPiprojects(create,name,numberId,client,createDate){
        await fetch("/Envirolink/API/Projects/addProject",{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                create: create,
                name: name,
                numberId: numberId,
                client: client,
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
        const clientInput = clientField.value;
        if (nameInput && createdInput && numberIdInput && clientInput) {
            
            //conect api
            const now = new Date();
            const createdDateInput = now.toISOString()
            addAPiprojects(createdInput,nameInput,numberIdInput,clientInput,createdDateInput)
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