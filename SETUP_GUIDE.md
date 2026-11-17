# Mantener y reutilizar este perfil

El perfil pertenece a [leonidas854](https://github.com/leonidas854) y su repositorio público es [leonidas854/leonidas854](https://github.com/leonidas854/leonidas854).

## Qué editar

| Archivo | Contenido |
| --- | --- |
| `README.md` / `README.en.md` | Presentación, tecnologías, nivel de experiencia y contactos |
| `index.html` | Contenido de la página interactiva |
| `assets/profile.css` | Colores, diseño y adaptación a móvil |
| `assets/universe.js` | Galaxia, interacción y controles de movimiento |
| `assets/globe-scene.svg` | Ilustración original editable de la bola de nieve |
| `assets/snow-globe.svg` | Ilustración con texto para el README |
| `assets/header-banner.svg` | Cabecera del perfil |
| `CREDITS.md` | Atribuciones y condiciones de los recursos |

Tras cambiar la bola de nieve, ejecuta `python3 scripts/build-assets.py` para actualizar sus variantes de pausa y nevada. Si modificas su dibujo, actualiza también la ilustración del README.

La escena del README usa SVG con animación CSS interna y alternativa estática si el visor no la reproduce. El dibujo sigue visible con movimiento reducido. GitHub no ejecuta el JavaScript ni los estilos HTML de una página dentro de un README; la interacción está en GitHub Pages. [Referencia de GitHub](https://github.com/github/markup).

## Probar localmente

Requisitos: Python 3; Node.js solo para comprobar la sintaxis de JavaScript. No se necesita instalar paquetes ni configurar claves.

```sh
python3 scripts/check.py
node --check assets/universe.js
python3 -m http.server 8765 --bind 127.0.0.1
```

Abre [la vista local](http://localhost:8765) y comprueba los enlaces, «Agitar la nieve» y «Pausar animación». La página respeta el tema del sistema, el movimiento reducido y los colores forzados. Pausa el movimiento al ocultar la pestaña o salir la escena de la pantalla. El perfil, sus enlaces y el dibujo siguen disponibles sin JavaScript.

## Publicar en GitHub Pages

La fuente de publicación es **main / (root)**. El archivo `.nojekyll` permite servir HTML, CSS, JS y SVG tal como están. Cada push a `main` actualiza el perfil y vuelve a publicar la página cuando Pages está activado.

Para activar o verificar esa configuración: repositorio → **Settings → Pages → Deploy from a branch → main → /(root)**. El enlace esperado es [leonidas854.github.io/leonidas854](https://leonidas854.github.io/leonidas854/). La publicación puede tardar unos minutos; comprueba el resultado en Actions. [Documentación oficial](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Usarlo en otra cuenta

1. Crea un repositorio **público con el mismo nombre que tu usuario** y coloca `README.md` en la raíz. [Requisitos del perfil](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme).
2. Sustituye `leonidas854`, el nombre, el correo, Telegram y Discord en ambos README y en `index.html`. Ajusta también los SVG y esta guía.
3. Actualiza los niveles de experiencia con tus datos y conserva los créditos que correspondan.
4. Activa Pages si quieres la página interactiva y cambia sus enlaces por los de tu cuenta.
5. Ejecuta las comprobaciones antes de publicar.

## Animación de contribuciones

Se conserva el workflow existente `Generate Contribution Snake`, que actualiza la rama `output` a diario a las 00:00 UTC (20:00 del día anterior en Bolivia), al publicar en `main` o manualmente desde Actions. La sección «Mi actividad en GitHub» del README usa esas imágenes. En una copia nueva, ejecuta el workflow una vez para generarlas. Si no quieres esta función, elimina esa sección y su workflow.

`Check profile` verifica los archivos en cada push y pull request. Solo necesita permisos de lectura. La serpiente necesita `contents: write` para actualizar exclusivamente su rama de salida.

## Recursos y privacidad

Los recursos de la página son locales. Los contactos son enlaces, sin formularios ni analítica. El enlace telefónico de Telegram depende de la configuración de descubrimiento de tu cuenta; si no abre tu conversación, reemplázalo por tu alias público `t.me/usuario`. Discord depende de la vigencia de la invitación.

Código original bajo MIT. Consulta `CREDITS.md` para los recursos y marcas de terceros. No se incluyen proyectos destacados por decisión del autor.
