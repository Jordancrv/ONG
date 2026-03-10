# Apuntes de Base de Datos

## TABLAS:

### USERS (Gestión de cuentas del sistema)

- id: int NOT NULL 
- created_at: datetime(6) NOT NULL
- updated_at: datetime(6) NOT NULL 
- email: varchar(255) NOT NULL  
- password_hash: varchar(255) NOT NULL 
- first_name: varchar(255) 
- last_name: varchar(255) 
- avatar_url: varchar(255) 
- role: enum('ADMIN','INSTRUCTOR','STUDENT') NOT NULL

#### Problemas Actuales
- first_name y last_name permiten valores nulos generando posibles registros incompletos en el registro.
-  El campo de role debería integrarse en una nueva tabla para poder integrar nuevos roles en un futuro y tener mayor flexibilidad.
- Implementar un campo para el Soft Delete podria llamarse status, esto servira para no eliminar datos en caso un usuario desee eliminar su cuenta y no desencadenar en perdida de datos.

### SUBSCRIPTIONS (Gestión de subscripciones)

- id: int NOT NULL
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


### AUDIT_LOGS (Registro de eventos de los usuarios)

- id: int NOT NULL
- created_at: datetime(6) NOT NULL
- updated_at: datetime(6) NOT NULL 
- action: varchar(255) 
- metadata: json 
- user_id: int

### COURSES (Gestión de catálogo de cursos)
- id: int NOT NULL, PK, autoincrement
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
