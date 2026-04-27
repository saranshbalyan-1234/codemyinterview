const KEY = "QUl6YVN5Ql9uNF9Cck05S2pGU25aV2VCeEpORDJuREhvQVpSVkJz";

const decodedKey = Buffer.from(KEY, "base64").toString("utf-8");
module.exports = decodedKey;
