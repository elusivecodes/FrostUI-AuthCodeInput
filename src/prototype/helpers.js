import $ from '@fr0st/query';

/**
 * Refresh the input value.
 */
export function _refresh() {
    const chars = $.getValue(this._node).split('');

    for (const input of this._inputs) {
        let char = chars.shift();

        while (char && !char.match(this._regExp)) {
            char = chars.shift();
        }

        $.setValue(input, char || '');
    }

    this._updateValue();
};

/**
 * Refresh the disabled styling.
 */
export function _refreshDisabled() {
    if ($.is(this._node, ':disabled')) {
        $.setAttribute(this._inputs, { disabled: 'true' });
    } else {
        $.removeAttribute(this._inputs, 'disabled');
    }
};

/**
 * Update the value.
 */
export function _updateValue() {
    const newValue = this._inputs
        .map((node) => $.getValue(node))
        .join('');

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
};
