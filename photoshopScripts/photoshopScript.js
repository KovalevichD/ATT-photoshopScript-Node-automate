(function (store) {
    for (var i = 0; i < store.length; i++) {
        var time = store[i].time
        var date = store[i].endDate
        var spaceName = store[i].spaceName
        var arrOfPsds = store[i].arrOfPsds
        var arrOfGifs = store[i].arrOfGifs

        for (var j = 0; j < arrOfPsds.length; j++) {
            var saveFile = new File(arrOfGifs[j])
            app.open(new File(arrOfPsds[j]))
            var layer = app.activeDocument.artLayers.getByName('text')
            var content;
            if (arrOfPsds[j].indexOf('320x50') !== -1 || arrOfPsds[j].indexOf('728x90') !== -1) {
                if (!spaceName) {
                    content = date + '\b' + time
                } else {
                    content = spaceName + '\r' + date + '\b' + time

                }

                //content = spaceName + '\b' + date + '\b' + time
            } else if (arrOfPsds[j].indexOf('300x600') !== -1) {

                if (!spaceName) {
                    content = date + '\r' + time
                } else {
                    content = spaceName + '\r' + date + '\r' + time
                }

            } else {
                if (!spaceName) {
                    content = date + '\r' + time
                } else {
                    content = spaceName + '\r' + date + '\r' + time
                }

            }

            layer.textItem.contents = content

            saveForWeb(saveFile)

            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)

            app.open(new File(saveFile))
            var lastFrameObj = app.activeDocument.artLayers[0].toString()
            var lastFrame = lastFrameObj.split(' ').pop().slice(0, -1)

            setDelayOfLastFrame(+lastFrame, 1.000000)
            saveForWeb(saveFile)
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)
        }
    }




    function saveForWeb(toFile) {
        const saveForWebOptions = new ExportOptionsSaveForWeb()

        saveForWebOptions.format = SaveDocumentType.COMPUSERVEGIF
        saveForWebOptions.includeProfile = false
        saveForWebOptions.interlaced = 1
        saveForWebOptions.optimized = true
        saveForWebOptions.transparency = 1
        saveForWebOptions.ColorReductionType = ColorReductionType.SELECTIVE
        saveForWebOptions.dither = Dither.PATTERN
        saveForWebOptions.ditherAmount = 100
        saveForWebOptions.webSnap = 0
        saveForWebOptions.colors = 256

        activeDocument.exportDocument(toFile, ExportType.SAVEFORWEB, saveForWebOptions)
    }


    function setDelayOfLastFrame(lastFrame, delay) {
        //select last frame
        var idslct = charIDToTypeID("slct");
        var desc1172 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref70 = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID("animationFrameClass");

        ref70.putIndex(idanimationFrameClass, lastFrame);
        desc1172.putReference(idnull, ref70);

        executeAction(idslct, desc1172, DialogModes.NO);

        // set dalay of the last frame
        var idsetd = charIDToTypeID("setd");
        var desc1156 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref66 = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID("animationFrameClass");
        var idOrdn = charIDToTypeID("Ordn");
        var idTrgt = charIDToTypeID("Trgt");

        ref66.putEnumerated(idanimationFrameClass, idOrdn, idTrgt);
        desc1156.putReference(idnull, ref66);

        var idT = charIDToTypeID("T   ");
        var desc1157 = new ActionDescriptor();
        var idanimationFrameDelay = stringIDToTypeID("animationFrameDelay");

        desc1157.putDouble(idanimationFrameDelay, delay);

        var idanimationFrameClass = stringIDToTypeID("animationFrameClass");

        desc1156.putObject(idT, idanimationFrameClass, desc1157);
        executeAction(idsetd, desc1156, DialogModes.NO);
    }



    return true
}(store))