# Usos y ejemplos de Eventos del Servidor.

Este documento proporciona un ejemplo para todos los eventos del servidor. Creemos que esto es necesario para asegurarnos de que verdaderamente entiendes cómo se disparan y tratan los eventos en alt:V.

## anyResourceError

Se dispara cuando cargas un recurso en `server.cfg` y da **error**.

-   resourceName es el nombre del recurso en tu archivo `server.cfg`

```js
alt.on('anyResourceError', handleEvent);

function handleEvent(resourceName) {
    console.log(`${resourceName} has failed to load.`);
}
```

## anyResourceStart

Se dispara cuando cargas un recurso your `server.cfg` y carga de manera correcta.

-   resourceName es el nombre del recurso en tu archivo `server.cfg`

```js
alt.on('anyResourceStart', handleEvent);

function handleEvent(resourceName) {
    console.log(`${resourceName} has loaded.`);
}
```

## anyResourceStop

Se dispara cuando fuerzas la detención de un recurso programáticamente o a través de la consola.

-   resourceName es el nombre del recurso en tu archivo `server.cfg`

```js
alt.on('anyResourceStop', handleEvent);

function handleEvent(resourceName) {
    console.log(`${resourceName} has been stopped. Restarting the resource.`);
    alt.restartResource(resourceName); // <-- This triggers the resource that stopped to restart automatically.
}
```

## consoleCommand

Se dispara cuando escribes en la consola del servidor en alt:V. Automáticamente separa tus palabras cuando presionas enter.

-   args es una matriz de cadenas

```js
alt.on('consoleCommand', handleEvent);

function handleEvent(args) {
    const cmd = args[0];

    if (cmd !== 'kickall') {
        return;
    }

    // Esto kickea a todos los jugadores que se encuentran online.
    const players = [...alt.Player.all];
    for (let i = 0; i < players.length; i++) {
        if (!players[i] || !players[i].valid) {
            continue;
        }

        players[i].kick();
    }
}
```

Digamos que escribimos el siguiente mensaje en la consola del servidor.

```
kickall
```

## entityEnterColshape

Si quieres verificar desde el lado del servidor si un jugador entra en un área específica, puedes usar una ColShape.

