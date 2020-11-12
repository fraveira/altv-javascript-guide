# Guía de usos de Eventos

Ahora que hemos dado una pequeña visión del conjunto de eventos, hablemos sobre cómo leer la API.

_Si estos links están desactualizados, notificad a Stuyk._

-   [API del Servidor](https://altmp.github.io/altv-typings/modules/_alt_server_.html#on)
-   [API del cliente](https://altmp.github.io/altv-typings/modules/_alt_client_.html#on)

Abajo podemos ver usos comunes de los eventos. Podéis encontrar algunos ejemplos de código para usarlos.

[Consula ejemplos de Eventos del Servidor para ver más sobre Sintáxis y Parámetros](./server_events)

## Muestras de eventos en el lado del servidor

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

## Muestra del Lado del Cliente de connectionComplete

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

## Muestra en Lado del Servidor/Cliente de playerDeath

La muerte del jugador es un evento bastante común. Si un jugador muere, querrás utilizar `player.spawn` para devolverle su funcionalidad.

Deberás de desactivarles manualmente después de que mueren si deseas que sigan en ese estado durante más tiempo. Ten en cuenta que has de ejecutar `player.spawn` antes de marcarles para que sigan en ese estado.

### Lado del Servidor

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

### Usos habituales.

Veamos cómo mantener en estado inactivo a un jugador cuando muere y mantenerlos así hasta que respawnean. Hay un modo simple de hacer esto.

#### Lado del Servidor

```js
alt.on('playerDeath', handlePlayerDeath);

function handlePlayerDeath(victim, killer, weaponHash) {
    // Validamos que la víctima existe.
    if (!victim || !victim.valid) {
        return;
    }

    // Respawneamos al jugador.
    victim.spawn(victim.pos.x, victim.pos.y, victim.pos.z);

    // Si ya hemos marcado a la víctima como muera, entonces paramos la ejecución del código.
    if (victim.isDead) {
        return;
    }

    // Marcamos la víctima como muerta
    victim.isDead = true;
    alt.emitClient(victim, 'death:Handle', victim.isDead);

    // Comenzamos una cuenta atrás para que en 5 segundos la víctima respawnee.
    alt.setTimeout(() => {
        // Verifica que todavía siguen en el servidor tras 5 segundos.
        if (!victim || !victim.valid) {
            return;
        }

        // Desmárcalos como muertos y respawnéalos.
        victim.isDead = false;
        alt.emitClient(victim, 'death:Handle', victim.isDead);
        victim.spawn(0, 0, 0); // Pon la posición de tu hospital
        victim.health = 200;
    }, 5000);
}
```

#### Lado del Cliente

```js
let interval;
let isDead = false;

// Recibimos el valor del lado del servidor.
alt.on('death:Handle', value => {
    // Actualiza tu valor local.
    isDead = value;

    // Si el valor es negativo, no recreemos el intervalo.
    if (!isDead) {
        return;
    }

    // Inicia un intervalo que llama a la función cada 100 milisegundos.
    interval = alt.setInterval(handleDeathTicks, 100);
});

function handleDeathTicks() {
    // Si ya no están marcados como muertos, se borra el intervalo.
    if (!isDead) {
        alt.clearInterval(interval);
        return;
    }

    // Si están marcados como muertos, "ragdol-lealos".
    native.setPedToRagdoll(alt.Player.local.scriptID, 5000, 0, 0, true, true, false);
}
```

## Muestra del lado del Servidor de playerLeftVehicle y playerEnteredVehicle.

Estos eventos se disparan cuando un jugador entra o deja un vehículo.

Aquí mostramos un ejemplo de cómo borrar el vehículo que un jugador ha utilizado cuando sale de él.

```js
alt.on('playerEnteredVehicle', handlePlayerEnteredVehicle);
alt.on('playerLeftVehicle', handlePlayerLeftVehicle);

function handlePlayerEnteredVehicle(player, vehicle, seat) {
    // Guarda información sobre el vehículo, y el asiento del jugador.
    player.currentSeat = seat;
    player.lastVehicle = vehicle;
}

function handlePlayerLeftVehicle(player, vehicle, seat) {
    // Verifica si el asiento es el asiento del conductor. Verifica si el vehículo es válido.
    if (player.currentSeat === -1 && player.lastVehicle.valid) {
        player.lastVehicle.destroy();
        player.lastVehicle = null;
        player.currentSeat = -2;
    }
}
```
