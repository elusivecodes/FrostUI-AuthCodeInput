import $ from '@fr0st/query';

/**
 * Attach events for the AuthCodeInput.
 */
export function _events() {
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
};
