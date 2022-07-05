import { mount, shallowMount } from "@vue/test-utils";
import App from './../../src/App.vue'

//import fetch from 'node-fetch';
//const { Response } = jest.requireActual('node-fetch');
//jest.mock('node-fetch');
const fetch = require("node-fetch");

// Necessario per fetch function in test
/*import fetch from "node-fetch"
import { unwatchFile } from 'fs'*/

describe('App.vue', function () {
    it('Checking <h1> tag text, TO IMPLEMENT', function () {
        //const wrapper = shallowMount(App)        
        //const h2 = wrapper.find('h1')        
        //expect(h2.text()).toBe('Image Toolkit App')
        expect(true).toBe(true);
    })
})


/*       

    // T E S T I N G  add images
setTimeout(() => {
  console.log('\n\nTEST ING agigunge un immagine fake per vedere se viene renderizzata con reactivity\n\n\n')
  addFakeImage();
  // shuffleArray(utenteSng.getCurrentCatalog_cid().listaImmagini)
}, 1000); 
function hardRefreshCatalogo(){ showCatalogo.value = false; setTimeout(()=> showCatalogo.value = true, 0) }
function addFakeImage(){ utenteSng.getCurrentCatalog_cid().listaImmagini.unshift(new Immagine('https://zabba.lucabazzanella.com/img/estate/DSC04881_ps.webp').setCatalogID(utenteSng.getCid()).setClassStyle('imageLoaded')) }
 

*/