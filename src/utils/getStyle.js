export default function getStyle(el, prop) {
    if (__SERVER__) {
        return '';
    }

    if (typeof window.getComputedStyle !== 'undefined') {
        return window.getComputedStyle(el, null).getPropertyValue(prop);
    }

    return el.currentStyle[prop];
}
