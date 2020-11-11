# Guía de usos de Eventos

Ahora que hemos dado una pequeña visión del conjunto de eventos, hablemos sobre cómo leer la API.

_Si estos links están desactualizados, notificad a Stuyk._

-   [API del Servidor](https://altmp.github.io/altv-typings/modules/_alt_server_.html#on)
-   [API del cliente](https://altmp.github.io/altv-typings/modules/_alt_client_.html#on)

Abajo podemos ver usos comunes de los eventos. Podéis encontrar algunos ejemplos de código para usarlos.

[Consula ejemplos de Eventos del Servidor para ver más sobre Sintáxis y Parámetros](./server_events)

## Ejemplos de eventos en el lado del servidor

Este evento es el punto de entrada para cualquier jugador que se conecta en tu servidor. Deberías de utilizar este evento solo una vez en todo tu recurso. Escucha conexiones de jugadores. Puedes incluso kickear (echar) del servidor a un jugador antes de conectarse por completo. ck a player before they fully connect.

**Lado del servidor**

```js
// Un evento para controlar cuando un jugador se conecta.
alt.on('playerConnect', handlePlayerConnect);

// Utiliza la clase alt.Player
function handlePlayerConnect(player) {
    alt.log(`${player.name} has connected.`);
}
```

Es importante entender que **NO OCURRE NADA** después de que un jugador se conecta.

El jugador no puede moverse, no tiene ningún modelo predeterminado.

Aquí es como puedes dar un modelo al jugador y hacerlo aparecer en el servidor (spawn).

**Lado del servidor**

```js
/// <reference types="@altv/types-server" />
import alt from 'alt-server';

const spawn = {
    x: -1291.7142333984375,
    y: 83.43296813964844,
    z: 54.8916015625
};

alt.on('playerConnect', handlePlayerConnect);

function handlePlayerConnect(player) {
    player.spawn(spawn.x, spawn.y, spawn.z, 0);
    player.model = `mp_m_freemode_01`;
}
```

## Ejemplo del Lado del Cliente de connectionComplete

La alternativa para el evento `playerConnect` es el evento `connectionComplete` del lado del cliente. Esto se dispara cuando un jugador está totalmente conectado a un servidor.

Este evento es del lado del cliente y ya sabemos quién es el jugador. Esto solo ocurre en su ordenador y está basado en instancia.

Esto quiere decir que la función se ejecuta para todos los jugadores, pero solo para el jugador que se conectó.

**Lado del Cliente**

```js
alt.on('connectionComplete', handleConnectionComplete);

function handleConnectionComplete() {
    const myClientPosition = { ...alt.Player.local.pos };

    alt.log(`My Position Is: ${JSON.stringify(myClientPosition)}`);
    alt.emitServer('helloFromClient', 'this is a string');
}
```

**Lado del Servidor**

```js
alt.onClient('helloFromClient', handleHelloFromClient);

function handleHelloFromClient(player, msg) {
    console.log(`${player.name} sent up an event.`);
    console.log(msg);
}
```

## playerDeath Server Side & Client Side Sample

Player Death is a pretty common event. If a player dies you will want to use `player.spawn` to restore their functionality.

You will have to ragdoll them manually after they die if you wish for them to stay there for a long time. Keep in mind you must run `player.spawn` before marking them to be rag dolled.

### Server Side

```js
alt.on('playerDeath', handlePlayerDeath);

function handlePlayerDeath(victim, killer, weaponHash) {
    if (!victim || !victim.valid) {
        return;
    }

    if (killer && killer.valid) {
        alt.log(`${victim.name} was killed by ${killer.name}`);
    }

    alt.log(`${victim.name} will spawn in 5 seconds...`);
    alt.setTimeout(() => {
        if (!victim || !victim.valid) {
            return;
        }

        victim.spawn(0, 0, 0);
        victim.health = 200;
    }, 60000 * 3); // Will respawn the victim in 3 Minutes.
}
```

### Common Use Case

Let's say we want to ragdoll a player when they die and keep them ragdoll until they respawn there is a simple way we can do that.

#### Server Side

```js
alt.on('playerDeath', handlePlayerDeath);

function handlePlayerDeath(victim, killer, weaponHash) {
    // Validate that the victim exists.
    if (!victim || !victim.valid) {
        return;
    }

    // Respawn the player.
    victim.spawn(victim.pos.x, victim.pos.y, victim.pos.z);

    // If we already marked the victim as dead. Stop code execution.
    if (victim.isDead) {
        return;
    }

    // Mark the victim as dead.
    victim.isDead = true;
    alt.emitClient(victim, 'death:Handle', victim.isDead);

    // Start a timeout in 5 seconds that will respawn them.
    alt.setTimeout(() => {
        // Verify they are still in the server in 5 seconds.
        if (!victim || !victim.valid) {
            return;
        }

        // Unmark them as dead and respawn them.
        victim.isDead = false;
        alt.emitClient(victim, 'death:Handle', victim.isDead);
        victim.spawn(0, 0, 0); // Set to your Hospital Position
        victim.health = 200;
    }, 5000);
}
```

#### Client Side

```js
let interval;
let isDead = false;

// Receive the value from server side.
alt.on('death:Handle', value => {
    // Update our local value.
    isDead = value;

    // If the value is false. Don't re-create the interval.
    if (!isDead) {
        return;
    }

    // Start an interval that calls a function every 100ms.
    interval = alt.setInterval(handleDeathTicks, 100);
});

function handleDeathTicks() {
    // If they are no longer marked as dead. Clear the interval.
    if (!isDead) {
        alt.clearInterval(interval);
        return;
    }

    // If they are marked as dead. Ragdoll them.
    native.setPedToRagdoll(alt.Player.local.scriptID, 5000, 0, 0, true, true, false);
}
```

## playerLeftVehicle & playerEnteredVehicle Server Side Sample

These events are triggered when a player enters or leaves a vehicle.

Here's an example of deleting the vehicle the player entered after they exit it.

```js
alt.on('playerEnteredVehicle', handlePlayerEnteredVehicle);
alt.on('playerLeftVehicle', handlePlayerLeftVehicle);

function handlePlayerEnteredVehicle(player, vehicle, seat) {
    // Store information about the vehicle and seat on the player.
    player.currentSeat = seat;
    player.lastVehicle = vehicle;
}

function handlePlayerLeftVehicle(player, vehicle, seat) {
    // Check if the seat is the driver seat. Check if the vehicle is valid.
    if (player.currentSeat === -1 && player.lastVehicle.valid) {
        player.lastVehicle.destroy();
        player.lastVehicle = null;
        player.currentSeat = -2;
    }
}
```
