class HookMap {
  constructor(createHookfactory) {
    this._map = new Map();
    this.createHookfactory = createHookfactory;
  }
  get(key) {
    return this._map.get(key);
  }

  for(key) {
    let hook = this.get(key);
    if (hook) return hook;
    let newHook = this.createHookfactory();
    this._map.set(key, newHook);
    return newHook;
  }
}

module.exports = HookMap;
