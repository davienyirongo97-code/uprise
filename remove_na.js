const fs = require('fs');

const filepath = 'c:\\Users\\bsc_inf_01_21\\Desktop\\UPRISE\\web\\app-enhanced.js';

let content = fs.readFileSync(filepath, 'utf-8');

// Replace standard N/A
content = content.replace(/ \|\| 'N\/A'/g, " || ''");
content = content.replace(/ \? client\.phoneNumber : 'N\/A'/g, " ? client.phoneNumber : ''");
content = content.replace(/ \? client\.district : 'N\/A'/g, " ? client.district : ''");
content = content.replace(/ \? client\.witnessName : 'N\/A'/g, " ? client.witnessName : ''");
content = content.replace(/ \? client\.witnessContact : 'N\/A'/g, " ? client.witnessContact : ''");
content = content.replace(/ \? client\.fullName : 'N\/A'/g, " ? client.fullName : ''");

fs.writeFileSync(filepath, content, 'utf-8');

console.log('Successfully processed ' + filepath);
