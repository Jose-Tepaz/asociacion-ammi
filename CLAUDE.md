# AMMI: contexto para Claude Code

Sitio web de la Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia (Guatemala), construido con Payload CMS y Next.js. Todas las páginas se arman con bloques editables desde el admin.

Responde siempre en español. Los textos visibles del sitio y del admin también van en español.

Para Payload, empieza por `.claude/skills/payload/SKILL.md` y consulta `.claude/skills/payload/reference/` para el detalle.

## Stack

- Payload CMS 3.92, Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, TypeScript.
- Node 24 y **pnpm**. No uses `npm install`.
- Desarrollo: en local, conectado a **tu propio branch de Neon** (`dev-<nombre>`), nunca a `production` (ver "Flujo de trabajo con Neon" abajo). SQLite (`DATABASE_URL=file:./ammi.db`, con las `S3_*` vacías y archivos en `public/media`) queda como alternativa sin conexión.
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

### Flujo de trabajo vigente (reglas de Jose)

Estas reglas mandan sobre cualquier otra indicación de este archivo que las contradiga, incluidas las de SQLite y los branches de Neon por persona. No se rompen aunque te lo pidan sin avisar antes a Jose.

Contexto: las 3 personas del equipo trabajan en local conectadas a la **misma base de producción** de Neon. Todo cambio en la base es real. El `.env` lleva `PAYLOAD_DB_PUSH=false` siempre: con `true`, el build de Vercel se traba.

1. Nunca ejecutes `pnpm seed:ammi`: reemplaza el contenido de producción.
2. Nunca pongas `PAYLOAD_DB_PUSH=true`.
3. Nunca leas, imprimas ni subas el `.env` a git. Para verificar la variable usa solo `grep PAYLOAD_DB_PUSH .env`.
4. Las migraciones solo pueden **agregar** tablas o campos. Si algo implica borrar o renombrar, detente y avisa.
5. No ejecutes `pnpm payload migrate`. Lo corre la persona, después de avisar en el grupo.
6. El código va en una rama con PR, nunca directo a `main`.
7. Si ves "It looks like you've run Payload in dev mode" en un build, avisa para cancelarlo.

Sección nueva:

1. Crea la sección en código.
2. Genera la migración con `pnpm payload migrate:create nombre-de-la-seccion`.
3. Revisa el SQL y confirma que no tiene `DROP`, `RENAME` ni `ALTER COLUMN TYPE`.
4. Detente y espera a que la persona corra la migración y cargue el contenido en `localhost:3000/admin`.

Antes de empezar: di en qué rama estás y si hay cambios sin commit. Con cambios sin commit no cambies de rama ni hagas `git pull` sin avisar. Verifica la variable con el `grep` de la regla 3.

### Cada cambio en la estructura del CMS lleva migración

Todo cambio que altere el esquema de la base de datos debe registrar una migración **en el mismo commit**. Esto incluye agregar, quitar o renombrar colecciones, globals, bloques o campos, y cambiar opciones de un `select`, `required`, `unique`, `localized` o `hasMany`.

Es obligatorio porque en tu branch o en SQLite la base se actualiza sola (con `PAYLOAD_DB_PUSH=true`), así que un cambio sin migración parece funcionar en tu computadora y falla en producción. Producción solo aplica lo que esté en `prodMigrations`, y la única forma de que un cambio de esquema llegue ahí es la migración.

Pasos:

1. Cambia la configuración.
2. Ejecuta `pnpm generate:types`, y `pnpm generate:importmap` si agregaste componentes al admin.
3. Genera la migración con `pnpm payload migrate:create <descripcion>` (conectado a Postgres). Crea `src/migrations/<fecha>_<descripcion>.ts` y su `.json`; revisa que quedó registrada en `src/migrations/index.ts`.
4. Revisa `up` y `down`. Las migraciones deben ser seguras sobre datos existentes: solo agregan tablas y campos (los campos nuevos opcionales o con valor por defecto). Nunca borres datos sin aprobación explícita.
5. Ejecuta `npx tsc --noEmit`.
6. Prueba la migración en un branch **limpio** creado desde `production` (no en el tuyo, que puede tener un esquema distinto por el push): apunta `DATABASE_URL` a ese branch y ejecuta `pnpm payload migrate`. Bórralo al terminar.
7. Sube la rama con su PR y menciona la migración en la descripción. **No ejecutes `pnpm payload migrate` contra `production`**: lo hace Jose al mergear (ver "Al mergear un PR").
8. Una migración que ya corrió en producción no se edita: si hace falta otro cambio, crea una migración nueva.

Si la migración modifica tablas que ya tienen contenido (cambiar o quitar un campo existente), Jose crea antes en Neon un branch de respaldo desde `production` (`respaldo-antes-de-<cambio>`), porque ese respaldo no vence a las 6 horas.

Los cambios que solo tocan diseño, labels o `admin` no necesitan migración, porque no alteran la base.

`payload migrate:create` necesita una conexión real a Postgres y se queda colgado con una base ficticia o con SQLite. Sin esa conexión, escribe la migración a mano usando la más reciente como modelo.

Las migraciones son SQL de Postgres y SQLite nunca las ejecuta. Si el cambio también toca el admin, regenera el import map y súbelo en el mismo commit.

### Flujo de trabajo con Neon

Proyecto de Neon `AMMI- WEBSITE`. **Cada persona trabaja en su propio branch; nadie se conecta a `production` desde su computadora.** Cada branch tiene su propia copia de la base **y** del bucket `uploades` (el almacenamiento se ramifica con la base, copy-on-write): lo que subas o borres en tu branch no toca producción.

