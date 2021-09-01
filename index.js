const fs = require('fs');

const GABI_NAME = 'Linda 🤍';
const JORGE_NAME = 'Jorge Habib';

function readModuleFile(path, callback) {
    try {
        var filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
        callback(e);
    }
}

readModuleFile('./_chat.txt', function (err, words) {
    const messagesCompleteInfoStrings = words.split('[').map(word => word.trim());

    const messages = buildMessagesObject(messagesCompleteInfoStrings);
    
    // messages.forEach(x => {
    //     console.log(x)
    // });

    const stats = getStats(messages);

    console.log(stats);
});

function getStats(messagesObject) {
    let gabis_images = 0;
    let jorges_images = 0;

    let gabis_audios = 0;
    let jorges_audios = 0;

    messagesObject.forEach(obj => {
        const [, termination] = obj.message.split('.');
        if (!termination) return;

        const termination_formatted = termination.replace('>', '');
        const termination_is_from_picture = termination_formatted === 'jpg' || termination_formatted === 'webp' || termination_formatted === 'png' || termination_formatted === 'mp4';

        if (termination_is_from_picture && obj.message.includes('<anexado: ') && obj.owner === 'Gabi') {
            gabis_images += 1;
        }

        if (termination_is_from_picture && obj.message.includes('<anexado: ') && obj.owner === 'Jorge') {
            jorges_images += 1;
        }

        const audio_termination = termination_formatted === 'opus'
        if (audio_termination && obj.message.includes('<anexado: ') && obj.owner === 'Gabi') {
            gabis_audios += 1;
        }

        if (audio_termination && obj.message.includes('<anexado: ') && obj.owner === 'Jorge') {
            jorges_audios += 1;
        }
    })

    let total_jorges_length = 0;
    let total_gabis_length = 0;

    messagesObject.forEach(obj => {
        if (obj.owner === 'Gabi') {
            total_gabis_length += obj.message.length;
        }

        if (obj.owner === 'Jorge') {
            total_jorges_length += obj.message.length;
        }
    });

    let total_final_gabis_messages = 0;
    let total_final_jorges_messages = 0;

    let total_gabis_delay = 0;
    let total_jorges_delay = 0;

    for (let i = 1; i < messagesObject.length; i++) {
        if (messagesObject[i].owner === 'Gabi' && messagesObject[i - 1].owner === 'Jorge') {
            total_gabis_delay += messagesObject[i].date - messagesObject[i - 1].date;
            total_final_gabis_messages += 1;
        }

        if (messagesObject[i].owner === 'Jorge' && messagesObject[i - 1].owner === 'Gabi') {
            total_jorges_delay += messagesObject[i].date - messagesObject[i - 1].date;
            total_final_jorges_messages += 1;
        }
    }

    const messages_per_day = {};

    messagesObject.forEach(obj => {
        const day = obj.date.getDate();
        const month = obj.date.getMonth() + 1;
        const year = obj.date.getFullYear();

        if (messages_per_day[`${day}/${month}/${year}`] >= 0) {
            messages_per_day[`${day}/${month}/${year}`] += 1;
        } else {
            messages_per_day[`${day}/${month}/${year}`] = 1;
        }
    })

    let word_counter = {};
    let jorge_word_counter = {};
    let gabi_word_counter = {};

    messagesObject.forEach(obj => {
        obj.message.split(' ').forEach(word => {
            const wordFormatted = word.replace('\n', '').replace(',', '').replace('.', '').replace('?', '').replace('!', '').replace('\r', '').toLowerCase();

            if (word_counter[wordFormatted] >= 0) {
                word_counter[wordFormatted] += 1;
            } else {
                word_counter[wordFormatted] = 1;
            }

            if (jorge_word_counter[wordFormatted] >= 0 && obj.owner === 'Jorge') {
                jorge_word_counter[wordFormatted] += 1;
            } else {
                jorge_word_counter[wordFormatted] = 1;
            }

            if (gabi_word_counter[wordFormatted] >= 0 && obj.owner === 'Gabi') {
                gabi_word_counter[wordFormatted] += 1;
            } else {
                gabi_word_counter[wordFormatted] = 1;
            }
        });
    });

    let top_words = Object.entries(word_counter);
    let jorge_top_words = Object.entries(jorge_word_counter);
    let gabi_top_words = Object.entries(gabi_word_counter);

    top_words = top_words.sort((a, b) => {
        if (a[1] < b[1]) {
            return 1;
        } else {
            return -1;
        }
    });

    jorge_top_words = jorge_top_words.sort((a, b) => {
        if (a[1] < b[1]) {
            return 1;
        } else {
            return -1;
        }
    });

    gabi_top_words = gabi_top_words.sort((a, b) => {
        if (a[1] < b[1]) {
            return 1;
        } else {
            return -1;
        }
    });

    top_words.length = 150;
    jorge_top_words.length = 50;
    gabi_top_words.length = 50;

    console.log(top_words);

    top_jorge_words = {
        "linda": 353,
        "❤️": 38,
        "nego": 35,
        "gostosa": 30,
        "maravilhosa": 15
    }

    top_gabi_words = {
        "lindo": 114,
        "jorge": 22,
        "amore": 12,
    }

    top_words = {
        'linda': 353,
        'amor': 230,
        'lindo': 223,
    }

    return {
        gabis_total_messages: gabi,
        jorges_total_messages: jorge,
        total_messages: gabi + jorge,
        gabis_images,
        jorges_images,
        gabis_audios,
        jorges_audios,
        total_jorges_length,
        total_gabis_length,
        average_jorges_response: (total_jorges_delay / total_final_jorges_messages) / (1000 * 60),
        average_gabis_response: (total_gabis_delay / total_final_gabis_messages) / (1000 * 60),
        total_jorges_delay,
        total_gabis_delay,
        total_final_gabis_messages,
        total_final_jorges_messages,
        top_jorge_words,
        top_gabi_words,
        top_words,
    }
}

function formatStringData(data) {
    var dia  = data.split("/")[0];
    var mes  = data.split("/")[1];
    var ano  = data.split("/")[2];
  
    return ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);
    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }

  
let gabi = 0;
let jorge = 0;

function buildMessagesObject (strs) {
    const objects = strs.map(str => {
        let owner = '';
        const [date, rest] = str.split(']');
        
        const [dates, hours, ampm] = date.split(' ');


        let message = '';
        if (rest) {
            if (rest.indexOf(GABI_NAME) === 1) {
                gabi += 1;
                owner = 'Gabi';

                message = rest.replace(' ' + GABI_NAME + ': ', '')
            }
    
            if (rest.indexOf(JORGE_NAME) === 1) {
                jorge += 1;
                owner = 'Jorge';

                message = rest.replace(' ' + JORGE_NAME + ': ', '')
            }
        } else {
            console.log(rest);
            console.log(str);
        }

        return {
            date: new Date(formatStringData(dates) + ' ' + hours + ' ' + ampm),
            owner,
            message
        }
    });

    return objects;
}
