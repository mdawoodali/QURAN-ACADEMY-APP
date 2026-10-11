# UI Design Guidelines & Standards

## 1. Global Scrolling
- **Smooth Scrolling:** All screens must use CSS smooth scrolling behavior globally:
  ```css
  html {
    scroll-behavior: smooth;
  }
  ```

## 2. Glassmorphism Design System
To maintain a cohesive, high-fidelity luxury Islamic design aesthetic, all main containers positioned over background images must use the **glassmorphism pattern**:
- **Core CSS Properties:**
  Combine `backdrop-filter: blur(...)` (along with `-webkit-backdrop-filter: blur(...)`) with a semi-transparent background color and subtle border.
- **Predefined Utilities in `globals.css`:**
  - `.glass-container`:
    ```css
    .glass-container {
      background: rgba(3, 29, 22, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15);
    }
    ```
  - `.glass-container-light`:
    ```css
    .glass-container-light {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
    ```

## 3. Interactive Buttons
- Buttons must use native **CSS `:hover` pseudo-classes** with smooth transitions and subtle elevation/lighting shifts:
  - Example: `.welcome-cta-btn:hover`
  - Subtle brightness boost, glowing box shadow, and cubic-bezier timing.
