# Uso y ejemplos de Eventos del Cliente

Este documento proporciona un ejemplo para cada evento del cliente. Creemos que esto es fundamental para asegurarnos de que verdaderamente entiendes cómo se disparan y tratan los eventos en alt:V.

## Un truco importante

Si intentas utilizar `console.log` en el lado del cliente, **no** va a funcionar.

Deberás utilizar `alt.log`.

```js
alt.log(`Hello on client side.`);
alt.log(`Your position is: ${JSON.stringify(alt.Player.local.pos)}`);
```

## anyResourceError

Se dispara cuando cargas un recurso en tu archivo `server.cfg` y tira un **error**.

-   resourceName es el nombre del recurso en tu `server.cfg`

```js
alt.on('anyResourceError', handleEvent);

function handleEvent(resourceName) {
    console.log(`${resourceName} has failed to load.`);
}
```

## anyResourceStart

Se dispara cuando cargar un recurso en tu `server.cfg` y carga correctamente.

-   resourceName es el nombre del recurso en tu `server.cfg`

```js
alt.on('anyResourceStart', handleEvent);

function handleEvent(resourceName) {
    console.log(`${resourceName} has loaded.`);
}
```

## anyResourceStop

Se dispara cuando fuerzas la detención de un recurso a través de código o de la consola.

-   resourceName es el nombre de un recurso en tu `server.cfg`

```js
alt.on('anyResourceStop', handleEvent);

function handleEvent(resourceName) {
    console.log(`${resourceName} has been stopped. Restarting the resource.`);
    alt.restartResource(resourceName); // <-- Dispara el recurso que se paró para que reinicialice automáticamente.
}
```

## connectionComplete

A este evento se le llama cuando has accedido al servidor y todos los recursos se han cargado para ti.

```js
alt.on('connectionComplete', handleEvent);

function handleEvent() {
    alt.log(`Welcome!`);
}
```

## consoleCommand

Se dispara cuando escribes algo en la consola del cliente de alt:V. Automáticamente separa tus palabras cuando presionas enter.

-   args es una matriz de cadenas

```js
alt.on('consoleCommand', handleEvent);

function handleEvent(args) {
    const cmd = args[0];

    if (cmd !== 'loghello') {
        return;
    }

    alt.log(`Hello from client.`);
}
```

Digamos que escribimos esto en la consola del servidor.

```
loghello
```

## disconnect

Este evento es más útil cuando estás reconectando tu entorno de desarrollo local. Se utiliza para limpiar cualquiera de los cambios hechos en el juego antes de reconectar nuevamente.

```js
alt.on('disconnect', handleEvent);

function handleEvent() {
    alt.log(`You have disconnected.`);
    // Después de este evento no funcionan más mensajes o funciones.
}
```

## gameEntityCreate

Se le llama cuando un jugador, vehículo, o cualquier otra cosa entra en el rango de streaming del cliente.

Queremos decir que si a un vehículo se está entrando desde fuera de tu rango de streaming, comenzará a sincronizarse para el jugador que se encuentre dentro de este evento.

-   entity es la entidad creada. .

### Lado del servidor

```js
alt.on('playerConnect', player => {
    player.model = 'mp_m_freemode_01';
    player.spawn(0, 0, 0);

    // Spawnear un vehículo.
    const vehicle = new alt.Vehicle('infernus', 0, 0, 0, 0, 0, 0);
    alt.emitClient(player, 'setIntoVehicle', vehicle);
});
```

### Lado del cliente

```js
// Comienza la ejecución desde el lado del servidor.
alt.onServer('setIntoVehicle', handleSetIntoVehicle);

function handleSetIntoVehicle(vehicle) {
    alt.Player.local.needsVehicle = vehicle;
}

// Comienza la implementación del evento
alt.on('gameEntityCreate', handleEvent);

function handleEvent(entity) {
    // Verifica si la entidad es un vehículo.
    if (typeof entity !== alt.Vehicle) {
        return;
    }

    // Verifica si este es el vehículo que estamos esperando.
    if (alt.Player.local.needsVehicle !== entity) {
        return;
    }

    // Desactiva la búsqueda de nuevos vehículos.
    alt.Player.local.needsVehicle = false;

    // Les coloca en el asiento del conductor.
    // ScriptID se utiliza para obtener el handle del vehículo de y del jugador de los "natives".
    native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle.scriptID, -1);
}
```

## gameEntityDestroy

Se le llama cuando un vehículo, jugador, o cualquier cosa, deja el rango streaming de un cliente.

