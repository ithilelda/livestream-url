const parser = require("node-html-parser");
const CryptoJS = require("crypto-js");


async function get_h5_url(room_number, rate=0) {
    const room_res = await fetch(`https://www.douyu.com/${room_number}`);
    const room_text = await room_res.text();
    const room_dom = parser.parse(room_text);
    // selecting those script tags with content, not sourcing from external url.
    const req_js = room_dom.querySelectorAll("body > script:not(:empty)").filter(script => /vdwdae325w_64we/.test(script.textContent))[0];
    // now we need to get the query params for the request.
    const did = "10000000000000000000000000001501";
    const tt = Math.floor(Date.now() / 1000);
    const query_param = eval(req_js.textContent + `ub98484234(${room_number},"${did}",${tt});`) + `&cdn=ws-h5&rate=${rate}`;
    const url_res = await fetch(`https://www.douyu.com/lapi/live/getH5Play/${room_number}?${query_param}`);
    return await url_res.json();
}

module.exports = {
    get_h5_url
}