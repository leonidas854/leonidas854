# Editar el perfil por componentes

Perfil: [leonidas854](https://github.com/leonidas854). Página: [Código, galaxia y nieve](https://leonidas854.github.io/leonidas854/).

## Estructura

| Qué quieres cambiar | Dónde editar |
| --- | --- |
| Orden de las secciones y metadatos | `src/page.html` |
| Navegación superior | `src/components/navigation/` |
| Nombre, presentación y terminal | `src/components/profile/` |
| Listas de lenguajes y frameworks | `src/components/technologies/` |
| Enlaces de contacto | `src/components/contact/` |
| Fondo de partículas | `src/components/galaxy/` |
| Esfera, casas, personajes y nieve | `src/components/snow-globe/` |
| Foca de Podman en 3D | `src/components/snow-globe/podman-seal.js` |
| Foca de Podman en SVG y vista sin WebGL | `src/readme/artwork/podman-seal.svg` y `scripts/readme/seal.py` |
| Paleta, tipografía y controles comunes | `src/styles/base.css` |
| Pausa, movimiento reducido y visibilidad | `src/shared/motion.js` |
| Conexión entre los componentes | `src/app.js` |
| Secciones del perfil de GitHub | `src/readme/es/` y `src/readme/en/` |
| Cabecera, terminal y frases animadas del README | `src/readme/artwork/*.svg` |
| Botones de contacto y navegación del README | `src/readme/artwork/buttons.json` |
| Galaxia y composición de los SVG del README | `scripts/readme/` |
| Velocidad y versiones estáticas de la serpiente | `scripts/prepare-snake.py` |

Cada componente de contenido tiene su HTML y CSS. Las escenas separan la creación de objetos, la física, el dibujo y los controles. Consulta [las referencias](docs/REFERENCES.md) para ver qué parte del HTML/CSS original se adaptó en cada módulo y [la dirección visual](DESIGN.md) para conservar el estilo aprobado.

`index.html`, `README.md` y `README.en.md` son **salidas generadas**. Se guardan en el repositorio para que GitHub pueda servirlos directamente, pero se editan desde `src/`.

## Flujo de trabajo

Requisitos: Python 3.9 o posterior y Node.js 22 o posterior para las comprobaciones. No hace falta instalar paquetes para construir o ejecutar la página.

```sh
python3 scripts/build.py
python3 scripts/build-assets.py
python3 scripts/check.py
python3 -m http.server 8765 --bind 127.0.0.1
```

Abre [la vista local](http://localhost:8765). Tras editar un componente, vuelve a ejecutar `python3 scripts/build.py` y recarga. Para cambios solo en CSS o JavaScript basta recargar el navegador.

Three.js y OrbitControls **0.170.0** están en `src/vendor/three/`, con su licencia. Los logos y bandas de iconos también se sirven localmente. No se usan CDN, API meteorológica, analítica ni claves en tiempo de ejecución.

## Comprobar las escenas

- Arrastra la esfera con el ratón para verla desde otros ángulos.
- Con foco en la esfera, las flechas giran la cámara e Inicio restablece la vista.
- «Agitar nieve» activa la circulación de partículas dentro del cristal.
- «Pausar movimiento» detiene galaxia, nieve y movimiento automático de la esfera; el giro manual sigue disponible.
- Movimiento reducido y colores forzados detienen el movimiento automático. La escena también se detiene al ocultar la pestaña o salir la cabecera de pantalla.
- Sin JavaScript se mantiene el contenido completo. Sin WebGL se muestra la ilustración y se deshabilitan los controles exclusivos de 3D.

El tema es nocturno, como las referencias originales. Con colores forzados se usan los colores de alto contraste del sistema.

## README y GitHub Pages

El README usa Markdown e imágenes SVG animadas. La esfera 3D y el lienzo de partículas pertenecen a la página enlazada: GitHub no ejecuta JavaScript de una página dentro del README. [Referencia de GitHub](https://github.com/github/markup).

Los botones, la cabecera, la terminal y el mundo de nieve se generan en `assets/profile/` con `python3 scripts/build-assets.py`. Las curvas reutilizan la geometría Bézier del componente de galaxia; el movimiento del README se expresa con CSS y SVG, sin JavaScript en las imágenes. Edita las fuentes, no las salidas. Los botones tienen enlaces HTML externos para funcionar dentro de GitHub.

La serpiente queda siempre visible, sin desplegables, y usa contribuciones reales. Su workflow ajusta todos los tiempos juntos al 72 % de su duración original y genera variantes estáticas desde una salida nueva de Platane/snk. No ejecutes el ajuste dos veces sobre la misma salida. Las imágenes principales usan `picture` para seleccionar una variante estática con movimiento reducido. Los textos y enlaces también están disponibles como Markdown.

Pages publica desde **main / (root)**. Después de generar y comprobar los archivos, un push a `main` actualiza el perfil y la página. `.nojekyll` permite servir los archivos estáticos directamente.

`Check profile` verifica enlaces locales, imágenes, módulos y sintaxis; también reconstruye las salidas para detectar cambios no generados. El workflow existente `Generate Contribution Snake` mantiene la animación en la rama `output` a las 00:00 UTC y al publicar. Se puede ejecutar manualmente desde Actions.

## Reutilizarlo

Crea un repositorio público cuyo nombre coincida con tu usuario. Sustituye `leonidas854`, el nombre, correo, Telegram y Discord en los componentes y en ambos idiomas. Cambia los textos de los SVG cuando corresponda, genera las salidas y activa Pages. Conserva los créditos de los recursos utilizados.

Telegram usa el número proporcionado y depende de la configuración de descubrimiento de la cuenta. Puedes cambiarlo por un alias público. Discord depende de la vigencia de su invitación.

Código original bajo [MIT](LICENSE), recursos de terceros según [CREDITS.md](CREDITS.md). No se incluyen proyectos destacados por decisión del autor.
