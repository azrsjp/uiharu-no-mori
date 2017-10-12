import {default as numeral} from 'numeral'
import {FetchPolicy as Policy} from './fetch-policy'


class Factory {
  static computePath(keys, name) {
    return `/img/${keys.join('/')}/${name}`
  }

  constructor(onLoadedCallback) {
    this.sources = {
      character: {
        uiharu: ['uiharu.png'],
        saten: ['saten.png'],
      },
      bg: [],
    }

    for (let i = 1; i <= 7; ++i) {
      const id = numeral(i).format('00')
      this.sources.bg.push(`${id}.jpg`)
    }

    this.dataCount = 0

    const flatten = (res, currentKeys, currentElem) => {
      for (const [k, v] of Object.entries(currentElem)) {
        currentKeys.push(k)
        const id = currentKeys.join('.')

        if (Array.isArray(v)) {
          res.set(id, new Map(v.map((name) => { ++this.dataCount; return [name.split('.')[0], `${Factory.computePath(currentKeys, name)}`] })))

        } else {
          Object.assign(res, flatten(new Map, currentKeys, v))
        }

        currentKeys.pop()
      }
      return res
    }
    this.sources = flatten(new Map, [], this.sources)

    this.data = new Map
    this.onLoadedCallback = onLoadedCallback
    this.progress = 0

    for (const [key, kv] of this.sources) {
      this.data.set(key, new Map)

      for (const [id, path] of kv) {
        let img = new Image()
        img.src = path

        img.onload = (e) => {
          this.data.get(key).set(id, e.target)
          this.onProgress()
        }
        img.onerror = () => {
          this.onProgress()
        }
      }
    }
  }

  onProgress() {
    if(++this.progress >= this.dataCount) {
        this.onLoadedCallback()
    }
  }

  get(raw_keys, policy = Policy.single, filter = null) {
    let keys = [].concat(raw_keys)
    const id = keys.pop()

    let e = this.data.get(keys.join('.'))
    if (!e) {
      e = this.data.get(id)
    }

    switch (policy) {
      case Policy.single: {
        return e.get(id)
      }

      case Policy.filter: {
        if (filter) {
          let ret = []
          for (const [k, v] of e) {
            if (filter(k)) {
              ret.push(v)
            }
          }
          return ret

        } else {
          return new Map(e)
        }
      }
    }
  } // get
}

export {Factory}
