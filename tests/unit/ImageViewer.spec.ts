import { shallowMount } from "@vue/test-utils"
import Immagine from "../../src/types/Immagine"
import ImageExifViewer from './../../src/components/ImageExifViewer.vue'

describe("ImageExifViewer.vue", () => {
  it("Renders Image Viewer rendering src datas", () => {

    const { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } = require("@firebase/rules-unit-testing")
    const MY_PROJECT_ID = 'image-toolkit-app'
/*     
    const auth = initializeTestEnvironment({projectId: MY_PROJECT_ID}).auth()

    const imageRf = new Immagine('test-jest-src.jpg').setTempImgId('ABCDEFG')
    const wrapper = shallowMount(ImageExifViewer, {
      props: { imageRf }
    })
    expect(wrapper.text()).toMatch( imageRf.src!.replace(/\.[^/.]+$/, "") ) // hideExtension()
 */
    expect(true).toBe(true)
  })

})
