<h1>
rollup-plugin-debug <a href="https://npmjs.org/package/rollup-plugin-debug"><img src="https://img.shields.io/badge/npm-v0.2.0-F00.svg?colorA=000"/></a> <a href="src"><img src="https://img.shields.io/badge/loc-185-FFF.svg?colorA=000"/></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-F0B.svg?colorA=000"/></a>
</h1>

<p></p>

Console debug statements that can be pattern toggled at compile time from comments in the code.

<h4>
<table><tr><td title="Triple click to select and copy paste">
<code>npm i rollup-plugin-debug </code>
</td><td title="Triple click to select and copy paste">
<code>pnpm add rollup-plugin-debug </code>
</td><td title="Triple click to select and copy paste">
<code>yarn add rollup-plugin-debug</code>
</td></tr></table>
</h4>

## Examples

<details id="example$web" title="web" open><summary><span><a href="#example$web">#</a></span>  <code><strong>web</strong></code></summary>  <ul>    <details id="source$web" title="web source code" open><summary><span><a href="#source$web">#</a></span>  <code><strong>view source</strong></code></summary>  <a href="example/web.ts">example/web.ts</a>  <p>

```ts
export {}
//!? 'hello world'
const someVar = 123
//!warn 'warning', someVar
//!time 'time'
//!timeEnd 'time'
console.log('sink', someVar)
//!> alert('hello')
```

</p>
</details></ul></details>

## API

<p>  <details id="RollupPluginDebugOptions$5" title="Interface" ><summary><span><a href="#RollupPluginDebugOptions$5">#</a></span>  <code><strong>RollupPluginDebugOptions</strong></code>     &ndash; Plugin options.</summary>  <a href="src/rollup-plugin-debug.ts#L18">src/rollup-plugin-debug.ts#L18</a>  <ul>        <p>  <details id="debugEnvName$9" title="Property" ><summary><span><a href="#debugEnvName$9">#</a></span>  <code><strong>debugEnvName</strong></code>     &ndash; Environment name. Default: <code>ROLLUP_DEBUG</code></summary>  <a href="src/rollup-plugin-debug.ts#L26">src/rollup-plugin-debug.ts#L26</a>  <ul><p>string</p>        </ul></details><details id="debugMatcher$8" title="Property" ><summary><span><a href="#debugMatcher$8">#</a></span>  <code><strong>debugMatcher</strong></code>     &ndash; Debug matcher (overrides Env variable)</summary>  <a href="src/rollup-plugin-debug.ts#L24">src/rollup-plugin-debug.ts#L24</a>  <ul><p>string</p>        </ul></details><details id="exclude$7" title="Property" ><summary><span><a href="#exclude$7">#</a></span>  <code><strong>exclude</strong></code>     &ndash; Exclude patterns.</summary>  <a href="src/rollup-plugin-debug.ts#L22">src/rollup-plugin-debug.ts#L22</a>  <ul><p><code>null</code> | string | <span>RegExp</span> | string | <span>RegExp</span>  []</p>        </ul></details><details id="include$6" title="Property" ><summary><span><a href="#include$6">#</a></span>  <code><strong>include</strong></code>     &ndash; Include patterns.</summary>  <a href="src/rollup-plugin-debug.ts#L20">src/rollup-plugin-debug.ts#L20</a>  <ul><p><code>null</code> | string | <span>RegExp</span> | string | <span>RegExp</span>  []</p>        </ul></details><details id="printId$11" title="Property" ><summary><span><a href="#printId$11">#</a></span>  <code><strong>printId</strong></code>     &ndash; Whether to print colored label ids. Default: true</summary>  <a href="src/rollup-plugin-debug.ts#L30">src/rollup-plugin-debug.ts#L30</a>  <ul><p>boolean</p>        </ul></details><details id="removeIfUnmatched$12" title="Property" ><summary><span><a href="#removeIfUnmatched$12">#</a></span>  <code><strong>removeIfUnmatched</strong></code>     &ndash; Whether to erase the comment completely when not matched. Default: false</summary>  <a href="src/rollup-plugin-debug.ts#L32">src/rollup-plugin-debug.ts#L32</a>  <ul><p>boolean</p>        </ul></details><details id="removeParts$13" title="Property" ><summary><span><a href="#removeParts$13">#</a></span>  <code><strong>removeParts</strong></code>     &ndash; Parts of the label namespace to remove. Default: <code>['lib', 'src', 'dist', 'esm', 'cjs']</code></summary>  <a href="src/rollup-plugin-debug.ts#L34">src/rollup-plugin-debug.ts#L34</a>  <ul><p>string  []</p>        </ul></details><details id="runtimeDebug$10" title="Property" ><summary><span><a href="#runtimeDebug$10">#</a></span>  <code><strong>runtimeDebug</strong></code>     &ndash; Enable runtime <code>localStorage.DEBUG='&lt;regexp&gt;'</code></summary>  <a href="src/rollup-plugin-debug.ts#L28">src/rollup-plugin-debug.ts#L28</a>  <ul><p>boolean</p>        </ul></details><details id="replacer$14" title="Method" ><summary><span><a href="#replacer$14">#</a></span>  <code><strong>replacer</strong></code><em>(payload, kind, id, color)</em>     &ndash; Custom replacer function.</summary>  <a href="src/rollup-plugin-debug.ts#L36">src/rollup-plugin-debug.ts#L36</a>  <ul>    <p>    <details id="payload$16" title="Parameter" ><summary><span><a href="#payload$16">#</a></span>  <code><strong>payload</strong></code>    </summary>    <ul><p>string</p>        </ul></details><details id="kind$17" title="Parameter" ><summary><span><a href="#kind$17">#</a></span>  <code><strong>kind</strong></code>    </summary>    <ul><p><a href="#DebugKind$20">DebugKind</a></p>        </ul></details><details id="id$18" title="Parameter" ><summary><span><a href="#id$18">#</a></span>  <code><strong>id</strong></code>    </summary>    <ul><p>string</p>        </ul></details><details id="color$19" title="Parameter" ><summary><span><a href="#color$19">#</a></span>  <code><strong>color</strong></code>    </summary>    <ul><p>string</p>        </ul></details>  <p><strong>replacer</strong><em>(payload, kind, id, color)</em>  &nbsp;=&gt;  <ul>string</ul></p></p>    </ul></details></p></ul></details>  <details id="DebugKind$20" title="TypeAlias" ><summary><span><a href="#DebugKind$20">#</a></span>  <code><strong>DebugKind</strong></code>    </summary>  <a href="src/rollup-plugin-debug.ts#L39">src/rollup-plugin-debug.ts#L39</a>  <ul><p>keyof     <span>Console</span> | <code>"literal"</code> | <code>"?"</code> | <code>">"</code></p>        </ul></details><details id="default$1" title="Function" open><summary><span><a href="#default$1">#</a></span>  <code><strong>default</strong></code><em>(options)</em>     &ndash; Compile time &quot;debug&quot; plugin for browser builds.</summary>  <a href="src/rollup-plugin-debug.ts#L91">src/rollup-plugin-debug.ts#L91</a>  <ul>    <p>  <p>

