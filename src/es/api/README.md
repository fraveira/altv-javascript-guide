# Introducción a la API

La API es donde puedes encontrar la mayoría de la información relativa a las funcionalidades de alt:V que te permitirá escribir código.

Lo único que cabe considerar es que hay pocos ejemplos que muestran cómo usar estas funcionalidades.

-   [https://altmp.github.io/altv-typings/](https://altmp.github.io/altv-typings/)

## Navegando por la API

Cuando leas la API, te encontrarás con dos secciones **(Haz clic en el link que aparece arriba)**

-   alt-server

    -   Aquí se refieren todas las funcionalidades relativas al server-side (lado del servidor).

-   alt-client

    -   Se refiere a aquellas funcionalidades disponibles en el client-side (lado del cliente).

    -   Habitualmente se utilizan "natives" / funcionalidad del propio juego.

    -   Solo afecta al cliente del jugador.

## Leyendo la API

En la API, todos los parámetros y sus tipos se encuentran definidos en funcionesl y clases.

Aquí podéis ver un ejemplo de la función `alt.on`.

```ts
on(eventName: "playerConnect", listener: (player: Player) => void): void
```

Al principio, observar este código puede resultar algo confuso si no estáis habituados a leer APIs.

-   El nombre del evento se llama `on`
-   El primer parámetro es `playerConnect`
-   Mientras que el segundo parámetro es un "oyente" o una función de retrollamada (callback). Pasa el tipo `alt.Player`.
    -   Puedes hacer clic (o colocar el cursos encima) para ver qué tipo de propiedades están disponibles.
    -   Algunas de estas propiedades son `name`, `ip`, etc.
-   `:void` significa que no se espera que la función retorne ningún valor.

Aquí podéis ver la misma función siendo utilizada.

```js
alt.on('playerConnect', handlePlayerConnect);

function handlePlayerConnect(player) {
    alt.log(`${player.name} connected to the server.`);
}
```

## Usando la API

Generalmente te vas a encontrar con distintos tipos de variables, funciones, clases, etc.

Hablemos de qué significa cada una de ellas y cómo son representadas en el código.

### Funciones

Las funciones se comportan como funciones al uso y la API tiene una sección para ellas.

![](../../img/functions.png)

Este es un ejemplo de cómo usar una de las funciones que aparecen más arriba.

```js
alt.setTimeout(() => {
    alt.log(`Hello. This triggered after 5 seconds.`);
}, 5000);
```

### Clases

Las clases funcionan como clases normales en JavaScript. Solo dependen de cómo hayas importado tus `alt-server` y `alt-client`.

Asumamos que utilizas `alt` como el prefijo para todo lo relacionado con alt:V.

![](../../img/classes.png)

Ten en cuenta que no todas las clases son accesibles o pueden ser creadas.
Aquí mostramos un ejemplo del uso de una de esas clases.

```js
const pos = new alt.Vector3(0, 0, 0);
const vehicle = new alt.Vehicle('infernus', pos.x, pos.y, pos.z, 0, 0, 0);
const shape = new alt.ColshapeCylinder(pos.x, pos.y, pos.z, 5, 10);
```

### Propiedades

Las propiedades generalmente existen dentro de clases. Se puede acceder a ellas **sin** el uso de paréntesis.

Las propiedades pueden ser leídas, no siempre hace falta establecerlas.

He aquí un ejemplo con un vehículo.

```js
const vehicle = new alt.Vehicle('infernus', 0, 0, 0, 0, 0, 0);

if (vehicle.engineOn === false) {
    vehicle.engineOn = true;
}
```

### Métodos

A su vez, los métodos existen generalmente dentro de clases. Se puede acceder a los mismos con paréntesis.

```js
const vehicle = new alt.Vehicle('infernus', 0, 0, 0, 0, 0, 0);
const result = vehicle.getDoorState(0);
vehicle.setArmoredWindowHealth(0, 100);
```
