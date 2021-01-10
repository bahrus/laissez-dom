export type ClonedTemplateCallback = (clone: DocumentFragment | Node | HTMLElement) => void;

export interface LaissezDOMProps extends Partial<HTMLElement>{
    templateClonedCallback?: ClonedTemplateCallback | undefined;
    clonedTemplate?: DocumentFragment | undefined;
    isVisible?: boolean | undefined;
    threshold?: number | undefined;
    noclone?: boolean | undefined;
    toggleDisabled?: boolean | undefined;
}