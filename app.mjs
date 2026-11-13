import { chooseLanguage, distance, formatDate, patternForDate } from './core.mjs';
import { referenceAt, scaleBounds, scaleValues } from './scale.mjs';

const translations = {
  es: {
    brand: 'Tu instante en π', eyebrow: 'UNA PEQUEÑA CURIOSIDAD MATEMÁTICA', headline: 'Una fecha. Un universo de cifras.', intro: 'Explora si una fecha especial aparece entre el primer millón de decimales de π.',
    dateOne: 'Tu fecha', dateTwo: 'Segunda fecha', format: 'Representación de búsqueda', couple: 'Comparar dos fechas', search: 'Buscar en π ↗', privacy: 'Tu fecha se busca en este dispositivo y la app no la guarda de forma persistente ni la envía al buscar. Compartir el resultado o descargar una tarjeta incluye tu fecha. El alojamiento puede registrar accesos.',
    privacyMore: 'Más sobre privacidad', privacyLabel: 'TUS DATOS', privacyTitle: 'Privacidad',
    privacyLocal: 'La fecha y su secuencia se procesan localmente en tu navegador, incluido un worker, y permanecen en la página mientras la usas. La aplicación no las guarda en almacenamiento persistente ni necesita una cuenta.',
    privacyStorage: 'La aplicación solo guarda la preferencia de idioma en localStorage cuando está disponible; no utiliza sessionStorage ni cookies propias. Solicita desactivar el autocompletado de fechas, pero el navegador o sus extensiones pueden conservar información según su configuración.',
    privacyShare: 'Copiar o compartir un resultado incluye la fecha, la secuencia, el formato y la posición; la tarjeta PNG también contiene esos datos. Estas acciones son voluntarias y pueden entregar información al portapapeles, al archivo o al servicio que elijas. Copiar el enlace solo comparte la dirección de la aplicación, sin fecha, nombre ni parámetros.',
    privacyNetwork: 'La aplicación descarga sus archivos de código desde el alojamiento y calcula los decimales localmente; no se envía la fecha introducida al buscar. El alojamiento y la red pueden registrar accesos, direcciones IP y direcciones solicitadas. No escribas datos personales en la URL: podrían llegar al servidor. La aplicación ignora sus parámetros. No se han incorporado herramientas de seguimiento de terceros.',
    shareNotice: 'Copiar o compartir el resultado incluye esta fecha, su secuencia, formato y posición. La tarjeta PNG también los incluye. El enlace por separado no incluye esos datos.',
    learnLabel: 'LA MATEMÁTICA DETRÁS', learnTitle: 'Infinito no significa que sepamos todo.', fact: 'π es irracional: sus decimales son infinitos y no periódicos. Esto, por sí solo, no demuestra que aparezca cada secuencia finita.',
    normal: 'La normalidad de π —que implicaría que todas las secuencias finitas aparecen con las frecuencias esperadas— sigue sin demostrarse.', probability: 'Como modelo idealizado de cifras independientes y uniformes, una secuencia de k dígitos tiene probabilidad aproximada 10⁻ᵏ en una posición. No es una garantía ni una prueba sobre π.',
    footer: 'Una coincidencia matemática, no una predicción.', about: 'Datos y metodología', licenses: 'Licencias y código fuente', loading: 'Calculando y buscando en el primer millón de decimales…', invalid: 'Introduce fechas válidas entre los años 0001 y 9999.', incomplete: 'Búsqueda incompleta: no se pudo calcular o verificar π. Se examinaron 0 decimales. Prueba desde un servidor HTTP(S).', cancel: 'Cancelar búsqueda', cancelled: 'Búsqueda cancelada; se eliminó la caché en memoria.',
    found: 'Una coincidencia en π', missing: 'No se encontró en este tramo', representation: 'Representación', examined: 'Decimales examinados', position: 'Primera aparición · posición decimal', context: 'Contexto desde el decimal', range: 'No aparecer en este tramo no demuestra que la secuencia no exista en π.',
    distance: 'Distancia entre posiciones', distanceUnit: 'posiciones decimales', distanceUnavailable: 'La distancia solo se calcula si ambas secuencias aparecen en el mismo tramo.', download: 'Descargar tarjeta PNG', share: 'Compartir resultado', copy: 'Copiar resultado', shareLink: 'Compartir enlace', copied: 'Copiado al portapapeles.', failed: 'No se pudo completar la acción. Revisa los permisos del navegador.', shared: 'Opciones para compartir abiertas.',
    scaleTitle: 'Distancia y escala', scaleSubtitle: 'La distancia absoluta es constante; la distancia relativa depende de la escala',
    scaleReference: 'Escala de referencia N', scaleSlider: 'Ajustar escala de referencia N (logarítmica)', scaleAbsolute: 'Distancia absoluta d', scaleRelative: 'Distancia relativa D(N) = d/N', scalePercent: 'Porcentaje 100D(N)', scaleNote: 'N es una escala de referencia, no una cantidad adicional de decimales calculados o examinados.',
    scaleLine: 'Posiciones normalizadas: x₁ = p₁/N y x₂ = p₂/N', scaleOverlap: 'Los marcadores pueden superponerse visualmente en escalas grandes; esto no significa que las posiciones sean idénticas.',
    scaleGraph: 'Gráfica de D(N) = d/N', scaleGraphDesc: 'Eje horizontal logarítmico de N; eje vertical lineal de D(N). El punto indica la escala seleccionada.', scaleAxisX: 'N · escala logarítmica', scaleAxisY: 'D(N)', scaleWhy: '¿Por qué ocurre esto?',
    scaleProof: 'La distancia absoluta d es constante. Para todo ε > 0, si N > d/ε, entonces d/N < ε. Así, la proporción tiende a cero al crecer la escala, sin cambiar las posiciones.',
    scaleLimit: 'lim(N → ∞) d/N = 0', scaleDisabled: 'No se puede ampliar la escala: la posición mínima alcanza o supera 10¹⁵.', scaleInvalid: 'La escala requiere dos posiciones verificadas y enteras dentro del mismo tramo.', scalePosition1: 'Posición 1', scalePosition2: 'Posición 2',
    cardTitle: 'Tu instante en π', cardPosition: 'Primera aparición · decimal', cardExamined: 'Decimales examinados', cardFooter: 'Una coincidencia matemática, no una predicción.', shareSummary: 'Primera aparición en el tramo: decimal', shareRange: 'decimales examinados', shareGeneric: 'Explora una fecha entre los decimales de π.'
  },
  en: {
    brand: 'Your moment in π', eyebrow: 'A LITTLE MATHEMATICAL CURIOSITY', headline: 'One date. A universe of digits.', intro: 'Explore whether a special date appears among the first million decimal digits of π.',
    dateOne: 'Your date', dateTwo: 'Second date', format: 'Search representation', couple: 'Compare two dates', search: 'Search π ↗', privacy: 'Your date is searched on this device; the app does not persist it or send it when searching. Sharing a result or downloading a card includes your date. The host may log access.',
    privacyMore: 'More about privacy', privacyLabel: 'YOUR DATA', privacyTitle: 'Privacy',
    privacyLocal: 'The date and its sequence are processed locally in your browser, including a worker, and remain on the page while you use it. The app does not save them in persistent storage or require an account.',
    privacyStorage: 'The app stores only the language preference in localStorage when available; it does not use sessionStorage or its own cookies. It requests that date autocomplete be disabled, but your browser or extensions may retain information depending on their settings.',
    privacyShare: 'Copying or sharing a result includes the date, sequence, format and position; the PNG card contains them too. These actions are voluntary and may hand information to the clipboard, a file or your chosen service. Copying the link shares only the app address, without dates, names or parameters.',
    privacyNetwork: 'The app downloads its code files from the host and calculates π digits locally; the date you enter is not sent when searching. The host and network may log access, IP addresses and requested URLs. Do not put personal information in the URL: it could reach the server. The app ignores URL parameters. No third-party tracking tools have been added.',
    shareNotice: 'Copying or sharing the result includes this date, its sequence, format and position. The PNG card includes them too. The separate link does not include that information.',
    learnLabel: 'THE MATHEMATICS', learnTitle: 'Infinite does not mean we know everything.', fact: 'π is irrational: its decimal digits are infinite and non-periodic. This alone does not prove that every finite sequence appears.',
    normal: 'The normality of π—which would imply that all finite sequences occur with the expected frequencies—remains unproved.', probability: 'In an idealized model of independent, uniform digits, a sequence of k digits has probability approximately 10⁻ᵏ at a position. This is neither a guarantee nor a proof about π.',
    footer: 'A mathematical coincidence, not a prediction.', about: 'Data and methodology', licenses: 'Licenses and source code', loading: 'Calculating and searching the first million decimal digits…', invalid: 'Enter valid dates between years 0001 and 9999.', incomplete: 'Search incomplete: π could not be calculated or verified. 0 digits were examined. Try using an HTTP(S) server.', cancel: 'Cancel search', cancelled: 'Search cancelled; the in-memory cache was discarded.',
    found: 'A match in π', missing: 'Not found in this range', representation: 'Representation', examined: 'Digits examined', position: 'First occurrence · decimal position', context: 'Context from decimal', range: 'Not appearing in this range does not prove that the sequence does not exist in π.',
    distance: 'Distance between positions', distanceUnit: 'decimal positions', distanceUnavailable: 'Distance is calculated only when both sequences appear in the same range.', download: 'Download PNG card', share: 'Share result', copy: 'Copy result', shareLink: 'Share link', copied: 'Copied to clipboard.', failed: 'The action could not be completed. Check your browser permissions.', shared: 'Sharing options opened.',
    scaleTitle: 'Distance & Scale', scaleSubtitle: 'Absolute distance remains constant; relative distance depends on scale.',
    scaleReference: 'Reference scale N', scaleSlider: 'Adjust reference scale N (logarithmic)', scaleAbsolute: 'Absolute distance d', scaleRelative: 'Relative distance D(N) = d/N', scalePercent: 'Percentage 100D(N)', scaleNote: 'N is a reference scale, not a number of additional digits calculated or examined.',
    scaleLine: 'Normalized positions: x₁ = p₁/N and x₂ = p₂/N', scaleOverlap: 'Markers may visually overlap at large scales; this does not mean the positions are identical.',
    scaleGraph: 'Graph of D(N) = d/N', scaleGraphDesc: 'Logarithmic horizontal N axis; linear vertical D(N) axis. The point indicates the selected scale.', scaleAxisX: 'N · logarithmic scale', scaleAxisY: 'D(N)', scaleWhy: 'Why does this happen?',
    scaleProof: 'The absolute distance d is constant. For every ε > 0, if N > d/ε, then d/N < ε. Thus the proportion tends to zero as the scale grows, without changing the positions.',
    scaleLimit: 'lim(N → ∞) d/N = 0', scaleDisabled: 'The scale cannot be enlarged: the minimum position is at or above 10¹⁵.', scaleInvalid: 'The scale requires two verified integer positions in the same range.', scalePosition1: 'Position 1', scalePosition2: 'Position 2',
    cardTitle: 'Your moment in π', cardPosition: 'First occurrence · decimal', cardExamined: 'Digits examined', cardFooter: 'A mathematical coincidence, not a prediction.', shareSummary: 'First occurrence in this range: decimal', shareRange: 'digits examined', shareGeneric: 'Explore a date among the digits of π.'
  }
};

