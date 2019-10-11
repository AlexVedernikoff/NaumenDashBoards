// @flow
export class RefContainer {
  static instance: Object;
  static exists: boolean;
  static ref: Object;

  constructor (ref?: {}) {
    if (RefContainer.exists) {
      return RefContainer.instance;
    }

    RefContainer.instance = this;
    RefContainer.exists = true;
    RefContainer.ref = ref || {};
  }

  getRef (): Object {
    return RefContainer.ref;
  }

  updatetRef (ref?: {}): void {
    RefContainer.ref = ref || {};
  }
}

export default RefContainer;
