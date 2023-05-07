const saveImage = async(files,name,indexx) => {
    /* - files contains list of files
       - name the name root
       - indexx to differentiate images will be added at the end of the name */
    let i=indexx
    let names = []
    for(const index in files) {
        let image = files[index]
        // If no image submitted, exit
        if (!image) return names.push(400)
        //if (!(/^image/.test(image.mimetype))) return names.push(400)

        // Move the uploaded image to our upload folder
        //let name = image.name+Math.random().toString(36).substring(2, 15)+(new Date).getTime()
        let finalName = name + i
        image.mv('public/images/' + finalName)
        names.push('images/'+finalName)
        i++
    }
    return names
}
export default saveImage