import { shallowMount } from "@vue/test-utils"
import Immagine from "../../src/types/Immagine"
import ImageExifViewer from './../../src/components/ImageExifViewer.vue'

describe("ImageExifViewer.vue", () => {
  it("Renders Image Viewer rendering src datas", () => {
    const imageRf = new Immagine('test-jest-src.jpg')
    const wrapper = shallowMount(ImageExifViewer, {
      props: { imageRf }
    });
    expect(wrapper.text()).toMatch( imageRf.src.replace(/\.[^/.]+$/, "") ) // hideExtension()
  });
})
