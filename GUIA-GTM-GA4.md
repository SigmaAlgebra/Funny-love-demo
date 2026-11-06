# Funny Love · GTM y GA4

Esta tienda funciona sin backend. Las compras y sus importes son de prueba.
Usa una propiedad GA4 de desarrollo separada de la tienda real.

## 1. Empezar

1. Abre la tienda, elige una pieza y una talla, añade a la bolsa.
2. Aplica AMOR10 para descontar 10% en productos.
3. Completa entrega, pago y revisión con los datos ficticios precargados.
4. En pago puedes elegir aprobado o rechazado.
5. En el pie de página abre «Laboratorio GTM / GA4».
6. Expande los eventos para inspeccionar sus parámetros o exporta el registro JSON.

El laboratorio es un inspector local. Un evento en este registro no demuestra
que Google lo haya recibido. Sin ID GTM no se carga ningún contenedor.

## 2. Conectar tu contenedor

1. Crea un contenedor web de Google Tag Manager y una propiedad de desarrollo de GA4.
2. Copia el ID GTM-… al laboratorio. Guarda; la página se recargará.
   Alternativa para publicar con el ID incorporado: edita `FL_CONFIG.gtmId` en `config.js`.
3. Acepta analítica en el banner. Puedes volver a abrirlo desde el pie de página.
4. El ID del laboratorio solo afecta al navegador actual; el de config.js afecta a todos los visitantes.
5. No instales gtag.js por separado: todas las etiquetas deben salir de GTM.

## 3. Etiquetas y variables

### Google tag

Crea una etiqueta «Google tag» con tu ID G-… y disparador Initialization – All Pages.
Configura `send_page_view` = false. El código emite `page_view` manualmente para
las rutas virtuales con hash. No añadas otro disparador History Change.
En GA4, Medición mejorada, desactiva la medición automática de cambios de historial,
búsquedas y formularios para esta propiedad de prueba. Así no duplicas eventos
ni capturas datos de formularios o el texto sin filtrar de una búsqueda.

### Eventos de ecommerce

Crea un disparador de Evento personalizado, coincidencia regex:

```
^(view_item_list|select_item|view_item|add_to_wishlist|add_to_cart|remove_from_cart|view_cart|begin_checkout|add_shipping_info|add_payment_info|purchase)$
```

Crea una etiqueta «Google Analytics: evento de GA4» con:

- ID de medición de la propiedad de desarrollo.
- Nombre del evento: variable integrada `{{Event}}`.
- Opción «Enviar datos de comercio electrónico» activada; origen: Data Layer.
- Disparador: el regex anterior.
- `debug_mode`: true durante la práctica.
- `demo_mode`: true.
- `page_location`: variable de capa de datos `page_location` (versión 2).
- `page_title`: variable de capa de datos `page_title` (versión 2).

El objeto ecommerce se limpia con `{ecommerce: null}` antes de cada evento.
No asignes un único producto global: utiliza siempre `ecommerce.items` del evento.

### page_view y otros eventos

Crea variables de capa de datos (versión 2) para:
`page_location`, `page_title`, `page_path`, `item_id`, `search_term`, `promotion_id`,
`promotion_name`, `creative_slot`, `method`, `shipping_tier`, `payment_type`,
`error_code`, `step`, `coupon`, `success`, `price_max`, `available_only`, `sort_order`.

Crea etiquetas GA4 de eventos con disparadores de Evento personalizado:

| Evento | Parámetros a mapear | Se produce cuando |
| --- | --- | --- |
| page_view | page_location, page_title, page_path | Entras a una ruta de la tienda |
| search | search_term | Envías el buscador |
| sign_up | method | Envías el formulario simulado de novedades |
| view_promotion | promotion_id, promotion_name, creative_slot | El CTA del hero entra en pantalla |
| select_promotion | promotion_id, promotion_name, creative_slot | Pulsas el CTA del hero |
| filter_catalog | price_max, available_only, sort_order | Cambias filtros u orden |
| apply_coupon | coupon, success | Intentas aplicar un cupón |
| size_guide_open | item_id | Abres la guía desde la ficha |
| checkout_step | step | Avanzas a pago o revisión |
| payment_failed | payment_type, error_code | Confirmas una compra con resultado rechazado |
| remove_from_wishlist | item_id | Retiras un favorito |

