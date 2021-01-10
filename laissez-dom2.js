import { define } from 'xtal-element/lib/define.js';
import { getPropDefs } from 'xtal-element/lib/getPropDefs.js';
import { letThereBeProps } from 'xtal-element/lib/letThereBeProps.js';
import { Reactor } from 'xtal-element/lib/Reactor.js';
import { hydrate } from 'xtal-element/lib/hydrate.js';
const propDefGetter = [
    ({ templateClonedCallback }) => ({
        type: Object,
        dry: true,
        stopReactionsIfFalsy: true
    }),
    ({ clonedTemplate }) => ({
        type: Object,
        dry: true,
        stopReactionsIfFalsy: true,
        notify: true,
    }),
    ({ noclone }) => ({
        type: Boolean,
        dry: true
    }),
    ({ isVisible }) => ({
        type: Boolean,
        reflect: true,
        dry: true
    })
];
const propDefs = getPropDefs(propDefGetter);
const linkObserver = ({ threshold, self }) => {
    if (self.observer !== undefined)
        self.observer.disconnect();
    const ioi = {
        threshold: 0.01
    };
    self.observer = new IntersectionObserver(self.callback.bind(this), ioi);
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
    }
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
            this.reactor = new Reactor(this);
            this.self = this;
        }
        connectedCallback() {
            hydrate(this, propDefs, {
                threshold: 0.01
            });
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
    LaissezDOM.is = 'laissez-dom';
    letThereBeProps(LaissezDOM, propDefs);
    define(LaissezDOM);
};
