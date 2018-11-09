/*
Ebben van a Json Web Token-hez a titkos kulcsunk
de ez csak a demoba kell  mindig az appa kell égetni valamilyen környezeti valtozoba vagy fájlba és beolvasni fs-sel.

Have in mind, under no circumstances should you ever, (EVER!) have your secret key publicly visible like this. 
Always put all of your keys in environment variables! I’m only writing it like this for demo purposes.

eza a kulcs lehet valamilyen kodolt dolog is most csak egy sima szöveg.
*/


module.exports = {
  'secretKey': '$2a$08$2ya9tWCFIuuptqItNPbPG.VrEUNhNzBuSQnGIVhTth181ylR4iR8W'
};