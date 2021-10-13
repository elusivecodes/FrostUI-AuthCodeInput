// AuthCodeInput default options
AuthCodeInput.defaults = {
    length: [3, 3],
    regExp: '[0-9]',
    autoSubmit: false
};

// AuthCodeInput classes
AuthCodeInput.classes = {
    container: 'd-flex justify-content-between',
    divider: 'vr align-self-center fs-5',
    hide: 'visually-hidden',
    input: 'input-outline fw-bold w-auto px-0 text-center'
};

UI.initComponent('authcodeinput', AuthCodeInput);

UI.AuthCodeInput = AuthCodeInput;
