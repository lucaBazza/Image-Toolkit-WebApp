import { mount, shallowMount } from "@vue/test-utils"
import MD5 from "../../src/utilities/MD5"

describe("MD5", () => {
    it("Check MD5 function is correct", () => {
        expect(MD5("2022-06_luca")).toBe("ba444bc04b78f3e3acf3db5a1e2311c3");
    });
});