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
        //this.style.minHeight = '25px';
        const ioi = {
            //root: this.parentElement,
            //rootMargin: '0px',
            threshold: 0.01
        };
        this._observer = new IntersectionObserver(this.callback.bind(this), ioi);
        this._observer.observe(this);
    }
    addRenderContext(rc) {
        if (this._renderContexts === undefined)
            this._renderContexts = [];
        this._renderContexts.push(rc);
    }
    disconnectedCallback() {
        this._observer.disconnect();
    }
    initTemplate() {
        const templ = this.querySelector('template');
        if (templ === null) {
            setTimeout(() => this.initTemplate(), 50);
            return;
        }
        //const div = document.createElement('div');
        //div.appendChild(templ.content.cloneNode(true));
        const clone = templ.content.cloneNode(true);
        this.appendChild(clone);
        templ.remove();
        if (this._renderContexts !== undefined) {
            this._renderContexts.forEach(rc => {
                if (rc.init !== undefined) {
                    rc.init(this, rc, this);
                }
            });
        }
    }
    callback(entries, observer) {
        //console.log(entries);
        //console.log(entries[0].intersectionRatio);
        const first = entries[0];
        if (first.intersectionRatio > 0) {
            if (!this._cloned && !this.hasAttribute('noclone')) {
                this._cloned = true;
                window.requestAnimationFrame(() => {
                    this.initTemplate();
                });
            }
            if (this.hasAttribute('toggle-disabled')) {
                Array.from(this.children).forEach(child => {
                    const currVal = child.getAttribute('disabled');
                    if (currVal === null)
                        return;
                    if (currVal === '' || currVal === '1' || isNaN(currVal)) {
                        child.removeAttribute('disabled');
                    }
                    else {
                        const currValN = parseInt(currVal);
                        if (currValN > 0) {
                            child.setAttribute('disabled', (currValN - 1).toString());
                        }
                        else {
                            child.removeAttribute('disabled');
                        }
                    }
                });
            }
            this.removeAttribute('nv');
        }
        else {
            this.setAttribute('nv', '');
            if (this.hasAttribute('toggle-disabled')) {
                Array.from(this.children).forEach(child => {
                    const currVal = child.getAttribute('disabled');
                    const isN = isNaN(currVal);
                    let newVal = currVal === null || currVal === '' ? '1' :
                        isN ? (parseInt(currVal) + 1).toString() : '';
                    child.setAttribute('disabled', newVal);
                });
            }
        }
    }
}
define(LaissezDOM);
