const isPrivate = str => {
  return (
    /.*password.*/.test(str) ||
    /.*street.*/.test(str) ||
    /.*email.*/.test(str) ||
    /.*zip.*/.test(str) ||
    /.*city.*/.test(str) ||
    /.*user.*/.test(str)
  );
};

const mockValue = key => {
  if (/.*password.*/.test(key)) return '*****';
  if (/.*email.*/.test(key)) return 'mock@example.com';
  if (/.*street.*/.test(key)) return '123 Mock St';
  if (/.*zip.*/.test(key)) return '00000';
  if (/.*city.*/.test(key)) return 'MockCity';
  if (/.*user.*/.test(key)) return 'mockUser';
  return '*****';
};

const walk = obj => {
  if (Array.isArray(obj)) {
    return obj.map(walk);
  } else if (obj !== null && typeof obj === "object") {
    const tmp = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        tmp[key] = isPrivate(key) ? mockValue(key) : walk(obj[key]);
      }
    }
    return tmp;
  }
  return obj;
};

class Mask {
  constructor(log) {
    this.log = log;
  }

  info(...args) {
    console.log('Masked Logger Info:', args); // Debug statement
    const maskedArgs = walk(args);
    console.log('Masked Arguments Info:', maskedArgs); // Debug statement
    return this.log.info(...maskedArgs);
  }

  debug(...args) {
    console.log('Masked Logger Debug:', args); // Debug statement
    const maskedArgs = walk(args);
    console.log('Masked Arguments Debug:', maskedArgs); // Debug statement
    return this.log.debug(...maskedArgs);
  }

  error(...args) {
    console.log('Masked Logger Error:', args); // Debug statement
    const maskedArgs = walk(args);
    console.log('Masked Arguments Error:', maskedArgs); // Debug statement
    return this.log.error(...maskedArgs);
  }
}

module.exports = Mask;
