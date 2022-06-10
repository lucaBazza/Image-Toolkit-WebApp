# vue-modal-project

![AppThumb](https://github.com/lucaBazza/Image-Toolkit-WebApp/blob/testing/src/assets/Thumbnail-ImageToolkitApp-v0.jpg)

WebApp VueJS che permette di gestire un catalogo di immagini caricate dall'utente, modificando metadata ed esportando con watermark, stich panorama, re-frame con differenti dimensioni.

## Note varie
Aggiungere un pacchetto: prima aggiungerlo in package.json > dependences, poi da bash
```console
    npm install npm-install-missing
```

## Avviare client e server
client
```console
    npm run serve
```

server
```console
    cd server && npm run devserver
```

client in modalità production
```console
    npm run build && serve -s dist
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Testing
```
npm run test
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
