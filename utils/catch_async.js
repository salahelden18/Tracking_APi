module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // lec 116 sasync function return a promise that is way we used .catch here next will trigger our global handle error function
  };
};
