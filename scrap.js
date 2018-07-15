const puppeteer = require('puppeteer');

module.exports = class Scraping {
    // Esta função deve ser chamada inicialmente para abrir o Chromium
    async launchBrowser(){
        this.browser = await puppeteer.launch({
            headless: false,
            args: [
                '--proxy-server="direct://"',
                '--proxy-bypass-list=*'
            ]
        });
    }

    // Esta função deve ser chamada para fechar o Chromium
    async closeBrowser(){
        this.browser.close();
    }
    
    // Esta função retorna json com o rastreio do objeto passado como parametro
    async scrape(codigo) {
        const page = await this.browser.newPage();
        let servico = 'ect';
    
        // tirando inutilidades da pagina 
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                request.abort();
            } else {
                request.continue();
            }
        });
        
        await page.goto('http://www2.correios.com.br//sistemas/rastreamento/default.cfm/');
        
        await page.click('#objetos');
        await page.keyboard.type(codigo);
        
        await Promise.all([
            page.click('#btnPesq'),
            page.waitForNavigation(),
          ]);

        let historico = [];

        //vai criar array elements, processar os dados e inserir no array dados
        //historico = array de json
        try{
            historico = await page.evaluate(() => {
                let dados = [];
                let elements = document.querySelector('tbody').querySelectorAll('tr');
                for (var element of elements) {
                    let localAndDate = element.querySelector('td').innerText;
                    localAndDate = localAndDate.split('\n');
                    let local = localAndDate[2];
                    let data = localAndDate[0]+localAndDate[1];
                    let detalhes = element.querySelectorAll('td')[1].innerText;
                    let situacao = element.querySelectorAll('td')[1].querySelector('strong').innerText;
        
                    //Tratando quebra de linha e espaços duplos
                    //Quebra de linha vira espaço, APÓS os espaços duplos viram espaço simples
                    //Obs: em caso de espaço+quebra de linha e quebra de linha+espaço, virará espaço+espaço e após apenas espaço
                    // detalhes = detalhes.replace(/(\r\n|\n|\r)/gm, " ");
                    detalhes = detalhes.replace("  ", " ");
                    data = data.replace(/(\r\n|\n|\r)/gm, " ");
                    data = data.replace("  ", " ");
        
                    dados.push({
                        detalhes,
                        local,
                        data,
                        situacao
                    });
                }
                return dados;
            });
        }
        catch(ex){
            servico = 'error';
        }
        finally{
            await page.close();
        }
        // retorna json no formato {String, String, [{datalhes, local, data, situacao}]}
        return { codigo, servico, historico };
    };
}