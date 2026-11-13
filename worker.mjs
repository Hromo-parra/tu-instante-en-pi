import { init } from './vendor/gmp-wasm.mjs';
import { DIGIT_COUNT, DIGIT_SHA256, findPattern } from './core.mjs';

let cache;
self.onmessage = async ({ data }) => {
  try {
    if (cache) { self.postMessage({ id: data.id, results: data.patterns.map(pattern => findPattern(cache, pattern)) }); return; }
    const { binding: g } = await init();
    const alloc = () => { const p = g.mpz_t(); g.mpz_init(p); return p; };
    const release = (...items) => { for (const p of items) { g.mpz_clear(p); g.mpz_t_free(p); } };
    const factor = alloc(); g.mpz_set_string(factor, '10939058860032000', 10);
    function split(a, b) {
      if (b - a === 1) {
        const p = alloc(), q = alloc(), t = alloc();
        if (a === 0) { g.mpz_set_ui(p, 1); g.mpz_set_ui(q, 1); g.mpz_set_ui(t, 13591409); }
        else {
          g.mpz_set_ui(p, 6 * a - 5);
          g.mpz_mul_ui(p, p, 2 * a - 1); g.mpz_mul_ui(p, p, 6 * a - 1);
          g.mpz_set_ui(q, a); g.mpz_mul_ui(q, q, a); g.mpz_mul_ui(q, q, a); g.mpz_mul(q, q, factor);
          g.mpz_set_string(t, String(13591409 + 545140134 * a), 10);
          g.mpz_mul(t, t, p); if (a % 2) g.mpz_neg(t, t);
        }
        return [p, q, t];
      }
      const m = Math.floor((a + b) / 2);
      const [p1, q1, t1] = split(a, m), [p2, q2, t2] = split(m, b);
      g.mpz_mul(t1, t1, q2); g.mpz_mul(t2, t2, p1); g.mpz_add(t1, t1, t2);
      g.mpz_mul(p1, p1, p2); g.mpz_mul(q1, q1, q2);
      release(p2, q2, t2);
      return [p1, q1, t1];
    }
    const precision = DIGIT_COUNT + 50;
    const [p, q, t] = split(0, Math.floor(precision / 14) + 2);
    const power = alloc(), root = alloc();
    g.mpz_ui_pow_ui(power, 10, precision);
    g.mpz_mul(root, power, power); g.mpz_mul_ui(root, root, 10005); g.mpz_sqrt(root, root);
    g.mpz_mul_ui(root, root, 426880); g.mpz_mul(root, root, q); g.mpz_tdiv_q(root, root, t);
    const text = g.mpz_to_string(root, 10);
    if (text.length !== precision + 1 || text[0] !== '3') throw new Error('Precision mismatch');
    const digits = text.slice(1, DIGIT_COUNT + 1);
    release(p, q, t, power, root, factor);
    const bytes = new TextEncoder().encode(digits);
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(x => x.toString(16).padStart(2, '0')).join('');
    if (hash !== DIGIT_SHA256 || digits.length !== DIGIT_COUNT) throw new Error('Computed digits failed verification');
    cache = digits;
    self.postMessage({ id: data.id, results: data.patterns.map(pattern => findPattern(cache, pattern)) });
  } catch (error) {
    self.postMessage({ id: data.id, error: String(error.message || error) });
  }
};
