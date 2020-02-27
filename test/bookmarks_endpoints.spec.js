const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeBookmarksArray } = require('./bookmarks.fixtures');

describe('Bookmarks Endpoints', function() {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db('bookmarks').truncate());
	
  afterEach('cleanup', () => db('bookmarks').truncate());
	
  describe('GET /bookmarks', () => {
    context('Given no bookmarks', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200, []);
      });
    });
	
    context('Gicen bookmarks', () => {
      const bookmarksData = makeBookmarksArray();
			
      beforeEach('insert Bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(bookmarksData);
      });

      it('GET /bookmarks responds with 200 and gets all of the bookmars from the data', () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200);
      });
    });
  });
	
  describe('GET /bookmarks/:id', () => {
    context('Given no bookmarks', () => {
      it('responds with 404', () => {
        return supertest(app)
          .get('/bookmarks/1')
          .expect(404, 'Bookmark not found');
      });
    });
		
    context('Given bookmarks in the data', () => {
      const bookmarksData = makeBookmarksArray();

      beforeEach('insert Bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(bookmarksData);
      });

      it('responds with 200', () => {
        const bookmarkId = 2;
        const expectedBookmark = bookmarksData[bookmarkId - 1];
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .expect(200, expectedBookmark);
      });
    });
  });
	

});