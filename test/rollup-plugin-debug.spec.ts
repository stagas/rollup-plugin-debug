import path from 'path'
import * as rollup from 'rollup'
import debug from '../src/rollup-plugin-debug'

const fixtures = path.join(__dirname, 'fixtures')

describe('debug', () => {
  it('works', async () => {
    process.env.ROLLUP_DEBUG = 'rollup-plugin-debug:*'
    const bundle = await rollup.rollup({
      input: path.join(fixtures, 'sink.js'),
      plugins: [debug()],
    })
    const result = await bundle.generate({})
    expect(result.output[0].code).toMatchSnapshot()
  })

  it('printId', async () => {
    process.env.ROLLUP_DEBUG = 'rollup-plugin-debug:*'
    const bundle = await rollup.rollup({
      input: path.join(fixtures, 'sink.js'),
      plugins: [debug({ printId: true })],
    })
    const result = await bundle.generate({})
    expect(result.output[0].code).toMatchSnapshot()
  })

  it('ignores', async () => {
    process.env.ROLLUP_DEBUG = ''
    const bundle = await rollup.rollup({
      input: path.join(fixtures, 'sink.js'),
      plugins: [debug()],
    })
    const result = await bundle.generate({})
    expect(result.output[0].code).toMatchSnapshot()
  })

  it('removes', async () => {
    process.env.ROLLUP_DEBUG = ''
    const bundle = await rollup.rollup({
      input: path.join(fixtures, 'sink.js'),
      plugins: [debug({
        removeIfUnmatched: true,
      })],
    })
    const result = await bundle.generate({})
    expect(result.output[0].code).toMatchSnapshot()
  })
})
