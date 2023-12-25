import "./style/index.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

const container: HTMLElement = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
