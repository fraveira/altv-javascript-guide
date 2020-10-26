# Configurar Depuración del cliente

A este punto deberías de tener instalado el cliente alt:V.

Ve a la ubicación del archivo altv.exe y busca altv.cfg.

![](../../img/edit_cfg.png)

## altv.cfg

Asegúrate de que este parámetro está configurado como "true".

Si no existe el parámetro, créalo.

```sh
debug: 'true'
```

## Reconectando

Después de reiniciar el servidor, serás desconectado del mismo. Solo puedes reconectar el servidor si el parámetro `debug` es `true`. También el parámetro `debug` de tu cliente debe de estar marcado como `true`.

Presiona la tecla `F8` para reconectar al servidor

**Con contraseña**

```
reconnect password_goes_here
```

**Sin contraseña**

```
reconnect
```
