// Chat UI Loader
// This script loads the chat UI HTML template into the page
(function() {
    // Load chat UI HTML
    fetch('../assets/chat-ui.html')
        .then(response => response.text())
        .then(html => {
            const container = document.createElement('div');
            container.innerHTML = html;
            document.body.appendChild(container);
        })
        .catch(error => {
            console.error('Failed to load chat UI:', error);
        });
})();
