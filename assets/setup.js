'use strict';

(function initializeEnvironment() {
    const OriginalMutationObserver = window.MutationObserver;

    function SafeMutationObserver(callback) {
        const observer = {
            _callback: callback,
            _observing: false,
            observe(target, options) {
                try {
                    if (OriginalMutationObserver) {
                        const realObserver = new OriginalMutationObserver(callback);
                        realObserver.observe(target, options);
                        this._observing = true;
                        this._realObserver = realObserver;
                    }
                } catch (error) {
                    // suppress to prevent noisy console output
                }
            },
            disconnect() {
                if (this._realObserver) {
                    this._realObserver.disconnect();
                }
                this._observing = false;
            },
            takeRecords() {
                return this._realObserver ? this._realObserver.takeRecords() : [];
            }
        };
        return observer;
    }

    if (OriginalMutationObserver && OriginalMutationObserver.prototype) {
        SafeMutationObserver.prototype = Object.create(OriginalMutationObserver.prototype);
        SafeMutationObserver.prototype.constructor = SafeMutationObserver;
    }

    window.MutationObserver = SafeMutationObserver;

    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
        const message = String(args[0] || '');
        if (message.includes('MutationObserver') ||
            message.includes('should not be used in production') ||
            message.includes('index.ts-38bcd7f6.js') ||
            message.includes("Failed to execute 'observe'")) {
            return;
        }
        originalError.apply(console, args);
    };

    console.warn = (...args) => {
        const message = String(args[0] || '');
        if (message.includes('should not be used in production')) {
            return;
        }
        originalWarn.apply(console, args);
    };

    window.addEventListener('error', (event) => {
        if (event.message && (
            event.message.includes('MutationObserver') ||
            event.message.includes('index.ts-38bcd7f6.js') ||
            event.message.includes("Failed to execute 'observe'"))) {
            event.preventDefault();
            event.stopPropagation();
            return true;
        }
        return undefined;
    }, true);

    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason && (
            String(event.reason).includes('MutationObserver') ||
            String(event.reason).includes('observe')))
        {
            event.preventDefault();
            return false;
        }
        return undefined;
    });

    window.tailwind = window.tailwind || {};
    window.tailwind.config = {
        daisyui: {
            themes: [
                {
                    bumblebee: {
                        "primary": "oklch(85% 0.199 91.936)",
                        "primary-focus": "oklch(42% 0.095 57.708)",
                        "primary-content": "oklch(42% 0.095 57.708)",
                        "secondary": "oklch(75% 0.183 55.934)",
                        "secondary-focus": "oklch(40% 0.123 38.172)",
                        "secondary-content": "oklch(40% 0.123 38.172)",
                        "accent": "oklch(0% 0 0)",
                        "accent-focus": "oklch(0% 0 0)",
                        "accent-content": "oklch(100% 0 0)",
                        "neutral": "oklch(37% 0.01 67.558)",
                        "neutral-focus": "oklch(37% 0.01 67.558)",
                        "neutral-content": "oklch(92% 0.003 48.717)",
                        "base-100": "oklch(100% 0 0)",
                        "base-200": "oklch(97% 0 0)",
                        "base-300": "oklch(92% 0 0)",
                        "base-content": "oklch(20% 0 0)",
                        "info": "oklch(74% 0.16 232.661)",
                        "info-focus": "oklch(39% 0.09 240.876)",
                        "info-content": "oklch(39% 0.09 240.876)",
                        "success": "oklch(76% 0.177 163.223)",
                        "success-focus": "oklch(37% 0.077 168.94)",
                        "success-content": "oklch(37% 0.077 168.94)",
                        "warning": "oklch(82% 0.189 84.429)",
                        "warning-focus": "oklch(41% 0.112 45.904)",
                        "warning-content": "oklch(41% 0.112 45.904)",
                        "error": "oklch(70% 0.191 22.216)",
                        "error-focus": "oklch(39% 0.141 25.723)",
                        "error-content": "oklch(39% 0.141 25.723)",
                        "rounded-box": "1rem",
                        "rounded-btn": "0.5rem",
                        "rounded-badge": "1rem",
                        "radius-selector": "1rem",
                        "radius-field": "0.5rem",
                        "radius-box": "1rem",
                        "size-selector": "0.25rem",
                        "size-field": "0.25rem",
                        "border": "1px",
                        "depth": "1",
                        "noise": "0"
                    }
                },
                {
                    black: {
                        "primary": "oklch(35% 0 0)",
                        "primary-focus": "oklch(35% 0 0)",
                        "primary-content": "oklch(100% 0 0)",
                        "secondary": "oklch(35% 0 0)",
                        "secondary-focus": "oklch(35% 0 0)",
                        "secondary-content": "oklch(100% 0 0)",
                        "accent": "oklch(35% 0 0)",
                        "accent-focus": "oklch(35% 0 0)",
                        "accent-content": "oklch(100% 0 0)",
                        "neutral": "oklch(35% 0 0)",
                        "neutral-focus": "oklch(35% 0 0)",
                        "neutral-content": "oklch(100% 0 0)",
                        "base-100": "oklch(0% 0 0)",
                        "base-200": "oklch(19% 0 0)",
                        "base-300": "oklch(22% 0 0)",
                        "base-content": "oklch(87.609% 0 0)",
                        "info": "oklch(45.201% 0.313 264.052)",
                        "info-focus": "oklch(89.04% 0.062 264.052)",
                        "info-content": "oklch(89.04% 0.062 264.052)",
                        "success": "oklch(51.975% 0.176 142.495)",
                        "success-focus": "oklch(90.395% 0.035 142.495)",
                        "success-content": "oklch(90.395% 0.035 142.495)",
                        "warning": "oklch(96.798% 0.211 109.769)",
                        "warning-focus": "oklch(19.359% 0.042 109.769)",
                        "warning-content": "oklch(19.359% 0.042 109.769)",
                        "error": "oklch(62.795% 0.257 29.233)",
                        "error-focus": "oklch(12.559% 0.051 29.233)",
                        "error-content": "oklch(12.559% 0.051 29.233)",
                        "rounded-box": "0rem",
                        "rounded-btn": "0rem",
                        "rounded-badge": "0rem",
                        "radius-selector": "0rem",
                        "radius-field": "0rem",
                        "radius-box": "0rem",
                        "size-selector": "0.25rem",
                        "size-field": "0.25rem",
                        "border": "1px",
                        "depth": "0",
                        "noise": "0"
                    }
                },
                {
                    silk: {
                        "primary": "oklch(23.27% 0.0249 284.3)",
                        "primary-focus": "oklch(23.27% 0.0249 284.3)",
                        "primary-content": "oklch(94.22% 0.2505 117.44)",
                        "secondary": "oklch(23.27% 0.0249 284.3)",
                        "secondary-focus": "oklch(23.27% 0.0249 284.3)",
                        "secondary-content": "oklch(73.92% 0.2135 50.94)",
                        "accent": "oklch(23.27% 0.0249 284.3)",
                        "accent-focus": "oklch(23.27% 0.0249 284.3)",
                        "accent-content": "oklch(88.92% 0.2061 189.9)",
                        "neutral": "oklch(20% 0 0)",
                        "neutral-focus": "oklch(20% 0 0)",
                        "neutral-content": "oklch(80% 0.0081 61.42)",
                        "base-100": "oklch(97% 0.0035 67.78)",
                        "base-200": "oklch(95% 0.0081 61.42)",
                        "base-300": "oklch(90% 0.0081 61.42)",
                        "base-content": "oklch(40% 0.0081 61.42)",
                        "info": "oklch(80.39% 0.1148 241.68)",
                        "info-focus": "oklch(30.39% 0.1148 241.68)",
                        "info-content": "oklch(30.39% 0.1148 241.68)",
                        "success": "oklch(83.92% 0.0901 136.87)",
                        "success-focus": "oklch(23.92% 0.0901 136.87)",
                        "success-content": "oklch(23.92% 0.0901 136.87)",
                        "warning": "oklch(83.92% 0.1085 80)",
                        "warning-focus": "oklch(43.92% 0.1085 80)",
                        "warning-content": "oklch(43.92% 0.1085 80)",
                        "error": "oklch(75.1% 0.1814 22.37)",
                        "error-focus": "oklch(35.1% 0.1814 22.37)",
                        "error-content": "oklch(35.1% 0.1814 22.37)",
                        "rounded-box": "1rem",
                        "rounded-btn": "0.5rem",
                        "rounded-badge": "1rem",
                        "radius-selector": "2rem",
                        "radius-field": "0.5rem",
                        "radius-box": "1rem",
                        "size-selector": "0.25rem",
                        "size-field": "0.25rem",
                        "border": "2px",
                        "depth": "1",
                        "noise": "0"
                    }
                },
                {
                    dark: {
                        "primary": "#8b5cf6",
                        "primary-focus": "#7c3aed",
                        "primary-content": "#ffffff",
                        "secondary": "#06b6d4",
                        "secondary-focus": "#0891b2",
                        "secondary-content": "#ffffff",
                        "accent": "#fbbf24",
                        "accent-focus": "#f59e0b",
                        "accent-content": "#000000",
                        "neutral": "#374151",
                        "neutral-focus": "#1f2937",
                        "neutral-content": "#d1d5db",
                        "base-100": "#1f2937",
                        "base-200": "#111827",
                        "base-300": "#0f172a",
                        "base-content": "#f3f4f6",
                        "info": "#0ea5e9",
                        "success": "#10b981",
                        "warning": "#f59e0b",
                        "error": "#ef4444",
                    }
                }
            ]
        },
        darkTheme: 'dark',
        theme: {
            extend: {
                animation: {
                    'fade-in': 'fadeIn 0.5s ease-in-out',
                    'slide-in': 'slideIn 0.5s ease-out',
                }
            }
        }
    };
})();
