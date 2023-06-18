import $ from '@fr0st/query';

/**
 * Render the AuthCodeInput.
 */
export function _render() {
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
};
