import Debug from 'debug'
import { colorHash } from 'everyday-utils'
import fs from 'fs/promises'
import MagicString from 'magic-string'
import { findAsync as findPackageJson } from 'new-find-package-json'
import path from 'path'
import type { Plugin } from 'rollup'
import { CreateFilter, createFilter } from 'rollup-pluginutils'
import { SourceMapConsumer } from 'source-map'
import { matchNamespace } from './match-namespace'

const log = Debug('rollup-plugin-debug')
const coloredKinds = ['debug', 'info', 'log', 'warn', 'error', 'time', 'timeLog', 'timeEnd']

/**
 * Plugin options.
 */
export interface RollupPluginDebugOptions {
  /** Include patterns. */
  include?: Parameters<CreateFilter>[0]
  /** Exclude patterns. */
  exclude?: Parameters<CreateFilter>[1]
  /** Debug matcher (overrides Env variable) */
  debugMatcher?: string
  /** Environment name. Default: `ROLLUP_DEBUG` */
  debugEnvName?: string
  /** Enable runtime `localStorage.DEBUG='<regexp>'` */
  runtimeDebug?: boolean
  /** Whether to print colored label ids. Default: true */
  printId?: boolean
  /** Whether to erase the comment completely when not matched. Default: false */
  removeIfUnmatched?: boolean
  /** Parts of the label namespace to remove. Default: `['lib', 'src', 'dist', 'esm', 'cjs']` */
  removeParts?: string[]
  /** Custom replacer function. */
  replacer?: (payload: string, kind: DebugKind, id: string, color: string) => string
}

export type DebugKind = keyof Console | 'literal' | '?' | '>'

interface DebugExecResult {
  id: string | undefined
  start: number
  end: number
  kind: DebugKind
  payload: string
}

interface DebugExecOutput extends RegExpExecArray {
  groups: {
    kind: DebugKind
    payload: string
    replace: string
  }
}

/**
 * Compile time "debug" plugin for browser builds.
 *
 * Enables the following:
 *
 * ```ts
 * //!? 'foo', bar
 * //!warn 'xyz'
 * //!time 'bench'
 * //!> if (x) { ... }
 *
 * // is compiled to:
 *
 * console.log('foo', bar)
 * console.warn('xyz')
 * console.time('bench')
 * if (x) { ... }
 * ```
 *
 * Along with colored label ids namespaced to the package name + filename
 * (excluding specific common parts like `src` or `lib` or `dist`, configurable).
 *
 * To enable a namespace, or all it is using the same pattern matching as the `debug` package:
 *
 * `ROLLUP_DEBUG='some-module:*,other:*,-notthis*' npm run build`
 *
 * Will enable the logs just for these modules. The main difference from the `debug` package,
 * aside from being compile time rather than runtime, is that in DevTools you get the proper
 * file/line link as the call sites of `console.*` are in the right place, instead of being
 * one module deep, which would point you to `debug.js` which was not helpful.
 *
 * @param options RollupPluginDebugOptions
 * @returns
 */
export default function debug(options: RollupPluginDebugOptions = {}): Plugin {
  options.removeParts ??= ['lib', 'src', 'dist', 'esm', 'cjs']

  let exclude: Parameters<CreateFilter>[1] = [/\/@virtual.*/]
  if (Array.isArray(options.exclude)) exclude = [...exclude, ...options.exclude]
  else if (typeof options.exclude === 'string' || options.exclude instanceof RegExp) exclude.push(options.exclude)
  const filter = createFilter(options.include, exclude)
  log('excluding', exclude)

  const debugEnvName = options.debugEnvName ?? 'ROLLUP_DEBUG'

  const debugMatcher = options.debugMatcher?.trim() || process.env[debugEnvName]

  const replacer = options.replacer ??= (payload, kind, id, color) => {
    const [r, g, b] = color.split('').map(x => parseInt(x + x, 16))
    if (kind === 'literal') {
      return payload.trim()
    } else {
      const startsWithString = '\'"`'.split('').includes(payload.trim()[0])
      const label = `\\x1B[38;2;${r};${g};${b}m${id}\\x1B[m`
      const result = (options.printId && !coloredKinds.includes(kind)
        ? `console.log('${label}'),`
        : '')
        + `console.${kind}(${
          options.printId && coloredKinds.includes(kind)
            ? (`'${label}${startsWithString ? ' \' + ' : '\','}`)
            : ''
        }${payload.trim()})`
      return options.runtimeDebug
        ? `;new RegExp( ( typeof window==='object'?location.hash.split('debug=')[1]:new URL(import.meta.url).searchParams.get('debug') ) || '%%%' ).test('${id}')&&(${result});`
        : result
    }
  }

  return {
    name: 'debug',

    async transform(code, id) {
      if (!filter(id)) {
        log('exclude:', id)
        return
      }

      let pkg: any
      try {
        for await (const file of findPackageJson(path.dirname(id))) {
          const json = JSON.parse(await fs.readFile(file, 'utf-8'))
          if (json.name) {
            pkg = {
              path: file,
              data: json,
            }
            break
          }
        }

        if (!pkg) {
          throw new Error('No package found for id: ' + id)
        }
      } catch (error) {
        console.error(error)
        return code
      }

      const getDebugId = (id: string, relativePath?: string | null) => {
        const resolved = relativePath ? path.resolve(path.dirname(relativePath), id) : id
        log('resolved', resolved)

        const withoutExt = resolved.replace(path.extname(resolved), '')
        const relative = path.relative(path.dirname(pkg.path), withoutExt)

        log('match:', debugMatcher ?? '<none>')

        const debugId = [pkg.data.name, ...relative.split('/').filter(x => !options.removeParts!.includes(x))].join(':')
        log('id:', debugId)

        const enabled = matchNamespace(debugMatcher ?? '', debugId)
        log('enabled:', enabled)

        if (enabled) return debugId
      }

      const regexp = /(?<replace>\/\/!(?<kind>\w+|>|\?)(?<payload>.*))/g
      let result: DebugExecOutput | null

      const magic = new MagicString(code)

      const results: DebugExecResult[] = []

      while (result = regexp.exec(code) as DebugExecOutput) {
        let { kind } = result.groups
        const { replace, payload } = result.groups

        const start = result.index
        const end = result.index + replace.length

        if (kind === '?') kind = 'debug'
        if (kind === '>') kind = 'literal'

        results.push({ id, start, end, kind, payload })
      }

      if (!results.length) return null

      await SourceMapConsumer.with(this.getCombinedSourcemap(), null, consumer => {
        for (const result of results) {
          const { start } = result
          const lines = code.slice(0, start).split('\n')
          const column = (lines.at(-1) ?? '').length
          const line = lines.length
          const original = consumer.originalPositionFor({ line, column })
          result.id = getDebugId(original?.source ?? id, original?.source ? id : null)
        }
      })

      let writes = 0

      for (const result of results) {
        const { id, start, end, payload, kind } = result
        if (!id) {
          if (options.removeIfUnmatched) {
            magic.overwrite(start, end, '')
            writes++
          }
          continue
        }
        const color = colorHash(id)
        magic.overwrite(start, end, replacer(payload, kind, id, color))
        writes++
      }

      if (!writes) return null

      const output = {
        code: magic.toString(),
        map: magic.generateMap(),
      }

      return output
    },
  }
}
