# 🗺️ Medsplain Design Blueprint - UI/UX Strategy Map

## Project Overview

**Project:** Medsplain – AI-Powered Medication Information Translator  
**Phase:** MVP Development (Week 5-15)  
**Target:** Launch-ready product with core features and strategic design foundations  
**Team:** 5 members | **Timeline:** 11 weeks

---

## 📊 Design Blueprint: Hierarchical Structure

| Design Area                 | 🎯 Sub-system                 | 🔧 Implementation                               | Priority | Week |
| --------------------------- | ----------------------------- | ----------------------------------------------- | -------- | ---- |
| **🌳 Root: Medsplain MVP**  |                               |                                                 |          |      |
|                             |                               |                                                 |          |      |
| **1. Content Architecture** |                               |                                                 |          |      |
|                             | **1.1 Information Hierarchy** |                                                 |          |      |
|                             |                               | 1.1.1 Progressive Information Disclosure        | 🔴 P0    | 5    |
|                             |                               | 1.1.2 Single-Column Layout Optimization         | 🔴 P0    | 5    |
|                             |                               | 1.1.3 Visual Hierarchy Through Typography       | 🔴 P0    | 5-6  |
|                             |                               | 1.1.4 Icon-Based Navigation Shortcuts           | 🟡 P1    | 6    |
|                             | **1.2 Safety Framework**      |                                                 |          |      |
|                             |                               | 1.2.1 Persistent Disclaimer Banner              | 🔴 P0    | 5    |
|                             |                               | 1.2.2 Critical Warnings Elevation               | 🔴 P0    | 6    |
|                             |                               | 1.2.3 Confirmation for Dangerous Queries        | 🔴 P0    | 7    |
|                             |                               |                                                 |          |      |
| **2. Mobile Experience**    |                               |                                                 |          |      |
|                             | **2.1 Touch Optimization**    |                                                 |          |      |
|                             |                               | 2.1.1 Thumb Zone Optimization                   | 🔴 P0    | 5    |
|                             |                               | 2.1.2 Single-Column Card Layout                 | 🔴 P0    | 5    |
|                             |                               | 2.1.3 Bottom Navigation Bar                     | 🔴 P0    | 6    |
|                             | **2.2 Performance**           |                                                 |          |      |
|                             |                               | 2.2.1 Multi-Stage Progress Indicators           | 🔴 P0    | 6    |
|                             |                               | 2.2.2 Engaging Loading Animations               | 🟡 P1    | 7    |
|                             |                               |                                                 |          |      |
| **3. Design System**        |                               |                                                 |          |      |
|                             | **3.1 Foundation**            |                                                 |          |      |
|                             |                               | 3.1.1 Component Library Foundation              | 🔴 P0    | 5    |
|                             |                               | 3.1.2 Color System Standardization              | 🔴 P0    | 5    |
|                             |                               | 3.1.3 Navigation Consistency                    | 🔴 P0    | 6    |
|                             | **3.2 UI Components**         |                                                 |          |      |
|                             |                               | 3.2.1 Button Component (Primary/Secondary/Text) | 🔴 P0    | 5    |
|                             |                               | 3.2.2 Input Field Component                     | 🔴 P0    | 5    |
|                             |                               | 3.2.3 Card Component                            | 🔴 P0    | 5    |
|                             |                               | 3.2.4 Alert/Warning Component                   | 🔴 P0    | 6    |
|                             |                               | 3.2.5 Loading State Component                   | 🔴 P0    | 6    |
|                             |                               | 3.2.6 Accordion Component                       | 🟡 P1    | 7    |

---

## 🎯 MVP Task Prioritization Matrix

### Week 5: Foundation Sprint

**Focus:** Core design system + basic layout structure

| Task ID | Task Name                           | Pillar | Owner  | Hours | Dependencies |
| ------- | ----------------------------------- | ------ | ------ | ----- | ------------ |
| P4-T1   | Progressive Information Disclosure  | 4      | Giorgi | 8h    | None         |
| P4-T2   | Single-Column Layout Optimization   | 4      | Giorgi | 6h    | None         |
| P4-T3   | Visual Hierarchy Through Typography | 4      | Giorgi | 4h    | None         |
| P16-T1  | Component Library Foundation        | 16     | Giorgi | 12h   | None         |
| P16-T2  | Color System Standardization        | 16     | Giorgi | 6h    | P16-T1       |
| P6-T1   | Thumb Zone Optimization             | 6      | Giorgi | 4h    | P4-T2        |
| P6-T3   | Single-Column Card Layout           | 6      | Giorgi | 6h    | P16-T1       |
| P5-T1   | Persistent Disclaimer Banner        | 5      | Giorgi | 4h    | P16-T1       |

