---
name: Ancestral Roots
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#343944'
  surface-container-lowest: '#090e17'
  surface-container-low: '#171c25'
  surface-container: '#1b2029'
  surface-container-high: '#252a34'
  surface-container-highest: '#30353f'
  on-surface: '#dee2f0'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#dee2f0'
  inverse-on-surface: '#2c303b'
  outline: '#a08e7a'
  outline-variant: '#534434'
  surface-tint: '#ffb95f'
  primary: '#ffc174'
  on-primary: '#472a00'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#855300'
  secondary: '#4fdbc8'
  on-secondary: '#003731'
  secondary-container: '#04b4a2'
  on-secondary-container: '#003f38'
  tertiary: '#ffbcb7'
  on-tertiary: '#68000a'
  tertiary-container: '#ff938c'
  on-tertiary-container: '#8d0012'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0f131d'
  on-background: '#dee2f0'
  surface-variant: '#30353f'
typography:
  headline-xl:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Syne
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0em
  headline-md:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Syne
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.06em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.12em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels an ancient, bioluminescent subterranean world where primordial flora meets crystallized arcane relicry. It supports an atmospheric hand-drawn 2D Metroidvania experience centered on mystery, lost lineages, and subterranean descent. 

The aesthetic fuses **Tactile / Skeuomorphic organicism** with **Mystic Glassmorphism**:
- **Organic & Carved**: Surfaces echo carved petrified bark, rough stone slate, and runic glyphs etched into forgotten roots.
- **Bioluminescent & Crystalline**: Containers act like fractured volcanic glass, obsidian vials, and luminous resinous vessels.
- **Atmospheric Depth**: Interfaces prioritize immersive, high-contrast HUD components that fade into the vignette of deep caverns, reacting dynamically to mana surges, corruption blights, and ancient discoveries.

## Colors

The palette creates sharp emotional contrast between ancient subterranean darkness, vital glowing spirits, crystalline magic, and spreading biological corruption.

### Primary: Ancestral Core & Solar Amber (`#F59E0B`, highlights `#FBBF24`, depths `#D97706`)
Represents the ancient heartwood, memories, relic energy, and player vitality. Used for high-priority interactive cues, core inventory frames, experience tallies, and sacred points of interest.

### Secondary: Crystalline Surge & Turquoise Mana (`#14B8A6`, highlights `#2DD4BF`, aura `#06B6D4`)
Evokes magical subterranean veins, fluid dash meters, arcane ability cooldowns, and ancient technology seals.

### Tertiary: Blight & Coral Corruption (`#EF4444`, highlights `#F87171`, deep `#991B1B`)
Signifies rot, volatile spores, hostile telegraphs, cursed augmentations, and critical danger thresholds.

### Atmosphere & Foundation: Abyssal Slate & Petroleum Depths
- **Abyssal Base**: Deep blue-black (`#070B12`, `#0A0F18`) providing an opaque, impenetrable bedrock for all UI backplates.
- **Deep Flora**: Petrified oil greens (`#0D3B36`, `#164E48`) and subterranean violets (`#1E1430`, `#2C1844`) layering ambient panels, map fog, and inventory backdrops.

## Typography

The typographic hierarchy blends sculptural, rúnic-feeling letterforms with razor-sharp readability for fast-paced gameplay and inventory management.

- **Headlines (Syne)**: Expressive, unconventional, and statuesque. Evokes carved stone stele and chiseled ancient monuments while avoiding illegible decorative faux-runes. Used for boss encounters, zone discoveries, and codex titles.
- **Body & Lore (Manrope)**: Neutral, refined, and balanced. Provides fatigue-free readability against dark, textured backgrounds during extended lore reads, item descriptions, and dialogue scrolls.
- **Labels & Stats (Space Grotesk)**: Geometric, technical, and slightly archaic. Used in uppercase for HUD stat metrics, weapon values, keybind tags, and inventory categorizations.

## Layout & Spacing

Layouts follow an edge-weighted safe-zone model to optimize both gamepad UI and compact handheld/mobile screen densities.

