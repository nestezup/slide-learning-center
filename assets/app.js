'use strict';



// Chat modal functions
function toggleChat() {
    const modal = document.getElementById('chatModal');

    if (!modal) return;

    if (modal.classList.contains('hidden')) {
        openChat();
    } else {
        closeChat();
    }
}

function openChat() {
    const modal = document.getElementById('chatModal');
    const card = document.getElementById('chatCard');
    const toggle = document.getElementById('chatToggle');

    if (!modal || !card) return;

    modal.classList.remove('hidden');

    card.classList.remove('slide-in', 'slide-out');
    card.classList.remove('translate-y-full');

    // Update toggle state
    if (toggle) {
        toggle.checked = true;
    }

    updateApiStatus();

    requestAnimationFrame(() => {
        card.classList.add('slide-in');
    });
}

function closeChat() {
    const modal = document.getElementById('chatModal');
    const card = document.getElementById('chatCard');
    const toggle = document.getElementById('chatToggle');

    if (!modal || !card) return;

    card.classList.remove('slide-in');
    card.classList.add('slide-out');

    // Update toggle state
    if (toggle) {
        toggle.checked = false;
    }

    setTimeout(() => {
        modal.classList.add('hidden');
        card.classList.add('translate-y-full');
        card.classList.remove('slide-out');
    }, 300);
}

// Handle chat toggle from sidebar
function handleChatToggle(checkbox) {
    if (checkbox.checked) {
        openChat();
    } else {
        closeChat();
    }
}

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Inject navigation below slides
function injectSlideNavigation() {
    if (totalSlides === 0) return;

    // Check if navigation already exists
    if (document.getElementById('slideNavigation')) return;

    // Find the main content wrapper
    const mainWrapper = document.querySelector('.container.mx-auto.px-4.py-8');
    if (!mainWrapper) return;

    // Create navigation container
    const navContainer = document.createElement('div');
    navContainer.id = 'slideNavigation';
    navContainer.className = 'mt-8';
    navContainer.innerHTML = `
        <div class="lg:grid lg:grid-cols-[260px_1fr] gap-8">
            <div class="hidden lg:block"></div>
            <div class="flex justify-between items-center py-6 max-w-5xl">
                <button id="prevSlideBtn" class="btn btn-outline gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    이전
                </button>
                <div class="text-center">
                    <span class="text-sm text-base-content/60"><span id="currentSlideNumber">1</span> / ${totalSlides}</span>
                </div>
                <button id="nextSlideBtn" class="btn btn-primary gap-2">
                    다음
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Insert after main wrapper
    mainWrapper.appendChild(navContainer);

    // Add click handlers
    document.getElementById('prevSlideBtn').addEventListener('click', () => changeSlide(-1));
    document.getElementById('nextSlideBtn').addEventListener('click', () => changeSlide(1));
}

// Initialize navigation on page load
if (slides.length > 0) {
    injectSlideNavigation();
}

function showSlide(index, { updateHash = true } = {}) {
    if (index < 0 || index >= totalSlides) return;

    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.classList.remove('animate-fade-in');
    });

    const targetSlide = slides[index];
    targetSlide.classList.add('active');
    targetSlide.classList.add('animate-fade-in');

    currentSlide = index;

    // Update progress bar
    const progress = ((index + 1) / totalSlides) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }

    // Update sidebar menu
    for (let i = 0; i < totalSlides; i++) {
        const sidebarItem = document.getElementById(`sidebar-slide-${i}`);
        if (sidebarItem) {
            if (i === index) {
                sidebarItem.classList.add('active');
            } else {
                sidebarItem.classList.remove('active');
            }
        }
    }

    // Update pagination
    updatePagination(index);

    if (updateHash) {
        const newHash = `#slide-${index + 1}`;
        if (window.location.hash !== newHash) {
            history.replaceState(null, '', newHash);
        }
    }

    // Scroll to top of page instead of anchor position
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePagination(index) {
    // Update slide number
    const slideNumber = document.getElementById('currentSlideNumber');
    if (slideNumber) {
        slideNumber.textContent = index + 1;
    }

    // Update button states
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');

    if (prevBtn) {
        if (index === 0) {
            prevBtn.disabled = true;
            prevBtn.classList.add('btn-disabled');
        } else {
            prevBtn.disabled = false;
            prevBtn.classList.remove('btn-disabled');
        }
    }

    if (nextBtn) {
        if (index === totalSlides - 1) {
            nextBtn.disabled = true;
            nextBtn.classList.add('btn-disabled');
        } else {
            nextBtn.disabled = false;
            nextBtn.classList.remove('btn-disabled');
        }
    }
}

