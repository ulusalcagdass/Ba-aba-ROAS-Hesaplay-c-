# ROAS Hesaplayıcı - Tasarım Kılavuzu

## Design Approach
**System-Based Approach**: Material Design principles adapted for financial/calculation tools, prioritizing clarity, scanability, and data hierarchy. This is a utility-first application where precision and usability trump visual storytelling.

## Core Design Principles
1. **Calculation Clarity**: Clear visual separation between input fields (user editable) and calculated results (read-only)
2. **Real-time Feedback**: Instant calculation updates as users type
3. **Data Hierarchy**: Inputs → Primary Calculations → ROAS Targets progression
4. **Turkish Localization**: All text, currency (₺), and number formatting in Turkish

## Typography System

**Font Family**: Inter or Roboto via Google Fonts CDN
- **Headings**: 
  - H1: text-3xl font-bold (Main title: "ROAS Hesaplayıcı")
  - H2: text-xl font-semibold (Section headers: "Ürün Bilgileri", "Hesaplanan Değerler", "Marjinal ROAS Hedefleri")
  - H3: text-lg font-medium (Card titles)
- **Body Text**: text-base font-normal
- **Input Labels**: text-sm font-medium 
- **Calculated Values**: text-2xl font-bold for key metrics, text-lg font-semibold for secondary
- **Helper Text**: text-xs

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6 or p-8
- Section gaps: space-y-8
- Form field spacing: space-y-4
- Card gaps: gap-6

**Container Structure**:
- Max width: max-w-5xl mx-auto
- Page padding: px-4 md:px-8
- Top margin: mt-8 md:mt-12

**Grid Layout**:
- Input section: Single column (full width forms)
- Results section: 2-column grid on desktop (grid-cols-1 md:grid-cols-2), single column on mobile
- ROAS targets: 2x2 grid on desktop (grid-cols-2), single column on mobile

## Component Library

### 1. Page Header
- Centered title "Performans Pazarlama ROAS Hesaplayıcı"
- Subtitle explaining purpose
- Spacing: mb-8

### 2. Input Card ("Ürün Bilgileri" & "Sabit Ücretler")
- Grouped form fields with clear labels
- Input fields with ₺ symbol or % indicator
- Number inputs with step values (0.01 for decimals)
- Fields: AOV, Ürün Maliyeti, Kredi Kartı Ücretleri (%), Ödeme İşlem Ücreti, Kargo Ücreti, Operasyon Maliyeti
- Visual treatment: Elevated card with rounded-lg

### 3. Calculated Results Card
- Read-only display (not editable)
- Key metrics in larger typography:
  - Toplam Ürün Maliyeti + Fullfillment
  - Maliyet Yüzdesi
  - Brüt Kar Marjı
  - Beklenen Brüt Kar
- Visual distinction: Different background treatment from input cards
- Icon indicators from Heroicons (calculator, chart-bar)

### 4. ROAS Targets Grid
- 4 metric cards in 2x2 grid:
  - Başabaş Noktası (ROAS)
  - Hedef ROAS (%10 Marj)
  - Hedef ROAS (%15 Marj)
  - Hedef ROAS (%20 Marj)
- Large number display with label below
- Visual indicator icons from Heroicons (trending-up, target)

### 5. Form Inputs
- Floating labels or top-aligned labels
- Border styling with focus states
- Proper input types (number with step)
- Right-aligned text for numerical inputs
- Currency/percentage suffixes positioned inside input (right side)

## Interaction Patterns

**Real-time Calculation**:
- Input onChange triggers immediate recalculation
- No submit button needed
- Smooth transitions for value updates

**Visual Feedback**:
- Focus states on inputs
- Subtle animations on calculated value changes (optional: brief highlight)
- No distracting animations

**Accessibility**:
- All inputs have proper labels
- Tab order flows logically (top to bottom)
- ARIA labels for calculated fields
- Sufficient contrast ratios

## Data Formatting

**Currency (₺)**:
- Format: "1.250,00₺" (Turkish locale)
- Thousand separators: dot (.)
- Decimal separator: comma (,)
- Always 2 decimal places

**Percentages**:
- Format: "%48.60"
- 2 decimal places

**ROAS Values**:
- Format: "1.88" or "2.31"
- 2 decimal places
- No currency symbol

## Information Architecture

**Single Page Layout** (no hero image):
1. Page Header (title + description)
2. Input Section - "Ürün ve Maliyet Bilgileri" card
3. Calculated Results Section - Primary metrics card
4. ROAS Targets Section - 4-card grid
5. Optional: Footer with brief usage tips

**Visual Hierarchy**:
- Input cards appear first (user action)
- Calculated results below (immediate feedback)
- ROAS targets at bottom (final insights)
- Clear visual separation between sections

## Icons
Use Heroicons via CDN:
- Calculator icon for main title
- Currency icon (₺) for financial fields
- Chart-bar for results section
- Target for ROAS metrics
- Information-circle for helper tooltips

**No Images Required**: This is a data-driven calculator tool without need for decorative imagery.