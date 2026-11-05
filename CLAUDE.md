# AMMI: contexto para Claude Code

Sitio web de la Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia (Guatemala), construido con Payload CMS y Next.js. Todas las páginas se arman con bloques editables desde el admin.

Responde siempre en español. Los textos visibles del sitio y del admin también van en español.

Para Payload, empieza por `.claude/skills/payload/SKILL.md` y consulta `.claude/skills/payload/reference/` para el detalle.

## Stack

- Payload CMS 3.92, Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, TypeScript.
- Node 24 y **pnpm**. No uses `npm install`.
- Desarrollo: en local, conectado a la base de **producción** de Neon con `PAYLOAD_DB_PUSH=false` (ver "Flujo de trabajo con Neon" abajo). SQLite (`DATABASE_URL=file:./ammi.db`, con las `S3_*` vacías y archivos en `public/media`) queda como alternativa sin conexión.
- Producción: Postgres (Neon, branch `production`) y Neon Object Storage (S3-compatible, bucket `uploades`, solo path-style). El adaptador de base de datos se elige en `src/payload.config.ts` según si `DATABASE_URL` empieza con `postgres`, y el almacenamiento S3 se activa solo si existe `S3_ENDPOINT`.

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

Es obligatorio porque con `PAYLOAD_DB_PUSH=false` la migración es la única forma de que el cambio llegue a Neon (y en SQLite la base se actualiza sola, así que un cambio sin migración parece funcionar en tu computadora y falla en producción). Producción solo aplica lo que esté en `prodMigrations`.

Pasos:

1. Cambia la configuración.
2. Ejecuta `pnpm generate:types`, y `pnpm generate:importmap` si agregaste componentes al admin.
3. Genera la migración con `pnpm payload migrate:create <descripcion>` (conectado a Postgres). Crea `src/migrations/<fecha>_<descripcion>.ts` y su `.json`; revisa que quedó registrada en `src/migrations/index.ts`.
4. Revisa `up` y `down`. Las migraciones deben ser seguras sobre datos existentes: solo agregan tablas y campos (los campos nuevos opcionales o con valor por defecto). Nunca borres datos sin aprobación explícita.
5. Ejecuta `npx tsc --noEmit`.
6. Avisa al equipo y ejecuta `pnpm payload migrate` contra producción, para que dos personas no migren a la vez. Si algo falla, avisa enseguida: Neon restaura las últimas 6 horas.
7. Una migración que ya corrió en producción no se edita: si hace falta otro cambio, crea una migración nueva.

Si la migración modifica tablas que ya tienen contenido (cambiar o quitar un campo existente), primero crea en Neon un branch de respaldo desde `production` (`respaldo-antes-de-<cambio>`), porque ese respaldo no vence a las 6 horas.

Los cambios que solo tocan diseño, labels o `admin` no necesitan migración, porque no alteran la base.

`payload migrate:create` necesita una conexión real a Postgres y se queda colgado con una base ficticia o con SQLite. Sin esa conexión, escribe la migración a mano usando la más reciente como modelo.

Las migraciones son SQL de Postgres y SQLite nunca las ejecuta. Si el cambio también toca el admin, regenera el import map y súbelo en el mismo commit.

### Flujo de trabajo con Neon

Todo el equipo trabaja en local conectado a la base de **producción** (proyecto de Neon `AMMI- WEBSITE`, branch `production`). El contenido se carga una sola vez, directo en producción, y no hay nada que copiar después.

1. En local, con `PAYLOAD_DB_PUSH=false`, crea la sección o el bloque y su migración (ver arriba).
2. Avisa al equipo y corre `pnpm payload migrate` contra producción.
3. Carga el contenido en `localhost:3000/admin`. Ya queda en la base real.
4. Sube el código en una rama con su PR. Mientras no se mergee, la sección existe en la base pero el sitio publicado no la muestra: es normal.

Reglas:

