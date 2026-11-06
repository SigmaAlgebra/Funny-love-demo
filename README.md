# Funny Love · Propuesta de boutique y laboratorio de ecommerce

Rediseño independiente basado en los archivos entregados por Sigma Algebra.
Página estática en `dist/`, sin dependencias de compilación.

## Incluye

- Inicio editorial responsive y catálogo de 9 productos de demostración.
- Lencería, bienestar y cuidado; búsqueda, precio, disponibles y orden.
- Ficha, galería ampliable, tallas, favoritos persistentes y productos relacionados.
- Bolsa persistente con cantidades por variante y stock máximo simulado.
- Cupón AMOR10, envío estándar / exprés y envío estándar gratis desde $999 netos.
- Checkout de tres pasos con datos ficticios y pago aprobado / rechazado.
- Comprobante local descargable, ID único y prevención de reenvío al recargar confirmación.
- Banner de analítica opcional e inspector de eventos con exportación JSON.
- Integración exclusivamente por dataLayer / GTM; sin gtag.js duplicado.

Ver `dist/GUIA-GTM-GA4.md` para configuración y matriz de pruebas.
Configurar GTM en `dist/config.js` o en el laboratorio (solo navegador actual).

## Fuente de fotografía

Imágenes de catálogo descargadas desde los assets públicos de la tienda original:
https://www.storefunnylove.com/lenceria
https://www.storefunnylove.com/vibradores
https://www.storefunnylove.com/lubricantes

Se usan como referencia para la propuesta a ese negocio. No se presume licencia
para su explotación independiente; confirmar autorización antes de publicación
comercial externa. El texto comercial, nombres editoriales, precios, tallas y
existencias de esta demo son ilustrativos, no datos de stock reales.
La tipografía DM Sans se solicita a Google Fonts con fallback de sistema.

## Ejecución

Desde dist: `python3 -m http.server 8000`. Abrir http://localhost:8000.
Desplegar dist como directorio raíz. Rutas hash compatibles con GitHub Pages.
No almacenar secretos en archivos públicos. Los IDs GTM y GA4 son identificadores públicos.

## Antes de vender

Conectar backend y pasarela, comprobar catálogo y especificaciones del proveedor,
validar precios/stock en servidor, aprobar políticas y completar una CMP conforme
al uso real de datos. El checkout actual no cobra ni genera pedidos reales.