function changeSlide(direction) {
    const nextIndex = Math.max(0, Math.min(totalSlides - 1, currentSlide + direction));
    showSlide(nextIndex);
}

function goToSlide(index) {
    showSlide(index);
}

function getSlideIndexFromHash() {
    const match = window.location.hash.match(/^#slide-(\d+)$/);
    if (!match) return null;

    const index = parseInt(match[1], 10) - 1;
    if (Number.isNaN(index) || index < 0 || index >= totalSlides) {
        return null;
    }

    return index;
}

function navigateToHash() {
    const index = getSlideIndexFromHash();
    if (index !== null) {
        showSlide(index, { updateHash: false });
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (themeMenuOpen) {
            closeThemeMenu();
        }
        const modal = document.getElementById('chatModal');
        if (modal && !modal.classList.contains('hidden')) {
            closeChat();
        }
    }
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
});

const DEFAULT_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent';
const DEFAULT_API_MODEL = 'gemini-2.5-flash';

if (window.marked && typeof window.marked.setOptions === 'function') {
    window.marked.setOptions({ breaks: true, gfm: true });
}

const themeDisplayNames = {
    bumblebee: '🐝 Bumblebee',
    silk: '🎨 Silk',
    black: '⚫ Black',
    dark: '🌙 Dark',
    light: '☀️ Light'
};

const themeToggleButton = document.getElementById('themeToggleButton');
const themeMenu = document.getElementById('themeMenu');
let themeMenuOpen = false;

function openThemeMenu() {
    if (!themeMenu || !themeToggleButton) return;
    themeMenu.classList.remove('hidden');
    themeMenuOpen = true;
    themeToggleButton.setAttribute('aria-expanded', 'true');
}

function closeThemeMenu() {
    if (!themeMenu || !themeToggleButton) return;
    themeMenu.classList.add('hidden');
    themeMenuOpen = false;
    themeToggleButton.setAttribute('aria-expanded', 'false');
}

function toggleThemeMenuVisibility() {
    if (themeMenuOpen) {
        closeThemeMenu();
    } else {
        openThemeMenu();
    }
}

function updateThemeLabel(theme) {
    const label = document.getElementById('currentThemeLabel');
    if (!label) return;
    label.textContent = themeDisplayNames[theme] || theme;
}

function getStoredApiSettings() {
    return {
        key: localStorage.getItem('chatApiKey') || '',
        endpoint: localStorage.getItem('chatApiEndpoint') || DEFAULT_API_ENDPOINT,
        model: localStorage.getItem('chatApiModel') || DEFAULT_API_MODEL,
    };
}

function updateApiStatus() {
    const { key } = getStoredApiSettings();
    const isValidated = localStorage.getItem('apiKeyValidated') === 'true';
    const statusText = document.getElementById('apiKeyStatus');
    const button = statusText?.parentElement;
    if (!statusText || !button) return;

    if (key && isValidated) {
        statusText.textContent = '키 설정됨';
        button.classList.remove('btn-ghost', 'btn-warning');
        button.classList.add('btn-primary');
    } else if (key && !isValidated) {
        statusText.textContent = '검증 필요';
        button.classList.remove('btn-primary', 'btn-ghost');
        button.classList.add('btn-warning');
    } else {
        statusText.textContent = '키 미설정';
        button.classList.remove('btn-primary', 'btn-warning');
        button.classList.add('btn-ghost');
    }
}

function openApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    if (!modal) return;

    const { key, endpoint, model } = getStoredApiSettings();

    document.getElementById('apiKeyInput').value = key || '';
    document.getElementById('apiEndpointInput').value = endpoint || '';
    document.getElementById('apiModelInput').value = model || '';

    modal.classList.remove('hidden');
}

function closeApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    if (!modal) return;
    modal.classList.add('hidden');
}

