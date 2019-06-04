const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const data = require('./data.json');
const ejs = require('ejs');
const path = require('path');

const compile = async function(templateName, data){
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.ejs`)
    const html = await fs.readFile(filePath, 'utf-8');
    return ejs.compile(html)(data);
};

(async function(){
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const content = await compile('shot-list', data);
        await page.setContent(content);
        await page.emulateMedia('screen');
        await page.pdf({
            path:'mypdf.pdf',
            format:'A4',
            printBackground:true
        })
        console.log('done')
        await browser.close();
        process.exit()
    }catch(e){
        console.log(e);
    }
})();