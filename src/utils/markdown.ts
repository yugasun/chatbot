import MarkdownIt from 'markdown-it';
import mila from 'markdown-it-link-attributes';
import hljs from 'highlight.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { html } from 'lit';

function highlightBlock(str: string, lang?: string) {
    return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">${'Copy'}</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`;
}

const markdown = new MarkdownIt({
    linkify: true,
    highlight(code: string, language: string) {
        const validLang = !!(language && hljs.getLanguage(language));
        if (validLang) {
            const lang = language ?? '';
            return highlightBlock(
                hljs.highlight(code, { language: lang }).value,
                lang,
            );
        }
        return highlightBlock(hljs.highlightAuto(code).value, '');
    },
});

markdown.use(mila, { attrs: { target: '_blank', rel: 'noopener' } });

export function parse(str: string) {
    return html`${unsafeHTML(markdown.render(str))}`;
}

export { markdown };