async function validateApiKey(key, endpoint, model) {
    if (!key) return { valid: false, error: 'API 키가 없습니다.' };

    try {
        const apiEndpoint = endpoint || DEFAULT_API_ENDPOINT;
        const apiModel = model || DEFAULT_API_MODEL;
        const url = apiEndpoint.replace('{model}', apiModel);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': key
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: 'test' }]
                }]
            })
        });

        if (response.ok) {
            return { valid: true };
        } else {
            const error = await response.text();
            return { valid: false, error: `API 응답 오류: ${response.status}` };
        }
    } catch (error) {
        return { valid: false, error: `네트워크 오류: ${error.message}` };
    }
}

async function testApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    const endpoint = document.getElementById('apiEndpointInput').value.trim();
    const model = document.getElementById('apiModelInput').value.trim();
    const resultDiv = document.getElementById('apiTestResult');

    if (!key) {
        resultDiv.className = 'alert alert-error text-sm';
        resultDiv.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>API 키를 입력해주세요.</span>
        `;
        resultDiv.classList.remove('hidden');
        return;
    }

    // 테스트 중 표시
    resultDiv.className = 'alert alert-info text-sm';
    resultDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>API 키 테스트 중...</span>
    `;
    resultDiv.classList.remove('hidden');

    const validation = await validateApiKey(key, endpoint, model);

    if (validation.valid) {
        // 검증 성공 시 플래그 저장
        window.apiKeyValidationSuccess = true;

        resultDiv.className = 'alert alert-success text-sm';
        resultDiv.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>✅ API 키가 정상적으로 작동합니다!</span>
        `;
    } else {
        window.apiKeyValidationSuccess = false;

        resultDiv.className = 'alert alert-error text-sm';
        resultDiv.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>❌ ${validation.error}</span>
        `;
    }
}

function saveApiSettings() {
    const key = document.getElementById('apiKeyInput').value.trim();
    const endpoint = document.getElementById('apiEndpointInput').value.trim();
    const model = document.getElementById('apiModelInput').value.trim();

    if (key) {
        localStorage.setItem('chatApiKey', key);
        // 테스트 성공한 경우에만 검증 플래그 저장
        if (window.apiKeyValidationSuccess === true) {
            localStorage.setItem('apiKeyValidated', 'true');
        } else {
            localStorage.setItem('apiKeyValidated', 'false');
        }
    } else {
        localStorage.removeItem('chatApiKey');
        localStorage.removeItem('apiKeyValidated');
    }

    if (endpoint) {
        localStorage.setItem('chatApiEndpoint', endpoint);
    } else {
        localStorage.removeItem('chatApiEndpoint');
    }

    if (model) {
        localStorage.setItem('chatApiModel', model);
    } else {
        localStorage.removeItem('chatApiModel');
    }

    updateApiStatus();
    closeApiKeyModal();

    // 테스트 결과 초기화
    const resultDiv = document.getElementById('apiTestResult');
    if (resultDiv) {
        resultDiv.classList.add('hidden');
    }
    window.apiKeyValidationSuccess = undefined;
}

// Theme toggle function
function setTheme(theme) {
    const body = document.body;

    // Remove all theme classes
    body.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');

    // Apply new theme
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    updateThemeLabel(theme);
}

function applyTheme(theme) {
    setTheme(theme);
    closeThemeMenu();
}

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleThemeMenuVisibility();
    });
}

if (themeMenu) {
    themeMenu.querySelectorAll('[data-theme-option]').forEach((button) => {
        button.addEventListener('click', (event) => {
            const theme = event.currentTarget.getAttribute('data-theme-option');
            if (theme) {
                applyTheme(theme);
            }
        });
    });
}

document.addEventListener('click', (event) => {
    if (!themeMenuOpen) return;
    if (themeMenu && themeMenu.contains(event.target)) return;
    if (themeToggleButton && themeToggleButton.contains(event.target)) return;
    closeThemeMenu();
});

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'bumblebee';
setTheme(savedTheme);
updateApiStatus();

const initialSlideIndex = getSlideIndexFromHash();
if (initialSlideIndex !== null) {
    showSlide(initialSlideIndex, { updateHash: false });
} else {
    showSlide(0);
}

