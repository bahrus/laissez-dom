import {define} from 'trans-render/define.js';
import {RenderContext} from 'trans-render/init.d.js';
export class LaissezDOM extends HTMLElement{
    static get is(){return 'laissez-dom';}

    _observer!: IntersectionObserver;
    _cloned = false;
    connectedCallback(){
        
        const ioi : IntersectionObserverInit = {
            threshold: 0.01
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
    
    callback(entries: any, observer: any){
        const first = entries[0];
        if(first.intersectionRatio > 0){
            if(!this._cloned && !this.hasAttribute('noclone')){
                this._cloned = true;
                window.requestAnimationFrame(() =>{
                    this.initTemplate();
                })
            }
            if(this.hasAttribute('toggle-disabled')){
                Array.from(this.children).forEach(child =>{
                    const currVal = child.getAttribute('disabled');
                    if(currVal === null) return;
                    if(currVal === '' || currVal === '1' || isNaN(currVal as any as number)){
                        child.removeAttribute('disabled');
                    }else{
                        const currValN = parseInt(currVal);
                        if(currValN > 0){
                            child.setAttribute('disabled', (currValN - 1).toString());
                        }else{
                            child.removeAttribute('disabled');
                        }
                    }
                    
                    
                })
            }
            this.removeAttribute('nv');
        }else{
            this.setAttribute('nv', '');
            if(this.hasAttribute('toggle-disabled')){
                Array.from(this.children).forEach(child =>{
                    const currVal = child.getAttribute('disabled');
                    const isN = isNaN(currVal as any as number);
                    let newVal = currVal === null || currVal === '' ? '1' : 
                        isN ? (parseInt(currVal) + 1).toString() : ''
                    child.setAttribute('disabled', newVal);
                })
            }
        }


    }
}
define(LaissezDOM);