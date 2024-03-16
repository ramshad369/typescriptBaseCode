import { expect } from 'chai';
import addContext from 'mochawesome/addContext';
import supertest from 'supertest';
import Logger from '../../core/logger';
import { AdminValidAuth } from '../../interfaces/testcase.interface';

export default function v2landingPage(
  request: supertest.SuperTest<supertest.Test>,
  adminValidAuth: AdminValidAuth
) {
  describe('Landing page welcome message', function () {
    Logger.info('validation auth-', adminValidAuth);

    it('200 Ok - V2 Landing page', function (done) {
      const test = this;
      request
        .get('/api/v2')
        .set(adminValidAuth)
        .end(function (err: Error, res: any) {
          addContext(test, `status: ${res.status}`);
          addContext(test, `body: ${JSON.stringify(res.body, null, 1)}`);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
}
