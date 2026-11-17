# 🚀 Guía de Configuración y Despliegue del Perfil de GitHub

Esta guía te explica paso a paso cómo subir y activar este repositorio para que se muestre en la página principal de tu perfil de GitHub de forma animada e interactiva.

---

## 📌 Paso 1: Crear el Repositorio Especial en GitHub

GitHub tiene una función especial que convierte un repositorio en el README de tu perfil si cumple dos requisitos:
1. El nombre del repositorio **debe coincidir exactamente con tu nombre de usuario de GitHub** (ejemplo: si tu usuario es `leonidas`, el repositorio debe llamarse `leonidas`).
2. El repositorio **debe ser Público** (`Public`).

### Pasos en GitHub:
1. Inicia sesión en [GitHub](https://github.com/).
2. Haz clic en el botón verde **New** (o visita [github.com/new](https://github.com/new)).
3. En **Repository name**, escribe tu nombre de usuario exacto. Verás un mensaje especial que dice:
   > *"✨ You found a secret! [username]/[username] is a special repository that you can use to add a README.md to your GitHub profile."*
4. Asegúrate de marcarlo como **Public**.
5. No es necesario marcar "Add a README file" ya que subiremos los archivos de esta carpeta.
6. Haz clic en **Create repository**.

---

## 💻 Paso 2: Personalizar tus Datos en el Código (2 Minutos)

Antes de subirlo (o justo después), abre los archivos `README.md` y `README.en.md` y realiza estos cambios rápidos:

| Texto a Buscar | Reemplazar por |
| :--- | :--- |
| `YOUR_GITHUB_USERNAME` | Tu nombre de usuario de GitHub real (ej. `leonidas`) |
| `YOUR_LINKEDIN_PROFILE` | Tu nombre de usuario o enlace de LinkedIn |
| `tu-correo@example.com` | Tu dirección de correo de contacto |
| `YOUR_TELEGRAM` | Tu usuario de Telegram |
| `portfolio-url.com` | Tu sitio web o portafolio personal |

> [!TIP]
> Si deseas ajustar el nombre que aparece en la tarjeta de terminal, puedes editar el archivo [assets/terminal-card.svg](file:///home/leonidas/deveploment/perfil/assets/terminal-card.svg#L55) buscando la palabra `Leonidas`.

---

## 📤 Paso 3: Subir los Archivos a GitHub

Abre tu terminal dentro de esta carpeta (`/home/leonidas/deveploment/perfil`) y ejecuta:

```bash
# 1. Inicializar git si aún no está inicializado
git init

# 2. Agregar todos los archivos
git add .

# 3. Crear el primer commit
git commit -m "feat: initial commit for animated tokyo night profile"

# 4. Asegurarse de estar en la rama main
git branch -M main

# 5. Conectar con tu repositorio remoto (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/TU_USUARIO.git

# 6. Subir los cambios a GitHub
git push -u origin main
```

---

## 🐍 Paso 4: Activar los Permisos para la Serpiente de Contribuciones

Para que la serpiente animada (`Platane/snk`) pueda leer tus contribuciones y generar el archivo SVG en la rama `output` de forma automática, debes habilitar los permisos de escritura en GitHub Actions:

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/TU_USUARIO`
2. Haz clic en la pestaña **Settings** (⚙️ Configuración).
3. En el menú lateral izquierdo, haz clic en **Actions** -> **General**.
4. Desplázate hacia abajo hasta la sección **Workflow permissions**.
5. Selecciona la opción: **Read and write permissions** (Permisos de lectura y escritura).
6. Haz clic en el botón verde **Save**.

### Ejecutar el flujo por primera vez:
1. Haz clic en la pestaña **Actions** en la barra superior del repositorio.
2. En el menú de la izquierda verás el flujo llamado **Generate Contribution Snake**. Haz clic sobre él.
3. A la derecha verás un botón que dice **Run workflow**. Haz clic y confirma pulsando **Run workflow** nuevamente.
4. Espera aproximadamente 30-60 segundos a que termine con un visto verde (✔️).
5. ¡Listo! Se habrá creado automáticamente una rama llamada `output` con las animaciones de la serpiente generadas en tiempo real.

---

## 🎨 Personalizaciones Adicionales (Opcional)

### ¿Cómo cambiar el tema de las tarjetas de estadísticas?
En `README.md`, los enlaces a `github-readme-stats` usan el parámetro `theme=tokyonight`. Puedes cambiarlo fácilmente por otros temas soportados si deseas experimentar:
- `dracula`
- `cyberpunk`
- `radical`
- `catppuccin_mocha`
- `chartreuse-dark`

### ¿Cómo cambiar el texto del Typing SVG?
En la línea que contiene `readme-typing-svg.demolab.com`, busca el parámetro `lines=` y separa cada frase con punto y coma (`;`). Los espacios se reemplazan con `+`.

---

## ❓ Preguntas Frecuentes & Soporte

**¿Por qué las imágenes de estadísticas no cargan de inmediato al subirlo?**
> GitHub utiliza un servicio proxy llamado *Camo* para almacenar imágenes en caché de forma segura. A veces la primera carga puede tardar 1 o 2 minutos. Si recargas con `Ctrl + F5`, verás la versión actualizada.

**¿Qué pasa si no tengo commits en repositorios públicos todavía?**
> Para que tus contribuciones en repositorios privados también se muestren en las estadísticas y en la serpiente, ve a la configuración de tu perfil de GitHub (`Settings` -> `Public profile`), marca la casilla **"Include private contributions on my profile"** y guarda los cambios.