Puedes crear una etiqueta por evento o un grupo con el nombre `{{Event}}` y solo
los parámetros pertinentes. No envíes `consent_state`, `gtm.*` o todo el dataLayer
indiscriminadamente. `traffic_type: demo` es una marca informativa: no crea por sí
sola un filtro de tráfico interno en GA4. Crea dimensiones personalizadas si quieres
usar demo_mode, shipping_tier u otros campos personalizados en exploraciones.

## 4. Consentimiento

La implementación usa consentimiento básico por bloqueo de carga: no se solicita
GTM antes de aceptar. Los eventos previos aparecen solo en el registro local y no
se reproducen después de aceptar. `consent_state` precede a la carga del contenedor.
Al rechazar o revocar se guarda la elección y se recarga para detener el contenedor.
No se borran automáticamente cookies que Google haya creado previamente.

No se presenta esto como una CMP certificada ni como una implementación completa
de Consent Mode v2. Para añadir publicidad o llevarlo a producción, usa una CMP
y las APIs de consentimiento de las plantillas de GTM. No añadas etiquetas que
carguen fuera del bloqueo de esta demo.

## 5. Qué comprobar en Preview y DebugView

1. Conecta Tag Assistant a la URL de la tienda, acepta analítica y navega otra vez al catálogo.
2. Verifica una sola etiqueta GA4 por evento y un solo page_view por navegación.
3. Abre una pieza, elige talla M y añade dos unidades.
4. En bolsa comprueba quantity=2, item_variant con talla y value = precio × 2.
5. Aplica AMOR10. En checkout, cada item tiene price neto y discount por unidad.
6. Avanza: begin_checkout → add_shipping_info → add_payment_info → purchase.
7. En purchase, value excluye envío; shipping lo contiene por separado.
8. transaction_id empieza por TEST- y es único. El comprobante conserva ese ID.
9. Recarga confirmación: NO debe emitir purchase de nuevo.
10. Prueba rechazo: debe haber payment_failed sin purchase; vuelve y aprueba.
11. Prueba quitar, aumentar/reducir cantidad, favoritos, filtros y búsqueda.
12. Rechaza analítica: no debe cargar GTM tras recarga; los eventos solo son locales.

`view_item_list` registra tarjetas al entrar al menos 35% en pantalla. Los items
se agrupan por tanda de intersección. Volver a un listado genera nuevas impresiones.
`purchase` usa tax=0: el IVA está incluido en el precio ilustrativo y no se desglosa.

El email, nombre y dirección nunca forman parte del payload. Las búsquedas se
limitan a términos de catálogo permitidos; otras se envían como consulta_no_catalogada.
La URL virtual enviada para búsqueda es /buscar, sin la consulta introducida.

## 6. Reutilizar fuera de Sites

Sirve el contenido de esta carpeta en cualquier hosting estático o GitHub Pages.
Las rutas usan #/ y funcionan sin reglas de reescritura. Para local:

```
python3 -m http.server 8000
```

Abre http://localhost:8000. No requiere npm, compilación ni claves secretas.
Para que Tag Assistant y GA4 reciban eventos, necesitas conexión y que el navegador
no bloquee los dominios de Google. Los adblockers pueden impedir su recepción.

## Referencias oficiales

- https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/tag-platform/tag-manager/datalayer

## Límites de esta propuesta

No hay cuentas, pagos, cobros, correos, pedidos externos, inventario sincronizado,
logística, recuperación de carrito entre dispositivos ni protección antifraude.
El último comprobante, bolsa y favoritos viven solo en el navegador.
Para producción se necesita backend comercial, pasarela, validación de precios y
existencias en servidor, políticas verificadas y derechos de uso de las imágenes.
