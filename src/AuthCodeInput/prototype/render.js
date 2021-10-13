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
