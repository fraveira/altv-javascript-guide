# Instalar Archivos del Servidor

## Requisitos Previos

Antes de comenzar, asegúrate de instalar estos programas y servicios.

-   [NodeJS 13+](https://nodejs.org/en/download/current/)
-   [Visual Studio Code](https://code.visualstudio.com/download)
-   [GIT](https://git-scm.com/downloads)
-   [Cliente alt:V](https://altv.mp/#/downloads)

## Supuestos generales

Esta guía asume que vas a estar trabajando en un entorno de desarrollo Windows.

-   Deberías saber cómo usar el Símbolo de Sistema o Powershell
-   Deberías saber cómo abrir el Símbolo de Sistema o Powershell
-   Deberías conocer que puedes ejecutar archivos .exe en el Símbolo de Sistema o Powershell.
-   Asumimos que tienes conocimientos básicos de JavaScript.

**Importante**

Todos los bloques de código con el prefijo `$` han de ejecutarse o bien en el Símbolo de Sistema o Windows Powershell.

¡ **NO** copies el símbolo `$` cuando ejecutes los comandos!

## Instalando altv-pkg

[altv-pkg](https://github.com/stuyk/altv-pkg) es la herramienta que te permitirá rápidamente ejecutar los archivos del servidor tanto en Windows como en Linux. Este recurso te servirá como base con la que trabajar más adelante.

Lo puedes instalar desde la consola (símbolo de Sistema o Powershell)

```sh
$ npm install -g altv-pkg
```

Si encuentras algún problema ejecutando e instalando archivos de manera global, abre una instancia de **Powershell** con la opción **Ejecutar como Administrador** seleccionada y ejecuta el siguiente comando:

```sh
$ Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted -Force;
```

Verifica la instalación comprobando la versión de altv-pkg

```sh
$ altv-pkg --version
```

## Cómo usar altv-pkg

Después de la instalación descargaremos los archivos del servidor.

Crea primero una carpeta donde ubicar tu servidor y, después, abre el Símbolo de Sistema dentro de esa carpeta.

```sh
$ altv-pkg d release
```

Tras ejecutar este comando, se te pedirá información relativa al gamemode que estás creando.

Por defecto, los archivos del servidor y los archivos "resource" se van a generar en tu carpeta actual.

Sigue las instrucciones en pantalla.

-   **N** para Voz
-   **Y** para Resource de ejemplo

![](../../img/cmd_altvpkg.gif)

## Comprendiendo los archivos descargados

Es importante echar un vistazo general a algunos de los archivos descargados. Aquí puedes ver una lista de algunos de los archivos que se han descargado después de que ejecutaras `altv-pkg d release`.

```
|   altv-server.exe
|   libnode.dll
|   package-lock.json
|   package.json
|   server.cfg
|   update.json
|
+---data
|       vehmodels.bin
|       vehmods.bin
|
+---modules
|       js-module.dll
|
\node_modules
\---resources
    \---example
        |   resource.cfg
        |
        +---client
        |       startup.js
        |
        \---server
                startup.js
```

### altv-server.exe

Este es el principal archivo binario que sirve para encender tu servidor. Puedes ejecutar el archivo desde el Símbolo de Sistema o Powershell:

```
$ altv-server.exe
```

Pulsa las teclas `Ctrl + C` para apagar el servidor.

### package.json

Aquí es donde los `node_modules` que usas están definidos. Es aquí donde vas a instalar los paquetes/módulos que pueden ser usados server-side (del lado del servidor). ¡Ten en cuenta que no puedes usar `node_modules` client-side (lado del cliente)!

```json
{
    "name": "altv-pkgserver",
    "version": "0.0.0",
    "description": "Don't worry we made this package.json for you.",
    "main": "index.js",
    "scripts": {
        "update": "altv-pkg d release"
    },
    "author": "stuyk",
    "type": "module",
    "prettier": {
        "printWidth": 120,
        "tabWidth": 4,
        "singleQuote": true,
        "bracketSpacing": true
    },
    "devDependencies": {
        "@altv/types-client": "^1.1.1",
        "@altv/types-natives": "^1.1.0",
        "@altv/types-server": "^1.4.2",
        "@altv/types-webview": "^1.0.2"
    }
}
```

Algunos puntos importantes que implica esta estructura JSON:

-   Estamos usando la extensión [Prettier para VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
-   Usamos `"type": "module"` para soportar la moderna [ES6 Sintaxis](https://www.w3schools.com/js/js_es6.asp).
-   Puedes actualizar los archivos del lado del servidor ejecutando `$ npm run update` desde el directorio base.

A grandes rasgos, esta es la estructura del archivo package.json, que funciona como un proyecto NodeJS al uso.

### server.cfg

Este archivo utiliza un parser personalizado para la configuración de tu servidor.

```sh
name: "TestServer",
host: "0.0.0.0",
port: 7788,
players: 1024,
#password: "verysecurepassword",
announce: false,
#token: no-token,
gamemode: "Freeroam",
website: "test.com",
language: "en",
description: "test",
debug: false,
modules: [
  "js-module",
],
resources: [
    "example"
],
tags: [
  "customTag1",
  "customTag2",
  "customTag3",
  "customTag4"
]
```

#### password

Password (contraseña) es un parámetro opcional. La línea estás comentada con `#`.

#### token

Token es un parámetro opcional. La línea estás comentada con `#`. Puedes obtener un token en el canal de Discord de alt:V enviando un mensaje a unos de los bots en la lista de miembros.

#### debug

(Modo depuración) Se recomienda que el parámetro tenga valor `true` cuando estés trabajando en tu servidor en modo desarrollo. Esta opción permitirá reconectarte si también tienes la opción `debug` activada en la [configuración del cliente](https://wiki.altv.mp/Altv.cfg).

#### resources

Aquí es donde puedes listar todas las carpetas que se encuentran dentro del directorio `/resources` y que quieres utilizar en tu proyecto. Todos los recursos han de incluir el archivo `resource.cfg` dentro de su propia carpeta para poder ser ejecutados correctamente como recursos.

Este es un ejemplo del `resource.cfg` que se puede encontrar en la carpeta `/resources/example`.

```sh
type: js,
main: server/startup.js,
client-main: client/startup.js,
client-files: [
	client/*
],
deps: []
```

El archivo de punto de entrada del recurso de ejemplo `example` es `/resources/example/server/startup.js`

Lo mismo aplica client-side (lado de servidor) excepto si utilizas `client` en vez de `server`.

### /data

Esta carpeta es donde tenemos archivos de datos que nos permiten definir qué vehículos corresponden a qué valores. Estos datos se deberían de descargar y utilizar automáticamente.

### /modules

Aquí es donde puedes cargar archivos `.dll` o `.so` para módulos que utilizan distintos lenguajes de programación, como por ejemplo, C#, Lua, etc. Estos archivos están creados generalmente por usuarios de la comunidad de alt:V.

### /node_modules

Aquí es donde los archivos descargados de NPM se instalan. Este es un ejemplo de cómo instalar la librería Stanford Javascript Crypto desde NPM.

```sh
$ npm i sjcl
```

### /resources

Resources es donde crearás los nuevos recursos que pueden ser cargados en tu `server.cfg`. Se recomienda encarecidamente que, si vas a crear un proyecto muy grande, crees únicamente un recurso por razones de rendimiento y facilidad de uso.

## Abrir tu Workspace

Abre la carpeta donde has configurado tu servidor alt:V en VSCode.

Debería de ser similar a esta imagen:

![](../../img/vscode_entry.png)

Puedes comenzar escribiendo tu código en `resources/example/startup.js`.

Asegúrate de que `server.cfg` contiene `example` dentro de la sección "resources" (recursos) de tu archivo `server.cfg`.

```sh
resources: [
  "example"
],
```

Ejecuta tu server desde la línea de comandos para asegurarte de que todo se ha cargado correctamente.

![](../../img/cmd_loaded.png)

## Conectando

Ahora puedes abrir tu cliente alt:V y utilizar la opción "Direct Connect" para conectarte localmente al servidor.

```
127.0.0.1:7788
```

## Server-Side

El código server-side (lado del servidor) debe de ser exclusivamente escrito en la carpeta `server`.

También necesitar importar los tipos `types` para alt:V Server Side.

```js
/// <reference types="@altv/types-server" />
import alt from 'alt-server';

alt.log('test');
```

Esto te permite que, al momento de escribir tu código en lado del servidor (server-side), obtendrás opciones de autocompletado, como en la siguiente imagen:

![](../../img/vscode_server_test.png)

## Client-Side

El cógido del lado del cliente (client-side) debe de escribirse en la carpeta `client`.

Este es el único lugar donde puedes utilizar códigos nativos `native`.

Y también te recomendamos importar los tipos/métodos `types` para programar en alt:V Client Side.

```js
/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';

alt.log(`You connected! Nice!`);
```

Cuando escribas código en client-side, deberías de obtener opciones de autocompletado:

![](../../img/vscode_client_test.png)
