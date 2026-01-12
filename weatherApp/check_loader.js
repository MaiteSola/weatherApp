const loader = require('@ngx-translate/http-loader');
console.log('Exports:', Object.keys(loader));
console.log('TranslateHttpLoader:', loader.TranslateHttpLoader);
console.log('Prototype:', loader.TranslateHttpLoader ? loader.TranslateHttpLoader.prototype : 'N/A');
if (loader.TranslateHttpLoader) {
    console.log('Constructor length:', loader.TranslateHttpLoader.length);
}
