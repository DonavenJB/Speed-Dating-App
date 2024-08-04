const isPrivate = str => {
  return (
    /.*password.*/.test(str) ||
    /.*street.*/.test(str) ||
    /.*email.*/.test(str) ||
    /.*zip.*/.test(str) ||
    /.*city.*/.test(str) ||
    /.*username.*/.test(str)  // Added username here
  );
};

const walk = obj => {
  const tmp = Object.assign({}, obj);
  const keys = Object.keys(tmp);

  keys.forEach(key => {
    const val = tmp[key];

    if (typeof val === "object" && val !== null) {
      tmp[key] = walk(val);
    }

    if (isPrivate(key)) {
      tmp[key] = "*****";
    }
  });

  return tmp;
};

class Mask {
  constructor(log) {
    this.log = log;
  }

  info(...args) {
    const maskedArgs = Array.from(args).map(arg => walk(arg));
    return this.log.info(...maskedArgs);
  }
}

module.exports = Mask;
