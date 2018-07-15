# Correios-Scraping
Rastreamento da Empresa de Correios e Telégrafos utilizando Data Scraping e Puppeteer

## Downloads
- Código-fonte no [GitHub](https://github.com/LucianoHanna/Correios-Scraping)
- Baixe diretamente do [NPM]()

## Instalação

```
npm install correios-tracking
```

## Como funciona
Correios-Scraping funciona com Data Scraping da página do Correios e retornando json com o rastreio do objeto passado como parametro.

## Como utilizar
É simples de utilizar, veja um exemplo de código:

```js
const Scraping = require('../scrap.js');
const correios = new Scraping();

// É necessário abrir o Chromium antes de rastrear qualquer objeto
correios.launchBrowser();

// A função correios.track retorna um json contendo o rastreio do objeto
console.log(correios.track('PP123456789BR'));

// Após os rastreios desejados serem feitos, pode ser fechado o Chromium
correios.closeBrowser();
```

Observe que é possivel fazer mais de um rastreio após abrir o Chromium:

```js
const Scraping = require('../scrap.js');
const correios = new Scraping();

// É necessário abrir o Chromium antes de rastrear qualquer objeto
correios.launchBrowser();

// A função correios.track retorna um json contendo o rastreio do objeto
console.log(correios.track('PP123456789BR'));
console.log(correios.track('PP123456789BR'));
console.log(correios.track('PP123456789BR'));

// Após os rastreios desejados serem feitos, pode ser fechado o Chromium
correios.closeBrowser();
```

## Demonstração:
Tem um demo dentro deste repositório, apenas clone e você encontrará dentro a pasta "demo", execute ```npm install && node demo.js``` e você verá retornar json no metódo GET do link "localhost:3000/:codigo_de_rastreio", substitua ":codigo_de_rastreio" por um código de rastreio válido.