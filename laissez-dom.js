import { define } from 'trans-render/define.js';
export class LaissezDOM extends HTMLElement {
    static get is() { return 'laissez-dom'; }
    connectedCallback() {
        Object.assign(this.style, {
            minHeight: '25px',
            display: 'block'
        });
        this.style.minHeight = '25px';
        const ioi = {
            root: this.parentElement,
            rootMargin: '0px',
            threshold: 0.1
        };
        this._observer = new IntersectionObserver(this.callback, ioi);
        this._observer.observe(this);
    }
    callback(entries, observer) {
        console.log({
            entries: entries,
            observer: observer
        });
    }
}
define(LaissezDOM);
