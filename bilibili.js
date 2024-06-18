async function get_roomid(room_number) {
    const room_res = await fetch(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${room_number}`);
    if (room_res.status !== 200) {
        throw new Error(`HTTP error! status: ${room_res.status}`);
    }
    const room_json = await room_res.json();
    if (room_json.code !== 0) {
        throw new Error(`Bilibili API error! code: ${room_json.code}, message: ${room_json.message}`);
    }
    if (room_json.data.live_status !== 1) {
        throw new Error(`Room is not live!`);
    }
    return room_json.data.room_id;
}

async function get_urls_from_roomid(room_id) {
    const info_res = await fetch(`https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${room_id}&protocol=0,1&format=0,1,2&codec=0,1,2&qn=0&platform=web&ptype=8&dolby=5&panorama=1`);
    if (info_res.status !== 200) {
        throw new Error(`HTTP error! status: ${info_res.status}`);
    }
    const info_json = await info_res.json();
    if (info_json.code !== 0) {
        throw new Error(`Bilibili API error! code: ${info_json.code}, message: ${info_json.message}`);
    }
    const hls_stream = info_json.data.playurl_info.playurl.stream.filter(stream => stream.protocol_name === "http_hls")[0];
    const fmp4_format = hls_stream.format.filter(format => format.format_name === "fmp4")[0];
    const urls = [];
    fmp4_format.codec.forEach(element => {
        const codec_name = element.codec_name;
        const current_qn = element.current_qn;
        const base_url = element.base_url;
        element.url_info.forEach(url_info => {
            const url = `${url_info.host}${base_url}${url_info.extra}`;
            urls.push({
                url: url,
                qn: current_qn,
                codec: codec_name
            });
        });
    });
    return urls;
}

async function get_live_urls(room_number) {
    try {
        const room_id = await get_roomid(room_number);
        return await get_urls_from_roomid(room_id);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { get_live_urls };