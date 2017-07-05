module.exports = function(msg) {
  if (process.env.NODE_ENV === 'prod') return false;
  console.log(msg);
};
