const NAME = Symbol();
const REF = Symbol();
const HEAD = Symbol();

const refPrefix = 'refs/heads/';

class Branch
{
  /**
   * Constructor
   *
   * @constructor
   * @param {nodegit.Reference} branchRef - Branch reference
   */
  constructor(branchRef)
  {
    const refName = branchRef.name();
    const branchName = refName.replace(refPrefix, '');

    this[NAME] = branchName;
    this[REF] = refName;
    this[HEAD] = branchRef.isHead();
  }

  get isHead(){
    return this[HEAD];
  }

  get ref(){
    return this[REF];
  }

  get name(){
    return this[NAME];
  }

  toJSON()
  {
    return this[REF];
  }
}

Branch.refPrefix = refPrefix;

module.exports = Branch;
