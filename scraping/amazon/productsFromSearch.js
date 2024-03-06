const { default: axios } = require('axios');
const { JSDOM } = require('jsdom');

const getProductsFromSearch = async (productName) => {
    const pNameQuery = productName.split(' ');
    let url = 'https://www.amazon.com/s?k=';
    for (let i = 0; i < pNameQuery.length; i++) {
        url += String(pNameQuery[i]);
        if (i !== pNameQuery.length - 1) {
            url += '+';
        }
    }
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Content-Type': 'text/html',
        },
    });
    const dom = new JSDOM(response.data, {
        'resources': 'usable',
        'pretendToBeVisual': true,
    }).window.document;
    const products = [], titles = [], prices = [], fractions = [], links = [];
    dom.querySelectorAll('h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2').forEach(title => {
        titles.push(title.textContent.trim());
        const link = title.querySelector('a');
        link ? links.push('https://amazon.com/' + link.href) : links.push(null);
    });
    dom.querySelectorAll('span.a-price-whole').forEach(price => {
        prices.push(price.textContent.trim().slice(0, -1));
    });
    dom.querySelectorAll('span.a-price-fraction').forEach(price => {
        fractions.push(price.textContent.trim());
    });
    for (let i = 0; i < Math.min(prices.length, titles.length); i++) {
        products.push({
            'title': titles[i],
            'price': `$${prices[i]}.${fractions[i]}`,
            'link': links[i],
        });
    }
    return products;

};
getProductsFromSearch('laptop').then(p => console.log(p)).catch(e => console.log(e));
module.exports = {
    getProductsFromSearch,
};
