const { resultsToConnection } = require("./_helpers");

const all = () => Promise.resolve(require("../../data/chapters"));

const search = async ({ keywords, after, bookIds = [], first }) => {
  const results = await all();
  const pattern = keywords && new RegExp(`\\b${keywords}\\b`, "i");

  return resultsToConnection({
    first,
    after,
    results: results.filter(chapter => {
      let keep = true;

      if (pattern) {
        keep =
          keep &&
          (pattern.test(chapter.title) || pattern.test(chapter.aliases.long));
      }

      if (bookIds.length > 0) {
        keep = keep && bookIds.includes(chapter.bookId);
      }

      return keep;
    })
  });
};

module.exports = {
  all,
  search,
  get: id => all().then(items => items.find(v => v.id === id))
};
