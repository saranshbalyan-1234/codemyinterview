# 🕵️‍♂️ CodeMyInterview

A transparent, always-on-top Electron overlay that lets you:

✅ Take screenshots and send to AI  
✅ Interact with AI responses directly in a floating window  
✅ Stay invisible to screen recording and sharing tools  
✅ Use customizable keyboard shortcuts for full control

---

## 🚀 Features

- **Stealth Mode** (click-through + screen-capture protected)
- **AI Integration**
  - screenshot the window, analyse it and find the solution
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

1. Drag `CodeMyInterview.app` to `/Applications`
2. Run this in Terminal to bypass Gatekeeper:

   ```bash
   xattr -cr /Applications/CodeMyInterview.app
   open /Applications/CodeMyInterview.app

## ⚙️ Developer Setup

```bash
git clone https://github.com/saranshbalyan-1234/codemyinterview.git
cd codemyinterview
npm install
npm start