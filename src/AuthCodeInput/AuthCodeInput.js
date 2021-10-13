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
