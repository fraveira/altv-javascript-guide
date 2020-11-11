# Introducción a los eventos

Los eventos son la base fundamental a la hora de trabajar con alt:V.

Ayudan a obtener una instancia del jugador siempre que realizan un evento específico. Por ejemplo, conectarse al servidor, entrar en un vehículo, salir de un vehículo, y mucho más.

Echemos un vistazo a los eventos disponibles actualmente.

## Eventos del lado del Servidor

| Nombre del evento        | Descripción                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| playerConnect            | Cuando un jugador se conecta al servidor                                                          |
| playerDisconnect         | Cuando un jugador se desconecta al servidor                                                       |
| anyResourceStart         | Cuando se inicia cualquier recurso                                                                |
| anyResourceStop          | Cuando se para cualquier recurso                                                                  |
| anyResourceError         | Cuando hay un error en un recurso                                                                 |
| resourceStart            | Cuando un recurso específico se inicia                                                            |
| resourceStop             | Cuando un recurso específico se para                                                              |
| syncedMetaChange         | Cuando una entidad recibe un cambio en su syncedMeta                                              |
| streamSyncedMetaChange   | Cuando una entidad en el rango de streaming de un cliente recibe un cambio en su streamSyncedMeta |
| playerDamage             | Cuando un jugador es dañado por otro o por otra cosa.                                             |
| playerDeath              | Cuando un jugador muere.                                                                          |
| explosion                | Cuando se crea una explosión, por ejemplo, al chocar contra un surtidor de gasolina               |
| weaponDamage             | Cuando un arma provoca daño                                                                       |
| vehicleDestroy           | Cuando un vehículo es destruido                                                                   |
| entityEnterColshape      | Cuando una entidad entra un ColShape.                                                             |
| entityLeaveColshape      | Cuando una entidad deja un ColShape.                                                              |
| playerEnterVehicle       | Cuando un jugador entra en un vehículo. Se dispara cuando se sienta.                              |
| playerLeaveVehicle       | Cuando un jugador sale de un vehículo.                                                            |
| playerChangedVehicleSeat | Cuando un jugador se cambia de asiento en un vehículo                                             |
| removeEntity             | Cuando una entidad se elimina del juego.                                                          |
| consoleCommand           | Cuando escribes un mensaje en la consola de tu servidor y presionas ENTER                         |

[Echa un vistazo a la API de Eventos del servidor para más Información](https://altmp.github.io/altv-typings/modules/_alt_server_.html#on)

## Eventos del lado del cliente

| Nombre del evento      | Descripción                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| connectionComplete     | Cuando un jugador se conecta completamente al servidor en el lado del cliente                     |
| disconnect             | Cuando un jugador se desconecta del servidor, esto se activa en el lado del cliente               |
| anyResourceStart       | Cuando cualquier recurso se inicia                                                                |
| anyResourceStop        | Cuando cualquier recurso se para                                                                  |
| anyResourceError       | Cuando hay un error en un recurso.                                                                |
| resourceStart          | Cuando un recurso específico se inicia                                                            |
| resourceStop           | Cuando un recurso específico se para                                                              |
| syncedMetaChange       | Cuando una entidad recibe un cambio en su syncedMeta                                              |
| streamSyncedMetaChange | Cuando una entidad en el rango de streaming de un cliente recibe un cambio en su streamSyncedMeta |
| keydown                | Cuando un jugador presiona una tecla                                                              |
| keyup                  | Cuando una tecla se deja de presionar                                                             |
| gameEntityCreate       | Cuando una entidad entra el rango de streaming de un cliente                                      |
| gameEntityDestroy      | Cuando una entidad deja el rango de streaming de un cliente                                       |
| removeEntity           | Cuando una entidad se elimina del juego.                                                          |
| consoleCommand         | Cuando escribes un mensaje en la consola de tu servidor y presionas enter                         |

[Echa un vistazo a la API de Eventos del Cliente para más Información](https://altmp.github.io/altv-typings/modules/_alt_client_.html#on)