const $ = selector => document.querySelector(selector);
const resultsElement = $('#results');
let stored;
try { stored = localStorage.getItem('tu-instante-en-pi-language'); } catch { stored = null; }
let language = chooseLanguage(stored, navigator.language);
let last = null;
let requestId = 0;
let worker;
const t = key => translations[language][key];
const num = number => new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US').format(number);
const measure = number => number !== 0 && Math.abs(number) < 0.0001
  ? new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', { notation: 'scientific', maximumSignificantDigits: 6 }).format(number)
  : new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', { maximumSignificantDigits: 6 }).format(number);

function setLanguage(value) {
  language = value;
  document.documentElement.lang = value;
  document.title = t('brand');
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === value)));
  try { localStorage.setItem('tu-instante-en-pi-language', value); } catch { /* Language remains available for this session. */ }
  render();
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function addAction(container, label, handler) {
  const button = element('button', label, 'action');
  button.type = 'button';
  button.addEventListener('click', handler);
  container.append(button);
}

function shareText(result, date, format) {
  return `${t('brand')}\n${formatDate(date, language)} · ${format}: ${result.pattern}\n${t('shareSummary')} ${num(result.position)}\n${num(result.examined)} ${t('shareRange')}`;
}

function appUrl() {
  const url = new URL('./', location.href);
  url.search = '';
  url.hash = '';
  return url.href;
}

