const shelljs = require("shelljs");
const path = require("path");

const idMap = {};

const bigData = require("../src-data/lds-scriptures")
  .map(
    ({
      volume_id: id,
      volume_title,
      volume_long_title,
      volume_subtitle: subtitle,
      volume_short_title,
      volume_lds_url: slug
    }) => ({
      id: `${id}`,
      title: volume_title,
      aliases: {
        short: volume_short_title,
        long: volume_long_title
      },
      subtitle,
      slug
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
  .to(path.join(process.cwd(), "data/volumes.json"));