Están disponibles en [distintas formas y tamaños](https://altmp.github.io/altv-typings/classes/_alt_server_.colshape.html) y utilizaremos un cilindro para ilustrar este ejemplo.

-   colshape puede ser cualquier colshape cuando un jugador entra en ella (collission shape: forma de colisión)
-   la entidad puede ser tanto un Vehículo como un Jugador. -

```js
// Crear un ColshapeCylinder
// Parámetros entre paréntesis ( coordenadas x, y, z, radio, altura)
const cs = new alt.ColshapeCylinder(0, 0, 0, 3, 200);

// Esta es una función flecha que podemos acceder desde la instancia de la colshape.
cs.doSomething = player => {
    console.log(`You have a player in your grasp.`);
};

// Crear el evento.
alt.on('entityEnterColshape', handleEvent);

// Manejar el evento.
function handleEvent(colshape, entity) {
    // Dejar de lado cualquier entidad que no sea un jugador.
    if (typeof entity !== alt.Player) {
        return;
    }

    // Comprobar si la función existe, luego, ejecutarla.
    if (typeof cs.doSomething === 'function') {
        cs.doSomething(entity); // <-- Llamar la función flecha y pasarle el jugador como argumento.
    }
}
```

## entityLeaveColshape

Si quieres comprobar desde el lado del servidor si un jugador deja un área específica, puedes usar una ColShape.

Están disponibles en [distintas formas y tamaños](https://altmp.github.io/altv-typings/classes/_alt_server_.colshape.html) y utilizaremos un cilindro para ilustrar este ejemplo.

-   colshape puede ser cualquier colshape cuando un jugador entra o sale de ella (collission shape: forma de colisión)
-   la entidad puede ser tanto un Vehículo como un Jugador. -

```js
// Crear un ColshapeCylinder
// Parámetros entre paréntesis ( coordenadas x, y, z, radio, altura)
const cs = new alt.ColshapeCylinder(0, 0, 0, 3, 200);

// Esta es una función flecha que podemos acceder desde la instancia de la colshape.
cs.doSomething = player => {
    console.log(`You no longer have a player in your grasp.`);
};

// Crear el evento.
alt.on('entityLeaveColshape', handleEvent);

// Manejar el evento.
function handleEvent(colshape, entity) {
    // Obviar cualquier entidad que no sea un jugador.
    if (typeof entity !== alt.Player) {
        return;
    }

    // Comprobar si la función existe para luego ejecutarla.
    if (typeof cs.doSomething === 'function') {
        cs.doSomething(entity); // <-- Llamar la función flecha y pasarle el jugador como argumento
    }
}
```

## explosion

Una explosión es un evento único. En la mayoría de los servers se desactivan las explosiones. Este es uno de aquellos eventos en los que podemos retornar `return false` al final para evitar que las explosiones provoquen daños en el servidor.

-   entity es el origen del daño.
-   explosionType es un número
-   position es la ubicación de la explosión
-   exposionFx es el hash de ScreenFx utilizado para la explosión.
-   target es a quién/qué iba dirigida esta explosión.

```js
alt.on('explosion', handleEvent);

function handleEvent(entity, explosionType, position, explosionFxNumberOrHash, target?) {
    if (explosionType === 0) {
        return false; // Para no hacer daño a otros jugadores.
    }

    return true; // Hacer daño a otros jugadores
}
```

## playerChangedVehicleSeat

Este evento es llamado cuando un jugador se cambia de un asiento a otro.

-   player es una instancia de jugador que está cambiándose de asiento.
-   vehicle es el vehículo en el que se está subido.
-   oldSeat es el asiento anterior en el que el jugador estaba sentado.
-   newSeat es el nuevo asiento en el que el jugador se encuentra.

```js
alt.on('playerChangedVehicleSeat', handleEvent);

function handleEvent(player, vehicle, oldSeat, newSeat) {
    if (oldSeat === -1 && newSeat !== -1) {
        console.log(`${player.name} has left the driver's seat!`);
    }
}
```

## playerConnect

Evento que ocurre cuando un jugador se conecta al servidor.

Se puede cancelar la conexión del jugador ejecutando el comando `player.kick()`.

### Nada ocurre tras la Conexión del Jugador

Es importante entender que **NADA OCURRE** cuando un jugador se conecta. Has de usar `player.spawn` y `player.model` para ver al jugador.

-   player es el jugador que se ha unido al servidor.

```js
alt.on('playerConnect', handleEvent);

function handleEvent(player) {
    console.log(`${player.name} has joined the server.`);
    console.log(`${player.name} has will now see himself out.`);

    player.spawn(0, 0, 0);
    player.model = `mp_m_freemode_01`; // mp_f_freemode_01

    alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        player.kick();
    }, 5000);
}
```

## playerDamage

Este evento ocurre cuando un jugador recibe daño. El daño puede ser negado añadiendo de nuevo la salud faltante.

Se recomienda no usar este evento como alternativa a playerDeath. Cada cual tiene sus usos respectivos.

Si quieres las partes del cuerpo que han sido dañadas y otra información, consulta [weaponDamage](#weaponDamage)

-   player es el jugador que está siendo dañado
-   attacker es el jugador que está atacando al otro jugador.
-   weaponHash es el número hash para un arma
-   damage es el daño realizado a un jugador

```js
alt.on('playerDamage', handleEvent);

function handleEvent(player, attacker, weaponHash, damage) {
    player.health += damage;

    if (player.health > 200) {
        player.health = 200;
    }

    if (player.health <= 100) {
        // Están muertos
        player.spawn(player.pos.x, player.pos.y, player.pos.z);
    }

    return false; // Esto va a anular todo el daño recibido. No va a respawnear al jugador.
}
```

## playerDeath

Si pierdes toda la salud y mueres, este es el evento que se dispara.

-   player es el jugador que murió.
-   attacker es el jugador que causó la muerte de este jugador. Puede ser él mismo.
-   weaponHash es el hash del arma utilizada.

```js
alt.on('playerDamage', handleEvent);

