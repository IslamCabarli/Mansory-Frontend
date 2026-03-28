<div align="center">

# 🏎️ Mansory Frontend

**Mansory eksklüziv avtomobil kataloqunu nümayiş etdirən müasir Angular tətbiqi**

[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://mansory-frontend.vercel.app)

[🚀 Canlı Demo](https://mansory-frontend.vercel.app) · [🐛 Xəta Bildir](../../issues) · [📖 Backend Repo](https://github.com/USERNAME/mansory-backend)

</div>

---

## 📋 Mündəricat

- [Layihə Haqqında](#layihə-haqqında)
- [Xüsusiyyətlər](#xüsusiyyətlər)
- [Texnologiyalar](#texnologiyalar)
- [Başlamaq](#başlamaq)
- [Ətraf Mühit Dəyişənləri](#ətraf-mühit-dəyişənləri)
- [Layihə Strukturu](#layihə-strukturu)
- [Deployment](#deployment)

---

## Layihə Haqqında

**Mansory Frontend** — lüks avtomobil tuning brendinin rəsmi kataloq platformasıdır. İstifadəçilər brendlər üzrə filtrləmə, avtomobilin texniki göstəricilərini öyrənmə və admin panel vasitəsilə məzmunu idarə etmə imkanına sahibdirlər.

Backend API ilə əlaqə saxlayır: `https://mansory-backend-production.up.railway.app/api`

---

## Xüsusiyyətlər

- 🔍 **Avtomobil Kataloqu** — brendlər üzrə filtrləmə və axtarış
- 🖼️ **Şəkil Qalereyası** — hər avtomobil üçün çoxlu şəkillər
- 🛠️ **Admin Panel** — avtomobil əlavə etmək, redaktə etmək, silmək və şəkilləri idarə etmək
- 📱 **Responsive Dizayn** — mobil, planşet və desktop üçün tam uyğun
- ⚡ **Performans** — Angular lazy loading ilə optimallaşdırılmış yüklənmə

---

## Texnologiyalar

| Texnologiya | Versiya | Məqsəd |
|---|---|---|
| [Angular](https://angular.io/) | 17+ | Əsas framework |
| [TypeScript](https://www.typescriptlang.org/) | 5+ | Proqramlaşdırma dili |
| [Tailwind CSS](https://tailwindcss.com/) | 3+ | UI styling |
| [RxJS](https://rxjs.dev/) | 7+ | Reaktiv proqramlaşdırma |

---

## Başlamaq

### Tələblər

- **Node.js** ≥ 18.x → [nodejs.org](https://nodejs.org)
- **Angular CLI** ≥ 17.x

```bash
npm install -g @angular/cli
```

### Quraşdırma

```bash
# 1. Repozitoriyanı klonlayın
git clone https://github.com/USERNAME/mansory-frontend.git
cd mansory-frontend

# 2. Asılılıqları yükləyin
npm install

# 3. Lokal serveri başladın
ng serve
```

Brauzerinizi açın: **http://localhost:4200**

### Mövcud Əmrlər

```bash
ng serve          # Development server
ng build          # Production build
ng test           # Unit testlər
ng lint           # Kod keyfiyyəti yoxlaması
```

---

## Ətraf Mühit Dəyişənləri

`src/environments/environment.ts` faylını aşağıdakı kimi konfiqurasiya edin:

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

> ⚠️ `environment.ts` faylını heç vaxt git-ə commit etməyin. `.gitignore`-a əlavə edin.

---

## Layihə Strukturu

```
src/
├── app/
│   ├── core/              # Servisler, interceptors, guards
│   ├── shared/            # Ortaq komponentlər və pipeslər
│   ├── features/
│   │   ├── catalog/       # Avtomobil kataloqu
│   │   ├── car-detail/    # Avtomobil detalları
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

Layihə **Vercel** üzərindən avtomatik deploy olunur. `main` branch-ə hər push-dan sonra deployment başlayır.

```bash
# Manual deployment
npm install -g vercel
vercel --prod
```

---

<div align="center">
  <sub>Built with ❤️ for Mansory</sub>
</div>
