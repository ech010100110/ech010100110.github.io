let spent = 0;
let data = {};

// product data
//0=title, 1=price, 2=description, 3=stock number, 4=url, 5=img filename 6=img alt, 7=img attrib, 8=amount in stock
function reloadData() {
    let stockFromCookie = getCookie("stock");
    stockFromCookie = stockFromCookie.split(",");
    data = {
        "pencil": ["Pencil", 2.49, "High quality pencil, HB, made in Sweden.", stockFromCookie[0], "pencil", "pencil.jpg", "An image of four HB Pencils", "ThomasMielke (talk · contribs), CC BY-SA 3.0", 0],
        "chair": ["Chair", 29.99, "Premium quality stackable plastic chair.", stockFromCookie[1], "chair", "chair.jpg", "An image of many white plastic chairs", "Public Domain", 1],
        "bag": ["Bag", 3.99, "Superior quality Swedish bag, blue.", stockFromCookie[2], "bag", "bag.jpg", "An image of a blue bag", "PanierAvide, CC BY-SA 4.0", 2],
        "eraser": ["Eraser", 12.29, "Premium natural rubber eraser, made in Barbados with rubber exported from Peru.", stockFromCookie[3], "eraser", "eraser.jpg", "An image of an eraser", "Captain MarcusL, CC BY-SA 4.0", 3],
        "donation": ["Donation", 1, "Linus gave me the idea. Donate $1?", stockFromCookie[4], "donation", "donate.jpg", "Donate One Dollar?", "CC0", 4]
    };
}

//Stock updating
function updateStock(item, count) {
    if (getCookie("stock") != "") {
        let stockcount = getCookie("stock");
        stockcount = stockcount.split(",");
        stockcount[item] = stockcount[item] - count;
        setCookie("stock", stockcount);
    } else {
        startupStock();
    }
}
//Stock startup
function startupStock() {
    if (getCookie("stock") == "") {
        setCookie("stock", [800, 800, 70, 10, 1000]);
    }
}

//Dialog control
// open
function showDialog(id) {
    document.getElementById(id).show();
}
// close
function closeDialog(id) {
    document.getElementById(id).close();
}

//Cookies
//set cookies
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
//get cookies
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
// clear the cookies
function clearCookies() {
    setCookie("spent", 0, -1);
    setCookie("theme", 0, -1);
    setCookie("stock", 0, -1);
    window.location.reload();
}
// is cookies enabled?
function cookiesIsEnabled() {
    let cookie = getCookie("spent");
    if (cookie == "") {
        window.location.href = "/err/nocookies.html";
        return false;
    } else {
        return true;
    }
}
//show permission for cookies
function showPermission() {
    if (!cookiesIsEnabled()) {
        window.location.href = "/err/nocookies.html";
    }
}
// allow/deny cookies
function allowCookies() {
    setCookie("spent", spent, 7);
    window.location.href = "/";
}
function denyCookies() {
    window.location.href = "/err/nocookies.html";
}

//Products
// for buy.html
function getProductData() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const product = urlParams.get('product');
    const productdata = eval("data." + product);

    let html = `<p><b><i>${productdata[0]}</i>&nbsp;$${productdata[1]}</b></p>
                <img class="productimage" src="images/products/${productdata[5]}" alt="${productdata[6]}" />
                <p class="attrib">${productdata[7]}</p>
                <p>${productdata[2]}</p>
                <p>${productdata[3]} in stock</p>
                <input id="qty" type="number" oninput="this.value = ((this.value > ${productdata[3]}) ? ${productdata[3]} : (this.value < 0) ? 0 : this.value)" value="0" min="0" max="${productdata[3]}">
                <button onclick="buy(${productdata[1]}, ${productdata[8]}, ${productdata[3]})">Buy</button>`;
    document.getElementById("productdata").innerHTML = html;
}
// for index.html
function getFrontPageLinks() {
    let html = '';
    let objKeys = Object.keys(data);

    objKeys.forEach(key => {
        let value = data[key];
        html += `<p><a href="/buy.html?product=${value[4]}"><i>${value[0]}</i>&nbsp;$${value[1]}</a></p>`;
    });
    document.getElementById("products").innerHTML = html;
}
// for both, on the sidebar
function populateCartButton() {
    document.getElementById("cart").innerHTML = "My cart: <b>$" + parseFloat(getCookie("spent")).toFixed(2) + "</b>";
}

//buying the products
function buy(x, itemstockid, limit) {
    spent = parseInt(getCookie("spent"))
    inputqty = document.getElementById('qty').value;
    if ((getCookie("stock").split(","))[itemstockid] > limit) {
        qty = (getCookie("stock").split(","))[itemstockid]
    } else {
        qty = inputqty
    }
    updateStock(itemstockid, qty)
    cost = qty * x;
    spent = Math.round((spent + cost + Number.EPSILON) * 100) / 100;
    setCookie("spent", spent, 7);
    reloadData();
    window.location.href = "/"
}

//Dark / Light mode control
function startupTheme() {
    const theme = getCookie("theme")
    if (theme == 'dark') {
        document.querySelector(":root").classList.add('dark-donotuse');
    } else {
        document.querySelector(":root").classList.remove('dark-donotuse');
    }
}
function darkMode() {
    if (cookiesIsEnabled()) {
        const theme = getCookie("theme")
        if (theme == 'dark') {
            setCookie("theme", "light", 7);
        } else {
            setCookie("theme", "dark", 7);
        }
        startupTheme();
    }
}