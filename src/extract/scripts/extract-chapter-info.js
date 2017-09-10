const shelljs = require("shelljs");
const path = require("path");

const idMap = {};

const bigData = require("../src-data/lds-scriptures")
  .map(
    ({
      volume_id: volumeId,
      book_id: bookId,
      book_title,
      chapter_id: id,
      chapter_number: number
    }) => ({
      bookId: `${bookId}`,
      id: `${id}`,
      number,
      title: `${book_title} ${number}`,
      aliases: {
        short: volumeId === 4 ? `Section ${number}` : `Chapter ${number}`,
        long:
          volumeId === 4
            ? `${book_title}, Section ${number}`
            : `${book_title}, Chapter ${number}`
      }
    })
  )
  .filter(({ id }) => {
    if (idMap[id]) {
      return false;
    }
    idMap[id] = true;
    return true;
  });

shelljs
  .ShellString(JSON.stringify(bigData, null, 2))
  .to(path.join(process.cwd(), "data/chapters.json"));