function handleEvent(player, attacker, weaponHash) {
    console.log(`${player.name} has died in the hands of ${attacker.name}.`);
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 5000); // Esto respawneará al jugador en el lugar en 5 segundos.
}
```

## playerDisconnect

Este es el evento de desconexión cuando un jugador abandona el servidor.

-   player es el jugador que ha abandonado el servidor.
-   reason es la razón por la que se ha abandonado el servidor.

```js
alt.on('playerDisconnect', handleEvent);

function handleEvent(player, reason) {
    // Deberías the comprobar si el jugador es válido. La información del prototipo puede perderse si son inválidos.
    if (!player || !player.valid) {
        console.error(`Could not get data for a player. ${player.name}`);
    } else {
        // Clona la información que quieres guardar aquí tan pronto como sea posible.
        // Haz una declaración de tu base de datos aquí.
        // Tan pronto como esta función finaliza, la información del jugador se pierde.
    }

    console.log(`${player.name} has disconnected.`);
}
```

## playerEnteredVehicle

Este evento se dispara cuando un jugador se ha **sentado** en un vehículo. **No** **entrando**. **No comenzando a entrar**.

-   player que entró en el vehículo.
-   vehicle en el que el jugador se ha sentado.
-   seat es el asiento en el que el jugador está sentado. Consulta[esta tabla de asientos para más información](#Seat Table)

```js
alt.on('playerEnteredVehicle', handleEvent);

function handleEvent(player, vehicle, seat) {
    console.log(`${player.name} left the ${vehicle.model} by entering seat ${seat}`);
    vehicle.engineOn = true; // <-- El motor se enciende.
}
```

## playerLeftVehicle

Este evento se dispara cuando un jugador ha abandonado un vehículo completamente. **No en proceso de abandonarlo**. **No comenzando a abandonarlo**.

-   player que abandonó el vehículo.
-   vehicle que el jugador ha dejado.
-   seat es el asiento en el que el jugador se estaba sentando. Consulta [esta tabla para ver más información](#Seat Table)

```js
alt.on('playerLeftVehicle', handleEvent);

function handleEvent(player, vehicle, seat) {
    console.log(`${player.name} left the ${vehicle.model} by leaving seat ${seat}`);
    vehicle.engineOn = false; // <--  El motor se apaga
}
```

## removeEntity

Este evento se activa cuando una entidad es destruida, entidad como un jugador, vehículo, blip o forma de colisión (colshape).

-   object is either `player, vehicle, blip, or colshape`.

```js
alt.on('removeEntity', handleEvent);

function handleEvent(someObject) {
    if (typeof someObject === alt.Player) {
        console.log(`A player got yeeted.`);
    }

    if (typeof someObject === alt.Vehicle) {
        console.log(`A vehicle got yeeted.`);
    }

    if (typeof someObject === alt.Blip) {
        console.log(`A blip got yeeted.`);
    }

    if (typeof someObject === alt.ColShape) {
        console.log(`A player got yeeted.`);
    }
}
```

## resourceStart

A esto se le llama cuando un recurso está inicializándose.

-   errored nos indica qué recurso falló al cargar..

```js
alt.on('resourceStart', handleEvent);

function handleEvent(errored) {
    if (errored) {
        throw new Error(`Something went horribly wrong and I have no idea why.`);
    }

    console.log(`Guess everything loaded okay.`);
}
```

## resourceStop

A esto se le llama cuando un recurso ha parado. Es su último aliento antes de morir.

```js
alt.on('resourceStop', handleEvent);

function handleEvent() {
    console.log(`He's dead Jim.`);
}
```

## syncedMetaChange

Se le llama cuando el valor synced meta cambia para cualquier jugador, vehículo, colshape o blip.

Ten en cuenta que a **syncedMeta** se puede **acceder desde el lado del servidor y del cliente.**

-   entity es un `player, vehicle, colshape, or blip`
-   key es un identificador con el que la información se identifica. Piensa en ello como un key en map en términos de JavaScript.
-   value es un valor asociado con esa key.
-   oldValue es el valor anterior al valor que se está siendo pasado ahora.

```js
alt.on('playerConnect', player => {
    player.setSyncedMeta('connected', true);
});

alt.on('syncedMetaChange', handleEvent);

