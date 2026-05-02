---
name: project-architecture
description: Project Architecture
---

Follow the project's architecture:

- 5e Data Location = `public/data`
- 2024 Data Location = `public/data/2024`
- 5e Components Location = `src/components`
- 2024 Components Location = `src/components/2024`
- Component adapters shared between 5e and 2024 = `src/components/adapters`
- Components shared between 5e and 2024 = `src/components/common`

- Share as much code reuse as possible between 5e and 2024 components and services
- Never mix concerns across layers.
- If a file violates architecture, propose a fix before acting.