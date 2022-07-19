export default interface Adjustment{
    saturation: number
    contrast: number
    brightness: number
    temperature: number
    vignetting: number

    lut: string
    lutAlpha: number
    lutInverted: boolean

    overlayColA: string
    overlayColB: string
    overlayFusion: string
    overlayGradient: string

    rotation: number
}