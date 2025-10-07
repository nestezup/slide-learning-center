// Chat UI Loader
// This script injects the chat UI HTML into the page
(function() {
    const chatHTML = `
<!-- Slide-out Chat Modal -->
<div id="chatModal" class="hidden fixed right-4 bottom-24 z-50">
    <div class="card w-96 bg-base-100 shadow-2xl transform translate-y-full transition-transform duration-300" id="chatCard">
        <div class="card-body p-4">
            <div class="flex justify-between items-center mb-4 gap-3">
                <h3 class="text-lg font-bold">🤖 슬라이드 도우미</h3>
                <div class="flex items-center gap-2">
                    <button onclick="openApiKeyModal()" class="btn btn-sm gap-2 h-9">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <span id="apiKeyStatus">키 미설정</span>
                    </button>
                    <button onclick="closeChat()" class="btn btn-sm btn-circle btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div id="chatMessages" class="h-[24rem] overflow-y-auto mb-4 space-y-2 bg-base-200 rounded-lg p-4">
                <div class="chat chat-start">
                    <div class="chat-bubble">
                        안녕하세요! 현재 슬라이드에 대해 궁금한 점을 물어보세요.
                    </div>
                </div>
            </div>

            <div class="form-control">
                <div class="flex gap-2">
                    <input type="text" id="chatInput" placeholder="질문을 입력하세요..." class="input input-bordered flex-1" onkeypress="handleChatKeyPress(event)">
                    <button class="btn btn-primary" onclick="sendChatMessage()">
                        보내기
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- API Key Modal -->
<div id="apiKeyModal" class="hidden fixed inset-0 z-[70] bg-[#0a0d14]/90 backdrop-blur-md flex items-center justify-center p-4">
    <div class="modal-card w-full max-w-md rounded-2xl shadow-2xl">
        <div class="p-6 space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold">API 키 설정</h3>
                <button onclick="closeApiKeyModal()" class="btn btn-sm btn-circle btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <p class="text-sm text-base-content/70">입력한 API 키는 브라우저의 <code>localStorage</code>에만 저장되며 서버로 전송되지 않습니다. 공개 키는 사용하지 마세요.</p>

            <label class="form-control">
                <span class="label-text">API Key</span>
                <input type="password" id="apiKeyInput" class="input input-bordered" placeholder="sk-..." autocomplete="off">
            </label>

            <label class="form-control">
                <span class="label-text">API Endpoint (선택)</span>
                <input type="text" id="apiEndpointInput" class="input input-bordered" placeholder="https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent">
            </label>

            <label class="form-control">
                <span class="label-text">모델 (선택)</span>
                <input type="text" id="apiModelInput" class="input input-bordered" placeholder="gemini-2.5-flash">
            </label>

            <!-- 테스트 버튼 -->
            <div class="flex gap-2">
                <button class="btn btn-outline btn-secondary flex-1" onclick="testApiKey()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    API 키 테스트
                </button>
            </div>

            <!-- 테스트 결과 표시 -->
            <div id="apiTestResult" class="hidden"></div>

            <div class="alert alert-warning text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 5c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>브라우저에서 직접 호출하므로 CORS 또는 요금 문제를 확인하세요.</span>
            </div>

            <div class="flex justify-end gap-2 pt-2">
                <button class="btn btn-ghost" onclick="closeApiKeyModal()">취소</button>
                <button class="btn btn-primary" onclick="saveApiSettings()">저장</button>
            </div>
        </div>
    </div>
</div>

`;

    // Inject chat UI when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.insertAdjacentHTML('beforeend', chatHTML);
            injectChatToggle();
        });
    } else {
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        injectChatToggle();
    }

    // Inject chat toggle into sidebar and mobile
    function injectChatToggle() {
        // Desktop: sidebar toggle
        const sidebar = document.querySelector('aside .sticky');
        if (sidebar) {
            const toggleHTML = `
                <div class="divider my-4"></div>
                <div class="form-control px-2 py-2 hover:bg-base-200 rounded-lg transition-colors">
                    <label class="label cursor-pointer">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span class="label-text">AI 도우미</span>
                        </div>
                        <input type="checkbox" id="chatToggle" class="toggle toggle-primary" onchange="handleChatToggle(this)" />
                    </label>
                </div>
            `;
            sidebar.insertAdjacentHTML('beforeend', toggleHTML);
        }

        // Mobile: floating button
        const mobileToggleHTML = `
            <div class="lg:hidden fixed bottom-24 right-4 z-40">
                <button class="btn btn-primary btn-circle btn-lg shadow-lg" onclick="toggleChat()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', mobileToggleHTML);
    }
})();
