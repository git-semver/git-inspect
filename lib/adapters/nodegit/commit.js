const MESSAGE = Symbol();
const SHA = Symbol();
const AUTHOR = Symbol();
const EMAIL = Symbol();
const DATE = Symbol();
const SOURCE = Symbol();

class Commit
{
  /**
   * Constructor
   *
   * @constructor
   * @param {nodegit.Commit} commit - Commit
   */
  constructor(commit)
  {
    this[MESSAGE] = commit.message().replace(/\n/, '');
    this[SHA] = commit.sha();
    this[AUTHOR] = commit.author().name();
    this[EMAIL] = commit.author().email();
    this[DATE] = commit.date();
    this[SOURCE] = commit;
  }

  /**
   * Return commit source
   *
   * @deprecated
   * @todo Remove after not usage
   * @return {git.Commit}
   */
  get source(){
    return this[SOURCE];
  }

  /**
   * Return commit message
   *
   * @return {string}
   */
  get message(){
    return this[MESSAGE];
  }

  /**
   * Return commit sha
   *
   * @return {string}
   */
  get sha(){
    return this[SHA];
  }

  /**
   * Return commit author name
   *
   * @return {string}
   */
  get author(){
    return this[AUTHOR];
  }

  /**
   * Return commit author email
   *
   * @return {string}
   */
  get email(){
    return this[EMAIL];
  }

  /**
   * Return commit date
   *
   * @return {string}
   */
  get date(){
    return this[DATE];
  }

  toJSON()
  {
    return this[SHA];
  }
}

module.exports = Commit;