window.addEventListener('hashchange', navigateToHash);

initCodeCopyButtons();

// Chat Bot Functions

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');
    input.value = '';

    // Get current slide content
    const slideContent = getCurrentSlideContent();
    const settings = getStoredApiSettings();

    if (!settings.key) {
        addChatMessage('API 키가 설정되어 있지 않습니다. "API 키" 버튼을 눌러 등록해 주세요.', 'bot');
        openApiKeyModal();
        return;
    }

    try {
        const response = await callChatApi(message, slideContent, settings);
        addChatMessage(response, 'bot');
    } catch (error) {
        console.error('Chat API error', error);
        addChatMessage('API 호출에 실패했습니다. 로컬 응답으로 대체합니다.', 'bot');
        const fallback = generateBotResponse(message, slideContent);
        addChatMessage(fallback, 'bot');
    }
}

async function callChatApi(message, content, settings) {
    const { key, endpoint, model } = settings;
    if (!key) {
        throw new Error('API_KEY_MISSING');
    }

    const effectiveModel = (model || DEFAULT_API_MODEL).trim() || DEFAULT_API_MODEL;
    const baseEndpoint = (endpoint || DEFAULT_API_ENDPOINT).trim() || DEFAULT_API_ENDPOINT;

    let resolvedEndpoint = baseEndpoint.includes('{model}')
        ? baseEndpoint.replace('{model}', effectiveModel)
        : baseEndpoint;

    if (!resolvedEndpoint.includes(':generateContent')) {
        const normalized = resolvedEndpoint.replace(/\/+$/, '');
        resolvedEndpoint = `${normalized}/${effectiveModel}:generateContent`;
    }

    let requestUrl;
    try {
        requestUrl = new URL(resolvedEndpoint);
    } catch (error) {
        throw new Error('INVALID_ENDPOINT');
    }

    if (!requestUrl.searchParams.has('key')) {
        requestUrl.searchParams.set('key', key);
    }

    const systemPrompt = [
        '역할: CLI 워크숍을 함께 진행하는 친절한 설명 도우미입니다.',
        '목표:',
        '1) 전문 용어 대신 쉬운 표현을 사용하고 실제 명령어 예시를 덧붙입니다.',
        '2) 핵심을 단계별로 요약하고, 필요한 경우 주의사항이나 실습 팁을 안내합니다.',
        '3) 답변 마지막에 이해가 되었는지, 추가로 궁금한 점이 있는지 정중히 확인합니다.',
        '4) 슬라이드에 직접적인 정보가 없다면 그 사실을 먼저 알리고, 일반적인 지식 범위에서만 도움을 드립니다. 확실하지 않은 부분은 추측하지 않습니다.'
    ].join('\n');

    const contextDetails = [
        `슬라이드 제목: ${content.title || '제목 없음'}`,
        `표시된 배지: ${content.badges || '없음'}`,
        `알림: ${content.alerts || '없음'}`,
        `주요 항목: ${content.lists || '없음'}`,
        `현재 슬라이드 번호: ${content.slideNumber || '알 수 없음'}`
    ].join('\n');

    const userPrompt = [
        '사용자 질문:',
        message,
        '',
        '참고할 슬라이드 정보:',
        contextDetails
    ].join('\n');

    const body = {
        contents: [
            {
                role: 'user',
                parts: [{ text: userPrompt }]
            }
        ],
        systemInstruction: {
            role: 'system',
            parts: [{ text: systemPrompt }]
        }
    };

    const response = await fetch(requestUrl.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': key
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API_ERROR: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    const text = Array.isArray(parts)
        ? parts.map(part => part?.text || '').join('\n').trim()
        : '';

    if (!text) {
        throw new Error('API_RESPONSE_EMPTY');
    }

    return text;
}

function initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.mockup-code');

    codeBlocks.forEach((block) => {
        if (!block || block.querySelector('.copy-button')) return;

        const codeElement = block.querySelector('code');
        if (!codeElement) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-xs btn-outline copy-button';
        button.textContent = '복사';
        button.setAttribute('aria-label', '코드 복사');

        button.addEventListener('click', async () => {
            const originalLabel = '복사';
            const successLabel = '복사됨!';
            const failureLabel = '복사 실패';
            const textToCopy = codeElement.innerText.replace(/\u00a0/g, ' ');

            const copied = await copyTextToClipboard(textToCopy);

            button.textContent = copied ? successLabel : failureLabel;
            if (copied) {
                button.classList.add('copied');
            }

            setTimeout(() => {
                button.textContent = originalLabel;
                button.classList.remove('copied');
            }, 1800);
        });

        block.appendChild(button);
    });
}

