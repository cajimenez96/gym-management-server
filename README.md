# Aplicación de Gestión de Gimnasio Backend

Un backend escalable y robusto para la gestión eficiente de gimnasios. Este proyecto backend proporciona la API principal y los servicios para
gestionar miembros, membresías, pagos y registros de entrada, integrándose perfectamente con
la [aplicación frontend](https://github.com/HanifCarroll/gym-management-client-react).

## Tabla de Contenidos

1. [Características](#características)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Visión General de la Arquitectura](#visión-general-de-la-arquitectura)
4. [Comenzando](#comenzando)
5. [Ejecutando la Aplicación](#ejecutando-la-aplicación)
6. [Pruebas](#pruebas)
7. [Esquema de Base de Datos](#esquema-de-base-de-datos)
8. [Endpoints de la API](#endpoints-de-la-api)
9. [Calidad y Formato del Código](#calidad-y-formato-del-código)
10. [Licencia](#licencia)

## Características

- Gestión de miembros con operaciones CRUD
- Creación y gestión de planes de membresía
- Procesamiento de pagos con integración de Stripe
- Sistema de registro de entrada de miembros
- API RESTful bien documentada

## Tecnologías Utilizadas

- Node.js: Runtime de JavaScript para construir la aplicación del lado del servidor
- Express.js: Una biblioteca probada para construir aplicaciones eficientes y escalables
- TypeScript: Lenguaje de programación fuertemente tipado que se basa en JavaScript
- Supabase: Base de datos Postgres hospedada para almacenamiento de datos
- Stripe: Integración de procesamiento de pagos para manejar transacciones
- Jest: Framework de pruebas para pruebas unitarias y de integración
- ESLint: Herramienta de linting para asegurar la calidad del código
- Prettier: Formateador de código para un estilo consistente
- Docker: Containerización para configuración de ambiente consistente

## Visión General de la Arquitectura

Este proyecto está estructurado siguiendo los principios de modularidad y separación de responsabilidades. El backend está organizado
en varios módulos clave:

Módulos Principales:

- Módulo de Miembros: Maneja todas las operaciones relacionadas con los miembros del gimnasio
- Módulo de Planes de Membresía: Gestiona los planes de membresía
- Módulo de Pagos: Se integra con Stripe para gestionar pagos
- Módulo de Registro de Entrada: Registra y gestiona los registros de entrada de miembros
- Módulo de Stripe: Encapsula las llamadas a la API de Stripe
- Módulo de Supabase: Proporciona un wrapper alrededor de Supabase

Esta arquitectura promueve:

- Escalabilidad: La estructura modular permite fácil expansión y mantenimiento
- Testabilidad: La separación de responsabilidades asegura que cada módulo pueda ser probado independientemente
- Mantenibilidad: La organización clara del código mejora la legibilidad y facilita la actualización o refactorización

## Comenzando

### Prerrequisitos

- Node.js (v20 o posterior)
- npm (v10 o posterior)

### Instalación

1. Clona el repositorio:

   ```
   git clone https://github.com/cajimenez96/gym-management-server.git
   ```

2. Navega al directorio del proyecto:

   ```
   cd gym-management-server
   ```

3. Instala las dependencias:
   ```
   npm install
   ```

### Configuración del Entorno

1. Copia el archivo `.env.example` a `.env`:

   ```
   cp .env.example .env
   ```

2. Edita `.env` y establece las variables de entorno requeridas:
   ```
   SUPABASE_URL=tu_url_de_supabase
   SUPABASE_KEY=tu_clave_de_supabase
   STRIPE_SECRET_KEY=tu_clave_secreta_de_stripe
   ```

Tu clave secreta de Stripe puede ser obtenida desde tu panel de control de Stripe.

Por favor asegúrate de que el modo de prueba esté habilitado y que obtengas la clave correspondiente. Debe comenzar con pk*test*.

## Ejecutando la Aplicación

Para ejecutar la aplicación en modo de desarrollo:

```
npm run start:dev
```

El servidor se iniciará en `http://localhost:3001`, y la API será accesible en esta URL.

## Pruebas

Este proyecto usa Jest para pruebas unitarias y de integración. Las pruebas cubren la lógica de negocio principal, las capas de servicio y los
endpoints de la API para asegurar confiabilidad y corrección.

Para ejecutar las pruebas:

```
npm test
```

Para modo watch:

```
npm run test:watch
```

Los reportes de cobertura de pruebas se generan automáticamente y pueden ser revisados para asegurar que la aplicación esté bien probada.

## Esquema de Base de Datos

El esquema de la base de datos está implementado en Supabase y sigue un modelo relacional. Las entidades clave incluyen:

- Members: Almacena información de miembros como nombre, detalles de contacto y estado
- MembershipPlans: Define los planes de membresía disponibles, incluyendo duración y precios
- Memberships: Vincula miembros con sus planes de membresía, con fechas de inicio y fin
- Payments: Rastrea transacciones de pago, incluyendo montos y estados
- CheckIns: Registra los registros de entrada de miembros, vinculados a un miembro

## Endpoints de la API

El backend expone una API RESTful para interactuar con el sistema. Los endpoints clave incluyen:

- Miembros:
    - GET /api/members
    - POST /api/members
    - PUT /api/members/:id
    - DELETE /api/members/:id
- Planes de Membresía:
    - GET /api/membership-plans
    - POST /api/membership-plans
    - PATCH /api/membership-plans/:id
    - DELETE /api/membership-plans/:id
- Pagos:
    - POST /api/payments/initiate
    - POST /api/payments/confirm/:paymentIntentId
    - GET /api/payments/history
- Registros de Entrada:
    - POST /api/check-in
    - GET /api/check-in/history

Estos endpoints están documentados usando Swagger, que se genera automáticamente y puede ser accedido
en `http://localhost:3001/api`.

## Calidad y Formato del Código

Para asegurar la calidad y consistencia del código, este proyecto usa:

- **Prettier**: Para formato de código consistente

    - Configuración en `.prettierrc`
    - Ejecutar formateador: `npm run format`

- **ESLint**: Para análisis estático de código

    - Configuración en `.eslintrc.js`
    - Ejecutar linter: `npm run lint`

- **lint-staged**: Para ejecutar linters en archivos git staged

    - Configuración en `package.json`

- **Husky**: Para ejecutar git hooks
    - Hook pre-commit para ejecutar lint-staged

Estas herramientas aseguran que la base de código permanezca limpia, legible y mantenible.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE.md](LICENSE) para más detalles.

