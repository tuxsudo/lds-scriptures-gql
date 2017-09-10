const toCursor = input =>
  new Buffer(input.toString(), "binary").toString("base64");

const fromCursor = input => new Buffer(input, "base64").toString("binary");

const defaultCursorifyFn = node => toCursor(JSON.stringify(node.id || node));

const resultsToConnection = ({ results, first = 20, after, cursorFn }) => {
  const edges = results.map(r => cursorify(r, cursorFn));

  const index =
    (after && edges.findIndex(({ cursor }) => cursor === after) + 1) || 0;

  return {
    pageInfo: {
      total: edges.length,
      hasNextPage: index + first < edges.length
    },
    edges: edges.slice(index, index + first)
  };
};

const cursorify = (node, fn = defaultCursorifyFn) => ({
  cursor: fn(node),
  node
});

module.exports = {
  toCursor,
  fromCursor,
  cursorify,
  resultsToConnection
};
