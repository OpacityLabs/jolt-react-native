import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to MyRustModule.web.ts
// and on native platforms to MyRustModule.ts
import MyRustModule from "./src/MyRustModule";
import MyRustModuleView from "./src/MyRustModuleView";
import {
  ChangeEventPayload,
  MyRustModuleViewProps,
} from "./src/MyRustModule.types";

// Get the native constant value.
export const PI = MyRustModule.PI;

export function hello(): string {
  return MyRustModule.hello();
}

export async function joltProve(n: number): Promise<String> {
  return await MyRustModule.jolt_prove(n);
}

export async function joltVerify(proofString: string): Promise<boolean> {
  return await MyRustModule.jolt_verify(proofString);
}

export async function setValueAsync(value: string) {
  return await MyRustModule.setValueAsync(value);
}

const emitter = new EventEmitter(
  MyRustModule ?? NativeModulesProxy.MyRustModule
);

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export { MyRustModuleView, MyRustModuleViewProps, ChangeEventPayload };
