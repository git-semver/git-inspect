const { expect }  = require('chai');
const { spy } = require('sinon');
const BranchInspector = require('./branch');
const GitflowReducer = require('./branch/gitflow');
const LinearReducer = require('./branch/linear');
const UnmergedReducer = require('./branch/unmerged');


describe('Branch Inspector', () =>
{
  context('Construct inpector', () =>
  {
    const adapterStub = {};
    const opts = { opt: 'value' };

    it('Should be construct inspector', () =>
    {
      const names = BranchInspector.reducerNames;
      const branchInspect = new BranchInspector(adapterStub, opts);

      expect(branchInspect.adapter).to.equal(adapterStub);
      expect(branchInspect.opts).to.equal(opts);
      expect(branchInspect.report).to.deep.equal(BranchInspector.getDefaultReport());
      expect(branchInspect.reducers[names.gitflow]).to.be.an.instanceof(GitflowReducer);
      expect(branchInspect.reducers[names.linear]).to.be.an.instanceof(LinearReducer);
      expect(branchInspect.reducers[names.unmerged]).to.be.an.instanceof(UnmergedReducer);
    });
  });

  context('Reduce report', () =>
  {
    const branchStub = {};
    const branches = [branchStub];

    const reducerStub = {
      reduce(branch, report)
      {
        return report;
      }
    };

    const adapterStub = {
      getBranches()
      {
        return branches;
      }
    };

    const report = { stub: Object.create(null) }

    let branchInspect = null;

    beforeEach(() =>
    {
      branchInspect = new BranchInspector(adapterStub);
      branchInspect.reducers = { stub: reducerStub };
      branchInspect.report = report;
    });

    it('Should be return report', async () =>
    {
      const result = await branchInspect.collect();
      expect(result).to.equal(report);
    });

    it('Should be called reduce method with branch and report', async () =>
    {
      spy(reducerStub, "reduce");
      await branchInspect.collect();
      expect(reducerStub.reduce.calledOnce).to.equal(true);
      expect(reducerStub.reduce.calledWith(branchStub, report.stub)).to.equal(true);
    });
  });
});