function makeCard(result, date, format) {
  const canvas = document.createElement('canvas');
  canvas.width = 1600; canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  const gradient = ctx.createLinearGradient(0, 0, 1600, 1000);
  gradient.addColorStop(0, '#102d3a'); gradient.addColorStop(1, '#07131f');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1600, 1000);
  ctx.fillStyle = '#9be6d6'; ctx.font = 'italic 440px Georgia'; ctx.fillText('π', 1220, 465);
  ctx.fillStyle = '#9be6d6'; ctx.font = 'bold 34px sans-serif'; ctx.fillText(t('cardTitle').toUpperCase(), 90, 110);
  ctx.fillStyle = '#eef8f7'; ctx.font = '56px sans-serif'; ctx.fillText(formatDate(date, language), 90, 245, 1200);
  ctx.fillStyle = '#a9c2ca'; ctx.font = '30px sans-serif'; ctx.fillText(`${t('representation')}: ${format} · ${result.pattern}`, 90, 325, 1200);
  ctx.fillText(t('cardPosition'), 90, 465, 1200);
  ctx.fillStyle = '#9be6d6'; ctx.font = '110px Georgia'; ctx.fillText(num(result.position), 90, 590, 1200);
  ctx.fillStyle = '#eef8f7'; ctx.font = '36px monospace'; ctx.fillText(`${result.before}${result.pattern}${result.after}`, 90, 720, 1400);
  ctx.fillStyle = '#a9c2ca'; ctx.font = '28px sans-serif'; ctx.fillText(`${t('cardExamined')}: ${num(result.examined)}`, 90, 840);
  ctx.fillText(t('cardFooter'), 90, 920, 1400);
  return canvas;
}

