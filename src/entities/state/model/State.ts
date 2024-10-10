/*
  TODO: currently it stores only strings. There definitely will be other data types, 
  so you need to find a way to make it generic to store any type.
  The general problem seems to be to create a Map with passed data types./
*/

export class State<T extends object> {
  private fields: Map<string, string>;

  constructor(private stateKey: string) {
    this.fields = this.loadState();

    // NOTE: possible problems with multiple tabs open at the same time
    window.addEventListener("beforeunload", this.saveState.bind(this));
  }

  loadState() {
    const fieldsString = localStorage.getItem(this.stateKey);

    if (fieldsString) {
      const parsed = JSON.parse(fieldsString) as T;

      const entries = Object.entries(parsed);

      return new Map<string, string>(entries);
    }

    return new Map<string, string>();
  }

  saveState() {
    const fields = JSON.stringify(Object.fromEntries(this.fields.entries()));

    localStorage.setItem(this.stateKey, fields);
  }

  resetState() {
    this.fields.clear();
  }

  setValue(name: string, value: string) {
    return this.fields.set(name, value);
  }

  getValue(name: string) {
    return this.fields.get(name) || "";
  }
}
