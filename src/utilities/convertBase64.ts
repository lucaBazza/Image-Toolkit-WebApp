/**
 * 
 */
export default function getBase64(file) : Promise<string>{
    const reader = new FileReader()
    return new Promise(resolve => {
        reader.onload = ev => { resolve(ev.target!.result as string) }
        reader.readAsDataURL(file)
    })
}