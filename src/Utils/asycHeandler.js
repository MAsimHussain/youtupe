const asyncHendler = (requesthendler) => {
  (req, res, next) => {
    Promise.resolve(requesthendler(req, res, next)).catch((err) => next(err));
  };
};

// const asyncHendler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({ success: false, message: err.message });
//   }
// };
