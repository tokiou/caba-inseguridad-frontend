# Delta Spec: Auth — JWT access en memoria + refresh en cookie HttpOnly

Domain: **auth** (nuevo)

---

## ADDED Requirements

### Requirement: Almacenamiento del access token solo en memoria

El access token (JWT) SHALL almacenarse **únicamente en memoria del módulo** `authService`. El
frontend NO SHALL persistirlo en `localStorage`, `sessionStorage`, cookies legibles por JS, ni en el
estado serializable de ningún store. El refresh token SHALL ser una cookie HttpOnly que el JS NUNCA
SHALL leer ni escribir.

#### Scenario: Token no persistido

- **GIVEN** un usuario autenticado con un access token vigente
- **WHEN** se inspecciona `localStorage` y `sessionStorage`
- **THEN** no existe ninguna entrada con el access token ni con el refresh token

#### Scenario: Recarga de página pierde el access pero no la sesión

- **GIVEN** un usuario autenticado
- **WHEN** recarga la página (F5)
- **THEN** el access token en memoria se pierde y la app lo recupera vía `POST /auth/refresh` usando
  la cookie, sin pedir contraseña

### Requirement: Registro de usuario

El frontend SHALL exponer un registro contra `POST {API}/auth/register` con body
`{ email, password }`. La contraseña SHALL validarse en el cliente con **mínimo 8 caracteres** antes
de enviar. Una respuesta `201 {id, email}` SHALL considerarse éxito; NO setea cookie ni token (el
usuario debe luego hacer login).

#### Scenario: Registro exitoso

- **GIVEN** un email no registrado y una contraseña de ≥ 8 caracteres
- **WHEN** se envía el registro
- **THEN** el backend responde `201 {id, email}` y la UI invita a iniciar sesión

#### Scenario: Email ya registrado

- **GIVEN** un email que ya existe
- **WHEN** se envía el registro
- **THEN** el backend responde `409 email_taken` y la UI muestra "Ese email ya está registrado"

#### Scenario: Contraseña corta

- **GIVEN** una contraseña de menos de 8 caracteres
- **WHEN** el usuario intenta enviar
- **THEN** la validación de cliente bloquea el envío y marca el campo

### Requirement: Login y obtención del access token

El frontend SHALL hacer `POST {API}/auth/login` con `{ email, password }` y
**`credentials: 'include'`** para recibir la cookie de refresh. Ante `200`, SHALL guardar
`access_token` en memoria y poblar `authStore` con el usuario (`status = authenticated`).

#### Scenario: Login exitoso

- **GIVEN** credenciales válidas
- **WHEN** el login responde `200 {access_token, token_type:"bearer", expires_in:900}`
- **THEN** el access token queda en memoria, `authStore.user` se puebla y `status = authenticated`

#### Scenario: Credenciales inválidas

- **GIVEN** email o contraseña incorrectos
- **WHEN** el login responde `401 invalid_credentials`
- **THEN** la UI muestra "Email o contraseña inválidos" y no cambia el estado de sesión

#### Scenario: Cuenta desactivada

- **GIVEN** un usuario con la cuenta inactiva
- **WHEN** el login responde `403 account_inactive`
- **THEN** la UI muestra "Tu cuenta está desactivada" y NO reintenta

### Requirement: Refresh del access token

El frontend SHALL hacer `POST {API}/auth/refresh` (body vacío) con `credentials: 'include'`. Ante
`200` SHALL reemplazar el access token en memoria y devolver éxito; ante fallo SHALL limpiar el token
y pasar `authStore` a `anonymous`. Las llamadas concurrentes a refresh SHALL compartir una única
promesa en vuelo (single-flight).

#### Scenario: Refresh exitoso al bootstrap

- **GIVEN** una cookie de refresh válida y sin access token en memoria
- **WHEN** la app arranca y llama `refresh()`
- **THEN** se obtiene un nuevo access token y `status = authenticated`

#### Scenario: Refresh inválido o vencido

- **GIVEN** una cookie de refresh ausente o vencida
- **WHEN** se llama `refresh()`
- **THEN** el backend responde `401 invalid_refresh`, se limpia el token y `status = anonymous`

#### Scenario: Refresh concurrente

- **GIVEN** dos requests protegidas que reciben `401` casi a la vez
- **WHEN** ambas disparan `refresh()`
- **THEN** solo se hace una llamada `POST /auth/refresh` y ambas reusan su resultado

### Requirement: Logout

El frontend SHALL hacer `POST {API}/auth/logout` con `credentials: 'include'`, luego SHALL limpiar el
access token en memoria y pasar `authStore` a `anonymous`, independientemente del resultado de la
llamada.

#### Scenario: Logout

- **GIVEN** un usuario autenticado
- **WHEN** hace logout
- **THEN** se invalida la cookie en el backend, el access token en memoria se borra y la UI vuelve a
  estado anónimo

### Requirement: Bootstrap de sesión al arranque

Al iniciar, el frontend SHALL exponer `authStore.status = 'booting'`, intentar `refresh()` y, si
tiene éxito, llamar `GET {API}/auth/me` (con Bearer) para poblar `user` y pasar a `authenticated`; si
falla, pasar a `anonymous`. Mientras `status = booting` el frontend NO SHALL disparar requests
protegidas.

#### Scenario: Sesión recuperada

- **GIVEN** una cookie de refresh válida
- **WHEN** la app arranca
- **THEN** `status` pasa `booting → authenticated` y `user` queda poblado vía `/auth/me`

#### Scenario: Sin sesión previa

- **GIVEN** sin cookie de refresh
- **WHEN** la app arranca
- **THEN** `status` pasa `booting → anonymous` sin mostrar error

### Requirement: `authFetch` con auto-refresh ante 401

El frontend SHALL exponer `authFetch(path, init)` que agrega `Authorization: Bearer <accessToken>` si
hay token. Ante una respuesta `401`, SHALL llamar `refresh()` una vez y, si tiene éxito, reintentar
la request original **una sola vez** con el nuevo token. Si el refresh falla, SHALL propagar el error
y la UI SHALL mandar a login. Toda llamada que dependa de la cookie SHALL incluir
`credentials: 'include'`.

#### Scenario: Access vencido, refresh ok

- **GIVEN** un access token vencido y una cookie de refresh válida
- **WHEN** una request protegida responde `401 unauthorized`
- **THEN** `authFetch` refresca el token y reintenta una vez, devolviendo la respuesta exitosa

#### Scenario: Access vencido, refresh falla

- **GIVEN** un access token vencido y una cookie de refresh inválida
- **WHEN** una request protegida responde `401`
- **THEN** `authFetch` intenta refrescar, falla, limpia la sesión y la UI manda a login (sin loop de
  reintentos)
