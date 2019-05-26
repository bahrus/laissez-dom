import {define} from 'trans-render/define.js';
export class LaissezDOM extends HTMLElement{
    static get is(){return 'laissez-dom';}

    _observer!: IntersectionObserver;
    _cloned = false;
    connectedCallback(){
        // Object.assign(this.style, {
        //     minHeight: '25px',
        //     display: 'block'

        // } as CSSStyleDeclaration);
        //this.style.minHeight = '25px';
        // const ioi : IntersectionObserverInit = {
        //     root: this.parentElement,
        //     rootMargin: '0px',
        //     threshold: 0.1

        // };
        this._observer = new IntersectionObserver(this.callback.bind(this));
        this._observer.observe(this);
    }

    disconnectedCallback(){
        this._observer.disconnect();
    }
    cloneTemplate(){
        const templ = this.querySelector('template');
        if(templ === null){
            setTimeout(() => this.cloneTemplate(), 50);
            return;
        }
        this.appendChild(templ.content.cloneNode(true));
        templ.remove();
        //this._cloned = true;
    }

    callback(entries: any, observer: any){
        //console.log(entries);
        console.log(entries[0].intersectionRatio);
        const first = entries[0];
        if(first.intersectionRatio > 0){
            if(!this._cloned){
                this._cloned = true;
                window.requestAnimationFrame(() =>{
                    this.cloneTemplate();
                })
            }else{

            }
        }else if(this._cloned){
            // Array.from(this.children).forEach(child => {
            //     (child as HTMLElement).style.display = 'none';
            // });
        }


    }
}
define(LaissezDOM);