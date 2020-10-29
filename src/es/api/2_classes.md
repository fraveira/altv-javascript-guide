# Clases

La mayoría de clases en JavaScript requieren el operador `new` antes de construirse.

Aquí un ejemplo del constructor para la clase `alt.Vehicle`.

```ts
new Vehicle(model: string | number, x: number, y: number, z: number, rx: number, ry: number, rz: number): Vehicle
```

Como puedes observar leyendo el constructor, toma múltiples parámetros.

Sabiendo esto, puedes ahora spawnear un vehículo.

```js
// Crear un vehículo.
// La variable 'vehículo' es ahora una instancia de nuestro Vehículo.
const vehicle = new alt.Vehicle('infernus', 0, 0, 0, 0, 0, 0);

// Enciende el motor del vehículo.
vehicle.engineOn = true;

// Ajusta el color primario del vehículo a rojo.
vehicle.customPrimaryColor = {
    r: 255,
    g: 0,
    b: 0,
    a: 255
};
```
