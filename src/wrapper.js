/**
 * FrostUI-AuthCodeInput v1.0
 * https://github.com/elusivecodes/FrostUI-AuthCodeInput
 */
(function(global, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory;
    } else {
        factory(global);
    }

})(window, function(window) {
    'use strict';

    if (!window) {
        throw new Error('FrostUI-AuthCodeInput requires a Window.');
    }

    if (!('UI' in window)) {
        throw new Error('FrostUI-AuthCodeInput requires FrostUI.');
    }

    const dom = window.dom;
    const UI = window.UI;

    // {{code}}
});