function addScale(box, results) {
  const [first, second] = results;
  const heading = element('h2', t('scaleTitle'));
  box.append(heading, element('p', t('scaleSubtitle'), 'muted'));
  if (!Number.isSafeInteger(first.position) || !Number.isSafeInteger(second.position) ||
      first.position < 1 || second.position < 1 || first.position > first.examined ||
      second.position > second.examined || first.examined !== second.examined) {
    box.append(element('p', t('scaleInvalid'), 'muted'));
    return;
  }
  const bounds = scaleBounds(first.position, second.position);
  const label = element('label', t('scaleSlider'));
  label.htmlFor = 'scale-slider';
  const slider = element('input');
  slider.type = 'range'; slider.id = 'scale-slider'; slider.min = '0'; slider.max = '1';
  slider.step = 'any'; slider.value = String(last.scaleFraction ?? 0); slider.disabled = !bounds.adjustable;
  const reference = element('p', '', 'scale-metric');
  const relative = element('p', '', 'scale-metric');
  const percent = element('p', '', 'scale-metric');
  const lineLabel = element('p', t('scaleLine'));
  const line = element('div', undefined, 'scale-line');
  line.setAttribute('aria-hidden', 'true');
  const marker1 = element('span', '1', 'scale-marker marker-one');
  const marker2 = element('span', '2', 'scale-marker marker-two');
  line.append(marker1, marker2);
  const lineText = element('p', '', 'muted scale-line-text');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 640 250'); svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${t('scaleGraph')}. ${t('scaleGraphDesc')}`);
  svg.classList.add('scale-graph');
  const graphPath = document.createElementNS(svg.namespaceURI, 'path');
  graphPath.setAttribute('class', 'scale-curve');
  const graphDot = document.createElementNS(svg.namespaceURI, 'circle');
  graphDot.setAttribute('class', 'scale-dot'); graphDot.setAttribute('r', '5');
  const axis = document.createElementNS(svg.namespaceURI, 'path');
  axis.setAttribute('d', 'M 50 20 V 200 H 620'); axis.setAttribute('class', 'scale-axis');
  const xLabel = document.createElementNS(svg.namespaceURI, 'text');
  xLabel.setAttribute('x', '335'); xLabel.setAttribute('y', '238'); xLabel.setAttribute('text-anchor', 'middle'); xLabel.textContent = t('scaleAxisX');
  const yLabel = document.createElementNS(svg.namespaceURI, 'text');
  yLabel.setAttribute('x', '10'); yLabel.setAttribute('y', '16'); yLabel.textContent = t('scaleAxisY');
  svg.append(axis, graphPath, graphDot, xLabel, yLabel);
  const graphBounds = element('p', `${t('scaleReference')}: ${num(bounds.min)} – ${num(bounds.max)} · ${t('scaleRelative')}: 0 – ${measure(Math.abs(first.position - second.position) / bounds.min)}`, 'muted');
  const detail = element('details');
  detail.append(element('summary', t('scaleWhy')), element('p', t('scaleProof')));
  const absolute = Math.abs(first.position - second.position);
  box.append(element('p', `${t('scaleAbsolute')}: ${num(absolute)}`, 'scale-metric'), label, slider, reference, relative, percent, element('p', t('scaleNote'), 'muted'));
  if (!bounds.adjustable) box.append(element('p', t('scaleDisabled'), 'muted'));
  box.append(lineLabel, line, lineText, element('p', t('scaleOverlap'), 'muted'), element('h3', t('scaleGraph')), svg, graphBounds, element('p', t('scaleGraphDesc'), 'muted'), element('p', t('scaleLimit'), 'scale-limit'), detail);
  const update = () => {
    const fraction = Number(slider.value);
    last.scaleFraction = fraction;
    const values = scaleValues(first.position, second.position, referenceAt(bounds, fraction));
    reference.textContent = `${t('scaleReference')}: ${num(values.reference)}`;
    slider.setAttribute('aria-valuetext', `${t('scaleReference')}: ${num(values.reference)}`);
    relative.textContent = `${t('scaleRelative')} ≈ ${measure(values.relative)}`;
    percent.textContent = `${t('scalePercent')} ≈ ${measure(values.percent)} %`;
    marker1.style.left = `${values.x1 * 100}%`; marker2.style.left = `${values.x2 * 100}%`;
    lineText.textContent = `${t('scalePosition1')}: ${num(first.position)}; x₁ ≈ ${measure(values.x1)} · ${t('scalePosition2')}: ${num(second.position)}; x₂ ≈ ${measure(values.x2)} · |x₂ − x₁| ≈ ${measure(values.relative)}`;
    const maxY = absolute / bounds.min;
    const yAt = n => maxY === 0 ? 200 : 200 - 180 * (absolute / n) / maxY;
    const points = Array.from({ length: 101 }, (_, i) => {
      const f = i / 100;
      return `${i ? 'L' : 'M'} ${50 + 570 * f} ${yAt(referenceAt(bounds, f))}`;
    }).join(' ');
    graphPath.setAttribute('d', points);
    graphDot.setAttribute('cx', String(50 + 570 * fraction));
    graphDot.setAttribute('cy', String(yAt(values.reference)));
  };
  slider.addEventListener('input', update);
  update();
}

