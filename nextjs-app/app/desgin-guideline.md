# Design Guidelines

## Brand Identity

### Core Values
- **Professional**: Clean, structured layouts with purposeful white space
- **Modern**: Contemporary design elements with subtle animations
- **Approachable**: Warm color accents and friendly typography
- **Technical**: Organized information hierarchy and systematic design patterns

### Brand Voice
- Confident but not arrogant
- Technical but accessible
- Personal and authentic
- Clear and concise

## Color Palette

### Primary Colors
- **Indigo** (Primary Brand Color)
  - Main: `#4f46e5` (Tailwind indigo-600)
  - Dark: `#4338ca` (Tailwind indigo-700)
  - Light: `#818cf8` (Tailwind indigo-400)
  - Extra Light: `#eef2ff` (Tailwind indigo-50)

### Secondary Colors
- **Amber** (Accent Color)
  - Main: `#d97706` (Tailwind amber-600)
  - Light: `#fef3c7` (Tailwind amber-50)

### Neutral Colors
- **Gray Scale**
  - Text (Dark): `#111827` (Tailwind gray-900)
  - Text (Medium): `#4b5563` (Tailwind gray-600)
  - Text (Light): `#6b7280` (Tailwind gray-500)
  - Borders: `#e5e7eb` (Tailwind gray-200)
  - Background (Light): `#f9fafb` (Tailwind gray-50)
  - Background (White): `#ffffff` (Tailwind white)

### Status Colors
- **Success**: `#059669` (Tailwind emerald-600)
- **Error**: `#dc2626` (Tailwind red-600)
- **Warning**: `#d97706` (Tailwind amber-600)
- **Info**: `#0284c7` (Tailwind sky-600)

## Typography

### Font Families
- **Headings**: Inter (sans-serif)
- **Body**: Inter (sans-serif)
- **Monospace** (for code blocks): JetBrains Mono or Fira Code

### Font Sizes
- **Headings**
  - H1: `text-5xl` (3rem / 48px) - Landing page main heading
  - H1 (Internal pages): `text-4xl` (2.25rem / 36px)
  - H2: `text-3xl` (1.875rem / 30px)
  - H3: `text-2xl` (1.5rem / 24px)
  - H4: `text-xl` (1.25rem / 20px)
  - H5: `text-lg` (1.125rem / 18px)
  - H6: `text-base` (1rem / 16px)

- **Body Text**
  - Default: `text-base` (1rem / 16px)
  - Large: `text-lg` (1.125rem / 18px)
  - Small: `text-sm` (0.875rem / 14px)
  - Extra Small: `text-xs` (0.75rem / 12px)

### Font Weights
- Extra Bold: `font-extrabold` (800)
- Bold: `font-bold` (700)
- Semi Bold: `font-semibold` (600)
- Medium: `font-medium` (500)
- Normal: `font-normal` (400)
- Light: `font-light` (300)

### Line Heights
- Tight: `leading-tight` (1.25)
- Snug: `leading-snug` (1.375)
- Normal: `leading-normal` (1.5)
- Relaxed: `leading-relaxed` (1.625)
- Loose: `leading-loose` (2)

## Spacing System

### Consistent Spacing Scale
- `space-0` (0px)
- `space-1` (0.25rem / 4px)
- `space-2` (0.5rem / 8px)
- `space-3` (0.75rem / 12px)
- `space-4` (1rem / 16px)
- `space-5` (1.25rem / 20px)
- `space-6` (1.5rem / 24px)
- `space-8` (2rem / 32px)
- `space-10` (2.5rem / 40px)
- `space-12` (3rem / 48px)
- `space-16` (4rem / 64px)
- `space-20` (5rem / 80px)
- `space-24` (6rem / 96px)

### Section Spacing
- Section Padding (Vertical): `py-16 md:py-24` (4rem on mobile, 6rem on desktop)
- Container Max Width: `max-w-7xl` (80rem / 1280px)
- Content Max Width: `max-w-4xl` (56rem / 896px)
- Text Block Max Width: `max-w-2xl` (42rem / 672px)

## Borders

