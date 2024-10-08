var hexcase = 0,
  b64pad = "";
function hex_sha512(s) {
  return rstr2hex(rstr_sha512(str2rstr_utf8(s)));
}
function b64_sha512(s) {
  return rstr2b64(rstr_sha512(str2rstr_utf8(s)));
}
function any_sha512(s, e) {
  return rstr2any(rstr_sha512(str2rstr_utf8(s)), e);
}
function hex_hmac_sha512(k, d) {
  return rstr2hex(rstr_hmac_sha512(str2rstr_utf8(k), str2rstr_utf8(d)));
}
function b64_hmac_sha512(k, d) {
  return rstr2b64(rstr_hmac_sha512(str2rstr_utf8(k), str2rstr_utf8(d)));
}
function any_hmac_sha512(k, d, e) {
  return rstr2any(rstr_hmac_sha512(str2rstr_utf8(k), str2rstr_utf8(d)), e);
}
function sha512_vm_test() {
  return (
    hex_sha512("abc").toLowerCase() ==
    "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"
  );
}
function rstr_sha512(s) {
  return binb2rstr(binb_sha512(rstr2binb(s), s.length * 8));
}
function rstr_hmac_sha512(key, data) {
  var bkey = rstr2binb(key);
  bkey.length > 32 && (bkey = binb_sha512(bkey, key.length * 8));
  for (var ipad = Array(32), opad = Array(32), i = 0; i < 32; i++)
    (ipad[i] = bkey[i] ^ 909522486), (opad[i] = bkey[i] ^ 1549556828);
  var hash = binb_sha512(ipad.concat(rstr2binb(data)), 1024 + data.length * 8);
  return binb2rstr(binb_sha512(opad.concat(hash), 1536));
}
function rstr2hex(input) {
  try {
  } catch (e) {
    hexcase = 0;
  }
  for (
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef",
      output = "",
      x,
      i = 0;
    i < input.length;
    i++
  )
    (x = input.charCodeAt(i)),
      (output += hex_tab.charAt((x >>> 4) & 15) + hex_tab.charAt(x & 15));
  return output;
}
function rstr2b64(input) {
  try {
  } catch (e) {
    b64pad = "";
  }
  for (
    var tab =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      output = "",
      len = input.length,
      i = 0;
    i < len;
    i += 3
  )
    for (
      var triplet =
          (input.charCodeAt(i) << 16) |
          (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) |
          (i + 2 < len ? input.charCodeAt(i + 2) : 0),
        j = 0;
      j < 4;
      j++
    )
      i * 8 + j * 6 > input.length * 8
        ? (output += b64pad)
        : (output += tab.charAt((triplet >>> (6 * (3 - j))) & 63));
  return output;
}
function rstr2any(input, encoding) {
  var divisor = encoding.length,
    i,
    j,
    q,
    x,
    quotient,
    dividend = Array(Math.ceil(input.length / 2));
  for (i = 0; i < dividend.length; i++)
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  var full_length = Math.ceil(
      (input.length * 8) / (Math.log(encoding.length) / Math.log(2))
    ),
    remainders = Array(full_length);
  for (j = 0; j < full_length; j++) {
    for (quotient = Array(), x = 0, i = 0; i < dividend.length; i++)
      (x = (x << 16) + dividend[i]),
        (q = Math.floor(x / divisor)),
        (x -= q * divisor),
        (quotient.length > 0 || q > 0) && (quotient[quotient.length] = q);
    (remainders[j] = x), (dividend = quotient);
  }
  var output = "";
  for (i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);
  return output;
}
function str2rstr_utf8(input) {
  for (var output = "", i = -1, x, y; ++i < input.length; )
    (x = input.charCodeAt(i)),
      (y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0),
      55296 <= x &&
        x <= 56319 &&
        56320 <= y &&
        y <= 57343 &&
        ((x = 65536 + ((x & 1023) << 10) + (y & 1023)), i++),
      x <= 127
        ? (output += String.fromCharCode(x))
        : x <= 2047
        ? (output += String.fromCharCode(
            192 | ((x >>> 6) & 31),
            128 | (x & 63)
          ))
        : x <= 65535
        ? (output += String.fromCharCode(
            224 | ((x >>> 12) & 15),
            128 | ((x >>> 6) & 63),
            128 | (x & 63)
          ))
        : x <= 2097151 &&
          (output += String.fromCharCode(
            240 | ((x >>> 18) & 7),
            128 | ((x >>> 12) & 63),
            128 | ((x >>> 6) & 63),
            128 | (x & 63)
          ));
  return output;
}
function str2rstr_utf16le(input) {
  for (var output = "", i = 0; i < input.length; i++)
    output += String.fromCharCode(
      input.charCodeAt(i) & 255,
      (input.charCodeAt(i) >>> 8) & 255
    );
  return output;
}
function str2rstr_utf16be(input) {
  for (var output = "", i = 0; i < input.length; i++)
    output += String.fromCharCode(
      (input.charCodeAt(i) >>> 8) & 255,
      input.charCodeAt(i) & 255
    );
  return output;
}
function rstr2binb(input) {
  for (var output = Array(input.length >> 2), i = 0; i < output.length; i++)
    output[i] = 0;
  for (var i = 0; i < input.length * 8; i += 8)
    output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << (24 - (i % 32));
  return output;
}
function binb2rstr(input) {
  for (var output = "", i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i >> 5] >>> (24 - (i % 32))) & 255);
  return output;
}
var sha512_k;
function binb_sha512(x, len) {
  sha512_k == null &&
    (sha512_k = new Array(
      new int64(1116352408, -685199838),
      new int64(1899447441, 602891725),
      new int64(-1245643825, -330482897),
      new int64(-373957723, -2121671748),
      new int64(961987163, -213338824),
      new int64(1508970993, -1241133031),
      new int64(-1841331548, -1357295717),
      new int64(-1424204075, -630357736),
      new int64(-670586216, -1560083902),
      new int64(310598401, 1164996542),
      new int64(607225278, 1323610764),
      new int64(1426881987, -704662302),
      new int64(1925078388, -226784913),
      new int64(-2132889090, 991336113),
      new int64(-1680079193, 633803317),
      new int64(-1046744716, -815192428),
      new int64(-459576895, -1628353838),
      new int64(-272742522, 944711139),
      new int64(264347078, -1953704523),
      new int64(604807628, 2007800933),
      new int64(770255983, 1495990901),
      new int64(1249150122, 1856431235),
      new int64(1555081692, -1119749164),
      new int64(1996064986, -2096016459),
      new int64(-1740746414, -295247957),
      new int64(-1473132947, 766784016),
      new int64(-1341970488, -1728372417),
      new int64(-1084653625, -1091629340),
      new int64(-958395405, 1034457026),
      new int64(-710438585, -1828018395),
      new int64(113926993, -536640913),
      new int64(338241895, 168717936),
      new int64(666307205, 1188179964),
      new int64(773529912, 1546045734),
      new int64(1294757372, 1522805485),
      new int64(1396182291, -1651133473),
      new int64(1695183700, -1951439906),
      new int64(1986661051, 1014477480),
      new int64(-2117940946, 1206759142),
      new int64(-1838011259, 344077627),
      new int64(-1564481375, 1290863460),
      new int64(-1474664885, -1136513023),
      new int64(-1035236496, -789014639),
      new int64(-949202525, 106217008),
      new int64(-778901479, -688958952),
      new int64(-694614492, 1432725776),
      new int64(-200395387, 1467031594),
      new int64(275423344, 851169720),
      new int64(430227734, -1194143544),
      new int64(506948616, 1363258195),
      new int64(659060556, -544281703),
      new int64(883997877, -509917016),
      new int64(958139571, -976659869),
      new int64(1322822218, -482243893),
      new int64(1537002063, 2003034995),
      new int64(1747873779, -692930397),
      new int64(1955562222, 1575990012),
      new int64(2024104815, 1125592928),
      new int64(-2067236844, -1578062990),
      new int64(-1933114872, 442776044),
      new int64(-1866530822, 593698344),
      new int64(-1538233109, -561857047),
      new int64(-1090935817, -1295615723),
      new int64(-965641998, -479046869),
      new int64(-903397682, -366583396),
      new int64(-779700025, 566280711),
      new int64(-354779690, -840897762),
      new int64(-176337025, -294727304),
      new int64(116418474, 1914138554),
      new int64(174292421, -1563912026),
      new int64(289380356, -1090974290),
      new int64(460393269, 320620315),
      new int64(685471733, 587496836),
      new int64(852142971, 1086792851),
      new int64(1017036298, 365543100),
      new int64(1126000580, -1676669620),
      new int64(1288033470, -885112138),
      new int64(1501505948, -60457430),
      new int64(1607167915, 987167468),
      new int64(1816402316, 1246189591)
    ));
  var H = new Array(
      new int64(1779033703, -205731576),
      new int64(-1150833019, -2067093701),
      new int64(1013904242, -23791573),
      new int64(-1521486534, 1595750129),
      new int64(1359893119, -1377402159),
      new int64(-1694144372, 725511199),
      new int64(528734635, -79577749),
      new int64(1541459225, 327033209)
    ),
    T1 = new int64(0, 0),
    T2 = new int64(0, 0),
    a = new int64(0, 0),
    b = new int64(0, 0),
    c = new int64(0, 0),
    d = new int64(0, 0),
    e = new int64(0, 0),
    f = new int64(0, 0),
    g = new int64(0, 0),
    h = new int64(0, 0),
    s0 = new int64(0, 0),
    s1 = new int64(0, 0),
    Ch = new int64(0, 0),
    Maj = new int64(0, 0),
    r1 = new int64(0, 0),
    r2 = new int64(0, 0),
    r3 = new int64(0, 0),
    j,
    i,
    W = new Array(80);
  for (i = 0; i < 80; i++) W[i] = new int64(0, 0);
  for (
    x[len >> 5] |= 128 << (24 - (len & 31)),
      x[(((len + 128) >> 10) << 5) + 31] = len,
      i = 0;
    i < x.length;
    i += 32
  ) {
    for (
      int64copy(a, H[0]),
        int64copy(b, H[1]),
        int64copy(c, H[2]),
        int64copy(d, H[3]),
        int64copy(e, H[4]),
        int64copy(f, H[5]),
        int64copy(g, H[6]),
        int64copy(h, H[7]),
        j = 0;
      j < 16;
      j++
    )
      (W[j].h = x[i + 2 * j]), (W[j].l = x[i + 2 * j + 1]);
    for (j = 16; j < 80; j++)
      int64rrot(r1, W[j - 2], 19),
        int64revrrot(r2, W[j - 2], 29),
        int64shr(r3, W[j - 2], 6),
        (s1.l = r1.l ^ r2.l ^ r3.l),
        (s1.h = r1.h ^ r2.h ^ r3.h),
        int64rrot(r1, W[j - 15], 1),
        int64rrot(r2, W[j - 15], 8),
        int64shr(r3, W[j - 15], 7),
        (s0.l = r1.l ^ r2.l ^ r3.l),
        (s0.h = r1.h ^ r2.h ^ r3.h),
        int64add4(W[j], s1, W[j - 7], s0, W[j - 16]);
    for (j = 0; j < 80; j++)
      (Ch.l = (e.l & f.l) ^ (~e.l & g.l)),
        (Ch.h = (e.h & f.h) ^ (~e.h & g.h)),
        int64rrot(r1, e, 14),
        int64rrot(r2, e, 18),
        int64revrrot(r3, e, 9),
        (s1.l = r1.l ^ r2.l ^ r3.l),
        (s1.h = r1.h ^ r2.h ^ r3.h),
        int64rrot(r1, a, 28),
        int64revrrot(r2, a, 2),
        int64revrrot(r3, a, 7),
        (s0.l = r1.l ^ r2.l ^ r3.l),
        (s0.h = r1.h ^ r2.h ^ r3.h),
        (Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l)),
        (Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h)),
        int64add5(T1, h, s1, Ch, sha512_k[j], W[j]),
        int64add(T2, s0, Maj),
        int64copy(h, g),
        int64copy(g, f),
        int64copy(f, e),
        int64add(e, d, T1),
        int64copy(d, c),
        int64copy(c, b),
        int64copy(b, a),
        int64add(a, T1, T2);
    int64add(H[0], H[0], a),
      int64add(H[1], H[1], b),
      int64add(H[2], H[2], c),
      int64add(H[3], H[3], d),
      int64add(H[4], H[4], e),
      int64add(H[5], H[5], f),
      int64add(H[6], H[6], g),
      int64add(H[7], H[7], h);
  }
  var hash = new Array(16);
  for (i = 0; i < 8; i++) (hash[2 * i] = H[i].h), (hash[2 * i + 1] = H[i].l);
  return hash;
}
function int64(h, l) {
  (this.h = h), (this.l = l);
}
function int64copy(dst, src) {
  (dst.h = src.h), (dst.l = src.l);
}
function int64rrot(dst, x, shift) {
  (dst.l = (x.l >>> shift) | (x.h << (32 - shift))),
    (dst.h = (x.h >>> shift) | (x.l << (32 - shift)));
}
function int64revrrot(dst, x, shift) {
  (dst.l = (x.h >>> shift) | (x.l << (32 - shift))),
    (dst.h = (x.l >>> shift) | (x.h << (32 - shift)));
}
function int64shr(dst, x, shift) {
  (dst.l = (x.l >>> shift) | (x.h << (32 - shift))), (dst.h = x.h >>> shift);
}
function int64add(dst, x, y) {
  var w0 = (x.l & 65535) + (y.l & 65535),
    w1 = (x.l >>> 16) + (y.l >>> 16) + (w0 >>> 16),
    w2 = (x.h & 65535) + (y.h & 65535) + (w1 >>> 16),
    w3 = (x.h >>> 16) + (y.h >>> 16) + (w2 >>> 16);
  (dst.l = (w0 & 65535) | (w1 << 16)), (dst.h = (w2 & 65535) | (w3 << 16));
}
function int64add4(dst, a, b, c, d) {
  var w0 = (a.l & 65535) + (b.l & 65535) + (c.l & 65535) + (d.l & 65535),
    w1 =
      (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (w0 >>> 16),
    w2 =
      (a.h & 65535) +
      (b.h & 65535) +
      (c.h & 65535) +
      (d.h & 65535) +
      (w1 >>> 16),
    w3 =
      (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (w2 >>> 16);
  (dst.l = (w0 & 65535) | (w1 << 16)), (dst.h = (w2 & 65535) | (w3 << 16));
}
function int64add5(dst, a, b, c, d, e) {
  var w0 =
      (a.l & 65535) +
      (b.l & 65535) +
      (c.l & 65535) +
      (d.l & 65535) +
      (e.l & 65535),
    w1 =
      (a.l >>> 16) +
      (b.l >>> 16) +
      (c.l >>> 16) +
      (d.l >>> 16) +
      (e.l >>> 16) +
      (w0 >>> 16),
    w2 =
      (a.h & 65535) +
      (b.h & 65535) +
      (c.h & 65535) +
      (d.h & 65535) +
      (e.h & 65535) +
      (w1 >>> 16),
    w3 =
      (a.h >>> 16) +
      (b.h >>> 16) +
      (c.h >>> 16) +
      (d.h >>> 16) +
      (e.h >>> 16) +
      (w2 >>> 16);
  (dst.l = (w0 & 65535) | (w1 << 16)), (dst.h = (w2 & 65535) | (w3 << 16));
}
//# sourceMappingURL=/cdn/shop/t/741/assets/sha512.js.map?v=159334585751392236001726068652
