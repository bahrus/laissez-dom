<a href="https://nodei.co/npm/laissez-dom/"><img src="https://nodei.co/npm/laissez-dom.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/laissez-dom">

# laissez-dom

laissez-dom allows a template to be instantiated only after it becomes visible.

Use case I.  Loading a large DOM tree, only part of which is visible.  This use case *may* have recently been knee-capped by [content-visibility](https://web.dev/content-visibility/).  However, unless I'm missing something, laissez-dom greatly outperforms content-visibility.  

**NB:**  The claim above was based on failing to consider the impact of downloading content from the server, as well as following the same kind of grouping strategy that laissez-dom does quite naturally, but applied to content-visibility.  So the jury is still out, to put it mildly. 

**Update:** I got better results by grouping with content-visibility, but still doesn't seem to match rendering speed of laissez-dom.

Use case II.  If a lazy-loading solution is in place for lazy-loading dependencies required by a web component, then laissez-dom can be useful for that scenario.

Use case III.  If you are working with DOM elements that can be put into sleep mode via the disabled attribute, laissez-dom will do that as well.

## Syntax:

```html
<laissez-dom>
    <template>
        <my-high-cost-custom-element></my-high-cost-custom-element>
    </template>
</laissez-dom>
```

