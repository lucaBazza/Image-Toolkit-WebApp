import { mount, shallowMount } from "@vue/test-utils";
import CatalogoForm from './../../src/components/CatalogoForm.vue'
//import CatalogoForm from '@/src/components/CatalogoForm.vue'
import Catalogo from './../../src/types/Catalogo'
import fetch from "node-fetch"


describe("CatalogoForm.vue", () => {
    global.window = Object.create(window);
    const urlServerImage = "http://example.com";
    Object.defineProperty(window, 'location', {
        value: {  href: urlServerImage  }
    });
    it("renders props.catalogName when passed, TODO implement", () => {
        //const catalogoRef = new Catalogo('Asdrubale','ABCD123',0);
        //const wrapper = shallowMount(CatalogoForm, {  props: {catalogoRef, urlServerImage} }) //mount(CatalogoForm, {
        //expect(wrapper.text()).toMatch(catalogoRef.titolo);
        expect(true).toBe(true);
    });
});
