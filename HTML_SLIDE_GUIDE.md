# HTML Slide Authoring Guide

이 문서는 `index.html` 구조를 그대로 활용하여 새로운 CLI 슬라이드를 작성할 때 필요한 규칙을 정리합니다. Tailwind + DaisyUI 기반 스타일과 기존 자바스크립트 로직에 맞춰 작성하면 자동으로 진행률, 목차, 챗봇이 동작합니다.

## 1. 기본 레이아웃

```html
<div class="container mx-auto px-4 py-8 lg:py-12">
  <header>...</header>
  <div class="lg:hidden">모바일 셀렉트</div>
  <div class="lg:grid lg:grid-cols-[260px_1fr] gap-8">
    <aside>콘텐츠 목차</aside>
    <main class="space-y-12 lg:space-y-14 max-w-5xl mx-auto lg:mx-0">
      <section id="slide-1" class="slide active animate-fade-in">...</section>
      <section id="slide-2" class="slide">...</section>
      <!-- 계속 추가 -->
    </main>
  </div>
</div>
```

- `main` 요소에는 항상 `slide` 클래스를 가진 `<section>`들을 순서대로 배치합니다.
- 첫 슬라이드에는 `active animate-fade-in` 클래스를 추가해 초기 화면으로 표시합니다.
- 새 슬라이드를 추가하면 전체 개수를 반영해 진행률(`style="width: ...%"`)을 수정합니다. 계산식은 `100 / 슬라이드 수`입니다.

## 2. 모바일 셀렉트 & 목차

모바일과 데스크톱 모두 동일한 순서를 유지합니다.

```html
<select class="select select-bordered" onchange="goToSlide(this.selectedIndex)">
  <option>소개</option>
  <option>CLI 개념</option>
  ...
</select>
```

```html
<ul class="menu ...">
  <li><a href="#slide-1" id="sidebar-slide-0">...</a></li>
  <li><a href="#slide-2" id="sidebar-slide-1">...</a></li>
  ...
</ul>
```

- `#slide-n`과 `sidebar-slide-(n-1)`는 반드시 본문 섹션의 ID와 일치해야 합니다.
- 항목 수가 변하면 Select와 Aside 둘 다 동일하게 갱신합니다.

## 3. 슬라이드 카드 패턴

각 슬라이드는 DaisyUI 카드 컴포넌트를 사용합니다.

```html
<section id="slide-n" class="slide">
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body space-y-5">
      <div class="badge badge-primary badge-lg">섹션 태그</div>
      <h2 class="card-title text-4xl lg:text-5xl">제목</h2>
      <p class="text-lg">설명</p>
      <!-- 필요시 grid/alert/mockup-code 등을 추가 -->
    </div>
  </div>
</section>
```

### 코드 블록

- DaisyUI `mockup-code`로 감싸고, 복사 버튼이 자동 생성되므로 `<pre><code>...</code></pre>` 구조만 유지합니다.
- 줄바꿈은 `\n`을 사용합니다. (예: `printf "INFO start\nWARN..."`).

### 알림/배지

- 경고: `<div class="alert alert-warning">...</div>`
- 정보: `<div class="alert alert-info">...</div>`
- 구분 태그: `<div class="badge badge-secondary badge-lg">...</div>`

## 4. 챗봇 연동을 위한 속성

챗봇은 슬라이드 DOM에서 텍스트 정보를 추출합니다.

- 제목: 첫 번째 `<h2>` 텍스트 사용
- 배지: `.card-body` 안의 모든 `.badge` 텍스트를 수집
- 알림: `.alert` 텍스트를 수집
- 리스트: 모든 `<li>` 텍스트를 연결

따라서 슬라이드에 정보를 추가할 때 `<li>`, `<alert>`, `<badge>`를 활용하면 챗봇 응답에 자동 반영됩니다.

## 5. 새 HTML 파일로 복사할 때 체크리스트

1. `<head>`의 스크립트/스타일 링크(`assets/setup.js`, DaisyUI/Tailwind, `assets/styles.css`)를 유지합니다.
2. `themeToggleButton`/`themeMenu`/`currentThemeLabel` 요소를 그대로 복사해 테마 토글 기능을 살립니다.
3. 진행률 바, 모바일 셀렉트, 사이드바, 슬라이드 섹션을 모두 같은 순서로 구성합니다.
4. 하단의 챗봇 모달, API 키 모달, Floating Chat Button, `assets/app.js` 스크립트 포함을 그대로 유지합니다.
5. 슬라이드 수가 바뀌면:
   - 진행률 초기값 변경 (`width: X%`).
   - 모바일 셀렉트 옵션과 사이드바 항목을 업데이트.
   - `assets/app.js`는 슬라이드 개수 변경과 상관없이 자동으로 동작합니다.

이 규칙에 맞춰 HTML을 작성하면 추가적인 CSS/JS 수정 없이 기존 인터랙션을 그대로 활용할 수 있습니다.
