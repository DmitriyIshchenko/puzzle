import App from "./app";
import "./style.css";

// @ts-expect-error: typescript doesn't like unused variables, but there is no way to use it here. Simple new App() also triggers ts errors.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new App();