function handleEvent(entity, key, value, oldValue) {
    // Filtrar todas entidades que no sean jugadores.
    if (typeof entity !== alt.Player) {
        return;
    }

    // Comparar si key es lo que estamos buscando.
    if (key !== 'connected') {
        return;
    }

    // Acabamos de diseñar un innecesariamente complejo console.log para cuando un jugador se conecta. ¡¡Olé!!
    console.log(`${player.name} has connected.`);
}
```

## streamSyncedMetaChange

Se le llama cuando el valor synced meta cambia para cualquier jugador, vehículo, colshape o blip.

Ten en cuenta que a **streamSyncedMeta** se puede **acceder tanto desde el lado del servidor como del cliente** por jugadores que están dentro del rango streaming del otro.

-   entity es un `player, vehicle, colshape, or blip`
-   key es un identificador con el que la información se identifica. Piensa en ello como un key en map en términos de JavaScript.
-   value es un valor asociado con esa key.
-   oldValue es el valor anterior al valor que se está siendo pasado ahora.

```js
alt.on('playerConnect', player => {
    player.setStreamedSyncedMeta('Connected', true);
});

alt.on('streamSyncedMetaChange', handleEvent);

function handleEvent(entity, key, value, oldValue) {
    // Filtrar todas entidades que no sean jugadores.
    if (typeof entity !== alt.Player) {
        return;
    }

    // Comparar si key es lo que estamos buscando.
    if (key !== 'connected') {
        return;
    }

    // Acabamos de diseñar un innecesariamente complejo console.log para cuando un jugador se conecta. ¡¡Bien!!
    console.log(`${player.name} has connected.`);
}
```

## globalMetaChange

Saltaremos esta hasta que se implemente. Actualmente **no implementado**.

## globalSyncedMetaChange

Saltaremos esta hasta que se implemente. Actualmente **no implementado**.

## vehicleDestroy

Se le llamada c uando un vehículo ha sido dañado al punto en que ha sido destruido.

```js
const vehicle = new alt.Vehicle('infernus', 0, 0, 0, 0, 0, 0);
vehicle.currentModel = 'infernus';

alt.on('vehicleDestroy', handleEvent);

function handleEvent(vehicle) {
    const newPosition = { ...vehicle.pos };
    const newModel = vehicle.currentModel;

    if (vehicle.valid && vehicle.destroyed) {
        vehicle.destroy();
    }

    // Respawnea el vehículo cuando ha sido destruido.
    new alt.Vehicle(oldModel, newPosition.x, newPosition.y, newPosition.z, 0, 0, 0);
}
```

## weaponDamage

Evento que ocurre cuando un jugador provoca daño con un arma. El daño puede ser negado añadiendo la salud que se ha restado.

Se recomienda no utilizar este evento en lugar de playerDeath. Cada cual tiene su respectivo uso.

-   player es el jugador que está causando daño.
-   target es el jugador que está siendo atacado por el jugador "player"
-   weaponHash es el número hash de un arma
-   damage es el daño realizado al jugador
-   offset es un vector3 que representa dónde se ha dañado al jugador exactamente
-   bodyPart es el índice bone donde el jugador fue dañado.

```js
alt.on('weaponDamage', handleEvent);

function handleEvent(player, target, weaponHash, damage, offset, bodyPart) {
    console.log(`${player.name} attacked ${target.name}`);
    console.log(`${target.name} took ${damage} from ${weaponHash} at the bone index of ${bodyPart}`);
    console.log(`Denying Damage`);
    return false;
}
```

## startFire

Saltaremos esta hasta que se implemente. Actualmente **no implementado**.

## startProjectile

Saltaremos esta hasta que se implemente. Actualmente **no implementado**.

## playerWeaponChange

Esto sucede cuando un jugador cambia de un arma a otra distinta.

-   player es el jugador que se encuentra cambiando armas.
-   oldWeapon es el número hash de la anterior arma usada.
-   newWeapon es el número hash de la nueva arma que está siendo utilizada.

```js
alt.on('playerWeaponChange', handleEvent);

function handleEvent(player, oldWeapon, newWeapon) {
    // Prevent Weapon Swapping
    player.currentWeapon = oldWeapon;
}
```
