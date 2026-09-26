# Changelog

All notable changes to skills.rest will be documented in this file.

---

## [2026-09-13] - Accessibility & SEO Enhancements

### Added
- **Accessibility**: Added hidden `<label>` with `sr-only` class to hero search input for WCAG compliance
- **Accessibility**: Added `aria-label` and `id` attributes to main search input
- **Performance**: Added GitHub avatars domain preconnect and DNS prefetch in global layout
- **SEO**: Added `about` field to WebSite structured data schema with 9 core topic keywords

### Fixed
- **SEO**: Fixed heading hierarchy in footer (changed `<h4>` to `<h3>`) to maintain proper document outline (H1→H2→H3)
- **SEO**: Corrected heading skip-level violation flagged by W3C validators

### Technical Details
- Modified files:
  - `src/components/client/HomeHero.tsx` - Search input accessibility
  - `src/app/layout.tsx` - Resource preconnection
  - `src/components/server/Footer.tsx` - Heading hierarchy
  - `src/components/WebSiteStructuredData.tsx` - Schema.org enhancements

### Impact
- ✅ Zero visual changes to UI
- ✅ Improved WCAG compliance
- ✅ Faster GitHub avatar loading
- ✅ Better search engine understanding of site topics
- ✅ Fixed W3C heading structure validation errors

---

## [2026-09-10] - Initial Explore Page Optimization

### Changed
- Implemented pristine state for explore page when no filters are active
- Improved empty state messaging and user guidance

---

## [2026-09-08] - Author Profile & Database Enhancements

### Fixed
- **Hydration**: Fixed React hydration mismatch in author profile capability chart
- **Type Safety**: Enhanced JSON parsing in `db.ts` to handle D1's unpredictable output formats
- **Data Validation**: Added strict type guards for capability breakdown data

### Changed
- Refactored `CapabilityChart.tsx` to pure SVG rendering (removed useState/useEffect)
- Updated author profile layout to conditionally render chart only when data exists
- Forced `en-US` locale on all numeric formatting to prevent server/client mismatches

### Technical Details
- Modified files:
  - `src/lib/db.ts` - Type-safe JSON parser
  - `src/components/client/CapabilityChart.tsx` - Pure component refactor
  - `src/app/company/[login]/page.tsx` - Strict data validation

---

*For detailed commit history, see the Git log.*
