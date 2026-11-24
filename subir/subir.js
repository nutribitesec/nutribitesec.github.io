(async function () {
  const CFG = window.NB_CONFIG, $ = id => document.getElementById(id);
  await NB.data.init('subir');
  const t0 = Date.now();
  let blob = null, pos = null, acc = null, fs = null, ms = null, enviando = false;

  /* mapa */
  const map = NB.mapa('pm', { z: 13, zoom: true, claro: true });
  let mk = null;
  function poner(lat, lng, precision) {
    pos = [+lat.toFixed(6), +lng.toFixed(6)]; acc = precision == null ? null : Math.round(precision);
    if (mk) mk.setLatLng(pos); else { mk = L.marker(pos, { icon: NB.pin('•', '', '#ff2bd6'), draggable: true }).addTo(map); mk.on('dragend', () => { const p = mk.getLatLng(); poner(p.lat, p.lng, null); }); }
    $('s2').classList.add('ok');
    $('lh').textContent = acc != null ? `Ubicación marcada (precisión aproximada de ${acc} m). Puedes mover el punto si hace falta.` : 'Ubicación marcada. Puedes mover el punto si hace falta.';
  }
  map.on('click', e => { poner(e.latlng.lat, e.latlng.lng, null); });
  $('gps').onclick = () => {
    if (!navigator.geolocation) return NB.toast('Tu navegador no permite ubicación. Toca el mapa para marcar el punto.', 'bad');
    const b = $('gps'); b.disabled = true; b.textContent = 'Buscando ubicación…';
    navigator.geolocation.getCurrentPosition(p => {
      b.disabled = false; b.innerHTML = '📍 Actualizar mi ubicación';
      poner(p.coords.latitude, p.coords.longitude, p.coords.accuracy); map.setView(pos, 18);
    }, () => { b.disabled = false; b.innerHTML = '📍 Usar mi ubicación actual'; NB.toast('No pudimos obtener tu ubicación. Activa el GPS o toca el mapa.', 'bad'); }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
  };

  /* foto */
  async function comprimir(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
      const m = 1280, k = Math.min(1, m / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      return await new Promise((ok, no) => c.toBlob(b => b ? ok(b) : no(new Error('toBlob')), 'image/jpeg', 0.78));
    } finally { URL.revokeObjectURL(url); }
  }
  const onFoto = async e => {
    const f = e.target.files[0]; if (!f) return;
    if (!/^image\//.test(f.type)) return NB.toast('Elige una imagen', 'bad');
    try {
      blob = await comprimir(f);
      if (blob.size > 3 * 1024 * 1024) { blob = null; return NB.toast('La foto es muy pesada. Intenta con otra.', 'bad'); }
      $('ph').innerHTML = `<input type="file" id="file2" accept="image/*" capture="environment" hidden><img alt="Foto de la fachada" src="${URL.createObjectURL(blob)}">`;
      $('file2').onchange = onFoto; $('s1').classList.add('ok');
    } catch (err) { console.error(err); NB.toast('No pudimos leer la foto. Intenta con otra.', 'bad'); }
  };
  $('file').onchange = onFoto;

  /* preguntas */
  const pick = (box, set) => document.querySelectorAll('#' + box + ' button').forEach(b => b.onclick = () => { document.querySelectorAll('#' + box + ' button').forEach(x => x.classList.toggle('on', x === b)); set(b.dataset.v); $('s3').classList.toggle('ok', !!(fs && ms)); });
  pick('fs', v => fs = v); pick('ms', v => ms = v);

  /* enviar */
  $('go').onclick = async () => {
    if (enviando) return;
    if (!blob) return NB.toast('Falta la foto de la fachada', 'bad');
    if (!pos) return NB.toast('Falta marcar la ubicación', 'bad');
    if (pos[0] < -5.1 || pos[0] > 1.5 || pos[1] < -81.2 || pos[1] > -75) return NB.toast('La ubicación está fuera de Ecuador. Revisa el punto.', 'bad');
    if (!fs) return NB.toast('Responde si vende frutos secos', 'bad');
    if (!ms) return NB.toast('Responde si vende snacks para mascotas', 'bad');
    if ($('web').value || Date.now() - t0 < 8000) { $('form').hidden = true; $('done').hidden = false; return; }   // robots: se descarta en silencio
    enviando = true; const b = $('go'); b.disabled = true; b.textContent = 'Enviando…';
    try {
      await NB.data.enviarPropuesta({ lat: pos[0], lng: pos[1], precision_m: acc, vende_frutos_secos: fs, vende_mascotas: ms }, blob);
      $('form').hidden = true; $('done').hidden = false; window.scrollTo(0, 0);
    } catch (err) {
      console.error(err); NB.toast('No se pudo enviar. Revisa tu conexión e intenta de nuevo.', 'bad');
    } finally { enviando = false; b.disabled = false; b.textContent = 'Enviar tienda'; }
  };
  $('otra').onclick = () => location.reload();

  if (pos == null) map.setView(CFG.CENTRO, 13);
})();
