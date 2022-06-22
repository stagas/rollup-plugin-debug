// ripped from: https://github.com/debug-js/debug/blob/d1616622e4d404863c5a98443f755b4006e971dc/src/common.js

export const matchNamespace = (namespaces: string, name: string) => {
  const names = []
  const skips = []

  let i
  const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/)
  let len = split.length

  for (i = 0; i < len; i++) {
    if (!split[i]) {
      // ignore empty strings
      continue
    }

    namespaces = split[i].replace(/\*/g, '.*?')

    if (namespaces[0] === '-') {
      skips.push(new RegExp('^' + namespaces.slice(1) + '$'))
    } else {
      names.push(new RegExp('^' + namespaces + '$'))
    }
  }

  if (name[name.length - 1] === '*') {
    return true
  }

  for (i = 0, len = skips.length; i < len; i++) {
    if (skips[i].test(name)) {
      return false
    }
  }

  for (i = 0, len = names.length; i < len; i++) {
    if (names[i].test(name)) {
      return true
    }
  }

  return false
}
