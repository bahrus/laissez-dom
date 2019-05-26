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
            threshold: 0.5
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
        //const div = document.createElement('div');
        //div.appendChild(templ.content.cloneNode(true));
        templ.remove();
        this.appendChild(templ.content.cloneNode(true));
        //this._div = div;
        //this._cloned = true;
    }
    //_div!: HTMLDivElement
    callback(entries, observer) {
        //console.log(entries);
        //console.log(entries[0].intersectionRatio);
        const first = entries[0];
        if (entries.length > 1) {
            console.log(entries.length);
        }
        if (first.intersectionRatio > 0) {
            if (!this._cloned) {
                this._cloned = true;
                window.requestAnimationFrame(() => {
                    this.cloneTemplate();
                });
            }
        }
        // }else{
        //     this._div.style.display = 'block';
        // }
        // }else if(this._cloned){
        //     this._div.style.display = 'none';
        // }
    }
}
define(LaissezDOM);
