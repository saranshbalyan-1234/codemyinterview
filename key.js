const KEY='c2stb3ItdjEtYjhhNzhkYjhjMjZkZjQ4NTVjM2E0NTM3NmRiOWYyN2RlZjU3MDBkOTQ0MGRmNjgxZTYzMGJmZjI1YjYzNDY2ZA=='

const decodedKey = Buffer.from(KEY, 'base64').toString('utf-8');
module.exports = decodedKey;