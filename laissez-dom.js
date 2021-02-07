import { xc } from 'xtal-element/lib/XtalCore.js';
const linkObserver = ({ threshold, self }) => {
    if (self.observer !== undefined)
        self.observer.disconnect();
    const ioi = {
        threshold: 0.01
    };
    self.observer = new IntersectionObserver(self.callback.bind(self), ioi);
    self.observer.observe(self);
};
const linkClonedTemplate = ({ isVisible, isCloned, toggleDisabled, self }) => {
    if (!toggleDisabled && (isCloned || !isVisible))
        return;
    if (!isCloned) {
        const templ = self.querySelector('template');
        if (templ === null) {
            setTimeout(() => linkClonedTemplate(self), 50);
            return;
        }
        const clone = templ.content.cloneNode(true);
        self.clonedTemplate = clone;
    }
    else {
        const children = Array.from(self.children);
        if (isVisible) {
            for (const child of children) {
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
            }
        }
        else {
            for (const child of children) {
                const currVal = child.getAttribute('disabled');
                const isN = isNaN(currVal);
                let newVal = currVal === null || currVal === '' ? '1' :
                    isN ? (parseInt(currVal) + 1).toString() : '';
                child.setAttribute('disabled', newVal);
            }
        }
    }
};
const appendClone = ({ clonedTemplate, templateClonedCallback, toggleDisabled, self }) => {
    if (templateClonedCallback !== undefined) {
        templateClonedCallback(clonedTemplate);
    }
    self.appendChild(clonedTemplate);
    if (!toggleDisabled)
        self.observer.disconnect;
    self.isCloned = true;
};
const propActions = [
    linkObserver,
    linkClonedTemplate,
    appendClone
];
export class LaissezDOM extends HTMLElement {
    constructor() {
        super(...arguments);
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
        this.self = this;
    }
    connectedCallback() {
        this.style.minHeight = '120px';
        this.style.display = 'block';
        const prev = this.previousElementSibling;
        // if(prev !== null && prev.localName === LaissezDOM.is){
        setTimeout(() => {
            xc.hydrate(this, slicedPropDefs, {
                threshold: 0.01
            });
        }, 100);
        // }else{
        // xc.hydrate<LaissezDOMProps>(this, slicedPropDefs, {
        //     threshold: 0.01
        // });            
        //}
    }
    onPropChange(name, prop, nv) {
        this.reactor.addToQueue(prop, nv);
    }
    disconnectedCallback() {
        if (this.observer !== undefined)
            this.observer.disconnect();
    }
    callback(entries, observer) {
        const first = entries[0];
        if (first.intersectionRatio > 0) {
            this.isVisible = true;
        }
        else {
            this.isVisible = false;
        }
    }
}
LaissezDOM.is = 'laissez-dom';
const propDefMap = {
    templateClonedCallback: {
        type: Object,
        dry: true,
    },
    clonedTemplate: {
        type: Object,
        dry: true,
        stopReactionsIfFalsy: true,
        notify: true,
    },
    noclone: {
        type: Boolean,
        dry: true
    },
    isVisible: {
        type: Boolean,
        reflect: true,
        dry: true
    },
    threshold: {
        type: Number,
        reflect: true,
        dry: true
    }
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(LaissezDOM, slicedPropDefs.propDefs, 'onPropChange');
xc.define(LaissezDOM);
