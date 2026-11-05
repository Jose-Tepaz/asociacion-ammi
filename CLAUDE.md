# AMMI: contexto para Claude Code

Sitio web de la Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia (Guatemala), construido con Payload CMS y Next.js. Todas las páginas se arman con bloques editables desde el admin.

Responde siempre en español. Los textos visibles del sitio y del admin también van en español.

Para Payload, empieza por `.claude/skills/payload/SKILL.md` y consulta `.claude/skills/payload/reference/` para el detalle.

## Stack

- Payload CMS 3.92, Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, TypeScript.
- Node 24 y **pnpm**. No uses `npm install`.
- Local: SQLite (`ammi.db`) y archivos en `public/media`.
- Producción: Postgres (Neon) y Vercel Blob. El adaptador se elige en `src/payload.config.ts` según si `DATABASE_URL` empieza con `postgres`.

## Comandos

```bash
pnpm dev                  # servidor local
pnpm build                # compilación de producción
pnpm lint                 # ESLint
pnpm generate:types       # regenera src/payload-types.ts
pnpm generate:importmap   # regenera el import map del admin
pnpm test:int             # pruebas de integración (Vitest)
pnpm test:e2e             # pruebas end-to-end (Playwright)
npx tsc --noEmit          # revisión de tipos
```

## Mapa del código

- `src/payload.config.ts`: configuración de Payload, base de datos y almacenamiento.
- `src/collections/`: Pages, Posts, Media, Categories, Users.
- `src/Header/`, `src/Footer/`: globals, cada uno con su `config.ts` y su componente.
- `src/blocks/<Nombre>/`: un bloque por carpeta. `src/blocks/RenderBlocks.tsx` los dibuja.
- `src/heros/`: portadas de las páginas. Los campos están en `config.ts` y `RenderHero.tsx` elige cuál mostrar.
- `src/app/(frontend)/`: rutas públicas. `globals.css` tiene la escala tipográfica y los colores.
- `src/migrations/`: migraciones de Postgres, registradas en `index.ts`.
- `src/endpoints/seed/ammi/`: contenido inicial (`pnpm seed:ammi`).
- `src/payload-types.ts`: archivo generado. No lo edites a mano.

## Reglas

### Cada cambio en la estructura del CMS lleva migración

Todo cambio que altere el esquema de la base de datos debe registrar una migración **en el mismo commit**. Esto incluye agregar, quitar o renombrar colecciones, globals, bloques o campos, y cambiar opciones de un `select`, `required`, `unique`, `localized` o `hasMany`.

Es obligatorio porque en local SQLite se actualiza solo, así que un cambio sin migración parece funcionar en tu computadora y falla en producción. Producción solo aplica lo que esté en `prodMigrations`.

Pasos:

1. Cambia la configuración.
2. Ejecuta `pnpm generate:types`, y `pnpm generate:importmap` si agregaste componentes al admin.
3. Crea `src/migrations/<AAAAMMDD_HHMMSS>_<descripcion>.ts` y su `.json`. Usa la migración más reciente como modelo.
4. Regístrala al final de `src/migrations/index.ts`.
5. Escribe `up` y `down`, en SQL de Postgres. Las migraciones deben ser seguras sobre datos existentes: nunca borres datos sin aprobación explícita.
6. Ejecuta `npx tsc --noEmit`.

Los cambios que solo tocan diseño, labels o `admin` no necesitan migración, porque no alteran la base.

`payload migrate:create` necesita una conexión real a Postgres y se queda colgado con una base ficticia. Sin esa conexión, escribe la migración a mano.

### Base de datos local

- Antes de tocar `ammi.db`, haz una copia de respaldo.
- Si agregas una columna a mano antes de cambiar la configuración, detén el servidor primero y usa la misma definición que generaría Payload. Una columna distinta hace que el modo `push` reconstruya las tablas y el servidor se quede colgado.

### Diseño

- Usa los tokens de `globals.css`, no valores sueltos. Tipografía: `text-step-small`, `regular`, `body`, `lead`, `title`, `head`, `display`. Espaciado vertical de sección: `var(--section-y)`.
- Colores: `besh-suave`, `besh-fuerte`, `besh-oscuro`, `corinto`, `corinto-secundario`, `corinto-terciario`, `fucsia`, `ocre`.
- Haz cambios pequeños y revísalos en computadora y en celular antes de darlos por terminados.
- El color del encabezado depende del atributo `data-hero` de la portada (`dark`, `beige`, `overlay`, `light`). Cada portada nueva debe declararlo.
- Si después de cambiar de rama o reiniciar faltan clases de Tailwind, detén el servidor y borra `.next`.

### Git y seguridad

- Haz commit o push solo cuando se pida.
- Nunca subas `.env*`, `ammi.db`, `public/media`, respaldos de base de datos ni llaves.
- Nunca muestres valores de variables de entorno ni direcciones de conexión en el chat o en commits.
- Publicar en producción y borrar datos en la nube requiere aprobación explícita.

## Variables de entorno

Ver `.env.example`. El proyecto usa `DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_SERVER_URL`, `CRON_SECRET` y `PREVIEW_SECRET`.
