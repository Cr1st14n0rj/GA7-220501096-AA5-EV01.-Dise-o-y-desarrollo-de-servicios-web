# GA7-220501096-AA5-EV01.-Dise-o-y-desarrollo-de-servicios-web
evidencia GA7-220501096-AA5-EV01. Diseño y desarrollo de servicios web sena, por Cristian Orjuela

## Ejecutar con Docker

```bash
docker compose up -d 
```

Los endpoints quedan en `http://localhost:8080/registro` y `http://localhost:8080/login`.

## Pruebas con Postman

Se probaron 7 casos (registro exitoso, duplicado, datos incompletos, login correcto, contraseña incorrecta, usuario inexistente y login sin datos). Ver `Documento_Pruebas` y la colección en la carpeta `postman/`.
