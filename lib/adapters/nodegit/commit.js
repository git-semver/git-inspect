const ID = Symbol();
const MESSAGE = Symbol();
const SHA = Symbol();
const AUTHOR = Symbol();
const EMAIL = Symbol();
const DATE = Symbol();

class Commit
{
  constructor(commit)
  {
    this[ID] = commit.id();
    this[MESSAGE] = commit.message();
    this[SHA] = commit.sha();
    this[AUTHOR] = commit.author().name();
    this[EMAIL] = commit.author().email();
    this[DATE] = commit.date();
  }

  get id(){
    return this[ID];
  }

  get message(){
    return this[MESSAGE];
  }

  get sha(){
    return this[SHA];
  }

  get author(){
    return this[AUTHOR];
  }

  get email(){
    return this[EMAIL];
  }

  get date(){
    return this[DATE];
  }
}