**Total Hours:** 50h | **Team Capacity:** 37h/week  
**Status:** ⚠️ Over capacity - prioritize P4-T1, P4-T2, P16-T1, P16-T2, P5-T1 (32h)

---

### Week 6: Safety & Navigation Sprint

**Focus:** Critical safety features + mobile navigation

| Task ID | Task Name                       | Pillar | Owner  | Hours | Dependencies |
| ------- | ------------------------------- | ------ | ------ | ----- | ------------ |
| P4-T6   | Icon-Based Navigation Shortcuts | 4      | Giorgi | 6h    | P16-T1       |
| P5-T4   | Critical Warnings Elevation     | 5      | Giorgi | 8h    | P16-T1       |
| P6-T4   | Bottom Navigation Bar           | 6      | Giorgi | 6h    | P16-T9       |
| P16-T9  | Navigation Consistency          | 16     | Giorgi | 4h    | P6-T4        |
| P7-T1   | Multi-Stage Progress Indicators | 7      | Giorgi | 10h   | Backend API  |

**Total Hours:** 34h | **Team Capacity:** 37h/week  
**Status:** ✅ On track

---

### Week 7: Loading States & Safety Confirmations

**Focus:** Perceived performance + high-risk query handling

| Task ID | Task Name                          | Pillar | Owner           | Hours | Dependencies        |
| ------- | ---------------------------------- | ------ | --------------- | ----- | ------------------- |
| P7-T5   | Engaging Loading Animations        | 7      | Giorgi          | 8h    | P7-T1               |
| P5-T5   | Confirmation for Dangerous Queries | 5      | Mariam + Giorgi | 10h   | Backend integration |

**Total Hours:** 18h | **Team Capacity:** 37h/week  
**Status:** ✅ Light week (buffer for testing/iteration)

---

## 🔗 Design System Dependencies Map

```
Component Library Foundation (P16-T1) [Week 5]
    ├─→ Color System (P16-T2) [Week 5]
    ├─→ Typography Hierarchy (P4-T3) [Week 5]
    ├─→ Card Layout (P6-T3) [Week 5]
    ├─→ Disclaimer Banner (P5-T1) [Week 5]
    ├─→ Icon Navigation (P4-T6) [Week 6]
    ├─→ Critical Warnings (P5-T4) [Week 6]
    └─→ Loading Animations (P7-T5) [Week 7]

Single-Column Layout (P4-T2) [Week 5]
    ├─→ Thumb Zone Optimization (P6-T1) [Week 5]
    ├─→ Progressive Disclosure (P4-T1) [Week 5]
    └─→ Bottom Nav Bar (P6-T4) [Week 6]

Backend RAG Pipeline Integration [Ongoing]
    ├─→ Multi-Stage Progress (P7-T1) [Week 6]
    └─→ Dangerous Query Confirmation (P5-T5) [Week 7]
```

---

## 📋 Design Task Specifications

### Priority 0 (P0) - Must Have for MVP

#### **P4-T1: Progressive Information Disclosure**

- **Description:** Layered content structure with summary → expandable details
- **Components:** Accordion pattern, "Show More" buttons
- **Technical:** React state management for expand/collapse
- **Design Specs:**
  - Summary: 2-3 sentences, 16px font
  - Expandable sections: "How to Take", "Side Effects", "Warnings"
  - Transition: 200ms ease-in-out
- **Success Metric:** Users can find key info in <10 seconds

#### **P4-T2: Single-Column Layout Optimization**

- **Description:** Vertical scroll, one concept per viewport
- **Technical:** CSS Grid, max-width 640px centered
- **Design Specs:**
  - Container: max-width 640px, margin auto
  - Card spacing: 24px vertical gap
  - No horizontal scroll on any device
- **Success Metric:** 0 horizontal scroll instances in testing

#### **P4-T3: Visual Hierarchy Through Typography**

- **Description:** Clear typographic scale for content structure
- **Technical:** TailwindCSS typography plugin
- **Design Specs:**
  - H1 (Drug Name): 28px, bold, text-blue-900
  - H2 (Section): 20px, semibold, text-gray-900
  - Body: 16px, regular, text-gray-700, line-height 1.6
- **Success Metric:** 90%+ users correctly identify drug name in 2 seconds

#### **P16-T1: Component Library Foundation**

- **Description:** Reusable React components with consistent styling
- **Components to Build:**
  1. Button (Primary, Secondary, Text variants)
  2. Input (Text, Search types)
  3. Card (Default, Elevated variants)
  4. Alert (Warning, Error, Info types)
  5. Loading (Skeleton, Spinner types)
- **Technical:** React + TypeScript + TailwindCSS
- **Documentation:** Storybook (optional) or Figma component page
- **Success Metric:** 5 core components built, documented, reused 3+ times

