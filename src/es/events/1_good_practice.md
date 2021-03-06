# Buenas Prácticas con Eventos

Hay un montón de maneras con las que usar eventos, y el problema más común sucede al inicializar eventos dentro de eventos.

## Inicializando Eventos dentro de Eventos

Si eres de aquellas personas que está inicializando un evento dentro de un evento, más pronto que tarde vas a crear una pérdida de memoria en tu aplicación.

### Ejemplo genérico de Eventos del Servidor.

**NO HAGAS ESTO** ⚠️

```js
alt.on('playerConnect', handleConnection);

function handleConnection(player) {
    alt.on('doSomething', player => {
        player.health = 200;
    });

    alt.emit('doSomething', player); // <--- Esto es un problema
}
```

Lo que deberías de hacer es inicializar los eventos de esta manera.

**MEJOR HAZ ESTO** ✔️

```js
alt.on('playerConnect', handleConnection);
alt.on('doSomething', handleDoSomething);

function handleConnection(player) {
    alt.emit('doSomething', player);
}

function handleDoSomething(player) {
    player.health = 200;
}
```

**¿POR QUÉ** ❓

La razón por la que no lo hacemos de la primera manera es porque cada vez que un jugador se conecta a nuestro servidor, estamos inicializando múltiples instancias para los mismos eventos. Piensa en ello así: cada vez que un jugador entra en el servidor, el evento se crea nuevamente.

Si queremos que un evento en particular se dispare una vez por usuario, lo inicializamos una vez fuera del mismo evento.

### Muestra Genérica de WebView

Aquí mostramos otro ej emplo de cómo utilizar la API del lado del cliente.

**NO HAGAS ESTO** ⚠️

```js
const url = `https://resource/client/html/index.html`;
let view;
let somethingToSend;

alt.onServer('show:WebView', handleOpen);
alt.onServer('close:WebView', handleClose);

function handleOpen(_somethingToSend) {
    somethingToSend = _somethingToSend;

    // Carga una nueva Vista
    if (!view) {
        view = new alt.WebView(url);
    }

    // Añade un Evento
    view.on('load', handleLoad); // <-- Esto es un problema
    view.on('close', handleClose);
}

function handleClose() {
    if (!view) {
        return;
    }

    view.destroy();
    view = null;
}

function handleLoad() {
    if (!view) {
        return;
    }

    view.emit('sendSomething', somethingToSend);
}
```

Como con los ejemplos de más arriba, podemos justificar por qué la línea resaltada puede suponer un problema.

Ten en cuenta que cuando crear una WebView, estás creando una instancia individual.

Tras crear esta instancia individual, vas a añadir tus eventos.

Sin embargo, solo puedes enganchar tus eventos **una vez**.

**MEJOR HAZ ESTO** ✔️

```js
const url = `https://resource/client/html/index.html`;
let view;
let somethingToSend;

alt.onServer('show:WebView', handleOpen);
alt.onServer('close:WebView', handleClose);

function handleOpen(_somethingToSend) {
    somethingToSend = _somethingToSend;

    if (!view) {
        // Carga una nueva WebView y añade eventos
        view = new alt.WebView(url);
        view.on('load', handleLoad);
        view.on('close', handleClose);
    }
}

function handleClose() {
    if (!view) {
        return;
    }

    view.destroy();
    view = null;
}

function handleLoad() {
    if (!view) {
        return;
    }

    view.emit('sendSomething', somethingToSend);
}
```

## Apagando eventos no utilizados

Si tienes muchos eventos, puede que encuentres que algunos de ellos no son necesarios.

Puedes apagar eventos basados en dónde se encuentran de distintas maneras.

| Tipo de Evento de apagadoType of Off Event | Descripción                                                |
| ------------------------------------------ | ---------------------------------------------------------- |
| `alt.off`                                  | Apaga cualquier evento del lado del cliente o del servidor |
| `alt.offClient`                            | Apaga cualquier evento proveniente del cliente.            |
| `alt.offServer`                            | Apaga cualquier evento proveniente del servidor.           |
| `yourWebViewVariable.off`                  | Apaga cualquier evento proveniente de un WebView.          |

Todos estos eventos requieren que la `function` esté apagada. Eso quiere decir que no puedes crear una función de flecha o un callback en lugar de una función, si es que quieres apagar tus eventos. Más abajo puedes encontrar algunos ejemplos de esto.

### Usando 'alt.off'

Puede ser usado tanto del lado del servidor o del cliente.

Este es un ejemplo de cómo utilizar `alt.off`

```js
alt.on('doSomething', handleDoSomething);

function handleDoSomething() {
    // Esta función puede invocarse desde cualquier lugar.
    // No tienes que apagarla dentro del  evento.
    alt.off('doSomething', handleDoSomething); // <--- Esta función
}
```

### Usando 'alt.offClient'

Esto puede hacerse **solamente** del lado del servidor.

Este es un ejemplo de cómo usar `alt.offClient`.

```js
alt.onClient('doSomething', handleDoSomething);

function handleDoSomething() {
    // Esta función puede invocarse desde cualquier lugar.
    //  No tienes que apagarla dentro del  evento.
    alt.offClient('doSomething', handleDoSomething); // <--- Esta función
}
```

### Usando 'alt.offServer'

Esto puede hacerse **solamente** del lado del cliente.

Este es un ejemplo de cómo usar `alt.offServer`

```js
alt.onServer('doSomething', handleDoSomething);

function handleDoSomething() {
    // Esta función puede invocarse desde cualquier lugar.
    // No tienes que apagarla dentro del  evento.
    alt.offServer('doSomething', handleDoSomething); // <--- Esta función
}
```

### Using 'yourWebView.off'

En este ejemplo se usa WebView que se muestra **solamente** en el lado del cliente.

```js
const url = `https://resource/client/html/index.html`;
let view;
let somethingToSend;

alt.onServer('show:WebView', handleOpen);
alt.onServer('close:WebView', handleClose);

function handleOpen(_somethingToSend) {
    somethingToSend = _somethingToSend;

    if (!view) {
        // Cargar una nueva WebView y añadir eventos
        view = new alt.WebView(url);
        view.on('load', handleLoad);
        view.on('close', handleClose);
    }
}

function handleLoad() {
    if (!view) {
        return;
    }

    view.emit('sendSomething', somethingToSend);

    // Digamos que queremos apagar un evento justo tras crear la WebView.
    // Esta función muestra la manera.
    view.off('load', handleLoad); // <-- Esta función.
}
```

## Declaración de cierre

Ten en cuenta que si apagas un evento, necesitarás reinicializarlo después.

Aprovéchate de esto y no tendrás que apagar todos los eventos. Esta es solo una característica que debería ser utilizada más frecuentemente.