async function copyTextToClipboard(text) {
    if (!text) return false;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.warn('Clipboard API failed, falling back to textarea.', error);
        }
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);

    let succeeded = false;
    try {
        textarea.select();
        succeeded = document.execCommand('copy');
    } catch (error) {
        console.error('Textarea copy fallback failed.', error);
        succeeded = false;
    } finally {
        document.body.removeChild(textarea);
    }

    return succeeded;
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    const isBot = sender !== 'user';

    messageDiv.className = `chat ${isBot ? 'chat-start' : 'chat-end'}`;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `chat-bubble ${isBot ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`;

    if (isBot) {
        let rendered = message;

        if (window.marked) {
            try {
                rendered = window.marked.parse(message, { breaks: true, gfm: true });
            } catch (error) {
                console.warn('Markdown parsing failed, falling back to plain text.', error);
                rendered = message.replace(/\n/g, '<br>');
            }
        } else {
            rendered = message.replace(/\n/g, '<br>');
        }

        if (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
            rendered = window.DOMPurify.sanitize(rendered);
        }

        bubbleDiv.innerHTML = rendered;
    } else {
        bubbleDiv.textContent = message;
    }

    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getCurrentSlideContent() {
    const activeSlide = document.querySelector('.slide.active');
    if (!activeSlide) return '';

    // Extract text content from slide
    const title = activeSlide.querySelector('h2')?.textContent || '';
    const badges = Array.from(activeSlide.querySelectorAll('.badge')).map(b => b.textContent).join(', ');
    const alerts = Array.from(activeSlide.querySelectorAll('.alert')).map(a => a.textContent.trim()).join('\n');
    const lists = Array.from(activeSlide.querySelectorAll('li')).map(li => li.textContent.trim()).join('\n');

    return {
        title,
        badges,
        alerts,
        lists,
        slideNumber: currentSlide + 1
    };
}

