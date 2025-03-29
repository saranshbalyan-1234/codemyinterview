const KEY='QUl6YVN5QzRqbmU1eHBlVkNCOEJGdVFQRTFlT1NFeGJmbWRTMmpn'

const decodedKey = Buffer.from(KEY, 'base64').toString('utf-8');
module.exports = decodedKey;