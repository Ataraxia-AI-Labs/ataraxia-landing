# 🚀 Guía de Deploy: ataraxia.ai

## Estructura del Proyecto

```
ataraxia-landing/
├── index.html        ← La landing V3 (archivo principal)
├── vercel.json       ← Configuración de Vercel
├── robots.txt        ← SEO
├── sitemap.xml       ← SEO
└── .gitignore        ← Archivos ignorados por Git
```

---

## PASO 1: Crear el Repositorio en GitHub

1. Ve a **github.com** → botón **"+"** arriba a la derecha → **"New repository"**
2. Configura:
   - **Repository name:** `ataraxia-landing`
   - **Visibility:** Private (para que nadie copie tu código)
   - **NO** marques "Add a README" ni nada más
3. Click **"Create repository"**
4. GitHub te mostrará instrucciones. **NO cierres esa página**, la necesitas en el Paso 2.

---

## PASO 2: Subir los Archivos (desde VS Code)

### Opción A: Desde VS Code (Recomendada)

1. Abre VS Code
2. Abre una terminal (Ctrl + ` o Terminal → New Terminal)
3. Navega a donde descargaste los archivos del proyecto:

```bash
cd ~/Downloads/ataraxia-landing
```
(o donde los hayas guardado)

4. Inicializa Git y sube:

```bash
git init
git add .
git commit -m "Landing V3 - primera versión"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ataraxia-landing.git
git push -u origin main
```

> ⚠️ Reemplaza `TU_USUARIO` con tu usuario real de GitHub.
> Si te pide credenciales, usa tu token de GitHub (no la contraseña).

### Opción B: Subir directo en GitHub (más fácil si no usas Git)

1. En el repo que creaste, click **"uploading an existing file"**
2. Arrastra TODOS los archivos del proyecto (index.html, vercel.json, robots.txt, sitemap.xml)
3. Escribe un commit message: "Landing V3"
4. Click **"Commit changes"**

---

## PASO 3: Conectar con Vercel

1. Ve a **vercel.com** → inicia sesión
2. Click **"Add New..."** → **"Project"**
3. En "Import Git Repository", busca **ataraxia-landing**
4. Click **"Import"**
5. En la pantalla de configuración:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./ ` (déjalo por defecto)
   - **Build Command:** déjalo vacío
   - **Output Directory:** `./ ` (déjalo por defecto)
6. Click **"Deploy"**
7. Espera ~30 segundos. Vercel te dará una URL temporal tipo:
   `ataraxia-landing-xxxxx.vercel.app`
8. **Abre esa URL y verifica que la landing se ve correcta** ✅

---

## PASO 4: Configurar el Dominio en Vercel

1. En tu proyecto de Vercel, ve a **Settings** → **Domains**
2. Escribe `ataraxia.ai` y click **"Add"**
3. Vercel te mostrará los DNS records necesarios. Típicamente:

```
Tipo: A
Name: @
Value: 76.76.21.21
```

```
Tipo: CNAME  
Name: www
Value: cname.vercel-dns.com
```

4. **NO cierres esta pantalla.** La necesitas para el Paso 5.

---

## PASO 5: Configurar DNS en Cloudflare

1. Ve a **dash.cloudflare.com** → selecciona **ataraxia.ai**
2. Ve a **DNS** → **Records**
3. Si hay records existentes (tipo A, AAAA, CNAME para @ o www), **elimínalos primero**
4. Agrega los records que Vercel te indicó:

### Record 1:
- **Type:** `A`
- **Name:** `@`
- **IPv4 address:** `76.76.21.21`
- **Proxy status:** ⚠️ **DNS only** (click en la nube naranja para que quede GRIS)
- **TTL:** Auto
- Click **Save**

### Record 2:
- **Type:** `CNAME`
- **Name:** `www`
- **Target:** `cname.vercel-dns.com`
- **Proxy status:** ⚠️ **DNS only** (nube GRIS, no naranja)
- **TTL:** Auto
- Click **Save**

> ⚠️ MUY IMPORTANTE: La nube debe estar GRIS (DNS only), NO naranja.
> Si está naranja, Cloudflare intercepta el tráfico y Vercel no puede emitir el SSL.

### Configuración adicional en Cloudflare:
5. Ve a **SSL/TLS** → pon el modo en **"Full"** (no Full Strict)
6. Ve a **SSL/TLS** → **Edge Certificates** → desactiva **"Always Use HTTPS"**
   (Vercel maneja esto mejor)

---

## PASO 6: Verificar

1. Vuelve a **Vercel** → Settings → Domains
2. Espera 1-5 minutos. Deberías ver:
   - `ataraxia.ai` ✅ Valid Configuration
   - `www.ataraxia.ai` ✅ Valid Configuration
3. Abre **https://ataraxia.ai** en tu navegador 🎉

> Los DNS pueden tardar hasta 48 horas en propagarse globalmente,
> pero normalmente con Cloudflare son 1-5 minutos.

---

## PASO 7: Editar en el Futuro

Una vez que todo está conectado, el flujo para editar es:

### Desde VS Code:
```bash
# 1. Edita index.html en VS Code
# 2. Guarda el archivo
# 3. En la terminal:
git add .
git commit -m "Actualización: lo que cambiaste"
git push
```

Vercel detecta el push automáticamente y redeploya en ~10 segundos.
Tu cambio está live en ataraxia.ai sin tocar nada más.

### Desde GitHub directo:
1. Ve a tu repo en github.com
2. Click en `index.html`
3. Click el lápiz (Edit)
4. Edita lo que necesites
5. Click "Commit changes"
6. Vercel redeploya automáticamente

---

## 📋 Checklist Final

- [ ] Repo creado en GitHub
- [ ] Archivos subidos (index.html, vercel.json, robots.txt, sitemap.xml)
- [ ] Proyecto importado en Vercel
- [ ] Landing funciona en URL temporal de Vercel
- [ ] Dominio `ataraxia.ai` agregado en Vercel
- [ ] DNS configurados en Cloudflare (nube GRIS)
- [ ] SSL/TLS en modo "Full" en Cloudflare
- [ ] https://ataraxia.ai carga correctamente
- [ ] https://www.ataraxia.ai redirige correctamente

---

## 🔧 Troubleshooting

### "La página no carga"
→ Verifica que los DNS en Cloudflare tengan la nube GRIS, no naranja.

### "Error de SSL / certificado"
→ En Cloudflare, SSL/TLS → modo "Full". Espera 5 minutos a que Vercel genere el certificado.

### "Error 404 en Vercel"
→ Verifica que el archivo se llame `index.html` (no landing.html ni otro nombre).

### "Los cambios no se reflejan"
→ Haz hard refresh (Ctrl+Shift+R). Si no, verifica que hiciste git push y que Vercel redeployó (ve a Deployments en Vercel).

---

## 📝 Próximos Pasos (después del deploy)

1. **WhatsApp Business** → Conseguir número y reemplazar +573001234567 en index.html
2. **Formulario** → Conectar a Supabase o webhook para capturar leads reales
3. **Analytics** → Agregar Google Analytics o Vercel Analytics
4. **Favicon** → Agregar tu logo como favicon
5. **Open Graph** → Agregar meta tags para que se vea bien al compartir en redes

---

*Ataraxia IA Labs — Deploy Guide v1.0 — Febrero 2026*
