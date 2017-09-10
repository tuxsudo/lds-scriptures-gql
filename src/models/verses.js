const { resultsToConnection } = require("./_helpers");

const all = () => Promise.resolve(require("../../data/verses"));

const search = async ({ keywords, chapterIds = [], after, first }) => {
  const results = await all();

  const pattern = keywords && new RegExp(`\\b${keywords}\\b`, "i");

  return resultsToConnection({
    first,
    after,
    results: results.filter(verse => {
      let keep = true;

      if (pattern) {
        keep = keep && pattern.test(verse.text);
      }

      if (chapterIds.length > 0) {
        keep = keep && chapterIds.includes(verse.chapterId);
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