function render() {
  resultsElement.replaceChildren();
  if (!last) return;
  if (last.state !== 'done') {
    const box = element('div', t(last.state), 'result');
    box.setAttribute('role', last.state === 'loading' ? 'status' : 'alert');
    resultsElement.append(box); return;
  }
  last.results.forEach((result, index) => {
    const box = element('article', undefined, 'result');
    box.append(element('p', formatDate(last.dates[index], language), 'eyebrow'));
    box.append(element('h2', t(result.status === 'found' ? 'found' : 'missing')));
    box.append(element('p', `${t('representation')}: ${last.format} · ${result.pattern}`, 'muted'));
    if (result.status === 'found') {
      box.append(element('p', t('position'), 'muted'), element('p', num(result.position), 'position'));
      box.append(element('p', `${t('context')} ${num(result.contextStart)}`, 'muted'));
      const context = element('div', undefined, 'context');
      context.append(document.createTextNode(result.before), element('mark', result.pattern), document.createTextNode(result.after));
      box.append(context);
    } else box.append(element('p', t('range'), 'muted'));
    box.append(element('p', `${t('examined')}: ${num(result.examined)}`, 'muted'));
    const actions = element('div', undefined, 'actions');
    const feedback = element('p', '', 'feedback muted');
    feedback.setAttribute('role', 'status');
    if (result.status === 'found') {
      addAction(actions, t('download'), () => {
        try {
          makeCard(result, last.dates[index], last.format).toBlob(blob => {
            if (!blob) { feedback.textContent = t('failed'); return; }
            const url = URL.createObjectURL(blob);
            const link = element('a'); link.href = url; link.download = 'instante-pi.png'; link.click();
            setTimeout(() => URL.revokeObjectURL(url), 10000);
          }, 'image/png');
        } catch { feedback.textContent = t('failed'); }
      });
      addAction(actions, t('copy'), async () => {
        try { await navigator.clipboard.writeText(shareText(result, last.dates[index], last.format)); feedback.textContent = t('copied'); }
        catch { feedback.textContent = t('failed'); }
      });
      if (navigator.share) addAction(actions, t('share'), async () => {
        try { await navigator.share({ title: t('brand'), text: shareText(result, last.dates[index], last.format), url: appUrl() }); feedback.textContent = t('shared'); }
        catch (error) { if (error.name !== 'AbortError') feedback.textContent = t('failed'); }
      });
    }
    addAction(actions, t('shareLink'), async () => {
      try { await navigator.clipboard.writeText(appUrl()); feedback.textContent = t('copied'); }
      catch { feedback.textContent = t('failed'); }
    });
    if (result.status === 'found') box.append(element('p', t('shareNotice'), 'share-notice'));
    box.append(actions, feedback); resultsElement.append(box);
  });
  if (last.results.length === 2) {
    const value = distance(...last.results);
    const box = element('div', undefined, 'result');
    box.append(element('h2', t('distance')), element('p', value === null ? t('distanceUnavailable') : `${num(value)} ${t('distanceUnit')}`, value === null ? 'muted' : 'position'));
    if (value !== null) addScale(box, last.results);
    else box.append(element('h2', t('scaleTitle')), element('p', t('scaleInvalid'), 'muted'));
    resultsElement.append(box);
  }
}

