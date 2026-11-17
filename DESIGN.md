# Dirección visual del perfil

La referencia vinculante es la versión `770c224` y los HTML/CSS aportados por el usuario. La revisión clara con tipografía serif (`9ca0448`) fue rechazada. Conservar la identidad técnica y cósmica al hacer cambios.

## Composición

- Galaxia de filamentos a toda la ventana, con la física del adjunto. No encerrarla en una tarjeta ni sustituirla por una imagen genérica.
- Perfil compacto, terminal, tipografía sans y monoespaciada. Cabecera SVG e iconos técnicos en el README.
- Esfera 3D protagonista con cristal, base, nieve, cabaña Rust, casa Podman y gophers de Go. El SVG es la alternativa para README y ausencia de WebGL.
- Superficies opacas detrás del texto para que las partículas no reduzcan la legibilidad.
- Colores sólidos en interfaz; nada de texto con degradado ni bloques crema. Las luces del cristal y las partículas son parte de la escena, no fondos de paneles.
- En el perfil de GitHub, conservar accesos con aspecto de botones, ilustraciones completas y serpiente visible sin desplegables. Las animaciones SVG deben ser perceptibles: partículas recorriendo filamentos, escritura, nieve y personajes; mantener variantes estáticas para movimiento reducido.

## Tokens

Definidos en `src/styles/base.css`: fondo `#080a10`, superficie `#10141e`, elevada `#181e2b`, texto `#e6edf3`, secundario `#aab8cb`, menta `#45ffc0`, azul `#8eb7ff`, Rust `#ffad85`. El tema permanece nocturno aunque el sistema prefiera tema claro; colores forzados usan los colores del sistema.

## Mantenimiento

Editar el componente responsable y conservar el resto. `src/page.html` ensambla la página; `src/readme/{es,en}` ensambla cada README. Las fuentes de sus imágenes están en `src/readme/artwork/` y `scripts/readme/`. Ejecutar `python3 scripts/build.py` y `python3 scripts/build-assets.py` antes de publicar. No editar a mano los archivos generados.

La escena debe poder pausarse, respetar movimiento reducido y detenerse al salir de pantalla. Mantener contenido y enlaces disponibles sin JavaScript y la ilustración disponible sin WebGL.