Enables the following:

```ts
//!? 'foo', bar
//!warn 'xyz'
//!time 'bench'
//!> if (x) { ... }

// is compiled to:

console.log('foo', bar)
console.warn('xyz')
console.time('bench')
if (x) { ... }
```

Along with colored label ids namespaced to the package name + filename
(excluding specific common parts like `src` or `lib` or `dist`, configurable).

To enable a namespace, or all it is using the same pattern matching as the `debug` package:

`ROLLUP_DEBUG='some-module:*,other:*,-notthis*' npm run build`

Will enable the logs just for these modules. The main difference from the `debug` package,
aside from being compile time rather than runtime, is that in DevTools you get the proper
file/line link as the call sites of `console.*` are in the right place, instead of being
one module deep, which would point you to `debug.js` which was not helpful.

</p>
  <details id="options$3" title="Parameter" ><summary><span><a href="#options$3">#</a></span>  <code><strong>options</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>{}</code></span>   &ndash; RollupPluginDebugOptions</summary>    <ul><p><a href="#RollupPluginDebugOptions$5">RollupPluginDebugOptions</a></p>        </ul></details>  <p><strong>default</strong><em>(options)</em>  &nbsp;=&gt;  <ul><span>Plugin</span></ul></p></p>    </ul></details></p>

## Credits

- [debug](https://npmjs.org/package/debug) by [Josh Junon](https://github.com/debug-js) &ndash; Lightweight debugging utility for Node.js and the browser
- [everyday-utils](https://npmjs.org/package/everyday-utils) by [stagas](https://github.com/stagas) &ndash; Everyday utilities
- [magic-string](https://npmjs.org/package/magic-string) by [Rich Harris](https://github.com/rich-harris) &ndash; Modify strings, generate sourcemaps
- [new-find-package-json](https://npmjs.org/package/new-find-package-json) by [hasezoey](https://github.com/github.com) &ndash; Find the an package.json in the path provided upwards
- [rollup-pluginutils](https://npmjs.org/package/rollup-pluginutils) by [Rich Harris](https://github.com/rollup) &ndash; Functionality commonly needed by Rollup plugins
- [source-map](https://npmjs.org/package/source-map) by [Nick Fitzgerald](https://github.com/mozilla) &ndash; Generates and consumes source maps

## Contributing

[Fork](https://github.com/stagas/rollup-plugin-debug/fork) or [edit](https://github.dev/stagas/rollup-plugin-debug) and submit a PR.

All contributions are welcome!

## License

<a href="LICENSE">MIT</a> &copy; 2022 [stagas](https://github.com/stagas)
