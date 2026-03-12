# AGENTS.md

Guidelines for AI agents working on this Astro landing page project.

## Build Commands

```bash
# Development
bun dev                 # Start dev server at localhost:4321

# Build & Deploy
bun run build           # Build static site to ./dist/
bun run preview         # Preview production build locally
bun run deploy          # Deploy to GitHub Pages

# Astro CLI
bun run astro check     # Type-check the project
bun run astro add <pkg> # Add Astro integrations
```

## Tech Stack

- **Framework**: Astro v6 (static output)
- **UI Components**: React v19 (for interactive components only)
- **Styling**: Tailwind CSS v4 with custom theme
- **Language**: TypeScript (strict mode)
- **Package Manager**: Bun
- **Icons**: @iconify/react (React) / astro-icon (Astro)

## Code Style

### File Organization
- Astro components: `src/components/**/*.astro`
- React components: `src/components/react/**/*.tsx`
- Page sections: `src/components/home/*.astro`
- Layouts: `src/layouts/*.astro`
- Styles: `src/styles/global.css`
- Assets: `src/assets/` (images), `public/` (static files)

### Imports
- Use relative imports: `../components/Header`
- Group imports: 1) Frameworks, 2) Components, 3) Assets/Utils
- Astro frontmatter imports first, then component logic

### Naming Conventions
- Components: PascalCase (`Header.astro`, `TestimonialsCarousel.tsx`)
- Files: PascalCase for components, camelCase for utilities
- CSS classes: kebab-case (`bg-gradient-purple-blue`)
- Custom colors: semantic names (`primary-teal`, `secondary-purple`)

### TypeScript
- Use strict TypeScript config
- Define interfaces for component props
- Avoid `any` type
- Use explicit return types for React components

### React Components
- Use functional components with hooks
- Prefer `useCallback` for event handlers passed to children
- Clean up event listeners in `useEffect` return
- Use `aria-label` for icon buttons

### Styling (Tailwind v4)
- Custom theme defined in `global.css` via `@theme`
- Use theme colors: `text-primary-teal`, `bg-secondary-purple`
- Custom gradients: `bg-gradient-teal-lime`, `text-gradient-purple-blue`
- Responsive prefixes: `sm:`, `md:`, `lg:` (mobile-first)

### Error Handling
- Use Astro's built-in error handling for pages
- Add `aria-label` for accessibility on interactive elements
- Handle missing data gracefully with optional chaining

### Git
- Node version: >=22.12.0 (specified in package.json)
- Site deployed to: `https://alhanielbaya.github.io/the-help-care-landing-page/`
- Do NOT commit: `dist/`, `.astro/`, `node_modules/`, `.env`

## Key Files

- `astro.config.mjs` - Site config, base path, integrations
- `src/styles/global.css` - Tailwind theme, custom utilities
- `tsconfig.json` - Strict TypeScript config extending Astro defaults

## Best Practices

1. Keep React components minimal - use Astro for static content
2. Use semantic HTML elements (`<section>`, `<article>`, `<nav>`)
3. Implement smooth scroll behavior for anchor links
4. Use the Inter font family (loaded in Layout.astro)
5. Optimize images before adding to `src/assets/`
6. Use `class` not `className` in `.astro` files
