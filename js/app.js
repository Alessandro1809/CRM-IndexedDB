(function(){
    let DB;
    const listaClientes=document.querySelector('#listado-clientes');
    document.addEventListener('DOMContentLoaded', function(){
        CrearDB();
        if(CrearDB= window.indexedDB.open('crm',1)){
            obtenerListadoDeClientes();
        }
        listaClientes.addEventListener('click', eliminarRegistro);
        
    });


    function CrearDB(){

        const CrearDB= window.indexedDB.open('crm',1);

        CrearDB.onerror=function(){
            console.log('Error al crear la base de datos');
        };

        CrearDB.onsuccess=function(){
           DB=CrearDB.result; 
        };

        CrearDB.onupgradeneeded=function(e){

            const db = e.target.result;

            const objectStore= db.createObjectStore('crm',{ keyPath: 'id', autoIncrement: true});

            objectStore.createIndex('nombre','nombre',{unique: false});
            objectStore.createIndex('email','email',{unique: true});
            objectStore.createIndex('telefono','telefono',{unique: false});
            objectStore.createIndex('empresa','empresa',{unique: false});
            objectStore.createIndex('id','id',{unique: true});

            console.log('Base de datos creada y lista');

        };


    }

function obtenerListadoDeClientes(){
    const abrirConexionDB= window.indexedDB.open('crm',1)
     
    abrirConexionDB.onerror= function(){
        console.log('Error al abrir conexion con la bd')
    }
    abrirConexionDB.onsuccess=function(){
        DB=abrirConexionDB.result;
        const objectStore=DB.transaction('crm').objectStore('crm');
        objectStore.openCursor().onsuccess=function(e){
            const cursor= e.target.result;
            if(cursor){
                const {nombre,email,telefono,empresa,id}=cursor.value;
              
                listaClientes.innerHTML+=`
                 <tr>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                    <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                    <p class="text-gray-700">${telefono}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                    <p class="text-gray-600">${empresa}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                    <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5 ">Editar</a>

                    <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                </td>
                </tr>
                `;

                cursor.continue();
            }else{
                console.log('no hay mas elementos');
            }
        }
    }
}


function eliminarRegistro(e){
    
    if(e.target.classList.contains('eliminar')){
        const idEliminar= Number(e.target.dataset.cliente);
       const confirmar= confirm('Seguro que deseas eliminar este cliente?')
       if (confirmar){
        const transaction= DB.transaction(['crm'],'readwrite');
        const objectStore= transaction.objectStore('crm');

        objectStore.delete(idEliminar);

        transaction.oncomplete=function(){
            e.target.parentElement.parentElement.remove();  
        }
        transaction.onerror= function(){
            console.log('error');
        }

       }
    };
}



})();