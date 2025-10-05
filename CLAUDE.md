# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean-language educational slide presentation about getting comfortable with the command line (CLI). The deck walks through practical macOS terminal workflows—app launching, file management, piping, and short automation recipes—and ends with how those habits extend to AI tooling. Everything lives in a single-page HTML application styled with Tailwind + DaisyUI.

## Technical Stack

- **HTML5**: Single-page application
- **TailwindCSS**: Utility-first CSS framework (via CDN)
- **DaisyUI**: Component library for TailwindCSS (v4.4.24)
- **Vanilla JavaScript**: No framework dependencies
- **Live Server**: For development (configured on port 5502)

## Development Commands

```bash
# Run the application
# Use VS Code Live Server or any static file server
# No build process required

# Alternatively with Python:
python -m http.server 5502
```

## Architecture

### File Structure
```
/Users/nest/Documents/slide_app01/
├── index.html          # Main application file (all code contained here)
└── .vscode/
    └── settings.json   # VS Code Live Server configuration
```

### Key Components

1. **Slide System** (slides 1-11): CLI quick-start content (intro → 개념 → 생활 명령 → 파이프 → 조합 → 실습 → 다음 단계)
2. **Sidebar Navigation**: Sticky outline (desktop) + mobile select for quick slide jumps
3. **Theme System**: 5 DaisyUI themes (Bumblebee, Silk, Black, Dark, Light)
4. **Chat Bot**: Interactive assistant with context-aware responses for each slide
5. **Progress Bar**: Visual indicator of presentation progress
6. **Keyboard Navigation**: Arrow key support for slide navigation

### Slide Content Structure
The presentation covers:
1. CLI 맛보기 소개
2. CLI의 정의와 장점
3. `open` 명령으로 앱·웹 열기
4. 파일·폴더 기본기 (pwd, ls, mkdir, cp, mv, rm)
5. 파이프와 리다이렉션
6. 작은 명령 조합 예시 (메모, HTML, 로그 정리)
7. 3분 데모 시나리오
8. 실습 미션 3가지
9. 왜 CLI를 사용하는가
10. CLI 치트시트
11. 다음 단계 – Claude Code와 연계

## Key Code Patterns

### JavaScript Architecture
- Event-driven programming with DOM manipulation
- `MutationObserver` wrapped in error handling for DOM changes
- Local storage for theme persistence
- Keyword-based chat bot responses that vary by slide

### Theme System
- Themes stored in localStorage as 'theme'
- Supported themes: bumblebee, silk, black, dark, light
- Theme changes trigger DOM update detection

### Navigation
- Previous/Next buttons for slide control
- Keyboard arrow key support
- Sidebar with clickable slide thumbnails
- Progress bar updates automatically

## Important Notes

- **No build process**: Edit `index.html` directly
- **Korean language**: All content is in Korean - maintain language consistency
- **Assets 분리**: UI 스타일(`assets/styles.css`), 앱 로직(`assets/app.js`), 초기 설정(`assets/setup.js`)로 나뉘어 관리
- **Static server required**: Some features may not work with `file://` protocol
- **DaisyUI themes**: When modifying themes, ensure they're in the supported list

## Development Tips

- Test theme switching across all 5 themes
- Verify keyboard navigation works on all slides
- Check chat bot responses are contextually appropriate
- Ensure progress bar updates correctly
- Test responsive design on mobile devices
