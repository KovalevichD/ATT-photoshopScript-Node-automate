const adobe = require("adobe-node")
const fs = require('fs')
const path = require('path')
const { google } = require('googleapis')
const keys = require('./keys.json')
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)
const mainFolder = __dirname + '/AT&T-Ready/'
const store = []

client.authorize(async function (err, tokens) {

    if (err) {
        console.log(err)
        return
    } else {
        console.log('Connected!')
        const data = await gsRun(client)

        main(data)
    }
})

async function gsRun(cl) {

    const gsApi = google.sheets({
        version: 'v4',
        auth: cl
    })

    const opt = {
        spreadsheetId: '1eP-VwcpLEpjUGiaAwgxJM0MbkIMIXCcFkeW9cDtO20Q',
        range: 'Data!B2:H100'
    }

    let data = await gsApi.spreadsheets.values.get(opt)
    let dataArray = data.data.values

    return dataArray
}

const main = async (data) => {
    const app = adobe.newAdobeApp({
        app: {
            name: adobe.AdobeAppName.Photoshop,
            path: '/Applications/Adobe Photoshop 2020/Adobe Photoshop 2020.app/Contents/MacOS/Adobe Photoshop 2020',
            adobeScriptsPath: __dirname + '/photoshopScripts/'
        },
        host: 'localhost',
        port: 5000,
        jsPath: './photoshopScripts/'
    })
    const dateNow = new Date()
    const options = {
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }
    const stringDateNow = dateNow.toLocaleString("en-US", options).replace(/:/g, '-')
    const readyFolder = mainFolder + 'Ready for upload/'
    const dateNowFolder = readyFolder + stringDateNow
    
    app.init()

    //create a directory if it doesn't exist and if data isn't empty
    if (data.length > 0) {
        if (!fs.existsSync(mainFolder)) {
            fs.mkdirSync(mainFolder)
        }
    }

    if (!fs.existsSync(readyFolder)) {
        fs.mkdirSync(readyFolder)
    }

    fs.mkdirSync(dateNowFolder)

    data.forEach(async property => {

        let [propertyName, startDate, time, endDate, spaceName, distinction, event] = property
        let properyItem = {}

        switch (event) {
            // case 'AT&T TV':
            //     event = 'TV';
            //     break;

            case 'Bring your Bill':
                event = 'Bill';
                break;

            case 'Breakfast on the Go':
                event = 'Breakfast';
                break;

            case 'Pizza Party':
                event = 'Pizza';
                break;

            default:
                return
        }

        //formatted string example: from => 'February 14th, 2020' to => 'February 14'
        const formattedEndDate = endDate.split(' ')[0] + ' ' + parseInt(endDate.split(' ')[1])
        const formattedTime = formattingTime(time)
        const readyFileNameWithoutEnding = `Event_Driven_${formattedEndDate}_${propertyName}_`
        let readyFolderName = `${dateNowFolder}${startDate}_${propertyName}/`

        distinction ? readyFolderName = `${readyFolderName}(${distinction})` : readyFolderName = readyFolderName

        if (!fs.existsSync(readyFolderName)) {
            fs.mkdirSync(readyFolderName)
        }

        const arrOfPsds = []
        const arrOfGifs = []
        const relativePathToTemplateDir = `/TEMPLATES/${event}/`
        const absolutePathToTemplateDir = path.resolve(__dirname + relativePathToTemplateDir)

        fs.readdirSync(absolutePathToTemplateDir).forEach(tamplate => {
            let ext = path.extname(tamplate)

            if (ext !== '.psd') return

            let pathPsd = path.resolve(__dirname + relativePathToTemplateDir + tamplate)
            let splittedNameOfTamplate = tamplate.split('.')[0].split('_')
            let dimensions = splittedNameOfTamplate[splittedNameOfTamplate.length - 1]
            let gifName = readyFileNameWithoutEnding + dimensions

            gifName = gifName.replace(/ /g, "-")

            let pathGif = path.resolve(readyFolderName, gifName) + '.gif'

            arrOfPsds.push(pathPsd)
            arrOfGifs.push(pathGif)
        })

        properyItem.time = formattedTime
        properyItem.endDate = formattedEndDate
        properyItem.spaceName = spaceName
        properyItem.arrOfPsds = arrOfPsds
        properyItem.arrOfGifs = arrOfGifs

        store.push(properyItem)
    })

    app.runScript(`photoshopScript.js`, {
        store: store
    })
}

//formatted string example: from => '5:30 AM - 8:00 PM' to => '5:30am - 8pm'
function formattingTime(str) {
    let formattedTime = str.replace(/:00/g, "").replace(/ PM/g, "pm").replace(/ AM/g, "am")

    //check and replace duplicate in row
    if (formattedTime.match(/am.*am/)) { // Check if there are 2 'am'
        formattedTime = formattedTime.replace('am', ''); // Remove the first one
    } else if (formattedTime.match(/pm.*pm/)) { // Check if there are 2 'pm'
        formattedTime = formattedTime.replace('pm', ''); // Remove the first one
    }
    return formattedTime
}