import {define} from 'trans-render/define.js';
import {RenderContext} from 'trans-render/init.d.js';
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
        const ioi : IntersectionObserverInit = {
            //root: this.parentElement,
            //rootMargin: '0px',
            threshold: 0.5

        };
        this._observer = new IntersectionObserver(this.callback.bind(this), ioi);
        this._observer.observe(this);
    }

    _renderContexts: RenderContext[] | undefined;
    addRenderContext(rc: RenderContext){
        if(this._renderContexts === undefined) this._renderContexts = [];
        this._renderContexts.push(rc);
    }

    disconnectedCallback(){
        this._observer.disconnect();
    }
    initTemplate(){
        const templ = this.querySelector('template');
        if(templ === null){
            setTimeout(() => this.initTemplate(), 50);
            return;
        }
        //const div = document.createElement('div');
        //div.appendChild(templ.content.cloneNode(true));
        const clone = templ.content.cloneNode(true);

        this.appendChild(clone);
        templ.remove();
        if(this._renderContexts !== undefined){
            this._renderContexts.forEach(rc =>{
                if(rc.init !== undefined){
                    rc.init(this, rc, this);
                }
                
            })
        }
    }
    //_div!: HTMLDivElement
    callback(entries: any, observer: any){
        //console.log(entries);
        //console.log(entries[0].intersectionRatio);
        const first = entries[0];
        if(first.intersectionRatio > 0){
            if(!this._cloned){
                this._cloned = true;
                window.requestAnimationFrame(() =>{
                    this.initTemplate();
                })
            }
            this.removeAttribute('nv');
        }else{
            this.setAttribute('nv', '');
        }


    }
}
define(LaissezDOM);