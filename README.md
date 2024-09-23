## DB & API

### Instalacion
Instalar docker y ejecutar

Usar node 20

Instalar dependencias
```
yarn install
```

Levantar el proyecto
```
yarn dev
```

Aplicar migraciones
```
yarn migrate init
```

Crear admin
```
yarn seed:createAdmin -- <email> <password>
```

### Desarrollo

Levantar el proyecto
```
yarn dev
```

Al actualizar modelos: generar/aplicar migraciones y regenenerar prisma-client
```
yarn run migrate <nombre de la migracion>

yarn run generate
```