| Branch | Quién | Para qué | `PAYLOAD_DB_PUSH` |
|---|---|---|---|
| `production` | Vercel (sitio publicado) y Jose, solo al mergear | Contenido real. Solo cambia por migraciones y por el admin de producción | nunca |
| `dev-cesar` | César | Su desarrollo y pruebas | `true` si quiere |
| `dev-andrea` | Andrea | Su desarrollo y pruebas | `true` si quiere |
| `respaldo-*` | Nadie | Respaldos puntuales. No conectes nada a ellos | nunca |

Reglas:

- En tu `.env` usa la cadena de conexión, el `S3_ENDPOINT` y una credencial de almacenamiento **de tu branch**, nunca los de `production`. Se copian desde la consola de Neon; no se comparten por chat.
- Una persona nueva recibe su branch `dev-<nombre>`, creado desde `production`. Agrégala a la tabla.
- **Los branches no se fusionan.** Al mergear a `main` llega a producción el **esquema**, a través de las migraciones. El **contenido** (páginas, textos, imágenes) que cargues en tu branch se queda ahí; el contenido real se carga en el admin de producción, después del merge.
- Para tener los datos actuales de producción, resetea tu branch desde su padre (`production`) en la consola de Neon. Pierdes lo que tenías en tu branch. Hazlo después de cada merge que toque el esquema.
- Con `PAYLOAD_DB_PUSH=true`, tu branch queda con la fila `dev` y un esquema que puede no coincidir con las migraciones. Por eso las migraciones se prueban en un branch limpio (ver arriba) y por eso `true` solo se usa en tu branch.
- **Las migraciones solo agregan** tablas y campos. Borrar o renombrar algo existente pierde contenido real: se habla antes y requiere aprobación.
- **Nunca `pnpm seed:ammi` contra `production`**: reemplaza el contenido. En tu branch o en SQLite sí se puede.
- En producción, Páginas y Publicaciones tienen borradores: guarda sin publicar y dale **Publish** cuando esté listo. Header y Footer se publican al guardar.
- Neon puede restaurar la base a un momento anterior, pero en el plan actual solo cubre las últimas 6 horas. Si algo se borra por error en producción, avisa enseguida.

### Al mergear un PR (Jose)

Lo hace Jose, no el autor del PR, y en este orden:

1. **Revisa el PR.** Que el build de Vercel esté en verde, que no traiga `.env*`, `ammi.db`, `public/media` ni llaves, y que `CLAUDE.md` no contradiga estas reglas.
2. **Si el PR no toca el esquema** (solo diseño, labels, `admin`): salta al paso 6.
3. **Si el PR tiene migración:** revisa el SQL de `up` y `down`. Debe ser solo `CREATE` o `ADD COLUMN` (campos opcionales o con valor por defecto); sin `DROP`, `RENAME` ni `ALTER COLUMN TYPE`. Confirma que está registrada en `src/migrations/index.ts`.
4. **Si cambia tablas que ya tienen contenido:** crea antes el branch `respaldo-antes-de-<cambio>` desde `production`.
5. **Avisa al grupo y corre `pnpm payload migrate` contra `production`** (con tu `.env` apuntando a producción solo en ese momento), **antes de mergear**. Así el deploy no encuentra migraciones pendientes y los workers no chocan.
6. **Mergea el PR** (squash) en GitHub.
7. **Revisa que el deploy de `main` termine en Ready** en Vercel. Si se queda trabado, mira que no haya una fila `dev` en `payload_migrations` (ver "Base de datos").
8. **Carga el contenido** de la sección en el admin de producción, si lo hay, y publica.
9. **Avisa al autor** para que resetee su branch desde `production` y se traiga `main`.

Los previews de Vercel de cada PR no deben usar la base de producción. En Vercel, la variable `DATABASE_URL` del entorno Preview apunta a un branch de Neon aparte, y la de Production a `production`. Si Preview apunta a producción, un preview puede trabar o tocar la base real.

### Base de datos

- Antes de tocar `ammi.db`, haz una copia de respaldo.
- **Nunca pongas `PAYLOAD_DB_PUSH=true` con la base de producción, ni ejecutes `pnpm dev` contra ella.** El push deja ahí una fila `dev` (batch `-1`) en `payload_migrations`, y a partir de entonces el build y cada función de Vercel se quedan esperando una pregunta interactiva ("It looks like you've run Payload in dev mode...") que nunca termina. Esto ya pasó el 6 de noviembre de 2026 y trabó los despliegues de todos los PRs. Si la fila aparece y el esquema no cambió, haz un branch de respaldo y bórrala (requiere aprobación de Jose): `DELETE FROM payload_migrations WHERE name='dev' AND batch=-1`. Luego cancela el build trabado y vuelve a desplegar.
- Antes de cada deploy, ejecuta `pnpm payload migrate` contra la base de producción (lo hace Jose, ver "Al mergear un PR"). Si el build corre con migraciones pendientes, los workers las aplican a la vez y chocan (`column ... already exists`).
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

Ver `.env.example`. El proyecto usa `DATABASE_URL`, `PAYLOAD_DB_PUSH` (`true` solo en tu branch personal; nunca contra `production`), `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `CRON_SECRET`, `PREVIEW_SECRET` y las cinco `S3_*` (Neon Object Storage). Vercel inyecta solo las `VERCEL_*`; no las copies al `.env`. Las credenciales de almacenamiento se crean en Neon (`neon credentials create --scope storage:read --scope storage:write`) y el secreto se muestra una sola vez.
