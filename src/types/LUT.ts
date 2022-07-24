import getLutURL from "@/utilities/getLutURL"

export default interface LUT {
    name: string
    url: string
    base64?: string 
    invert: boolean
    opacity?: number
}

// TODO: if getLut URL is undefined, return null ? 
export function createLut_byName(_name : string){
    let lut_names_inverted = 'lutC-warmer-soft.png';
    return {
        name: _name,
        url: getLutURL(_name) ? getLutURL(_name) : '',
        // base64: "",
        invert: _name==lut_names_inverted,
        opacity: 255
    } as LUT;
}