# [PicKit.app](https://image-toolkit-app.web.app/)

Image editor native for the web.

![AppThumb](https://raw.githubusercontent.com/lucaBazza/Image-Toolkit-WebApp/master/others/screenshots/20220724-screen.webp)

## Features
- 🔍 Catalog images combining ML classification and exif metadatas

- 🎨 Color grading with LUTs, filters and noise algorithm, powered by WebGL direcly on your device 

- ✂️ Crop, resize, add watermark and description based on image subject

- 📸 Integration with Photoshop with custom script compiler

- 📲 Mobile first

- 🌎 Public showcase gallery

- 🔌 PWA Offline mode

- 🏎 FAST local image caching 50 RAW A7iii catalog in 43ms

## Tech stack

- Vue3
- Typescript
- Firebase
- WebGL + Three.js
- Ml5, fork of Tensorflow.js
- PWA

## Project setup
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
```
```
    firebase serve -o 0.0.0.0
```

### Testing
```
    npm run test
    npm run test CatalogoFormExample
```

### Firebase deploy
```
firebase deploy
firebase emulators:export seed
firebase emulators:start --import seed
```

---
## Features in development

- Dockerization (frontend + firebase emulator + raspbarry porting)

- Face Api

- Custom LUT uploading

- More customizable public galleries

- Premium user plans


.


## Misc

PWA > Apple Icon Scaling using ffmpeg
```js
ffmpeg -i logoToolkit-512px.png  -vf scale=60:-1 apple-touch-icon-60x60.png
ffmpeg -i logoToolkit-512px.png  -vf scale=76:-1 apple-touch-icon-76x76.png
ffmpeg -i logoToolkit-512px.png  -vf scale=120:-1 apple-touch-icon-120x120.png
ffmpeg -i logoToolkit-512px.png  -vf scale=152:-1 apple-touch-icon-152x152.png
ffmpeg -i logoToolkit-512px.png  -vf scale=180:-1 apple-touch-icon-180x180.png
ffmpeg -i logoToolkit-512px.png  -vf scale=180:-1 apple-touch-icon.png
```

thumbs Cover webp:
```
for i in *.png; 
    do cwebp -q 70 -resize 720 0 $i -o "${i%.*}.webp";
done;

```

fix porte rimaste aperte
```
sudo lsof -i :3000  //Find Pid
kill -9 <pid>    //kill

lsof -t -i :8081 | xargs kill -9

```


Note: for ML classifier is needed to get for each classification a GET of the image => crossOrigin = anonymus, check firebase service CORS policy

> https://stackoverflow.com/questions/37760695/firebase-storage-and-access-control-allow-origin

.

> cool gallery for show images

https://codepen.io/suez/pen/wMMgXp 

> wow menu bar

https://codepen.io/uiswarup/pen/qBObQKG

> sweet menu bar

https://codepen.io/gzkdev/details/VwKqjGm

.

.


# More Check for firebase installation

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