# Apuntes de Base de Datos

## TABLAS:

### USERS (Gestión de cuentas del sistema)

- id: int NOT NULL IDENTITY PK
- created_at: datetime(6) NOT NULL
- updated_at: datetime(6) NOT NULL 
- email: varchar(255) NOT NULL UNIQUE 
- password_hash: varchar(255) NOT NULL 
- first_name: varchar(255) 
- last_name: varchar(255) 
- avatar_url: varchar(255) 
- role: enum('ADMIN','INSTRUCTOR','STUDENT') NOT NULL

#### Problemas Actuales
- first_name y last_name permiten valores nulos generando posibles registros incompletos en el registro.
-  El campo role debería integrarse en una nueva tabla en la cual se puede integrar nuevos roles en un futuro y tener mayor flexibilidad.
- Implementar un campo status, con la finalidad de usar Soft Delete, esto sirve para no eliminar datos en caso un usuario desee eliminar su cuenta y no desencadenar en perdida de datos.

### SUBSCRIPTIONS (Gestión de subscripciones)

- id: int NOT NULL IDENTITY PK
- created_at: datetime(6) NOT NULL
- updated_at: datetime(6) NOT NULL 
- start_at: datetime NOT NULL 
- end_at: datetime 
- status: enum('ACTIVE','CANCELLED','EXPIRED') NOT NULL
- user_id: int
- plan_id: int

#### Problemas Actuales
- user_id y plan_id no deberia permitir valores nulos, puesto que un usuario al registrarse deberia agregarse al plan free, basico o gratuito, esto se debe para no tener perdida de datos en el registro de planes de los usuarios.
- Deberia crearse una tabla llamada subscriptions_logs con un campo el cual guarde el precio en el que el usuario se suscribio en el plan ya que al momento de realizar una auditoria de datos y los planes hayan sido modificados apareceran con los ultimos precios generando un desbalance en los ingresos.


### MEMBERSHIP_PLANS (Planes)

- id: int NOT NULL IDENTITY PK
- created_at: datetime(6) NOT NULL
- updated_at: datetime(6) NOT NULL 
- code: enum('BASIC','PRO') NOT NULL
- name: varchar(255) NOT NULL
- features: json
- status: tinyint NOT NUL

#### POSIBLES MEJORAS
- Se podria agregar nuevos campos price_monthly y currency por si se desea cobrar por los planes y los cursos, ademas de agregar el historial historico de los precios en un log. 

### AUDIT_LOGS (Registro de eventos de los usuarios)
- id: int NOT NULL IDENTITY PK
- created_at: datetime(6) NOT NULL
- updated_at: datetime(6) NOT NULL 
- action: varchar(255) 
- metadata: json 
- user_id: int

#### POSIBLES MEJORAS
- Deberia eliminarse el campo de updated_at, probablemente fue creada al usar la plantilla ORM, lo importante aqui es guardar las acciones de los usuarios sin actualizarse a menos de que se trate de pagos o transacciones y el estado de la transaccion se actualice.

### COURSES (Gestión de catálogo de cursos)
- id: int NOT NULL IDENTITY PK
- created_at: datetime(6) NOT NULL
- updated_at: datetime(6) NOT NULL
- title: varchar(255) NOT NULL
- slug: varchar(255) NULL
- summary: varchar(255) NULL
- description: text NULL
- thumbnail_url: varchar(255) NULL
- level: varchar(255) NULL
- language: varchar(255) NULL
- visibility: enum('PUBLIC','PRIVATE') NOT NULL default 'PUBLIC'
- modality: enum('SELF_PACED','GUIDED') NOT NULL default 'SELF_PACED'
- tier_required: enum('FREE','BASIC','PRO') NOT NULL default 'FREE'
- has_certificate: tinyint NOT NULL default 0
- supports_live: tinyint NOT NULL default 0
- supports_challenges: tinyint NOT NULL default 0
- owner_id: int NULL, FK a users.id

#### Problemas Actuales
- slug permite valores nulos y no cuenta con UNIQUE por lo que se pueden crear slugs duplicados y existir cursos sin slugs. 
- Pueden existir cursos sin owner.
- level y language son varchar(255) lo que puede permitir datos inconsistentes por si no se sigue una regla de estandarizacion.
- summary varchar(255) podria quedar corto en algunos casos.
### RECOMENDACION
- slug NOT NULL UNIQUE
- owner_id NOT NULL
- level y language estandarizar con enum o crear una tabla para estandarizar estos datos


### COURSES_MODULES (Gestión de catálogo de cursos)
- id: int NOT NULL IDENTITY PK
- created_at: datetime(6) NOT NULL
- updated_at: datetime(6) NOT NULL
- index: int NOT NULL
- title: varchar(255) NOT NULL
- summary: varchar(255)
- course_id: int

#### Problemas Actuales
- Renonbrar el campo index ya que al ser una palabra reservada por sql puede traer inconsistencias.
- course_id permite valores nulos pudiendo registrar datos huerfanos.
- course_id e index deberian integrarse con UNIQUE para mantener un orden entre curso e index permitiendo reutilizarlo
### RECOMENDACION
- position (index) int NOT NULL
- course_id: int NOT NULL
- UNIQUE(course_id, position)

### LESSONS (Lecciones)
- id: int NOT NULL IDENTITY PK
- created_at: datetime(6) NOT NULL
- updated_at: datetime(6) NOT NULL
- index: int NOT NULL
- title: varchar(255) NOT NULL
- content: text
- video_url: varchar(255)
- duration_min: int
- resources: json
- module_id: int FK(course_modules)

#### Problemas Actuales
- module_id esta permitiendo el registro de lecciones sin modulo.
- Renombrar el campo de index ya que al ser una palabra reservada por sql puede traer inconsistencias.
- module_id y index deberian agregarse en UNIQUE por lo cual se podria repetir el index y mantener un orden entre los modulos y el index.

### RECOMENDACION
- module_id NOT NULL
- position (index) int NOT NULL
- UNIQUE (module_id, position)
 
### CHALLENGE ()
- id: int NOT NULL
- created_at: datetime(6) NOT NULL
- updated_at: datetime(6) NOT NULL
- title: varchar(255) NOT NULL
- description: text
- points: int NOT NULL
- rules: json
- course_id: int
- lesson_id: int


### CHALLENGE_SUBMISSIONS ()
- id: int NOT NULL
- artifact_url: varchar(255) 
- score: int NOT NULL 
- status: enum('SUBMITTED','REVIEWING',APPROVED','REJECTED') NOT NULL
- challenge_id: int 
- user_id: int

#### Problemas Actuales
- No existe campos que registren el momento en el que se mando la respuesta del challenge y tampoco de cuando se actualizo ese score.
- Agregar not null en challenge id ya que una entrega sin challenge id podria romper parte de la logica del sistema, lo mismo con los usuarios.
### RECOMENDACION
- submitted_at datetime(6) NOT NULL
- updated_at datetime(6)
- challenge_id: int NOT NULL
- user_id: int NOT NULL
