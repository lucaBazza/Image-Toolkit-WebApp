import LUT from "./LUT"

export default interface Adjustment{
    saturation: number
    contrast: number
    brightness: number
    temperature: number
    vignetting: number
    lut: LUT

    overlayColA: string
    overlayColB: string
    overlayFusion: string
    overlayGradient: string

    rotation: number
}