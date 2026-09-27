# Backend Auth TypeScript

This service handles user registration, secure JWT generation, and public JWK exposure for decentralized backend validation, integrated with role-based access control (RBAC) via Active Directory (AD) groups.

## 🚀 Features

* **User Authentication:** Secure registration and credential hashing using `bcryptjs`.
* **Asymmetric JWT Signing:** Generates secure JSON Web Tokens (JWT) using asymmetric cryptography.
* **Public JWK Exposure:** Exposes a public JSON Web Key Set (JWKS) endpoint, allowing downstream microservices to validate tokens independently without querying this auth service.
* **AD Group Management:** Built-in support for AD Groups to manage user authorization and group-based access control.

## 🛠️ Tech Stack

* **Runtime & Framework:** Node.js, [Fastify](https://fastify.dev) (Optimized for low overhead and high throughput)
* **Database & ORM:** [Prisma ORM](https://prisma.io) (Type-safe database access)
* **Cryptography & JWT:** [Jose](https://github.com) (Lightweight and secure JWT/JWK/JWS implementation)
* **Password Hashing:** `bcryptjs`
* **Language:** TypeScript