function generateBotResponse(message, content) {
    const lowerMessage = message.toLowerCase();
    const contains = (...tokens) => tokens.some(token => lowerMessage.includes(token));

    let reply;

    if (contains('open', '열기', '열어', '브라우저')) {
        reply = 'open 명령은 원하는 앱이나 URL을 즉시 실행할 때 씁니다. 예를 들어 `open -a "Google Chrome"`은 크롬을 열고, `open https://example.com`은 해당 웹 페이지를 바로 띄웁니다.';
    } else if (contains('파일', '폴더', 'mkdir', 'ls', 'mv', 'rm')) {
        reply = 'CLI에서 파일을 다루는 기본 흐름은 위치 확인(pwd), 목록 확인(ls -la), 그리고 mkdir·cp·mv·rm 같은 명령으로 조작하는 것입니다. 이 흐름만 익히면 대부분의 파일 작업을 빠르게 처리할 수 있습니다.';
    } else if (contains('파이프', 'pipe', '|')) {
        reply = '파이프(|)는 앞 명령의 출력을 뒤 명령의 입력으로 넘기는 연결 고리입니다. 예를 들어 `cat log.txt | grep "ERROR"`처럼 연결하면 필요한 줄만 바로 걸러낼 수 있습니다.';
    } else if (contains('리다이렉션', 'redirect', '>', '>>')) {
        reply = '`>`는 새 파일을 만들거나 덮어쓰고, `>>`는 기존 파일 끝에 내용을 이어붙입니다. 예를 들어 `echo "첫 줄" > log.txt`로 파일을 만들고 `echo "둘째 줄" >> log.txt`로 계속 추가할 수 있습니다.';
    } else if (contains('실습', '미션', 'mission')) {
        reply = '실습 미션은 notes/today.md 메모 만들기, app.log에서 WARN/ERROR만 뽑아내기, 그리고 HTML 파일을 만들어 브라우저로 확인하기로 구성되어 있어요. 직접 손으로 따라 하면 CLI 감각이 훨씬 빨리 생깁니다.';
    } else if (contains('치트', 'cheat', '요약')) {
        reply = '치트시트에는 가장 자주 쓰는 명령이 모여 있습니다. `pwd`, `ls -la`, `grep`, `ps aux | grep`, `open` 같은 명령을 정리해 두면 실습 중에 곧바로 참고할 수 있어요.';
    } else if (contains('이유', '왜', 'reason')) {
        reply = '터미널을 쓰는 가장 큰 이유는 반복 작업을 한 줄로 줄이고, 작은 도구들을 파이프로 연결해 다시 쓰기 쉬운 형태로 만들기 때문입니다. 특히 자동화나 서버 작업에서는 CLI가 훨씬 효율적이에요.';
    } else if (contains('다음', 'next', 'claude')) {
        reply = '다음 단계에서는 Claude Code 같은 AI 도구와 CLI를 연결해, 파일 생성·수정·실행을 자연어 명령으로 처리하는 워크플로를 살펴보면 좋아요.';
    } else {
        switch (content.slideNumber) {
            case 1:
                reply = '첫 슬라이드는 이번 세션의 목표를 요약합니다. CLI의 장점을 빠르게 체감하고, 명령을 레고처럼 조합하는 감각을 익히는 것이 핵심이에요.';
                break;
            case 2:
                reply = '두 번째 슬라이드는 CLI의 개념을 정리합니다. GUI보다 반복 작업에 강하고, 명령을 이어 붙여 자동화할 수 있다는 점을 강조하고 있어요.';
                break;
            case 3:
                reply = '세 번째 슬라이드는 `open` 명령으로 앱이나 웹을 즉시 여는 방법을 보여줍니다. 크롬, VS Code, Finder 등을 한 줄로 실행할 수 있어요.';
                break;
            case 4:
                reply = '네 번째 슬라이드는 폴더 만들기(mkdir), 파일 이동/복사(cp, mv), 삭제(rm)처럼 가장 기본적인 파일 조작 흐름을 다룹니다.';
                break;
            case 5:
                reply = '다섯 번째 슬라이드는 리다이렉션과 파이프의 조합을 설명합니다. 출력 결과를 파일에 저장하거나 다음 명령으로 넘기는 패턴을 기억해 두면 좋아요.';
                break;
            case 6:
                reply = '여섯 번째 슬라이드는 짧은 명령을 묶어 새로운 워크플로로 만드는 예시(A~C)를 보여줍니다. 메모 만들기, HTML 생성, 로그 필터링이 좋은 예에요.';
                break;
            case 7:
                reply = '일곱 번째 슬라이드는 3분 데모 순서를 안내합니다. 앱 열기, 파일 생성·열기, 파이프 검색, 자동화 감각 전달 순으로 진행하면 흐름이 매끄럽습니다.';
                break;
            case 8:
                reply = '여덟 번째 슬라이드는 직접 따라 하는 실습 미션입니다. notes/today.md 작성, 로그 요약, HTML 파일 미리보기를 해보면 CLI가 금방 친숙해져요.';
                break;
            case 9:
                reply = '아홉 번째 슬라이드는 “왜 CLI를 쓸까?”에 대한 한 줄 정리와 추가 설명을 제공합니다. 반복 작업을 스크립트로 바꾸는 효율을 강조하고 있어요.';
                break;
            case 10:
                reply = '열 번째 슬라이드는 치트시트입니다. 자주 쓰는 명령을 한눈에 모아 두었으니 실습 중 단축키처럼 활용하면 됩니다.';
                break;
            case 11:
                reply = '마지막 슬라이드는 다음 단계로 Claude Code와 CLI를 연결해 자동화를 확장하자는 메시지를 전합니다.';
                break;
            default:
                reply = '현재 슬라이드에 나온 내용을 바탕으로 도와드릴게요. 궁금한 점을 조금 더 구체적으로 알려주시면 좋겠어요!';
        }
    }

    return `${reply}

이 설명이 이해되셨나요? 더 궁금한 점이 있다면 편하게 말씀해주세요.`;
}
