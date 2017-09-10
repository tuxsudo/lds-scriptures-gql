const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { books, chapters, verses, volumes } = require("../models");

const resolvers = {
  Slug: new GraphQLScalarType({
    name: "Slug",

    description: "Slug custom scalar type",

    // value from the client
    parseValue: value =>
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : null,

    serialize: value => value,

    parseLiteral: ast => (ast.kind === Kind.STRING ? ast.value : null)
  }),

  Keywords: new GraphQLScalarType({
    name: "Keywords",

    description: "Keywords custom scalar type",

    // value from the client
    parseValue: value => (/^[a-z0-9"',\- ]+$/i.test(value) ? value : null),

    serialize: value => value,

    parseLiteral: ast => (ast.kind === Kind.STRING ? ast.value : null)
  }),

  Volume: {
    // books: async ({ id }) => {
    //   const all = await books.all();
    //   return all.filter(book => book.volumeId === id);
    // },

    booksConnection: ({ id }, { input: { keywords } = {}, first, after }) =>
      books.search({ keywords, first, after, volumeIds: [id] })
  },

  Book: {
    volume: ({ volumeId }) => volumes.get(volumeId),

    // chapters: async ({ id }) => {
    //   const all = await chapters.all();
    //   return all.filter(chapter => chapter.bookId === id);
    // },

    chaptersConnection: ({ id }, { input: { keywords } = {}, first, after }) =>
      chapters.search({ bookIds: [id], keywords, first, after }),

    versesConnection: async (
      { id },
      { input: { keywords } = {}, first, after }
    ) => {
      const allChapters = await chapters.all();
      const myChapters = allChapters.filter(chapter => chapter.bookId === id);
      const chapterIds = myChapters.map(({ id }) => id);
      return verses.search({ keywords, first, after, chapterIds });
    }
  },

  Chapter: {
    book: ({ bookId }) => books.get(bookId),

    versesConnection: ({ id }, { input: { keywords } = {}, first, after }) =>
      verses.search({ keywords, first, after, chapterIds: [id] })

    // verses: async ({ id }) => {
    //   const all = await verses.all();
    //   return all.filter(verse => verse.chapterId === id);
    // }
  },

  Verse: {
    chapter: ({ chapterId }) => chapters.get(chapterId)
  },

  Query: {
    getVolume: (_, { id }) => volumes.get(id),

    getBook: (_, { id }) => books.get(id),

    getChapter: (_, { id }) => chapters.get(id),

    getVerse: (_, { id }) => verses.get(id),

    allVolumes: (_, { input: { keywords } = {}, first, after }) =>
      volumes.search({ keywords, first, after }),

    allBooks: (_, { input: { keywords, volumeIds } = {}, first, after }) =>
      books.search({ volumeIds, keywords, first, after }),

    allChapters: (_, { input: { keywords, bookIds } = {}, first, after }) =>
      chapters.search({ bookIds, keywords, first, after }),

    allVerses: (_, { input: { keywords, chapterIds } = {}, first, after }) =>
      verses.search({ chapterIds, keywords, first, after })
  }
};

module.exports = resolvers;