Esta es una opción muy buena en caso de que necesites destruir objetos asociados a jugadores que dejan un área.

Digamos que la entidad más abajo posee un objeto definido por su scriptID.

```js
alt.on('gameEntityDestroy', handleEvent);

function handleEvent(entity) {
    // Comprobar si esta entidad es un vehículo.
    if (typeof entity !== alt.Player) {
        return;
    }

    // Comprobar si este es el vehículo que queremos.
    if (!alt.Player.local.attachedObject) {
        return;
    }

    // Borrar dicho objeto.
    native.deleteEntity(alt.Player.local.attachedObject);
    alt.Player.local.attachedObject = false;
}
```

## keydown

Se llama cuando un jugador presiona una tecla en su teclado.

Puedes encontrar[los códigos de tecla en esta web](http://keycode.info/?ref=stuyk).

-   keycode es el identificador de la tecla en JavaScript

```js
alt.on('keydown', handleEvent);

function handleEvent(keycode) {
    if (keycode !== 70) {
        alt.log(`Pressed 'F' to pay respects.`);
    }
}
```

## keyup

Se llama cuando un jugador deja de presionar una tecla.

Puedes encontrar[los códigos de tecla en esta web](http://keycode.info/?ref=stuyk).

-   keycode es el identificador de la tecla en JavaScript

```js
alt.on('keyup', handleEvent);

function handleEvent(keycode) {
    if (keycode !== 69) {
        alt.log(`Pressed 'E' to say nice.`);
    }
}
```

## removeEntity

El evento sucede cuando una entidad es destruida, ocomo un jugador, vehículo, blip o colshape.

-   object es tanto `player, vehicle, blip, o colshape`.

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

Se llama cuando tu recurso está iniciándose.

-   errored nos ayuda a saber si el recurso no ha cargado correctamente.

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

Se le llama cuando el valor synced meta ha cambiado para cualquier jugador, vehículo, colshape o blip.

Ten en cuenta que a **syncedMeta** se puede **acceder desde el lado del cliente y del servidor.**

-   entity es un `player, vehicle, colshape, or blip`
-   key es un identificador con el que la información se identifica. Piensa en ello como un key en map en términos de JavaScript.
-   value es un valor asociado con esa key.
-   oldValue es el valor anterior al valor que se está siendo pasado ahora.

**Lado del Servidor**

```js
alt.on('playerConnect', player => {
    player.setSyncedMeta('Connected', true);
});
```

**Lado del Cliente**

```js
alt.on('syncedMetaChange', handleEvent);

function handleEvent(entity, key, value, oldValue) {
    // Filtrar tipos que no sean jugadores.
    if (typeof entity !== alt.Player) {
        return;
    }

    // Comparar la key para ver si es lo que estábamos buscando.
    if (key !== 'connected') {
        return;
    }

    // Acabamos de diseñar un innecesariamente complejo console.log para cuando un jugador se conecta. ¡¡Olé!!
    alt.log(`You have joined the server.`);
}
```

## streamSyncedMetaChange

Se le llama cuando el valor synced meta ha cambiado para cualquier jugador, vehículo, colshape o blip.

Ten en cuenta que a **streamSyncedMeta** se puede **acceder desde el lado del cliente y del servidor** por jugadores que se encuentren en su rango de streaming.

-   entity es un `player, vehicle, colshape, or blip`
-   key es un identificador con el que la información se identifica. Piensa en ello como un key en map en términos de JavaScript.
-   value es un valor asociado con esa key.
-   oldValue es el valor anterior al valor que se está siendo pasado ahora.

**Lado del Servidor**

```js
alt.on('playerConnect', player => {
    player.setStreamedSyncedMeta('Connected', true);
});
```

**Lado del Cliente**

```js
alt.on('streamedSyncedMetaChange', handleEvent);

function handleEvent(entity, key, value, oldValue) {
    // Filtrar tipos que no sean jugadores.
    if (!(entity instanceof alt.Player)) return;

    // Comparar la key para ver si es lo que estábamos buscando.
    if (key !== 'connected') {
        return;
    }

    // Acabamos de diseñar un innecesariamente complejo console.log para cuando un jugador se conecta. ¡¡Olé!!
    console.log(`You have joined the server.`);
}
```

## globalMetaChange

Saltaremos este evento hasta que se implemente. Actualmente **no implementado**.

## globalSyncedMetaChange

Saltaremos este evento hasta que se implemente. Actualmente **no implementado**.
