const shelljs = require("shelljs");
const path = require("path");

const idMap = {};

const bigData = require("../src-data/lds-scriptures")
  .map(
    ({
      volume_id: volumeId,
      book_title,
      chapter_id: chapterId,
      verse_id: id,
      verse_title,
      verse_short_title,
      verse_number: number,
      scripture_text: text
    }) => ({
      chapterId: `${chapterId}`,
      id: `${id}`,
      title: verse_title,
      aliases: {
        short: verse_short_title,
        long: `${book_title}, ${volumeId === 4
          ? "Section"
          : "Chapter"} ${number}, Verse ${number}`
      },
      number,
      text
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
  .to(path.join(process.cwd(), "data/verses.json"));
