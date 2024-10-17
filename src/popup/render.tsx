import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter as Router, Route, Routes } from "react-router";

import type { TicketWithFmt } from "../types";
import About from "./components/about";
import Tool from "./components/tool";

function render(tickets: TicketWithFmt[], errors: Error[]) {
  const container = document.getElementById("popup-root");
  const root = createRoot(container!);

  const element = (
    <Router>
      <Routes>
        <Route path="/" element={<Tool tickets={tickets} errors={errors} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );

  root.render(element);
}

export default render;
