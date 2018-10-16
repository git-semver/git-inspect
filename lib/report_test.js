const { expect }  = require('chai');
const sinon = require('sinon');
const Report = require('./report');
const { defaultReport, reportNotStartedException, resultsIsExistsException } = Report;

describe('Report', () =>
{
  it('Should be fill default report instance', () =>
  {
    const report = new Report();
    expect(report.getInstance()).to.deep.equal(defaultReport());
  });

  it('Should be add startTimestamp', () =>
  {
    const report = new Report();
    const { startTimestamp } = report.getInstance();
    expect(startTimestamp).to.equal(null);
    report.start();
    const { startTimestamp: afterStartTimestamp } = report.getInstance();
    expect(afterStartTimestamp).to.not.equal(null);
  });


  it('Should be add endTimestamp', () =>
  {
    const report = new Report();
    const { endTimestamp } = report.getInstance();
    expect(endTimestamp).to.equal(null);
    report.start();
    report.end();
    const { endTimestamp: afterEndTimestamp, time } = report.getInstance();
    expect(afterEndTimestamp).to.not.equal(null);
    expect(time).to.not.equal(null);
  });

  it('Should be end throw exception if process not started', () =>
  {
    const report = new Report();
    const { endTimestamp } = report.getInstance();
    expect(() => report.end()).to.throw(reportNotStartedException);
  });

  it('Should be add and get result', () =>
  {
    const rep = new Report();
    const inspector = 'inspector';
    const reducer = 'reducer';
    const report = { result: 'result' };
    rep.start();
    expect(rep.getResult(inspector, reducer)).to.equal(undefined);
    rep.addResult(inspector, reducer, report);
    expect(rep.getResult(inspector, reducer)).to.deep.equal({
      inspector,
      reducer,
      report
    });
  });

  it('Should be throw exception #addResult if process not started', () =>
  {
    const rep = new Report();
    const inspector = 'inspector';
    const reducer = 'reducer';
    const report = { result: 'result' };
    expect(() =>
      rep.addResult(inspector, reducer, report)
    ).to.throw(reportNotStartedException);
  });

  it('Should be throw exception #addResult if result exist', () =>
  {
    const rep = new Report();
    const inspector = 'inspector';
    const reducer = 'reducer';
    const report = { result: 'result' };
    rep.start();
    rep.addResult(inspector, reducer, report)
    expect(() =>
      rep.addResult(inspector, reducer, report)
    ).to.throw(resultsIsExistsException);
  });

  it('Should be map results', () =>
  {
    const inspector1 = 'inspector1';
    const inspector2 = 'inspector2';
    const reducer1 = 'reducer1';
    const reducer2 = 'reducer2';
    const reducer3 = 'reducer3';
    const report1 = { result: 'result1' };
    const report2 = { result: 'result1' };
    const report3 = { result: 'result1' };
    const rep = new Report();
    rep.start();
    rep.addResult(inspector1, reducer1, report1);
    rep.addResult(inspector1, reducer2, report2);
    rep.addResult(inspector2, reducer3, report3);
    const results = rep.getMappedResults();
    expect(results).to.deep.equal({
      [inspector1]: {
        [reducer1]: report1,
        [reducer2]: report2
      },
      [inspector2]: {
        [reducer3]: report3
      }
    });
  });
});
