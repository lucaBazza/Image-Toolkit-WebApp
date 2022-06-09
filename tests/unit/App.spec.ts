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