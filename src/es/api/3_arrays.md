# Obteniendo todos los Jugadores y Vehículos

Hay dos colecciones (arrays) que existen en el lado del servidor y que te pueden ayudar a determinar todos los jugadores o vehículos.

## alt.Player.all

Esta array retorna un listado de todos los jugadores que ser encuentran actualmente en tu servidor.

Pero ten en cuenta algunas cosas cuando utilices arrays como esta.

1. Siempre clona tu array. Te ayudará a evitar problemas del tipo undefined o invalid.

```js
const currentPlayers = [...alt.Player.all];
```

2. Cuando iteres sobre tus jugadores, valídalos.

```js
const currentPlayers = [...alt.Player.all];

// Iterando sobre jugadores.
for (let i = 0; i < currentPlayers.length; i++) {
    const aPlayer = currentPlayers[i];

    // Comprobamos su validez revisando si 'aPlayer.valid' es true.
    if (!aPlayer || !aPlayer.valid) {
        continue;
    }

    // Haz otras cosas
}

// Otra manera de iterar sobre jugadores.
currentPlayers.forEach((player, index) => {
    // Comprobamos su validez aquí
    if (!player || !player.valid) {
        return;
    }

    // Haz otras cosas
});
```

## alt.Vehicle.all

Asegúrate de haber leído la sección superior porque el mismo proceso sirve para los vehículos.

```js
const currentVehicles = [...alt.Vehicle.all];

// Itera sobre vehículos
for (let i = 0; i < currentVehicles.length; i++) {
    const aVehicle = currentVehicles[i];

    // Comprobamos su validez revisando si 'aVehicle.valid' es true.
    if (!aVehicle || !aVehicle.valid) {
        continue;
    }

    // Haz otras cosas
}

// Otra manera de iterar sobre vehículos.
currentVehicles.forEach((vehicle, index) => {
    // Comprobamos su validez aquí
    if (!vehicle || !vehicle.valid) {
        return;
    }

    // Haz otras cosas
});
```