### Layout Model
- **HUD Safe Zones**: Dynamic corner clustering with a standard `2.5rem` offset from screen boundaries to clear display bezels and maintain clear combat sightlines.
- **Menus & Grids**: An 8-column layout for overlay panels (Bestiary, Relic Tree, Inventory) expanding to 12 columns on ultrawide desktop viewports, with a strict `1.25rem` gutter between modular slots.
- **Reflow Rules**: On smaller screens and handheld devices, multi-column inventory grids collapse from 6x4 slot configurations to 4x3 scrollable arrays with persistent quick-select docks pinned at the base.

## Elevation & Depth

Visual hierarchy uses **Bioluminescent Volumetric Stacking** rather than traditional drop shadows:

1. **Canvas / Deep Abyssal**: `#070B12` base with low-opacity vignette gradients (`#1E1430` at 30% alpha) to focus player attention toward center elements.
2. **Surface Level (Stone & Bark Shelves)**: `#0A0F18` fill framed with 1px etched borders in `#164E48`. Inner bevels use semi-transparent highlights (`rgba(255, 255, 255, 0.05)`) mimicking cut mineral edges.
3. **Floating HUD & Receptacles (Crystal Vessels)**: Glassmorphic layers (`background: rgba(13, 59, 54, 0.65)`, `backdrop-filter: blur(8px)`) enclosed in sharp crystalline facet lines.
4. **Luminescent Aura & Focus**: Focused items, filled mana tanks, and interactive runes break elevation using layered radial glows:
   - Amber Energy: `0 0 24px rgba(245, 158, 11, 0.35), 0 0 4px rgba(251, 191, 36, 0.8)`
   - Crystalline Turquoise: `0 0 20px rgba(20, 184, 166, 0.4), inset 0 0 8px rgba(45, 212, 191, 0.5)`
   - Corrupted Hazard: `0 0 16px rgba(239, 68, 68, 0.5)`

## Shapes

The shape system employs tight, disciplined corner radii (`0.25rem`) augmented by faceted chamfers (45-degree corner clips) that emulate hand-chiseled slate, severed roots, and cut gem facets. True rounded pill shapes are strictly restricted to organic liquid gauges and fluid energy orbs.

## Components

### Buttons & Action Glyphs
- **Primary / Ancestral**: Deep teal-slate slate backing (`#0D3B36`) bordered by a 1px chamfered frame in Amber (`#F59E0B`). Text set in `label-lg` uppercase. On focus/hover, the border blooms with a vibrant gold aura and a subtle inner turquoise flare.
- **Secondary / Runic**: Frameless with a faint background wash (`rgba(30, 20, 48, 0.5)`), flanked by carved bracket marks `[ ]` that animate outwards when selected.
- **Destructive / Blighted**: Red-tinted slate with an unstable pulsing inner glow in `#EF4444`.

### Resource Orbs & Meter Flasks (HUD)
- **Health Core**: Segmented amber heartwood vessel. Depletion reveals an empty, cracked obsidian cavity; replenishment pulses outward with golden pollen particles.
- **Mana / Crystal Vessel**: Translucent turquoise column with liquid fluid shader effects, capped with petrified root filigree brackets. Overcharging casts a sharp cyan rim light.

### Relic Cards & Inventory Slots
- Square or 4:5 aspect ratio cells with an obsidian base (`#070B12`). 
- Unlocked slots feature a faint turquoise crystalline lattice pattern; empty slots show faded runic carvings.
- Rarity or infusion states change the outer etched boundary color (Common: `#164E48`, Core: `#F59E0B`, Blighted: `#EF4444`).

### Chips & Stat Badges
- Compact tags with `space-xs` vertical and `space-sm` horizontal padding.
- Text rendered in `label-sm` Space Grotesk. Enclosed within a 1px border colored according to the damage/element type (Kinetic, Crystalline, Spore, Primordial).

### Selection & Input Fields
- **Checkboxes & Toggles**: Represented as unlit carved runic nodes that ignite with turquoise or amber flame upon activation.
- **Sliders**: Petrified root vine track with a floating multifaceted raw crystal serving as the draggable thumb.
- **Dialogue Boxes**: Wide slate containers pinned to lower-center view, layered over a deep violet mist with speaker portraits framed in carved petrified wood.