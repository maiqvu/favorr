const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

chai.use(chaiHttp);

chai.should();   // Declare assertion type

describe('Favors API', () => {
  
  /* GET all favors owed by one user */
  describe('GET /api/favors/:userId/owedByMe', () => {
    it('It should get all favors owed by one user', done => {
      chai.request(server)
        .get('/api/favors/5f5f276f6f471616307da196/owedByMe')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
    
    it('It should return 404 when URL is nonexistent', done => {
      chai.request(server)
        .get('/api/favors/5f5f276f6f471616307da196')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    
    it('It should return 500 when URL is wrong due to client errors', done => {
      chai.request(server)
        .get('/api/favors/123/owedByMe')
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
  
  /* GET all favors owed to one user */
  describe('GET /api/favors/:userId/owedToMe', () => {
    it('It should get all favors owed to one user', done => {
      chai.request(server)
        .get('/api/favors/5f5f276f6f471616307da196/owedToMe')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
    
    it('It should return 404 when URL is nonexistent', done => {
      chai.request(server)
        .get('/api/favors/5f5f276f6f471616307da196')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    
    it('It should return 500 when URL is wrong due to client errors', done => {
      chai.request(server)
        .get('/api/favors/123/owedToMe')
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
  
  /* GET the count of owedByMe favors */
  describe('GET /api/favors/:userId/owedByMe/count', () => {
    it('It should get the count of owedByMe favors', done => {
      chai.request(server)
        .get('/api/favors/5f5f276f6f471616307da196/owedByMe/count')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('number');
          res.body.should.be.gte(0);
          done();
        });
    });
    
    it('It should return 500 when URL is wrong due to client errors', done => {
      chai.request(server)
        .get('/api/favors/123/owedByMe/count')
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
    
    it('It should return 404 when URL is nonexistent', done => {
      chai.request(server)
        .get('/api/favors/5f5f276f6f471616307da196/count')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  
  /* GET the count of owedToMe favors */
  describe('GET /api/favors/:userId/owedToMe/count', () => {
    it('It should get the count of owedToMe favors', done => {
      chai.request(server)
        .get('/api/favors/5f5f276f6f471616307da196/owedToMe/count')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('number');
          res.body.should.be.gte(0);
          done();
        });
    });
    
    it('It should return 500 when URL is wrong due to client errors', done => {
      chai.request(server)
        .get('/api/favors/123/owedToMe/count')
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
    
    it('It should return 404 when URL is nonexistent', done => {
      chai.request(server)
        .get('/api/favors/owedToMe/count')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  
  /* POST new favor */
  describe('POST /api/favors/', () => {
    it('It should post a new favor', done => {
      const newFavor = {
        description: 'Coffee',
        owedBy: 'steve',
        owedTo: 'bobby'
      };
      
      chai.request(server)
        .post('/api/favors/')
        .send(newFavor)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.keys(['__v', '_id', 'description', 'owedBy', 'owedTo', 'repaid', 'createdAt', 'updatedAt']);
          res.body.should.have.property('description').eq('Coffee');
          res.body.should.have.property('repaid').eq(false);
          done();
        });
    });
    
    it('It should not post a new favor without one of the 3 required properties - description, owedBy, owedTo', done => {
      const newFavor = {
        owedBy: 'steve',
        owedTo: 'bobby'
      };
      
      chai.request(server)
        .post('/api/favors/')
        .send(newFavor)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eq('Please enter all required fields.');
          done();
        });
    });
    
    it('It should not post a new favor owed by and owed to the same user', done => {
      const newFavor = {
        description: 'Brownie',
        owedBy: 'bobby',
        owedTo: 'bobby'
      };
      
      chai.request(server)
        .post('/api/favors/')
        .send(newFavor)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eq('Invalid fields. The favor is owed by the same person.');
          done();
        });
    });
    
    it('It should not post a new favor when user input is wrong', done => {
      const newFavor = {
        description: 'Brownie',
        owedBy: '12345',
        owedTo: '5f5f276f6f471616307da196'
      };
      
      chai.request(server)
        .post('/api/favors/')
        .send(newFavor)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
  
  /* PATCH a favor */
  describe('PATCH /api/favors/f/:favorId', () => {
    it('It should update a favor with new repaid status', done => {
      const updatePayload = { repaid: true };
      chai.request(server)
        .patch('/api/favors/f/5f8a7f9b33be6d2e6b757553')
        .send(updatePayload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('repaid').eq(true);
          done();
        });
    });
    
    it('It should not update a favor with a wrong payload', done => {
      const updatePayload = { image: true };
      chai.request(server)
        .patch('/api/favors/f/5f8a7f9b33be6d2e6b757553')
        .send(updatePayload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eq('Invalid PATCH request.');
          done();
        });
    });
    
    it('It should not update a favor when URL is wrong', done => {
      const updatePayload = { repaid: true };
      chai.request(server)
        .patch('/api/favors/f/123')
        .send(updatePayload)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
});
