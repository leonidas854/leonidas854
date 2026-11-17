# Referencias aportadas y adaptación

## Campo de partículas

El adjunto que empieza con `<main id="universe">` contiene curvas Bézier, filamentos ramificados, fuerzas de vórtice, interacción del puntero y una cuadrícula de colisiones. Es la fuente de `src/components/galaxy/`:

| Parte de la referencia | Componente actual |
| --- | --- |
| `bezier`, `gaussian` | `geometry.js` |
| `makeStrand`, `createNebula` | `model.js` |
| `fieldForce`, `updateParticles` | `forces.js` |
| `buildGrid`, `collisions` | `collisions.js` |
| `drawFilaments`, `drawParticles` | `painter.js` |
| Tamaño, puntero y actualización | `index.js` |

Se conservaron el campo y la dinámica. Se limitó la densidad en móvil, se cachearon los puntos por filamento y se dejó de recolocar aleatoriamente los puntos de las hebras al salir del lienzo. La paleta usa tres colores fijos y el tiempo se controla desde un único reloj.

## Bola de nieve

El primer adjunto incluye la referencia **Guthrie Theater snow globe**, firmada en su HTML por [Lucy Bichakhchyan](https://bichakhchyan.com/). Se tomó la geometría torneada de la base y la cúpula, el shader de reflejos del cristal y el modelo de giro y circulación de la nieve. La versión de Three.js se fijó a **0.170.0**, como en su importmap, y se guardó localmente.

| Parte | Componente actual |
| --- | --- |
| Base, placa y cúpula | `snow-globe/shell.js` |
| Cristal y reflejos | `snow-globe/glass.js` |
| Nieve y agitación | `snow-globe/snow.js` |
| Casas Rust/Podman y árboles | `snow-globe/village.js` |
| Personajes Go | `snow-globe/characters.js` |
| Cámara, luces, teclado y WebGL | `snow-globe/index.js` |

El teatro se sustituyó por las casas solicitadas. Los datos meteorológicos de Minneapolis y el audio no pertenecen al perfil y no se incorporaron. Los controles útiles son giro, agitación, vista inicial y pausa.

## Historial de comparación

- `770c224`: identidad visual anterior preferida por el usuario.
- `9ca0448`: revisión que el usuario pidió corregir.
- Las referencias originales se recibieron como texto adjunto. Esta tabla permite localizar cada adaptación sin depender de rutas privadas del equipo.
