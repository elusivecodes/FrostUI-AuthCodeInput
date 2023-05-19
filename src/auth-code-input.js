import $ from '@fr0st/query';
import { BaseComponent } from '@fr0st/ui';

/**
 * AuthCodeInput Class
 * @class
 */
export default class AuthCodeInput extends BaseComponent {
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