- **`PAYLOAD_DB_PUSH` siempre `false`** (o sin definir). Con `true`, `pnpm dev` modifica el esquema de producción y deja la fila `dev` que traba el build (ver "Base de datos").
- **Las migraciones solo agregan** tablas y campos. Borrar o renombrar algo existente pierde contenido real: se habla antes y requiere aprobación.
- **Nunca `pnpm seed:ammi` contra Neon**: reemplaza el contenido.
- Páginas y Publicaciones tienen borradores: guarda sin publicar y dale **Publish** cuando esté listo. Header y Footer se publican al guardar.
- No editen la misma página a la vez: gana el último que guarda.
- Neon puede restaurar la base a un momento anterior, pero en el plan actual solo cubre las últimas 6 horas. Si algo se borra por error, avisa enseguida.

### Base de datos

- Antes de tocar `ammi.db`, haz una copia de respaldo.
- **Nunca pongas `PAYLOAD_DB_PUSH=true` con la base de producción.** El push deja ahí una fila `dev` (batch `-1`) en `payload_migrations`, y a partir de entonces el build y cada función de Vercel se quedan esperando una pregunta interactiva ("It looks like you've run Payload in dev mode...") que nunca termina. Con `PAYLOAD_DB_PUSH=false`, `pnpm dev` contra producción es seguro. Si la fila aparece y el esquema no cambió, haz un branch de respaldo y bórrala: `DELETE FROM payload_migrations WHERE name='dev' AND batch=-1`. Luego cancela el build trabado y vuelve a desplegar.
- Antes de cada deploy, ejecuta `pnpm payload migrate` contra la base de producción. Si el build corre con migraciones pendientes, los workers las aplican a la vez y chocan (`column ... already exists`).
- Next guarda en `.next/cache` los globals (header y footer) por un año. Si se construyó con la base vacía, el navbar y el footer salen sin elementos: borra `.next/cache/fetch-cache` y reconstruye, o guarda el global en el admin.
- Si agregas una columna a mano antes de cambiar la configuración, detén el servidor primero y usa la misma definición que generaría Payload. Una columna distinta hace que el modo `push` reconstruya las tablas y el servidor se quede colgado.

### Diseño

- Usa los tokens de `globals.css`, no valores sueltos. Tipografía: `text-step-small`, `regular`, `body`, `lead`, `title`, `head`, `display`. Espaciado vertical de sección: `var(--section-y)`.
- Colores: `besh-suave`, `besh-fuerte`, `besh-oscuro`, `corinto`, `corinto-secundario`, `corinto-terciario`, `fucsia`, `ocre`.
- Haz cambios pequeños y revísalos en computadora y en celular antes de darlos por terminados.
- El color del encabezado depende del atributo `data-hero` de la portada (`dark`, `beige`, `overlay`, `light`). Cada portada nueva debe declararlo.
- Si después de cambiar de rama o reiniciar faltan clases de Tailwind, detén el servidor y borra `.next`.

### Git y seguridad

- Haz commit o push solo cuando se pida.
- **Todo cambio se sube en una rama y se abre un Pull Request.** Nunca hagas push directo a `main`. Flujo:
  1. Desde `main` actualizado, crea una rama con nombre descriptivo (`feature/...`, `fix/...`, `chore/...`).
  2. Haz commit en esa rama y súbela con `git push -u origin <rama>` (cuenta `Jose-Tepaz`).
  3. Abre el PR hacia `main` con `gh pr create`. Describe qué cambia y cómo se probó; si toca el esquema, menciona la migración.
  4. Se mergea desde GitHub una vez revisado. Toda rama que se suba lleva su PR, sin excepciones.
- Nunca subas `.env*`, `ammi.db`, `public/media`, respaldos de base de datos ni llaves.
- Nunca muestres valores de variables de entorno ni direcciones de conexión en el chat o en commits.
- Publicar en producción y borrar datos en la nube requiere aprobación explícita.

## Variables de entorno

Ver `.env.example`. El proyecto usa `DATABASE_URL`, `PAYLOAD_DB_PUSH` (siempre `false` contra Neon), `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `CRON_SECRET`, `PREVIEW_SECRET` y las cinco `S3_*` (Neon Object Storage). Vercel inyecta solo las `VERCEL_*`; no las copies al `.env`. Las credenciales de almacenamiento se crean en Neon (`neon credentials create --scope storage:read --scope storage:write`) y el secreto se muestra una sola vez.
