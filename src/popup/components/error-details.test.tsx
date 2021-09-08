/**
 * @jest-environment jsdom
 */
import { render as renderComponent, waitFor } from "@testing-library/react";
import React from "react";
import StackTrace from "stacktrace-js";

import type { Props as CopyButtonProps } from "./copy-button";
import type { Props } from "./error-details";
import CopyErrorDetails from "./error-details";

jest
  .mock("stacktrace-js", () => ({ fromError: jest.fn() }))
  .mock("./copy-button", () => ({ value }: CopyButtonProps) => (
    <button type="button" value={value}>
      Copy error details
    </button>
  ));

class MockStackFrame {
  functionName: string;

  fileName: string;

  lineNumber: number;

  columnNumber: number | null;

  constructor(
    functionName: string,
    fileName: string,
    lineNumber: number,
    columnNumber: number | null
  ) {
    this.functionName = functionName;
    this.fileName = fileName;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
  }

  getFunctionName() {
    return this.functionName;
  }

  getFileName() {
    return this.fileName;
  }

  getLineNumber() {
    return this.lineNumber;
  }

  getColumnNumber() {
    return this.columnNumber;
  }
}

describe("error-details", () => {
  function render(overrides: Partial<Props>) {
    const defaults: Props = { errors: [new Error("WAT?")] };
    const props = { ...defaults, ...overrides };
    return renderComponent(<CopyErrorDetails {...props} />);
  }

  beforeEach(() => {
    (StackTrace.fromError as jest.Mock).mockResolvedValue(
      (
        [
          ["scan", "src/common/adapters/github.js", 74, 8],
          ["attempt", "src/common/search.js", 12, 26],
          ["search", "src/common/search.js", 27, 45],
          ["search", "src/common/search.js", 27, 25],
          [
            "browser.runtime.onMessage.addListener",
            "src/web-extension/content.js",
            8,
            13,
          ],
          [
            "wrappedSendResponse",
            "node_modules/webextension-polyfill/dist/browser-polyfill.js",
            1057,
            null,
          ],
        ] as const
      ).map(
        ([functionName, fileName, lineNumber, columnNumber]) =>
          new MockStackFrame(functionName, fileName, lineNumber, columnNumber)
      )
    );
  });

  afterEach(() => {
    (StackTrace.fromError as jest.Mock).mockClear();
  });

  it("renders a button to copy the error details", async () => {
    const screen = render({ errors: [new Error("Boom!")] });
    await waitFor(() => {
      const button = screen.getByRole("button", {
        name: "Copy error details",
      }) as HTMLButtonElement;
      expect(button.value).toMatchSnapshot();
    });
  });
});
