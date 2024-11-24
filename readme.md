# Proyecto de React Native

Este es un proyecto de la materia Programacion Web Frontend de la Facultad Politecnica la Universidad Nacional de Asuncion.

## Dependencias

- React Native

## Comandos para ejecutar

### Iniciar json-server

Para ejecutar `db.json`, usa el siguiente comando:

```bash
npx json-server --watch db.json --port 3000
```

### Iniciar el proyecto con npm

Para instalar las dependencias y ejecutar el proyecto, usa los siguientes comandos:

```bash
npm install
npm start
```

Asegúrate de tener `npm` instalado globalmente en tu sistema.

## Descripción del Proyecto

Este proyecto es una aplicación de ventas desarrollada en React Native. Permite a los usuarios navegar por productos, agregar productos al carrito, gestionar categorías y realizar ventas. La aplicación también incluye funcionalidades para filtrar ventas por fecha, cliente y tipo de operación.

## Configuración del Entorno

1. Clona el repositorio en tu máquina local.
2. Navega al directorio del proyecto.
3. Asegúrate de tener `npm` instalado globalmente en tu sistema.
4. Crea un archivo `.env` en el directorio raíz del proyecto.
5. Agrega las siguientes variables de entorno al archivo `.env` para configurar la comunicación con el emulador:

```properties
db_ip=192.168.0.1
```

Estas variables permiten que la aplicación se comunique con el servidor JSON y el emulador de Android.

## Verificación e Instalación de Dependencias

Para verificar si tienes `npm` instalado globalmente, puedes usar los siguientes comandos:

```bash
npm -v
npx -v
```

Si no tienes `npm` instalado, puedes instalarlo usando el siguiente comando:

Para instalar `npm`:

```bash
npm install -g npm
```

Para más detalles sobre la instalación y configuración de React Native en diferentes sistemas operativos, visita la [página oficial de React Native](https://reactnative.dev/docs/environment-setup).

## Ejecución del Proyecto

Sigue los comandos mencionados anteriormente para iniciar `json-server` y el proyecto de React Native.
