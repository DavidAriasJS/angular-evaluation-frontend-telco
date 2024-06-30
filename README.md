# Proyecto Angular - evaluation-frontend-telco

Este proyecto es una aplicación frontend desarrollada en Angular, que utiliza servicios simulados a través de `json-server` para pruebas locales.

## Requisitos previos

Asegúrate de tener instalado Node.js y npm en tu sistema. Puedes descargarlos desde [nodejs.org](https://nodejs.org/).

## Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/BryanAriasC/angular-evaluation-frontend-telco.git
   cd angular-evaluation-frontend-telco
    ```

2. **Instalar dependencias:**
    ```bash
   npm install
   ```

## Ejecución del proyecto
  Para iniciar la aplicación Angular y el servidor JSON simulado, utiliza los siguientes comandos:
    
  ```bash
  npm start
  ```

  Este comando utiliza `concurrently` para ejecutar simultáneamente el servidor de desarrollo de Angular (`ng serve`) y `json-server` con la configuración del archivo `db.json`.

  La aplicación estará disponible en `http://localhost:4200/`.

  ## Servicios JSON simulados
  Este proyecto utiliza `json-server` para simular servicios RESTful en `localhost:3000`.

   ### Servicios disponibles:
   Books: `http://localhost:3000/books`
   Authors: `http://localhost:3000/authors`
   Puedes acceder a estos servicios en tu navegador o realizar peticiones HTTP desde tu aplicación Angular para interactuar con los datos simulados.



## Desarrollado
`David Arias`

## Prueba técnica
``TELCOM HACOM``