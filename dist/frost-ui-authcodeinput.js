(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@fr0st/ui'), require('@fr0st/query')) :
    typeof define === 'function' && define.amd ? define(['exports', '@fr0st/ui', '@fr0st/query'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UI = global.UI || {}, global.UI, global.fQuery));
})(this, (function (exports, ui, $) { 'use strict';

    /**
     * AuthCodeInput Class
     * @class
     */
    class AuthCodeInput extends ui.BaseComponent {
        /**
         * New AuthCodeInput constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the AuthCodeInput with.
         */
        constructor(node, options) {
            super(node, options);

            this._options.length = $._wrap(this._options.length);

            this._length = this._options.length.reduce((acc, a) => acc + a, 0);

            const maxLength = $.getAttribute(this._node, 'maxlength');
            if (maxLength && this._length > maxLength) {
                this._length = maxLength;
                this._options.length = [this._length];
            }

            this._regExp = new RegExp(this._options.regExp);

            this._render();
            this._events();
            this._refresh();
            this._refreshDisabled();
            this._updateValue();
        }

        /**
         * Clear the AuthCodeInput.
         */
        clear() {
            this.setValue('');
        }

        /**
         * Disable the AuthCodeInput.
         */
        disable() {
            $.setAttribute(this._node, { disabled: true });
            this._refreshDisabled();
        }

        /**
         * Dispose the AuthCodeInput.
         */
        dispose() {
            $.remove(this._container);
            $.removeAttribute(this._node, 'tabindex');
            $.removeEvent(this._node, 'focus.ui.authcodeinput');
            $.removeClass(this._node, this.constructor.classes.hide);

            this._container = null;
            this._inputs = null;

            super.dispose();
        }

        /**
         * Enable the AuthCodeInput.
         */
        enable() {
            $.removeAttribute(this._node, 'disabled');
            this._refreshDisabled();
        }

        /**
         * Get the current value.
         * @return {number} The current value.
         */
        getValue() {
            return $.getValue(this._node);
        }

        /**
         * Set the value.
         * @param {string} value The value.
         */
        setValue(value) {
            $.setValue(this._node, value);
            this._refresh();
        }
    }

    /**
     * Attach events for the AuthCodeInput.
     */
    function _events() {
        $.addEvent(this._node, 'focus.ui.authcodeinput', (_) => {
            const nextInput = this._inputs.find((input) => !$.getValue(input));
            $.focus(nextInput || this._inputs[0]);
        });

        $.addEventDelegate(this._container, 'focusin.ui.authcodeinput', 'input', (e) => {
            const target = e.currentTarget;
            const targetIndex = this._inputs.indexOf(target);
            const lastIndex = this._inputs.findLastIndex((input) => $.getValue(input));

            if (targetIndex > lastIndex + 1 && lastIndex < this._inputs.length) {
                $.focus(this._inputs[lastIndex + 1]);
            } else {
                $.select(target);
            }
        });

        $.addEventDelegate(this._container, 'input.ui.authcodeinput', 'input', (e) => {
            const target = e.currentTarget;
            let value = $.getValue(target);

            if (value && !value.match(this._regExp)) {
                value = '';
                $.setValue(target, value);
            }

            this._updateValue();

            if (!value) {
                return;
            }

            const targetIndex = this._inputs.indexOf(target);

            if (targetIndex < this._inputs.length) {
                $.focus(this._inputs[targetIndex + 1]);
            }
        });

        $.addEventDelegate(this._container, 'keydown.ui.authcodeinput', 'input', (e) => {
            const target = e.currentTarget;
            const targetIndex = this._inputs.indexOf(target);

            switch (e.code) {
                case 'ArrowLeft':
                    if (targetIndex > 0) {
                        $.focus(this._inputs[targetIndex - 1]);
                    }
                    break;
                case 'ArrowRight':
                    if (targetIndex < this._inputs.length) {
                        $.focus(this._inputs[targetIndex + 1]);
                    }
                    break;
                case 'Backspace':
                    if ($.getValue(target)) {
                        $.setValue(target, '');

                        this._updateValue();
                    } else if (targetIndex > 0) {
                        $.setValue(this._inputs[targetIndex - 1], '');
                        $.focus(this._inputs[targetIndex - 1]);
                    }
                    break;
                default:
                    if (e.key.length !== 1 || e.key.match(this._regExp)) {
                        return;
                    }
                    break;
            }

            e.preventDefault();
        });
    }

    /**
     * Refresh the input value.
     */
    function _refresh() {
        const chars = $.getValue(this._node).split('');

        for (const input of this._inputs) {
            let char;

            do {
                char = chars.shift();
            } while (char && !char.match(this._regExp));

            $.setValue(input, char || '');
        }

        this._updateValue();
    }
    /**
     * Refresh the disabled styling.
     */
    function _refreshDisabled() {
        if ($.is(this._node, ':disabled')) {
            $.setAttribute(this._inputs, { disabled: 'true' });
        } else {
            $.removeAttribute(this._inputs, 'disabled');
        }
    }
    /**
     * Update the value.
     */
    function _updateValue() {
        const newValue = this._inputs
            .map((node) => $.getValue(node))
            .join('');

        const lastIndex = this._inputs.findLastIndex((input) => $.getValue(input));

        for (const [index, input] of this._inputs.entries()) {
            if (index && index > lastIndex + 1) {
                $.setAttribute(input, { tabindex: -1 });
            } else {
                $.removeAttribute(input, 'tabindex');
            }
        }

        if (newValue === this.getValue()) {
            return;
        }

        $.setValue(this._node, newValue);

        $.triggerEvent(this._node, 'change.ui.authcodeinput');

        if (this._options.autoSubmit && newValue.length === this._length) {
            const form = $.closest(this._node, 'form').shift();

            if (form) {
                form.requestSubmit();
            }
        }
    }

    /**
     * Render the AuthCodeInput.
     */
    function _render() {
        this._container = $.create('div', {
            class: this.constructor.classes.container,
        });

        this._inputs = [];

        for (const [i, length] of this._options.length.entries()) {
            if (i > 0) {
                const divider = $.create('span', {
                    class: this.constructor.classes.divider,
                });
                $.append(this._container, divider);
            }

            for (let j = 0; j < length; j++) {
                const formInput = $.create('div', {
                    class: this.constructor.classes.inputContainer,
                });

                const input = $.create('input', {
                    class: [
                        `input-${this._options.style}`,
                        this.constructor.classes.input,
                    ],
                    attributes: {
                        'type': 'text',
                        'required': true,
                        'maxlength': 1,
                        'size': 1,
                        'pattern': this._options.regExp,
                        'autocomplete': 'off',
                        'aria-label': this._options.getAriaLabel(i + j + 1),
                    },
                });

                $.append(formInput, input);

                this._inputs.push(input);

                if (this._options.style === 'filled') {
                    const rippleLine = $.create('div', {
                        class: this.constructor.classes.inputRipple,
                    });

                    $.append(formInput, rippleLine);
                }

                $.append(this._container, formInput);
            }
        }

        // hide the input node
        $.addClass(this._node, this.constructor.classes.hide);
        $.setAttribute(this._node, { tabindex: -1 });

        $.before(this._node, this._container);
    }

    // AuthCodeInput default options
    AuthCodeInput.defaults = {
        style: 'outline',
        length: [3, 3],
        regExp: '[0-9]',
        autoSubmit: false,
        getAriaLabel: (i) => `Character ${i}`,
    };

    // AuthCodeInput classes
    AuthCodeInput.classes = {
        container: 'd-flex justify-content-between',
        divider: 'vr align-self-center fs-5',
        hide: 'visually-hidden',
        input: 'fw-bold text-center px-0',
        inputContainer: 'form-input w-auto',
        inputRipple: 'ripple-line',
    };

    // AuthCodeInput prototype
    const proto = AuthCodeInput.prototype;

    proto._events = _events;
    proto._refresh = _refresh;
    proto._refreshDisabled = _refreshDisabled;
    proto._render = _render;
    proto._updateValue = _updateValue;

    // AuthCodeInput init
    ui.initComponent('authcodeinput', AuthCodeInput);

    exports.AuthCodeInput = AuthCodeInput;

}));
//# sourceMappingURL=frost-ui-authcodeinput.js.map