### Border Radius
- Extra Small: `rounded-sm` (0.125rem / 2px)
- Small: `rounded` (0.25rem / 4px)
- Medium: `rounded-md` (0.375rem / 6px)
- Large: `rounded-lg` (0.5rem / 8px)
- Extra Large: `rounded-xl` (0.75rem / 12px)
- Full (Pills/Badges): `rounded-full` (9999px)

### Border Widths
- Default: `border` (1px)
- Medium: `border-2` (2px)
- Thick: `border-4` (4px)

### Border Colors
- Default: `border-gray-200` (#e5e7eb)
- Darker: `border-gray-300` (#d1d5db)
- Focus: `border-indigo-500` (#6366f1)

## Shadows

### Elevation Levels
- Subtle: `shadow-sm` (0 1px 2px 0 rgb(0 0 0 / 0.05))
- Default: `shadow` (0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1))
- Medium: `shadow-md` (0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))
- Large: `shadow-lg` (0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1))

## Components

### Buttons

#### Primary Button
```html
<button class="px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
  Button Text
</button>
```

#### Secondary Button
```html
<button class="px-5 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
  Button Text
</button>
```

#### Text Button
```html
<button class="font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none focus:underline transition-colors">
  Button Text
</button>
```

#### Small Button
```html
<button class="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
  Button Text
</button>
```

### Cards

#### Default Card
```html
<div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
  <!-- Card Content -->
</div>
```

#### Interactive Card
```html
<div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
  <!-- Card Content -->
</div>
```

#### Accent Card
```html
<div class="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
  <!-- Card Content -->
</div>
```

### Badges

#### Default Badge
```html
<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
  Badge Text
</span>
```

#### Colored Badge
```html
<span class="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
  Badge Text
</span>
```

### Form Elements

#### Text Input
```html
<input 
  type="text" 
  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
/>
```

#### Textarea
```html
<textarea 
  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
></textarea>
```

#### Select
```html
<select 
  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

#### Checkbox
```html
<div class="flex items-center">
  <input 
    type="checkbox" 
    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
  />
  <label class="ml-2 text-gray-700">Checkbox Label</label>
</div>
```

## Layout Patterns

### Section Structure
```html
<section class="py-16 md:py-24 bg-white border-t border-gray-100">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <!-- Section content -->
    </div>
  </div>
</section>
```

### Grid Layouts
- Two Column: `grid md:grid-cols-2 gap-8`
- Three Column: `grid md:grid-cols-3 gap-8`
- Four Column: `grid md:grid-cols-2 lg:grid-cols-4 gap-6`

### Container Widths
- Full Width Container: `container mx-auto px-4 sm:px-6 lg:px-8`
- Content Width: `mx-auto max-w-4xl`
- Narrow Content: `mx-auto max-w-2xl`

## Animations & Transitions

### Transition Properties
- Default: `transition` (all properties, 150ms)
- Colors Only: `transition-colors` (background-color, border-color, color, fill, stroke)
- Transform Only: `transition-transform` (transform)
- Opacity Only: `transition-opacity` (opacity)
- Shadow Only: `transition-shadow` (box-shadow)

### Animation Definitions
```css
@keyframes wave {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(14deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
  60% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

.animate-wave {
  display: inline-block;
  transform-origin: 70% 70%;
  animation: wave 2.5s ease-in-out infinite;
}

.hover-lift {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.1);
}
```

## Responsive Breakpoints

- **Small** (sm): 640px
- **Medium** (md): 768px
- **Large** (lg): 1024px
- **Extra Large** (xl): 1280px
- **2x Extra Large** (2xl): 1536px

## Accessibility

- Include focus states on all interactive elements
- Maintain contrast ratios of at least 4.5:1 for normal text and 3:1 for large text
- Use semantic HTML elements appropriately
- Include `aria-*` attributes when necessary

## Image Treatments

- Default border radius for images: `rounded-lg`
- Image aspect ratios:
  - Square: `aspect-square`
  - 16:9: `aspect-video`
  - 4:3: `aspect-[4/3]`
  - Custom: `aspect-[16/10]`

## Icons

- Default icon size: `w-5 h-5`
- Small icon size: `w-4 h-4`
- Large icon size: `w-6 h-6`
- Icon color typically matches text: `text-current`
- Icon libraries: Lucide React or Heroicons