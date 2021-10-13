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
