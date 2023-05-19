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

        const prevInput = this._inputs.find((_, index) => index === targetIndex - 1);

        if (prevInput && !$.getValue(prevInput)) {
            $.focus(prevInput);
            return;
        }

        $.select(target);
    });

    $.addEventDelegate(this._container, 'input.ui.authcodeinput', 'input', (e) => {
        const target = e.currentTarget;
        const value = $.getValue(target);

        if (!value) {
            return;
        }

        if (!value.match(this._regExp)) {
            $.setValue(target, '');
            return;
        }

        this._updateValue();

        const targetIndex = this._inputs.indexOf(target);
        const nextInput = this._inputs.find((input, index) => index > targetIndex || !$.getValue(input));

        if (nextInput) {
            $.focus(nextInput);
        }
    });

    $.addEventDelegate(this._container, 'keydown.ui.authcodeinput', 'input', (e) => {
        const target = e.currentTarget;
        const targetIndex = this._inputs.indexOf(target);

        switch (e.code) {
            case 'ArrowLeft':
                const prevInput = this._inputs.find((_, index) => index === targetIndex - 1);

                if (prevInput) {
                    $.focus(prevInput);
                }
                break;
            case 'ArrowRight':
                const nextInput = this._inputs.find((_, index) => index === targetIndex + 1);

                if (nextInput && $.getValue(target)) {
                    $.focus(nextInput);
                }
                break;
            case 'Backspace':
                if ($.getValue(target)) {
                    $.setValue(target, '');

                    this._updateValue();
                } else {
                    const prevInput = this._inputs.find((_, index) => index === targetIndex - 1);

                    if (prevInput) {
                        $.setValue(prevInput, '');
                        $.focus(prevInput);
                    }
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
