const { expect }  = require('chai');
const sinon = require('sinon');
const LinearReducer = require('./linear');

describe('Linear branches reducer', () =>
{
  it('Should be properly calculation for linear history', () =>
  {
    const reducer = new LinearReducer({}, {});
    const statePart = { linearFactors: [ 1, 1, 1 ] };
    const result = reducer.afterReduce(statePart);
    expect(result.linearFactors).to.equal(undefined);
    expect(result.linearFactor).to.equal(1);
    expect(result.isLinearHistory).to.equal(true);
  });

  it('Should be properly calculation for not linear history', () =>
  {
    const reducer = new LinearReducer({}, {});
    const statePart = { linearFactors: [ 0.001, 0.001, 0.001 ] };
    const result = reducer.afterReduce(statePart);
    expect(result.linearFactors).to.equal(undefined);
    expect(result.linearFactor).to.equal(0.001);
    expect(result.isLinearHistory).to.equal(false);
  });
});
