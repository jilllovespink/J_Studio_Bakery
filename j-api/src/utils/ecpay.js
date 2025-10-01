import crypto from "crypto";
import qs from "qs";

const MERCHANT_ID = "3002607";
const HASH_KEY = "pwFHCqoQZGmho4w6";
const HASH_IV = "EkRm7iFT261dpevs";

// 建立 CheckMacValue
export function generateCheckMacValue(params) {
  // 1. 物件排序
  const sorted = Object.keys(params)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

  // 2. 加入 HashKey & HashIV
  let query = `HashKey=${HASH_KEY}&${qs.stringify(sorted)}&HashIV=${HASH_IV}`;

  // 3. URL encode → toLowerCase
  query = encodeURIComponent(query).toLowerCase();

  // 4. 取 MD5 → 大寫
  return crypto.createHash("md5").update(query).digest("hex").toUpperCase();
}

export { MERCHANT_ID };
