<div align="center">

# 🏎️ Mansory Frontend

**A modern Angular application showcasing the Mansory exclusive car catalogue**

[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://mansory-frontend.vercel.app)

[🚀 Live Demo](https://mansory-frontend.vercel.app) · [🐛 Report a Bug](../../issues) · [📖 Backend Repo](https://github.com/IslamCabarli/Mansory-Backend)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

---

## About

**Mansory Frontend** is the official catalogue platform for the luxury automotive tuning brand. Users can browse cars filtered by brand, explore technical specifications, and manage content through the admin panel.

Communicates with the backend API at: `https://mansory-backend-production.up.railway.app/api`

---

## Features

- 🔍 **Car Catalogue** — filter and search by brand
- 🖼️ **Image Gallery** — multiple images per vehicle
- 🛠️ **Admin Panel** — add, edit, delete cars and manage images
- 📱 **Responsive Design** — fully adapted for mobile, tablet, and desktop
- ⚡ **Performance** — optimised loading with Angular lazy loading

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Angular](https://angular.io/) | 17+ | Core framework |
| [TypeScript](https://www.typescriptlang.org/) | 5+ | Programming language |
| [Tailwind CSS](https://tailwindcss.com/) | 3+ | UI styling |
| [RxJS](https://rxjs.dev/) | 7+ | Reactive programming |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x → [nodejs.org](https://nodejs.org)
- **Angular CLI** ≥ 17.x

```bash
npm install -g @angular/cli
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/IslamCabarli/Mansory-Frontend.git
cd mansory-frontend

# 2. Install dependencies
npm install

# 3. Start the development server
ng serve
```

Open your browser at: **http://localhost:4200**

### Available Commands

```bash
ng serve          # Start development server
ng build          # Production build
ng test           # Run unit tests
ng lint           # Check code quality
```

---

## Environment Variables

Configure `src/environments/environment.ts` as follows:

```typescript
// Development
export const environment = {
  production: false,
  apiUrl: 'https://mansory-backend-production.up.railway.app/api'
};
```

```typescript
// Production
export const environment = {
  production: true,
  apiUrl: 'https://mansory-backend-production.up.railway.app/api'
};
```

> ⚠️ Never commit `environment.ts` to git. Add it to `.gitignore`.

---

## Project Structure

```
src/
├── app/
│   ├── core/              # Services, interceptors, guards
│   ├── shared/            # Shared components and pipes
│   ├── features/
│   │   ├── catalog/       # Car catalogue
│   │   ├── car-detail/    # Car detail page
│   │   └── admin/         # Admin panel
│   ├── app.routes.ts
│   └── app.config.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── assets/
```

---

## Deployment

The project is automatically deployed on **Vercel**. Every push to the `main` branch triggers a new deployment.

```bash
# Manual deployment
npm install -g vercel
vercel --prod
```

---

<div align="center">
  <sub>Built with ❤️ for Mansory</sub>
</div>
