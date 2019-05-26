import { define } from 'trans-render/define.js';
export class LaissezDOM extends HTMLElement {
    constructor() {
        super(...arguments);
        this._cloned = false;
    }
    static get is() { return 'laissez-dom'; }
    connectedCallback() {
        // Object.assign(this.style, {
        //     minHeight: '25px',
        //     display: 'block'
        // } as CSSStyleDeclaration);
        this.style.minHeight = '25px';
        const ioi = {
            root: this.parentElement,
            rootMargin: '0px',
            threshold: 0.1
        };
        this._observer = new IntersectionObserver(this.callback.bind(this), ioi);
        this._observer.observe(this);
    }
    disconnectedCallback() {
        this._observer.disconnect();
    }
    cloneTemplate() {
        const templ = this.querySelector('template');
        if (templ === null) {
            setTimeout(() => this.cloneTemplate(), 50);
            return;
        }
        this.appendChild(templ.content.cloneNode(true));
        templ.remove();
        //this._cloned = true;
    }
    callback(entries, observer) {
        if (!this._cloned) {
            this._cloned = true;
            window.requestAnimationFrame(() => {
                this.cloneTemplate();
            });
        }
        console.log({
            this: this,
            entries: entries,
            observer: observer
        });
    }
}
define(LaissezDOM);
