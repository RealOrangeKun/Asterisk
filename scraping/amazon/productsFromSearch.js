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
    const dom = new JSDOM(response.data).window.document;
    const products = [], titles = [], prices = [];
    dom.querySelectorAll('h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2').forEach(title => {
        titles.push(title.textContent.trim());
    });
    dom.querySelectorAll('span.a-price-whole').forEach(price => {
        prices.push(price.textContent.trim().slice(0, -1));
    });
    for (let i = 0; i < prices.length; i++) {
        products.push({
            'title': titles[i],
            'price': prices[i],
        });
    }
    return products;
};


module.exports = {
    getProductsFromSearch,
};
