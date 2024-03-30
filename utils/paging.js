const pagingFn = (arr, curPage) => {
  return arr.slice((curPage - 1) * 19, (curPage - 1) * 19 + 20);
};

module.exports = pagingFn;
