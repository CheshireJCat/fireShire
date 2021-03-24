const store = new Map();

export const sub = (name: string, func: Function) => {
  if (!store.has(name)) {
    store.set(name, [func]);
  } else {
    let funcs = store.get(name);
    let hasFunc = funcs.filter((item: Function) => item === func);
    if (hasFunc.length) {
      return;
    } else {
      store.set(name, [...funcs, func]);
    }
  }
};

export const unsub = (name: string, func: Function) => {
  if (!store.has(name)) {
    return;
  } else {
    let funcs = store.get(name);
    let restFuncs = funcs.filter((item: Function) => item !== func);
    if (!restFuncs.length) {
      store.delete(name);
    } else {
      store.set(name, restFuncs);
    }
  }
};

export const pub = (name: string, ...args: any[]) => {
  if (!store.has(name)) {
    return;
  } else {
    let funcs = store.get(name);
    funcs.forEach((func: Function) => {
      func.call(this, ...args);
    });
  }
};