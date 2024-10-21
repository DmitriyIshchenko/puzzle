import { Component } from "../ui/base/Component";

// use never since any is not allowed

export function findAllInstancesOf<T>(
  classConstructor: new (...args: never[]) => T, // return an instance of type T
  component: Component,
): T[] {
  let instances: T[] = [];

  if (component instanceof classConstructor) {
    instances.push(component);
  }

  component.getChildren().forEach((child) => {
    instances = instances.concat(findAllInstancesOf(classConstructor, child));
  });

  return instances;
}
