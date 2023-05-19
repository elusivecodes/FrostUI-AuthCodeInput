import { initComponent } from '@fr0st/ui';
import AuthCodeInput from './auth-code-input.js';
import { _events } from './prototype/events.js';
import { _refresh, _refreshDisabled, _updateValue } from './prototype/helpers.js';
import { _render } from './prototype/render.js';

// AuthCodeInput default options
AuthCodeInput.defaults = {
    style: 'outline',
    length: [3, 3],
    regExp: '[0-9]',
    autoSubmit: false,
};

// AuthCodeInput classes
AuthCodeInput.classes = {
    container: 'd-flex justify-content-between',
    divider: 'vr align-self-center fs-5',
    hide: 'visually-hidden',
    input: 'fw-bold text-center px-0',
    inputContainer: 'form-input w-auto',
    inputRipple: 'ripple-line',
};

// AuthCodeInput prototype
const proto = AuthCodeInput.prototype;

proto._events = _events;
proto._refresh = _refresh;
proto._refreshDisabled = _refreshDisabled;
proto._render = _render;
proto._updateValue = _updateValue;

// AuthCodeInput init
initComponent('authcodeinput', AuthCodeInput);

export default AuthCodeInput;
