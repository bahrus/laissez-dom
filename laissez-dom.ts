import {define} from 'xtal-element/lib/define.js';
import {getPropDefs} from 'xtal-element/lib/getPropDefs.js';
import {getSlicedPropDefs} from 'xtal-element/lib/getSlicedPropDefs.js';
import {destructPropInfo, ReactiveSurface, PropAction, PropDef} from 'xtal-element/types.d.js';
import {ClonedTemplateCallback, LaissezDOMProps} from './types.js';
import {letThereBeProps} from 'xtal-element/lib/letThereBeProps.js';
import {Reactor} from 'xtal-element/lib/Reactor.js';
import {hydrate} from 'xtal-element/lib/hydrate.js';

const propDefGetter = [
    ({templateClonedCallback}: LaissezDOM) => ({
        type: Object,
        dry: true,
        stopReactionsIfFalsy: true
    }),
    ({clonedTemplate}: LaissezDOM) => ({
        type: Object,
        dry: true,
        stopReactionsIfFalsy: true,
        notify: true,
    }),
    ({noclone}: LaissezDOM) => ({
        type: Boolean,
        dry: true
    }),
    ({isVisible}: LaissezDOM) => ({
        type: Boolean,
        reflect: true,
        dry: true
    }),
    ({threshold}: LaissezDOM) => ({
        type: Number,
        reflect: true,
        dry: true
    })
] as destructPropInfo[];
const propDefs = getPropDefs(propDefGetter);

const linkObserver = ({threshold, self}: LaissezDOM) => {
    if(self.observer !== undefined) self.observer.disconnect();
    const ioi : IntersectionObserverInit = {
        threshold: 0.01
    };
    self.observer = new IntersectionObserver(self.callback.bind(self), ioi);
    self.observer.observe(self);
}
const linkClonedTemplate = ({isVisible, isCloned, toggleDisabled, self}: LaissezDOM) => {
    if(!toggleDisabled && (isCloned || !isVisible)) return;
    if(!isCloned){
        const templ = self.querySelector('template');
        if(templ === null){
            setTimeout(() => linkClonedTemplate(self), 50);
            return;
        }
        
        const clone = templ.content.cloneNode(true);
        self.clonedTemplate = clone as DocumentFragment;
    }else{
        const children = Array.from(self.children);
        if(isVisible){
            for(const child of children){
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
            }
        }else{
            for(const child of children){
                const currVal = child.getAttribute('disabled');
                const isN = isNaN(currVal as any as number);
                let newVal = currVal === null || currVal === '' ? '1' : 
                    isN ? (parseInt(currVal) + 1).toString() : ''
                child.setAttribute('disabled', newVal);
            }
        }
        
    }

}
const appendClone = ({clonedTemplate, templateClonedCallback, toggleDisabled, self}: LaissezDOM) => {
    if(templateClonedCallback !== undefined){
        templateClonedCallback(clonedTemplate!);
    }
    self.appendChild(clonedTemplate!);
    if(!toggleDisabled) self.observer!.disconnect;
    self.isCloned = true;
}
const propActions = [
    linkObserver,
    linkClonedTemplate,
    appendClone
] as PropAction[];
export class LaissezDOM extends HTMLElement implements ReactiveSurface, LaissezDOMProps{
    static is = 'laissez-dom';
    propActions = propActions;
    observer: IntersectionObserver | undefined;
    reactor = new Reactor(this);
    self = this;
    templateClonedCallback: ClonedTemplateCallback | undefined;
    isCloned: boolean | undefined;
    clonedTemplate: DocumentFragment | undefined;
    isVisible: boolean | undefined;
    threshold: number | undefined;
    noclone: boolean | undefined;
    toggleDisabled: boolean | undefined;
    connectedCallback(){
        hydrate<LaissezDOMProps>(this, propDefs, {
            threshold: 0.01
        });
    }
    onPropChange(name: string, prop: PropDef, nv: any){
        this.reactor.addToQueue(prop, nv);
    }
    disconnectedCallback(){
        if(this.observer !== undefined) this.observer.disconnect();
    }
    callback(entries: any, observer: any){
        const first = entries[0];
        if(first.intersectionRatio > 0){
            this.isVisible = true;
            
        }else{
            this.isVisible = false;
            
        }


    }
}
letThereBeProps(LaissezDOM, propDefs, 'onPropChange')
define(LaissezDOM);