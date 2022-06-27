# Image Toolkit App

![AppThumb](https://github.com/lucaBazza/Image-Toolkit-WebApp/blob/testing/src/assets/Thumbnail-ImageToolkitApp-v0.jpg?raw=true)

WebApp VueJS che permette di gestire un catalogo di immagini caricate dall'utente, modificando metadata ed esportando con watermark, stich panorama, re-frame con differenti dimensioni.

.

> [image-toolkit-app.web.app](https://image-toolkit-app.web.app/)

.


### Project setup
```
    npm install  ||   npm ci
```

### Compiles and hot-reloads for development
```
    npm run serve
```

### Compiles and minifies for production
```
    npm run build
```

### Build and serve locally in production mode
```
    npm run build && serve -s dist

    or

    firebase serve -o 0.0.0.0
```

### Lints and fixes files
```
    npm run lint
```

### Testing
```
    npm run test
```

### Firebase deploy
```
    firebase deploy

    firebase emulators:export seed
    firebase emulators:start --import seed
```



.

---
# TODOs
Dockerization (frontend + firebase emulator + raspbarry porting)

.

.

---

# Note varie


PWA > Apple Icon Scaling using ffmpeg
```js
ffmpeg -i logoToolkit-512px.png  -vf scale=60:-1 apple-touch-icon-60x60.png
ffmpeg -i logoToolkit-512px.png  -vf scale=76:-1 apple-touch-icon-76x76.png
ffmpeg -i logoToolkit-512px.png  -vf scale=120:-1 apple-touch-icon-120x120.png
ffmpeg -i logoToolkit-512px.png  -vf scale=152:-1 apple-touch-icon-152x152.png
ffmpeg -i logoToolkit-512px.png  -vf scale=180:-1 apple-touch-icon-180x180.png
ffmpeg -i logoToolkit-512px.png  -vf scale=180:-1 apple-touch-icon.png
```

.


> cool gallery for show images

https://codepen.io/suez/pen/wMMgXp 

> wow menu bar

https://codepen.io/uiswarup/pen/qBObQKG

> sweet menu bar

https://codepen.io/gzkdev/details/VwKqjGm

.

.


# check addizionali firebase

> firebase function modules
```
cd functions && npm install
```

> configurazione emulatore
```
firebase login
firebase init emulators ( function, firestore, auth, storage)
firebase serve -o 0.0.0.0  (on local-network)
```

> java JDK (using homebrew*)
```
brew install java11
sudo ln -sfn /usr/local/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk
java -version
```
