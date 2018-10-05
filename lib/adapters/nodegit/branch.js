const NAME = Symbol();
const SOURCE = Symbol();
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
    this[SOURCE] = branchRef;
    this[HEAD] = branchRef.isHead();
  }

  /**
   * Return true if branch is head of repository
   *
   * @return {boolean}
   */
  get isHead(){
    return this[HEAD];
  }

  /**
   * Return branch ref-name (like as refs/head/master)
   *
   * @return {string}
   */
  get ref(){
    return this[REF];
  }

  /**
   * Return branch name (like as master)
   *
   * @return {string}
   */
  get name(){
    return this[NAME];
  }

  /**
   * Return branch source
   *
   * @return {nodegit.Reference}
   */
  get source(){
    return this[SOURCE];
  }

  toJSON()
  {
    return this[REF];
  }
}

Branch.refPrefix = refPrefix;

module.exports = Branch;
