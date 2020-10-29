# Eventos

Los eventos funcionan de modo muy específico y comprender cómo se comunican es muy importante.

El servidor puede hablar con cualquier cliente.
El cliente solo puede hablar con WebViews y con el servidor.

Un cliente **NO PUEDE** comunicarse con otro cliente.

| Nombre de la función | Descripción                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| alt.emit             | Emitir un evento en el lado del servidor o del cliente. Solo se recibe del lugar desde el que fue emitido |
| alt.on               | Recibe un evento. El servidor solo recibe eventos del servidor. El cliente, solo eventos del cliente.     |
| alt.onServer         | Recibe en el lado del cliente un evento emitido desde el servidor. Se dispara con `alt.emitClient`.       |
| alt.emitClient       | Emite un evento a un cliente específico, que el cliente recibe con `alt.onServer`.                        |
| alt.onClient         | Recibe en el lado del servidor un evento emitido desde el cliente. Se dispara con `alt.emitServer`.       |
| alt.emitServer       | Emite un evento al servidor, que el servidor recibe con `alt.onClient`.                                   |

## Servidor a cliente

El servidor solo puede emitir data al lado del cliente con un emitClient que requiere al jugador.
Sin embargo, también podemos sustituir un jugador por null, para así emitir el evento a todos los jugadores.

**Lado del servidor**

```js
alt.on('playerConnect', player => {
    alt.emitClient(player, 'sayHello');
});
```

**Lado del cliente**

```js
alt.onServer('sayHello', () => {
    alt.log('Hello from server.');
});
```

## De Cliente a Servidor

El cliente solo puede emitir informatión al lado del servidor con emitServer.
El onServer evento del lado del servidor recibe automáticamente el "Jugador" en su controlador de eventos (event handler).

**Lado del cliente**

```js
alt.on('connectionComplete', () => {
    alt.emitServer('sayHello');
});
```

**Lado del servidor**

```js
alt.onClient('sayHello', player => {
    alt.log(`${player.name} is saying hello`);
});
```

## Recursos del servidor a recursos del servidor

El servidor puede comunicarse consigo mismo con las funciones on y emit.
El cliente puede comunicarse consigo mismo con las funciones on y emit.
A su vez, pueden comunciarse con otros recursos.

**Lado del servidor**

```js
alt.emit('hello', 'this is a message');

alt.on('hello', msg => {
    alt.log(msg);
});
```

## Recursos del cliente a recursos del cliente

**Lado del cliente**

```js
alt.emit('hello', 'this is a message');

alt.on('hello', msg => {
    alt.log(msg);
});
```

## Cliente a WebView y viceversa

**Nota:** Con recursos en la dirección HTTP nos referimos al recurso en el cual estás actualmente escribiendo tu código.

**Lado del cliente**

```js
const webview = new alt.WebView('http://resource/client/html/index.html');
webview.on('test2', handleFromWebview);

function handleFromWebview(msg) {
    alt.log(msg);
}

alt.setTimeout(() => {
    webview.emit('test', 'Hello from Client');
}, 500);
```

**Página HTML en el lado del cliente**

```html
<html>
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <p>Words</p>
        <script type="text/javascript">
            if ('alt' in window) {
                alt.on('test', msg => {
                    console.log(msg);
                    alt.emit('test2', 'hello from webview');
                });
            }
        </script>
    </body>
</html>
```
