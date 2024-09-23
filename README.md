
## DB & API

### Build with

 <img src="https://skillicons.dev/icons?i=docker,ts,postgresql,prisma" />
 
### Install

Use node 20 (specified in the .nvmrc file)
```
nvm use
```
Dependencies
```
yarn install
```
Run project
```
yarn dev
```
Apply first migration
```
yarn migrate init
```
Create admin user
```
yarn seed:createAdmin -- <email> <password>
```

### Develop

Run project el proyecto
```
docker-compose up
yarn dev
```
When updating models: generate/apply migrations and regenerate prisma-client
```
yarn run migrate <migration name>
yarn run generate
```