#### **P16-T2: Color System Standardization**

- **Description:** Semantic color palette for consistent UI
- **Color Palette:**
  ```
  Primary (Action/Trust): #2563EB (blue-600)
  Primary Hover: #1D4ED8 (blue-700)
  Warning: #F59E0B (amber-500)
  Error: #EF4444 (red-500)
  Success: #10B981 (green-500)
  Neutral:
    - Text Primary: #111827 (gray-900)
    - Text Secondary: #6B7280 (gray-500)
    - Border: #E5E7EB (gray-200)
    - Background: #F9FAFB (gray-50)
  ```
- **Technical:** TailwindCSS config extended with semantic aliases
- **Success Metric:** 0 hardcoded hex colors in components (all use semantic classes)

#### **P5-T1: Persistent Disclaimer Banner**

- **Description:** Non-dismissible header with medical advice disclaimer
- **Design Specs:**
  - Background: #FEF3C7 (amber-100)
  - Text: 14px, semibold, #92400E (amber-900)
  - Icon: ⚕️ (16px)
  - Copy: "This is educational information, not medical advice. Always consult your healthcare provider."
  - Position: Sticky top, 48px height mobile, 40px desktop
- **Technical:** Sticky position, z-index 40
- **Success Metric:** Visible on 100% of result pages

#### **P5-T4: Critical Warnings Elevation**

