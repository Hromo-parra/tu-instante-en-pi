# Recompilar y sustituir gmp-wasm

Descarga y extrae el ZIP de fuentes. En macOS con Apple Silicon, instala las herramientas de línea de comandos de Apple y usa Node 20 y Python 3. Desde la carpeta extraída, ejecuta:

```sh
bash scripts/preparar-macos.sh ./compilacion
bash scripts/build-pi-wasm.sh ./compilacion
```

El script comprueba el SHA-256 del SDK oficial. El WASM de referencia, `compilacion/rebuilt-mini.wasm`, tiene SHA-256 `a80724e3b31201ae8a4b86bb29793781afae29cec42fcf1bdec14bd48b016a52`. Para probar el reemplazo, desde esa misma carpeta ejecuta este comando sobre una extracción nueva de la app. Sustituye la ruta de ejemplo por la ruta real.

```sh
app=/ruta/a/copia-local
python3 scripts/install-pi-wasm.py compilacion/modified-mini.wasm \
  "$app/vendor/gmp-wasm.mjs" --bundle "$app/vendor/gmp-wasm.mjs" --probe
python3 -m http.server 8769 --bind 127.0.0.1 --directory "$app"
```

Abre http://127.0.0.1:8769/ y busca 1 de enero de 1974 con DDMMYYYY. La posición esperada es 109 223. La consola registra la ejecución del diagnóstico. Para un WASM compatible propio, usa el archivo correspondiente y omite `--probe`. Haz cada sustitución sobre una copia nueva.

## English

Extract the source archive and run the two build commands above on Apple Silicon macOS with the Apple command-line tools, Node 20, and Python 3. Set `app` to a fresh local extraction of the application, then run the replacement and loopback server commands. Search for January 1, 1974 with DDMMYYYY. The expected position is 109,223. For your own compatible WASM build, use its path and omit `--probe`.