document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
$('#couple').addEventListener('change', event => { $('#second-field').hidden = !event.target.checked; $('#date-two').required = event.target.checked; });
$('#cancel').addEventListener('click', () => {
  requestId++;
  if (worker) worker.terminate();
  worker = null;
  $('#search').disabled = false;
  $('#cancel').hidden = true;
  last = { state: 'cancelled' };
  render();
});
$('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  const dates = [$('#date-one').value];
  if ($('#couple').checked) dates.push($('#date-two').value);
  const format = $('#format').value;
  let patterns;
  try { patterns = dates.map(date => patternForDate(date, format)); }
  catch { last = { state: 'invalid' }; render(); return; }
  last = { state: 'loading', dates, format };
  render();
  $('#search').disabled = true;
  $('#cancel').hidden = false;
  const id = ++requestId;
  try {
    if (!worker) {
      worker = new Worker(new URL('./worker.mjs', import.meta.url), { type: 'module' });
      worker.onmessage = ({ data }) => {
        if (data.id !== requestId) return;
        $('#search').disabled = false;
        $('#cancel').hidden = true;
        if (data.error) { worker.terminate(); worker = null; }
        last = data.error ? { state: 'incomplete' } : { ...last, state: 'done', results: data.results };
        render();
      };
      worker.onerror = () => { worker.terminate(); worker = null; $('#search').disabled = false; $('#cancel').hidden = true; last = { state: 'incomplete' }; render(); };
    }
    worker.postMessage({ id, patterns });
  } catch { $('#search').disabled = false; $('#cancel').hidden = true; last = { state: 'incomplete' }; render(); }
});
setLanguage(language);
