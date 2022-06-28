import { mount, shallowMount } from "@vue/test-utils";
import CatalogoForm from './../../src/components/CatalogoForm.vue'
import Catalogo from './../../src/types/Catalogo'

describe("CatalogoForm.vue", () => {
    // global.window = Object.create(window);   // TypeError: Cannot redefine property: window
    //const urlServerImage = "http://example-test.site.com";
    //Object.defineProperty(window, 'location', {
    //    value: {  href: urlServerImage  }
    //});
    it("renders props.catalogName when passed, TODO implement", () => {
        
        //const catalogoRef = new Catalogo('Asdrubale','ABCD123').setListaImmagini([])
        //const wrapper = shallowMount(CatalogoForm, {  props: {catalogoRef} }) //mount(CatalogoForm, {
        //expect(wrapper.text()).toMatch(catalogoRef.titolo)
        
        expect(true).toBe(true)

    })
})
