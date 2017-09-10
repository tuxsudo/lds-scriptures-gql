const { resultsToConnection } = require("./_helpers");

const all = () => Promise.resolve(require("../../data/books"));

const search = async ({ keywords, volumeIds = [], after, first }) => {
  const results = await all();

  const pattern = keywords && new RegExp(`\\b${keywords}\\b`, "i");

  return resultsToConnection({
    first,
    after,
    results: results.filter(book => {
      let keep = true;

      if (pattern) {
        keep =
          keep &&
          (pattern.test(book.title) ||
            pattern.test(book.aliases.long) ||
            pattern.test(book.heading));
      }

      if (volumeIds.length > 0) {
        keep = keep && volumeIds.includes(book.volumeId);
      }

      return keep;
    })
  });
};

module.exports = {
  all,
  search,
  get: id => all().then(books => books.find(v => v.id === id))
};
