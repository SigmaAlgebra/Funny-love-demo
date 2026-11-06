// Única integración de medición: GTM. No instalar gtag.js en paralelo.
window.FL_CONFIG = { gtmId: 'GTM-P7BPKDS2', debug: true, currency: 'MXN', freeShipping: 999, standardShipping: 99, expressShipping: 149 };
window.dataLayer = window.dataLayer || [];

(function () {
  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag('set', 'send_page_view', false);
})();
