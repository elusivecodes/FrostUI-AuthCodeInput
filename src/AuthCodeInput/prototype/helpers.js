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
