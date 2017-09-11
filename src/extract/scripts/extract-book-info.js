const shelljs = require("shelljs");
const path = require("path");

const idMap = {};

const moarData = {
  "1": require("../src-data/old-testament"),
  "2": require("../src-data/new-testament"),
  "3": require("../src-data/book-of-mormon"),
  "4": require("../src-data/doctrine-and-covenants"),
  "5": require("../src-data/pearl-of-great-price")
};

const bigData = require("../src-data/lds-scriptures")
  .map(
    ({
      volume_id: volumeId,
      book_id: id,
      book_title: title,
      book_long_title,
      book_subtitle: subtitle,
      book_short_title,
      book_lds_url: slug
    }) => ({
      volumeId: `${volumeId}`,
      id: `${id}`,
      slug,
      title,
      subtitle,
      aliases: {
        short: book_short_title,
        long: book_long_title
      }
    })
  )
  .filter(({ id }) => {
    if (idMap[id]) {
      return false;
    }
    idMap[id] = true;
    return true;
  })
  .map(data => {
    const volumeInfo = moarData[`${data.volumeId}`];
    const bookInfo =
      volumeInfo &&
      volumeInfo.books &&
      volumeInfo.books.find(b => b.book === data.aliases.short);

    return {
      ...data,
      ...(bookInfo && { heading: bookInfo.heading })
    };
  });

shelljs
  .ShellString(JSON.stringify(bigData, null, 2))
  .to(path.join(process.cwd(), "/data/books.json"));
