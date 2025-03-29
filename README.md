# 🕵️‍♂️ CodeMyInterview

A transparent, always-on-top Electron overlay that lets you:

✅ Take screenshots and send to AI  
✅ Interact with AI responses directly in a floating window  
✅ Stay invisible to screen recording and sharing tools  
✅ Use customizable keyboard shortcuts for full control

---

## 🚀 Features

- **Stealth Mode** (click-through + screen-capture protected)
- **OpenAI Integration**
  - GPT-4 Vision for screenshots
- **Always on Top Overlay**
  - Transparent
  - No dock/taskbar icon
- **Hotkey Controls**
- **Mac, Windows, and Linux builds**

---

## 🧠 Keyboard Shortcuts

| Shortcut        | Action                           |
|----------------|----------------------------------|
| ⌘ + 0          | Quit the app                     |
| ⌘ + 1          | Take a screenshot & ask AI  |
| ⌘ + 8 / ⌘ + 9  | Scroll AI response up/down       |
| ⌘ + Arrows     | Move window around screen        |

---

## 🛠 Installation

### macOS (after extracting `.dmg`)

1. Drag `StealthOverlay.app` to `/Applications`
2. Run this in Terminal to bypass Gatekeeper:

   ```bash
   xattr -cr /Applications/StealthOverlay.app
   open /Applications/StealthOverlay.app

## ⚙️ Developer Setup

### 1. Clone and Install

```bash
git clone https://github.com/your-org/stealth-overlay.git
cd stealth-overlay
npm install