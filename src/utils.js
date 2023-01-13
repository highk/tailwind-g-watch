module.exports.getDirPath = function (argv) {
  let dir = "./";
  if (argv.dir) {
    const dirArr = argv.dir.split("");
    switch (dirArr[0]) {
      case ".":
        dir = argv.dir;
        break;
      case "/":
        dir = argv.dir;
        break;
      default:
        dir += argv.dir;
    }
  }
  return dir;
};

// Alreay run? (first argument)
module.exports.preventDuplicateExecutionAsync = function (func) {
  const running = new Map();
  const next = new Map();
  return async function () {
    const args = [...arguments];

    if (running.get(args[0])) {
      next.set(args[0], true);
      return await running.get(args[0]);
    } else {
      let result;
      let err;
      do {
        next.delete(args[0]);
        result = undefined;
        err = undefined;
        const promise = func(...args);
        running.set(args[0], promise);
        try {
          result = await promise;
        } catch (e) {
          err = e;
        }
        running.delete(args[0]);
      } while (next.get(args[0]));
      if (err) {
        throw err;
      } else {
        return result;
      }
    }
  };
};
