import "./index.scss";

import React from "react";
import { createRoot } from "react-dom/client";

import store from "../store";
import Form from "./components/form";

const domNode = document.getElementById("options-root");
const root = createRoot(domNode!);
const element = <Form store={store} />;
root.render(element);
