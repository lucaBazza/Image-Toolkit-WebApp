export default interface Exif {
    Make: string
    Model: string
    Orientation: number | string
	XResolution: number
	YResolution: number
	ResolutionUnit: number
	DateTime: string
	YCbCrPositioning: number
	ExifIFDPointer: number
	ExposureTime: number
	FNumber: number | string
	ExifVersion: string
	DateTimeOriginal: string
	DateTimeDigitized: string
	ComponentsConfiguration: string
	CompressedBitsPerPixel: number
	ShutterSpeedValue: number
	ApertureValue: number
	ExposureBias: number
	MaxApertureValue: number
	MeteringMode: string
	Flash: string
	FocalLength: number
	FlashpixVersion: string
	ColorSpace: number | string
	PixelXDimension: number
	PixelYDimension: number
	InteroperabilityIFDPointer: number
	FocalPlaneXResolution: number
	FocalPlaneYResolution: number
	FocalPlaneResolutionUnit: number
	SensingMethod: string
	FileSource: string
	CustomRendered: string
	ExposureMode: number
	WhiteBalance: string
	DigitalZoomRation: number
	SceneCaptureType: string

	Author: string
	Artist: string
	
	Copyright: string
}