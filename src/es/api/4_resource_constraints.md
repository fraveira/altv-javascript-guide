# Recurso Único vs Múltiple

Dependiendo en la dirección que quieras llevar a tu proyecto puede ser interesante preguntarse si deberías de utilizar un recurso único o múltiples recursos que puedan ser encendidos y apagados a voluntad.

Es preciso mencionar que los recursos adicionales recibirán su propio thread (hilo).

Veamos primero algunas de las limitaciones de utilizar recursos múltiples.

## Limitaciones de Recursos Múltiples

Una limitación se definirá como aquello que puede causar problemas o inconvenientes al crear tu gamemode.

### Los prototipos no se comparten

Si disfrutas extendiendo la funcionalidad de clases individuales y añadiendo nuevas funcionalidades, entonces un sistema de Recursos múltiples no te va a ayudar mucho.
Hablemos del porqué.

Si tienes un prototipo como el siguiente.

```js
alt.Player.local.addMoney = function addMoney(amount) {
    if (isNaN(amount)) {
        return false;
    }

    if (!this.money) {
        this.money = amount;
    } else {
        this.money += amount;
    }

    return true;
};
```

Ahora tendrás solo acceso a la functión `addMoney` dentro del recurso en el que está escrita.

No es posible portar esta función a otro recurso debido a que las variables no se comparten entre distintos recursos.

### Las propiedades personalizadas no se comparten

¿Te preguntas por qué `setMeta` y `getMeta` existen? Este es el porqué.

Con la función de más arriba podemos añadir dinero al jugador. Pero, ¿y si queremos usarla en otro recurso?

Echemos un vistazo a cómo sería el código.

```js
// Usamos "export" porque queremos importarla dentro de otros recursos.
export function addMoney(amount) {
    if (isNaN(amount)) {
        return false;
    }

    if (!this.hasMeta('money')) {
        this.setMeta('money', amount);
    } else {
        let currentAmount = this.getMeta('money');
        currentAmount += amount;
        this.setMeta('money', currentAmount);
    }
}

// Usamos "export" porque queremos importarla dentro de otros recursos.
export function getMoney(amount) {
    if (!this.hasMeta('money')) {
        return 0;
    }

    return this.getMeta('money');
}
```

Como ves, hemos creado dos nuevas funciones que pueden ser importadas dentro de cualquier otro recurso, siempre y cuando este recurso esté asignado como dependencia del recurso donde queremos añadir/obtener dinero.

Todo esto está muy bien, pero el único beneficio de hacerlo sería para los subprocesos integrados en C++.

¿Por qué molestarse en dividir todo esto añadiendo mayor dificultad a tu proyecto cuando puedes hacerlo todo en un recurso individual? (Y no hablamos de un archivo individual. Eso es una idea desafortunada. No estamos en SAMP)

## Limitaciones de Recurso Único

Obviamente, lo que más vas a echar en falta al utilizar recurso único son los subprocesos. Sin embargo, la mayor parte de las personas que crean recursos no los van a necesitar. Esto incluye a aquellos de vosotros que queréis escribir gamemodes de juegos de rol y buscáis seguir 'buenas prácticas' de programación.

### Pérdida de estado

Cuando reinicias un recurso único, pierdes el estado del recurso que guarda su estado dentro de sí.
Esto quiere decir que para restablecer el estado, tienes que reconectarte.

Un ejemplo sería `player.money`, si fuese 500 antes de reiniciar un recurso.

Entonces, `player.money` sería 0 después de reiniciar el recurso ya que no volviste a generar el estado de tu jugador otra vez.

### Mantenimiento de la Estructura de Archivos.

Si estás creando un gamemode muy grande, vas a tener un recurso muy grande. Lo que significa que si no tienes una buena estructura de carpetas, te vas a encontrar con dificultades para mantener todo tu código organizado. Esta es una de las principales razones por las que la gente opta por un sistema de Recurso Múltiple.

Una de mis estructuras favoritas es como la que os muestro a continuación:

#### Estructura de Carpetas del Cliente.

```sh
├───anticheat 				# Carpeta para sistemas relacionados con anticheat.
├───events				    # Carpeta para manejar eventos del lado del cliente
├───gamedata			    # Carpeta para datos de objetos relativos al juego.
├───html				    # Carpeta para todas las interfaces HTML/VUE/etc
│   ├───atm
│   ├───charactereditor
│   ├───characterselect
│   ├───clothing
│   ├───hud
│   ├───help
│   ├───inventory
│   ├───login
├───systems					# Carpeta con los archivos que tienen funcionalidad correspondiente en el lado del servidor.
│   ├───inventorySystem.js	 	# Encargado de funcionalidad del inventario.
│   └───vehicleSystem.js		# Encargado de funcionalidad de vehículos general. Por ejemplo, setIntoVehicle
├───utility					# Funciones matemáticas o por el estilo.
└───views					# Aquí es donde llamas a la creación/eliminación de tu WebView
    ├───atm.js				# Encargado del funcionamiento de cajeros automáticos en el lado del cliente.
    └───chat.js				# Encargado del funcionamiento del chat en el lado del cliente.
```

Ten en cuenta que carpetas individuales se pueden ampliar a más carpetas.

Sin embargo, el truco de esta estructura de carpetas es mantener el mismo nombre del archivo en el lado del cliente, para así saber qué archivo se corresponde con qué sistema.

#### Estructura de Carpetas del Servidor.

```sh
├───commands				# Manipulación de comandos.
│   ├───cmdPlayer.js 			# Comandos específicos para jugadores.
│   └───cmdVehicle.js			# Comandos específicos para vehículos.
├───configuration			# Todo aquello relativo a configuración: puntos de spawneo, preconfiguraciones, etc.
├───events				    # Utilizado para controlar eventos exclusivos del lado del cliente.
├───extensions				# Prototipos para distintas clases de la API de alt:V.
│   ├───player.js
│   ├───vehicle.js
│   └───colshape.js
├───gamedata
├───systems					# Carpeta de archivos con sus correspondientes correlatos en el lado del cliente.
│   ├───inventorySystem.js	 	 # Encargado de funcionalidad del inventario.
│   └───vehicleSystem.js		 # Encargado de funcionalidad de vehículos general. Por ejemplo, setIntoVehicle
├───utility					# Funciones matemáticas o por el estilo.
└───views					# Carpeta correlativa que se encarga de la funcionalidad "view" en el lado del cliente.
    ├───atm.js				# Encargado del funcionamiento de cajeros automáticos en el lado del servidor.
    └───chat.js 			# Encargado de enrutar mensajes (en el lado del cliente).
```

## Una opinión

Creo que la funcionalidad añadida de los Prototipos tiene más peso que las desventajas de que un Recurso Único pueda propiciar. Con un buen sistema de carpetas y un buen conocimiento de tu código, es muy fácil trabajar con recurso único, siempre y cuando dividas tus archivos en sistemas individuales con sus correspondientes nombres, tanto en el lado del cliente comoe en el lado del servidor.

La mayoría de desarrolladores que utilizan JavaScript en alt:V deciden no utilizar recurso múltiple solo por este motivo.
