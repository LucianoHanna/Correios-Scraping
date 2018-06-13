const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

async function scrape(codigo) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--proxy-server="direct://"',
            '--proxy-bypass-list=*'
        ]
    });
    const page = await browser.newPage();
    // let codigo = "LB130144332SE";
    const servico = "ect";

    // tirando inutilidades da pagina 
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
            request.abort();
        } else {
            request.continue();
        }
    });
    await page.goto('http://websro.com.br/detalhes.php?P_COD_UNI=' + codigo);

    //vai criar array elements, processar os dados e inserir no array dados
    //historico = array de json
    const historico = await page.evaluate(() => {
        let dados = [];
        let elements = document.querySelector('tbody').querySelectorAll('tr');

        for (var element of elements) {
            let local = element.querySelector('td').querySelector('label').innerText;
            let detalhes = element.querySelectorAll('td')[1].innerText;
            let data = element.querySelector('td').innerText;
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
    await browser.close();
    // retorna json no formato {String, String, [{datalhes, local, data, situacao}]}
    return { codigo, servico, historico };
};

app.get('/:trackingCode', async function (req, res) {
    try
    {
        let saida = await scrape(req.params['trackingCode']);
        return res.json(saida);
    }
    catch(ex){ //caso de erro como pacote não encontrado, inválido, etc, retorna array {trackingCode, 'error', []}
        let codigo = req.params['trackingCode'];
        let servico = 'error';
        let historico = [];

        return res.json({codigo, servico, historico});
    }
});

app.listen(3000, () => console.log("Escutando porta 3000"));
