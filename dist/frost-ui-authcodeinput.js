/**
 * FrostUI-AuthCodeInput v1.0
 * https://github.com/elusivecodes/FrostUI-AuthCodeInput
 */
(function(global, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory;
    } else {
        factory(global);
    }

})(window, function(window) {
    'use strict';

    if (!window) {
        throw new Error('FrostUI-AuthCodeInput requires a Window.');
    }

    if (!('UI' in window)) {
        throw new Error('FrostUI-AuthCodeInput requires FrostUI.');
    }

    const dom = window.dom;
    const UI = window.UI;

    /**
     * AuthCodeInput Class
     * @class
     */
    class AuthCodeInput extends UI.BaseComponent {

        /**
         * New AuthCodeInput constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [settings] The options to create the AuthCodeInput with.
         * @returns {AuthCodeInput} A new AuthCodeInput object.
         */
        constructor(node, settings) {
            super(node, settings);

            if (dom.hasAttribute(this._node, 'maxlength')) {
                this._settings.length = dom.getAttribute(this._node, 'maxlength');
            }

            this._settings.length = Core.wrap(this._settings.length);
            this._length = this._settings.length.reduce((acc, a) => acc + a, 0);

            this._regExp = new RegExp(this._settings.regExp);

            this._render();
            this._events();
            this._refreshDisabled();
        }

        /**
         * Disable the AuthCodeInput.
         * @returns {AuthCodeInput} The AuthCodeInput.
         */
        disable() {
            dom.setAttribute(this._node, 'disabled', true);
            this._refreshDisabled();

            return this;
        }

        /**
         * Dispose the AuthCodeInput.
         */
        dispose() {
            dom.remove(this._container);
            dom.removeAttribute(this._node, 'tabindex');
            dom.removeEvent(this._node, 'focus.ui.authcodeinput');
            dom.removeClass(this._node, this.constructor.classes.hide);

            this._container = null;
            this._inputs = null;

            super.dispose();
        }

        /**
         * Enable the AuthCodeInput.
         * @returns {AuthCodeInput} The AuthCodeInput.
         */
        enable() {
            dom.removeAttribute(this._node, 'disabled');
            this._refreshDisabled();

            return this;
        }

        /**
         * Get the current value.
         * @returns {number} The current value.
         */
        getValue() {
            return dom.getValue(this._node);
        }

    }


    /**
     * AuthCodeInput Events
     */

    Object.assign(AuthCodeInput.prototype, {

        /**
         * Attach events for the AuthCodeInput.
         */
        _events() {
            dom.addEvent(this._node, 'focus.ui.authcodeinput', _ => {
                const nextInput = this._inputs.find(input => !dom.getValue(input));
                dom.focus(nextInput || this._inputs[0]);
            });

            dom.addEventDelegate(this._container, 'focusin.ui.authcodeinput', 'input', e => {
                dom.select(e.currentTarget);
            });

            dom.addEventDelegate(this._container, 'keydown.ui.authcodeinput', 'input', e => {
                if (e.key.length === 1) {
                    if (!e.key.match(this._regExp)) {
                        e.preventDefault();
                    }

                    return;
                }

                const target = e.currentTarget;

                switch (e.code) {
                    case 'ArrowLeft':
                        const prev = dom.prevAll(target, 'input').pop();
                        dom.focus(prev);
                        break;
                    case 'ArrowRight':
                        const next = dom.nextAll(target, 'input').shift();
                        dom.focus(next);
                        break;
                    case 'Backspace':
                        if (dom.getValue(target)) {
                            dom.setValue(target, '');

                            this._updateValue();
                        } else {
                            const prev = dom.prevAll(target, 'input').pop();
                            dom.focus(prev);
                        }
                        break;
                    default:
                        return;
                }

                e.preventDefault();
            });

            dom.addEventDelegate(this._container, 'keyup.ui.authcodeinput', 'input', e => {
                const target = e.currentTarget;

                if (e.key.length === 1 && e.key.match(this._regExp) && dom.getValue(target)) {
                    this._updateValue();

                    const next = dom.nextAll(target, 'input').shift();
                    dom.focus(next);
                }
            });
        }

    });


    /**
     * AuthCodeInput Helpers
     */

    Object.assign(AuthCodeInput.prototype, {

        /**
         * Refresh the disabled styling.
         */
        _refreshDisabled() {
            if (dom.is(this._node, ':disabled')) {
                dom.setAttribute(this._inputs, 'disabled', true);
            } else {
                dom.removeAttribute(this._inputs, 'disabled');
            }
        },

        /**
         * Update the value.
         */
        _updateValue() {
            const value = this._inputs
                .map(node => dom.getValue(node))
                .join('');

            if (value === this.getValue()) {
                return;
            }

            dom.setValue(this._node, value);
            dom.triggerEvent(this._node, 'change.ui.authcodeinput');

            if (this._settings.autoSubmit && value.length === this._length) {
                const form = dom.closest(this._node, 'form').shift();

                if (form) {
                    form.requestSubmit();
                }
            }
        }

    });


    /**
     * AuthCodeInput Render
     */

    Object.assign(AuthCodeInput.prototype, {

        /**
         * Render the AuthCodeInput.
         */
        _render() {
            this._container = dom.create('div', {
                class: this.constructor.classes.container
            });

            this._inputs = [];

            for (const [i, length] of this._settings.length.entries()) {
                if (i > 0) {
                    const divider = dom.create('span', {
                        class: this.constructor.classes.divider
                    });
                    dom.append(this._container, divider);
                }

                for (let j = 0; j < length; j++) {
                    const input = dom.create('input', {
                        class: this.constructor.classes.input,
                        attributes: {
                            type: 'text',
                            required: true,
                            maxlength: 1,
                            size: 1,
                            pattern: this._settings.regExp
                        }
                    });

                    this._inputs.push(input);
                    dom.append(this._container, input);
                }
            }

            // hide the input node
            dom.addClass(this._node, this.constructor.classes.hide);
            dom.setAttribute(this._node, 'tabindex', -1);

            dom.before(this._node, this._container);
        }

    });


    // AuthCodeInput default options
    AuthCodeInput.defaults = {
        length: [3, 3],
        regExp: '[0-9]',
        autoSubmit: false
    };

    // AuthCodeInput classes
    AuthCodeInput.classes = {
        container: 'd-flex justify-content-between',
        divider: 'vr align-self-center fs-5',
        hide: 'visually-hidden',
        input: 'input-outline fw-bold w-auto px-0 text-center'
    };

    UI.initComponent('authcodeinput', AuthCodeInput);

    UI.AuthCodeInput = AuthCodeInput;

});