- **Description:** Prominent safety information card at top of results
- **Design Specs:**
  - Card: Light coral background (#FEE2E2, red-100)
  - Border: 2px solid #FCA5A5 (red-300)
  - Padding: 16px
  - Icon: ⚠️ (20px)
  - Heading: "Important Safety Information" (16px, bold)
  - Content: FDA warnings, contraindications, allergy info
  - Position: First card after drug name header
- **Technical:** Conditional rendering based on FDA data presence
- **Success Metric:** 100% of high-risk medications show warnings card

#### **P6-T1: Thumb Zone Optimization**

- **Description:** Primary actions in bottom 2/3 of screen (reachable area)
- **Design Specs:**
  - Safe zone: 0-67% from bottom of viewport
  - Primary CTA buttons: Bottom 40% (420-560px from bottom on iPhone 14)
  - Search button: Bottom nav bar (56px height)
  - Expandable accordions: Middle zone (40-67%)
- **Technical:** CSS positioning, test on 5.5"-6.7" devices
- **Success Metric:** One-handed usability test passes for 80%+ users

#### **P6-T3: Single-Column Card Layout**

- **Description:** Vertical stacked cards, self-contained information units
- **Design Specs:**
  - Card: 100% width (max 640px), 16px padding, 8px border-radius
  - Shadow: 0 1px 3px rgba(0,0,0,0.1)
  - Spacing: 16px gap between cards
  - Min width: 320px (iPhone SE support)
  - Content structure per card: Icon → Heading → Body → Action
- **Technical:** Flexbox column, gap property
- **Success Metric:** All content readable without horizontal scroll

#### **P6-T4: Bottom Navigation Bar**

- **Description:** Sticky mobile navigation with primary app sections
- **Design Specs:**
  - Height: 56px
  - Background: White with top border (1px, gray-200)
  - Items: 4 icons with labels (Home, Search, History, Profile)
  - Icon size: 24px
  - Label: 11px, gray-600
  - Active state: Icon + label in primary blue, 2px top border indicator
  - Position: Fixed bottom, z-index 50
- **Technical:** Fixed positioning, React Router active link detection
- **Success Metric:** Navigation accessible within 1 tap from any screen

#### **P7-T1: Multi-Stage Progress Indicators**

- **Description:** 3-stage loading with informative labels matching RAG pipeline
- **Design Specs:**
  - Progress bar: 4px height, rounded, primary blue fill
  - Stage labels:
    1. "🔍 Searching medical databases..." (0-1s, Pinecone retrieval)
    2. "🤖 Simplifying explanation..." (1-3s, GPT generation)
    3. "✅ Almost ready..." (3-4s, readability scoring)
  - Position: Below search input, above skeleton cards
  - Animation: Smooth fill transition, 300ms ease
- **Technical:** Progress state from backend API events
- **Success Metric:** Users correctly identify processing stage in tests

---

### Priority 1 (P1) - Should Have (Post-MVP)

#### **P4-T6: Icon-Based Navigation Shortcuts**

- **Week:** 6
- **Description:** Quick-access icon bar for common result sections
- **Icons:** 💊 Dosage | ⚠️ Warnings | 🤝 Interactions | 📋 Side Effects
- **Deferred:** Can be added after core navigation is validated

#### **P16-T9: Navigation Consistency**

- **Week:** 6
- **Description:** Standardize navigation patterns across all pages
- **Rules:** Back button always top-left, bottom nav always same position
- **Deferred:** Will formalize after Week 6 user testing feedback

#### **P7-T5: Engaging Loading Animations**

- **Week:** 7
- **Description:** Purposeful animations instead of generic spinners
- **Options:** Pulsing dots, medical icon sequence, data flow visualization
- **Deferred:** Functional progress bar (P7-T1) is sufficient for MVP

#### **P5-T5: Confirmation for Dangerous Queries**

- **Week:** 7
- **Description:** Modal for high-risk medications (warfarin, insulin)
- **Copy:** "This medication requires careful monitoring. Have you discussed this with your doctor?"
- **Buttons:** [Yes, Continue] [Contact Doctor]
- **Deferred:** Requires backend drug risk classification integration

---

## 🎨 Design System Assets

### Color Palette (TailwindCSS Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        medical: {
          primary: "#2563EB", // Actions, links
          warning: "#F59E0B", // Cautions
          danger: "#EF4444", // Critical warnings
          success: "#10B981", // Confirmations
          info: "#3B82F6", // General info
        },
      },
    },
  },
};
```

### Typography Scale

```css
/* Base: 16px */
H1: 1.75rem (28px), font-bold, text-gray-900
H2: 1.25rem (20px), font-semibold, text-gray-900
H3: 1.125rem (18px), font-semibold, text-gray-800
Body: 1rem (16px), font-normal, text-gray-700
Caption: 0.875rem (14px), font-normal, text-gray-500
```

### Spacing Scale

```
Base unit: 4px
xs: 4px   (1 unit)
sm: 8px   (2 units)
md: 16px  (4 units)
lg: 24px  (6 units)
xl: 32px  (8 units)
2xl: 48px (12 units)
```

---

## 📊 Success Metrics Dashboard

### User Experience Metrics

| Metric                   | Target | Measurement      | Current | Week 8 Goal |
| ------------------------ | ------ | ---------------- | ------- | ----------- |
| Task Completion Rate     | >70%   | User testing     | TBD     | >60%        |
| Time to Core Action      | <3 min | Timed testing    | TBD     | <4 min      |
| One-Handed Mobile Use    | >80%   | Observation      | TBD     | >70%        |
| Information Findability  | <10s   | Task completion  | TBD     | <15s        |
| Visual Hierarchy Clarity | >90%   | Recognition test | TBD     | >80%        |

### Design System Metrics

| Metric                   | Target | Current  | Week 7 Goal |
| ------------------------ | ------ | -------- | ----------- |
| Component Reusability    | >80%   | 0%       | >60%        |
| Design Consistency Score | >85%   | TBD      | >70%        |
| Development Velocity     | +30%   | Baseline | +15%        |

---

## 🚀 Implementation Timeline

### Phase 1: Foundation (Week 5)

- ✅ Design system setup (P16-T1, P16-T2)
- ✅ Core layout structure (P4-T2, P6-T3)
- ✅ Typography hierarchy (P4-T3)
- ✅ Safety banner (P5-T1)

### Phase 2: Navigation & Safety (Week 6)

- ✅ Mobile navigation (P6-T4, P16-T9)
- ✅ Critical warnings (P5-T4)
- ✅ Progress indicators (P7-T1)
- ✅ Icon shortcuts (P4-T6)

### Phase 3: Polish & Iteration (Week 7-8)

- ✅ Loading animations (P7-T5)
- ✅ Dangerous query modals (P5-T5)
- ✅ User testing & feedback integration

---

## 👥 Team Alignment

### Design Ownership

- **Primary Designer:** Giorgi Ksovreli (Frontend UX/UI Lead)
- **Design Reviewers:** All team members (weekly reviews)
- **User Testing:** Tekla Cahpidze (Testing Lead) + Giorgi

### Cross-Functional Integration

- **Backend Integration:** Mariam (RAG pipeline) + Saba (Flask API)
- **Component Development:** Giorgi (React components)
- **Testing & QA:** Tekla (Automated + manual testing)

---

## 📚 Design Resources

### Tools & References

- **Component Library:** Lucide React icons (already in stack)
- **UI Framework:** TailwindCSS + shadcn/ui components
- **Prototyping:** Figma (recommended for mockups)
- **Documentation:** Markdown in `/docs/design-system/`

### Accessibility Standards

- WCAG 2.1 AA compliance target
- Color contrast ratio: 4.5:1 minimum for text
- Touch targets: 44x44px minimum
- Focus indicators: 2px blue ring
- Screen reader support: Semantic HTML + ARIA labels

---

**Blueprint Version:** 1.0  
**Created:** October 31, 2025  
**Next Review:** Week 7 (after user testing feedback)  
**Status:** ✅ Ready for Implementation
