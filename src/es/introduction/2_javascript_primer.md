# JavaScript Básico

El objetivo de esta página es explicar algunos principios básicos de JavaScript. La hemos creado teniendo en mente a aquellas personas que necesitan un "Crash course". Os recomendamos estos cursos (en inglés). En general, hace falta saber un mínimo de inglés para programar, al igual que hace falta un mínimo de JavaScript para poder programar en alt:V:

-   [https://learnxinyminutes.com/docs/javascript/](https://learnxinyminutes.com/docs/javascript/)
-   [https://www.learn-js.org/](https://www.learn-js.org/)
-   [https://bonsaiden.github.io/JavaScript-Garden/](https://bonsaiden.github.io/JavaScript-Garden/)

## Variables

Hay dos tipos de variables que se usan habitualmente en el JavaScript que se escribe hoy en día.
\*Nota del traductor, todos los ejemplos de código están escritos en inglés. Es recomendable que todo el desarrollo de un servidor en alt:V se haga dando nombres a las variables/funciones en inglés:

```js
const myVariable = 'example';
let myVariableName = 'example';
```

**const** significa que la variable es constante. Esto es, el tipo que representa la variable no puede cambiar, y las propiedades del contenido no pueden ser reasignadas, pero sí mutadas (alteradas). Requiere inicializarse con un valor.

**let** es un tipo de variable cuyos valores pueden ser reasignados: puede ser reutilizada una y otra vez a lo largo del mismo ámbito (scope). Inicializar con un valor es opcional.

```js
let myVariable;
myVariable = 'test';
myVariable = 25;
myVariable = {
    myProperty: 'Cool Stuff'
};
```

## Matemática básica

Las operaciones matemáticas en JavaScript son similares a las de otros lenguajes de programación.

```js
let result;

// Suma
result = 5 + 5;
result += 1;
console.log(result);

// Resta
result = 10 - 5;
result -= 1;
console.log(result);

// Multiplicación
result = 10 * 5;
result *= 2;
console.log(result);

// División
result = 10 / 5;
console.log(result);
```

## Funciones básicasBasic Functions

Las funciones son bloques especiales de código que pueden, a su vez, ser invocadas desde otros bloques de código. También pueden ser exportadas e importadas desde otros archivos (e invocadas). Hablaremos de las importaciones más abajo en esta sección.

Puedes escribir funciones de un montón de maneras distintas. Preferimos el método tradicional a las funciones flecha.

**Ejemplo de Función Tradicional**

```js
function myFancyFunction(myArgument, myOtherArgument) {
    console.log(myArgument);
    console.log(myOtherArgument);
}

myFancyFunction('hola', 'mundo');

function add(n1, n2) {
    return n1 + n2;
}

const result = add(5, 5);
console.log(result);
// Como resultado, logea 10 en la consola.
```

**Funciones flecha**

```js
const myFancyFunction = (myArgument, myOtherArgument) => {
    console.log(myArgument);
    console.log(myOtherArgument);
};

myFancyFunction('hola', 'mundo');

const add = (n1, n2) => {
    return n1 + n2;
};

const result = add(5, 5);
console.log(result);
// Como resultado, logea 10 en la consola.
```

## Exportando funciones

Exportar es una parte fundamental del proceso de desarrollo en alt:V. Sin embargo, las exportaciones no son JavaScript común. Vamos a utilizar la síntaxis moderna que aparece tras la especificación ECMASCript 2015 (o ES6), Esta sintaxis es algo distinta de aquella que aparece en JavaScript anterior a 2015.

Asumiendo que estos archivos se encuentran en el mismo directorio:

**File 1 - file1.js**

```js
export function myFunction(arg1, arg2) {
    console.log(arg1, arg2);
}
```

**File 2 - file2.js**

```js
import { myFunction } from './file1.js';

myFunction('hello', 'world');
```

**File 2 (Alternative) - file2.js**

```js
import * as myFuncs = from './file1.js'

myFuncs.myFunction('hello', 'world');
```

Es muy sencillo gestionar así las importaciones y exportaciones. Vamos a utilizar estas funciones de esta manera a lo largo de nuestro código, ya que cada módulo y funcionalidad de nuestro gamemode se encontrará físicamente en un archivo distinto.

## Bucles "for"

Los bucles se utilizan para un montón de objetivos distintos en JavaScript y deberían de ser parte fundamental de tu caja de herramientas como desarrollador para así escribir menos código. Un bucle "for" nos ayuda a iterar por un bloque de código múltiples veces. Esto nos permite, por ejemplo, ejecutar distintas acciones con los resultados dentro de una matriz (arreglo).
Los arreglos empiezan en 0, no como en el lenguaje de programación Lua. Así, el primer elemento de un arreglo se encuentra en posición 0.

```js
const data = ['test0', 'test1', 'test2'];

function saySomething(msg) {
    console.log(msg);
}

// i++ incrementa el número por uno en cada iteración
for (let i = 0; i < data.length; i++) {
    saySomething(data[i]);
}
```

El código superior logeará 3 veces. La primera,‘test0’; la segunda, ‘test1’, y por último, ‘test2’. Esto se consigue pasando los datos contenidos por este arreglo basado en el número de elementos (que es data.length) a lo largo de la cantidad de número total de elementos disponibles en el conjunto (índice numérico, o 2, equivalente a 3 elementos).
