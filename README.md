# Proyecto Gym System

Este proyecto consiste en una plataforma completa para la gestión de gimnasios que incluye una API construida con **Node.js**, un frontend basado en **hbs (Handlebars)**, una base de datos **MySQL**, y una aplicación móvil desarrollada en **Flutter**. El desarrollo del proyecto se realizó utilizando **Windows 11** y **Visual Studio Code** como entorno de desarrollo.

---

## Descripción General

El sistema de gestión de gimnasios ofrece una solución integral para administrar las operaciones de un gimnasio, desde la gestión de clientes y membresías hasta la programación de rutinas y clases. Además, se incluye una aplicación móvil que permite a los usuarios gestionar sus actividades desde cualquier lugar.

## Características Principales

- **Gestión de Usuarios**: Registro e inicio de sesión con roles definidos (administradores, entrenadores, clientes).
- **Gestión de Membresías**: Creación, modificación y membresías.
- **Gestión de Clases y Rutinas**: Programación de clases, asignación de rutinas personalizadas y seguimiento del progreso.
- **Aplicación Móvil**: Acceso a las rutinas y clases desde una aplicación móvil.
- **Seguridad**: Implementación de cifrado para contraseñas y tokens de autenticación seguros.

## Tecnologías Utilizadas

- **Backend**: Node.js (Express)
- **Frontend**: hbs (Handlebars) para la generación de vistas dinámicas.
- **Base de Datos**: MySQL
- **Móvil**: Flutter
- **Autenticación y Seguridad**: JWT, bcrypt
- **Desarrollo en Windows 11**: Herramientas de desarrollo y entorno configurado en Visual Studio Code.


## Estructura del Proyecto

ProyectoGS-FINAL/
├── backend/
│   └── api/            # API construida con Node.js y Express
│       ├── src/        # Código fuente del backend
│       └── package.json
├── frontend/
│   └── hbs/            # Vistas y archivos públicos para el frontend
│       ├── public/
│       └── index.js    # Archivo principal del frontend
│       └── package.json
├── .gitignore          # Archivos ignorados por Git

## Seguridad
El sistema implementa seguridad para el manejo de usuarios y datos:

bcrypt se utiliza para cifrar las contraseñas antes de almacenarlas en la base de datos.
JWT (JSON Web Tokens) se utiliza para la autenticación de los usuarios, permitiendo la protección de rutas mediante la validación de tokens en las solicitudes.

## Contacto
Si tienes preguntas o necesitas más información sobre el proyecto, puedes contactarme a través de:

Correo: gymsysteminfo@gmail.com




