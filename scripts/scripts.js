     // FILTRAR PRENDAS POR TIPO DE PRENDA

     function filtrarTipo(){

        cargarPrendas();
    }
    
    
    // FILTRAR PRENDAS POR COLOR

    function filtrarColor(){

        cargarPrendas();
    }

      // CARGA SELECT CON TIPOS DE PRENDAS

      fetch('https://rararopa-f4c58-default-rtdb.firebaseio.com/tipo_prenda.json')
      .then(response => response.json())
        .then(data => {
      
      
          const select = document.getElementById('ddl_tipo');
      
          let contador=1;
      
          for (let key in data) {


            
            if(data[contador]!=null){
                const option = document.createElement('option');
                option.value = data[contador].id;
                option.textContent = data[contador].tipo;
                select.appendChild(option);
                contador++;
            }
          }
        });



      // CARGA SELECT CON COLORES DE PRENDAS

        fetch('https://rararopa-f4c58-default-rtdb.firebaseio.com/color_prenda.json')
      .then(response => response.json())
        .then(data => {
          const select = document.getElementById('ddl_color');
      
          let contador=1;
      
          for (let key in data) {
      
            if(data[contador]!=null){
                const option = document.createElement('option');
                option.value = data[contador].id;
                option.textContent = data[contador].color;
                select.appendChild(option);
                contador++;
            }
           
          }
        });


      // CARGA PRENDAS

        let arrayPrendas = [];

        cargarPrendas();


        function cargarPrendas(){



          let div_cards = document.getElementById('product-cards');


          let contador=1; 

          let url = "https://rararopa-f4c58-default-rtdb.firebaseio.com/prenda.json";

     


          fetch(url)
          .then(response => response.json())
            .then(data => {

            
            // Filtrar los valores nulos
            let objetoFiltrado = Object.keys(data)
            .filter(key => data[key] !== null)
            .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
            }, {});

            
          let buscar = document.getElementById("txtBuscar").value;


          if(buscar.length>4){


            objetoFiltrado = Object.keys(objetoFiltrado).filter((item) => {
                return objetoFiltrado[item].nombre.includes(buscar)}) // buscar cadena 'mar' en la propiedad 'name'
                .reduce((obj, key) => {
                    obj[key] = objetoFiltrado[key];
                    return obj;
                    }, {});

                    
              
          }

        


            if(document.getElementById("ddl_tipo").value>0){

                objetoFiltrado = Object.keys(objetoFiltrado)
               .filter(key => objetoFiltrado[key] !== null)
               .filter(x => objetoFiltrado[x].id_tipo == document.getElementById("ddl_tipo").value)
               .reduce((obj, key) => {
               obj[key] = objetoFiltrado[key];
               return obj;
               }, {});
           }

            if(document.getElementById("ddl_color").value>0){

                objetoFiltrado = Object.keys(objetoFiltrado)
               .filter(key => objetoFiltrado[key] !== null)
               .filter(x => objetoFiltrado[x].id_color == document.getElementById("ddl_color").value)
               .reduce((obj, key) => {
               obj[key] = objetoFiltrado[key];
               return obj;
               }, {});
           }

       
         
            for(let key in objetoFiltrado){

              // Crear el elemento div con la clase card
              let card = document.createElement('div');
              card.className = 'card col-3 m-3';

              // Crear la imagen de la card
              let imagen = document.createElement('img');
              imagen.src = objetoFiltrado[key].url_imagen;
              imagen.className = 'card-img-top rounded align-self-center mr-3';
              
              card.appendChild(imagen);

              // Crear el cuerpo de la card
              let cuerpo = document.createElement('div');
              cuerpo.className = 'card-body';

              // Crear el título de la card
              let titulo = document.createElement('h5');
              titulo.className = 'card-title';
              titulo.textContent = objetoFiltrado[key].nombre;
              cuerpo.appendChild(titulo);

              // Crear el texto de la card
              let texto = document.createElement('p');
              texto.className = 'card-text';
              texto.textContent = objetoFiltrado[key].descripcion;
              cuerpo.appendChild(texto);

               // Crear el texto de la card
              let texto2 = document.createElement('p');
              texto2.className = 'card-text precio';
              texto2.id='p_precio'+objetoFiltrado[key].id;
              texto2.textContent = 'Precio: $'+ objetoFiltrado[key].precio;
              cuerpo.appendChild(texto2);
              
     
     
              let text = "Añadir al carrito";

              // Crear el botón de la card
              let boton = document.createElement('button');
              boton.className = 'btn btn-primary';
              boton.textContent = 'Añadir al carrito';
              boton.addEventListener('click', addToCart);
              cuerpo.appendChild(boton);

              // Añadir el cuerpo a la card
              card.appendChild(cuerpo);

              // Añadir la card al contenedor
              let contenedor = document.getElementById('product-cards');
              contenedor.appendChild(card);
              contador++; 

            }

            

            if(Object.keys(objetoFiltrado).length==0){


                let card = document.createElement('div');
                card.className = 'row';

               // Crear el cuerpo de la card
               let cuerpo = document.createElement('div');
               cuerpo.className = 'col';
 
               // Crear el título de la card
               let titulo = document.createElement('h5');
               titulo.className = 'card-title';
               titulo.textContent = 'Sin resultados';
               cuerpo.appendChild(titulo);

                  // Añadir el cuerpo a la card
              card.appendChild(cuerpo);

              // Añadir la card al contenedor
              let contenedor = document.getElementById('product-cards');
              contenedor.appendChild(card);
 

            }

         
     
          });


          div_cards.innerHTML="";

        }

        


        // Arreglo para almacenar los ítems del carrito
let cartItems = [];

// Función para añadir un ítem al carrito
function addToCart(event) {
  // Obtener los datos del producto
  let productName = event.target.closest('.card').querySelector('.card-title').textContent;
  let productPrice = event.target.closest('.card').querySelector('.precio').textContent;

productPrice=productPrice.replace("Precio: $","");

  // Crear un objeto que represente el ítem del carrito
  let cartItem = {
    name: productName,
    price: productPrice,
    quantity: 1
  };

  // Agregar el ítem al arreglo de ítems del carrito
  cartItems.push(cartItem);
   
  updateCartTable();

}


function updateCartTable() {
  let cartTableBody = document.getElementById("tabla-carrito");
  cartTableBody.innerHTML = "";
  let total = 0;

  for (let i = 0; i < cartItems.length; i++) {
    let item = cartItems[i];
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price * item.quantity}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${i})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    cartTableBody.appendChild(row);
    total += item.price * item.quantity;
  }

  let totalRow = document.createElement("tr");
  totalRow.innerHTML = `
    <td colspan="3"></td>
    <td>Total:$</td>
    <td>${total}</td>
  `;
  cartTableBody.appendChild(totalRow);
}
      