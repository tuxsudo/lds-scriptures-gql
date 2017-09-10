const { resultsToConnection } = require("./_helpers");

const all = () => Promise.resolve(require("../../data/volumes"));

const search = async ({ keywords, after, first }) => {
  const results = await all();
  const pattern = keywords && new RegExp(`\\b${keywords}\\b`, "i");

  return resultsToConnection({
    first,
    after,
    results: results.filter(volume => {
      let keep = true;

      if (pattern) {
        keep =
          keep &&
          (pattern.test(volume.title) || pattern.test(volume.aliases.long));
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
