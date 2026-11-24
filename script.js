document.documentElement.classList.add('js');

// Sanftes Einblenden der Abschnitte beim Scrollen
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();

// Geschenk: Deckel fliegt hoch, Konfetti & Herzchen
(function () {
  var wrap = document.querySelector('.present');
  if (!wrap) return;
  var btn = wrap.querySelector('.present__btn');
  var burst = wrap.querySelector('.present__burst');
  var colors = ['#E3A5AE', '#A9C1A0', '#C9B5DD', '#F0D98C', '#A9C8E0', '#EDB9C0'];
  var timer, timer2;

  // Sprechblase: Kontoangaben aufklappen (dann bleibt alles offen) & IBAN kopieren
  var bToggle = document.querySelector('.bubble__toggle');
  var bBank = document.getElementById('bubble-bank');
  var bCopy = document.querySelector('.bubble__copy');
  if (bToggle && bBank) {
    bToggle.addEventListener('click', function () {
      clearTimeout(timer);
      clearTimeout(timer2);
      bToggle.setAttribute('aria-expanded', 'true');
      bBank.hidden = false;
    });
  }
  if (bCopy) {
    bCopy.addEventListener('click', function () {
      var el = document.querySelector('.bubble__iban'); var iban = (el.getAttribute('data-iban') || el.textContent).replace(/\s+/g, '');
      var done = function () { bCopy.textContent = 'Kopiert ✓'; setTimeout(function () { bCopy.textContent = 'IBAN kopieren'; }, 2000); };
      if (navigator.clipboard) { navigator.clipboard.writeText(iban).then(done, function () {}); }
      else {
        var ta = document.createElement('textarea'); ta.value = iban; document.body.appendChild(ta);
        ta.select(); try { document.execCommand('copy'); done(); } catch (e) {} ta.remove();
      }
    });
  }

  btn.addEventListener('click', function () {
    // Wünsche bei jedem Klick erneut herausfliegen lassen
    clearTimeout(timer);
    clearTimeout(timer2);
    if (bToggle && bBank) { bToggle.setAttribute('aria-expanded', 'false'); bBank.hidden = true; }
    wrap.classList.remove('has-opened', 'is-closing');
    void wrap.offsetWidth;
    wrap.classList.add('is-open', 'has-opened');
    // nach einer Weile: Wünsche fliegen zurück ins Paket, dann geht der Deckel zu
    timer = setTimeout(function () {
      wrap.classList.add('is-closing');
      timer2 = setTimeout(function () {
        wrap.classList.remove('is-open', 'has-opened', 'is-closing');
      }, 800);
    }, 5000);
    if (!Element.prototype.animate) return;

    for (var i = 0; i < 70; i++) {
      var bit = document.createElement('span');
      var kind = i % 7 === 0 ? 'heart' : (i % 3 === 0 ? 'round' : 'rect');
      var color = colors[i % colors.length];
      bit.className = 'present__bit' + (kind === 'rect' ? '' : ' present__bit--' + kind);
      if (kind === 'heart') { bit.textContent = '♥'; bit.style.color = color; }
      else { bit.style.background = color; }
      burst.appendChild(bit);

      var angle = (-90 + (Math.random() - 0.5) * 150) * Math.PI / 180;
      var dist = 180 + Math.random() * 260;
      var x = Math.cos(angle) * dist;
      var y = Math.sin(angle) * dist;
      var spin = (Math.random() - 0.5) * 900;
      var anim = bit.animate([
        { transform: 'translate(-50%, -50%) rotate(0deg) scale(.4)', opacity: 1 },
        { transform: 'translate(' + x + 'px,' + y + 'px) rotate(' + spin / 2 + 'deg) scale(1)', opacity: 1, offset: .45 },
        { transform: 'translate(' + (x * 1.15) + 'px,' + (y + 320) + 'px) rotate(' + spin + 'deg) scale(.9)', opacity: 0 }
      ], { duration: 1600 + Math.random() * 900, easing: 'cubic-bezier(.2,.7,.4,1)' });
      anim.onfinish = (function (el) { return function () { el.remove(); }; })(bit);
    }
  });
})();

// Fotobox: Blitz, Foto kommt heraus, Sprechblase erscheint
(function () {
  var booth = document.querySelector('.booth');
  if (!booth) return;
  var btn = booth.querySelector('.booth__btn');
  var flash = document.querySelector('.booth__flash');
  btn.addEventListener('click', function () {
    booth.classList.remove('has-shot', 'is-shooting');
    if (flash) flash.classList.remove('is-on');
    void booth.offsetWidth;
    booth.classList.add('has-shot', 'is-shooting');
    if (flash) flash.classList.add('is-on');
    setTimeout(function () {
      booth.classList.remove('is-shooting');
      if (flash) flash.classList.remove('is-on');
    }, 750);
  });
})();

// Akkordeon: Unterkünfte auf- und zuklappen
(function () {
  document.querySelectorAll('.stay__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });
})();
