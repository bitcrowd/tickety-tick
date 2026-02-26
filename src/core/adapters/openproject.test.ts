/**
 * @jest-environment node
 */

import fs from "fs";
import { JSDOM } from "jsdom";
import path from "path";

import scan from "./openproject";

const url = new URL(
  "https://bitcrowd.openproject.net/projects/tickety-tick/work_packages/166/activity",
);

describe("openproject adapter", () => {
  function doc(html = "") {
    const { window } = new JSDOM(html);
    return window.document;
  }

  function fixture(name: string) {
    return fs.readFileSync(
      path.join(__dirname, "__fixtures__/openproject", name),
      "utf-8",
    );
  }

  it("returns an empty array if it is on a different page", async () => {
    const result = await scan(url, doc("<html><body>other</body></html>"));
    expect(result).toEqual([]);
  });

  it("extracts tickets from work package pages", async () => {
    const result = await scan(url, doc(fixture("wp-full-view.html")));
    expect(result).toEqual([
      {
        id: "166",
        title: "Add support for OpenProject",
        type: "task",
        url: "https://bitcrowd.openproject.net/wp/166",
      },
    ]);
  });

  it("extracts tickets from split views", async () => {
    const result = await scan(url, doc(fixture("wp-split-view.html")));
    expect(result).toEqual([
      {
        id: "166",
        title: "Add support for OpenProject",
        type: "epic",
        url: "https://bitcrowd.openproject.net/wp/166",
      },
    ]);
  });

  it("supports any kind of ticket type", async () => {
    const html = `
      <html>
        <head>
          <title>Some other title (#666)</title>
        </head>
        <body>
          <op-wp-full-view>
            <op-editable-attribute-field>
              <span data-field-name="type">Feature</span>
            </op-editable-attribute-field>
            <op-editable-attribute-field>
              <span data-field-name="subject">Some other ticket</span>
            </op-editable-attribute-field>
          </op-wp-full-view>
        </body>
      </html>
    `;
    const result = await scan(url, doc(html));
    expect(result).toEqual([
      {
        id: "666",
        title: "Some other ticket",
        type: "feature",
        url: "https://bitcrowd.openproject.net/wp/666",
      },
    ]);
  });

  it("stops when the ticket ID cannot be extracted", async () => {
    const html = `
      <html>
        <head>
          <title>Some other title (666)</title>
        </head>
        <body>
          <op-wp-full-view>
            <op-editable-attribute-field>
              <span data-field-name="type">Feature</span>
            </op-editable-attribute-field>
            <op-editable-attribute-field>
              <span data-field-name="subject">Some other ticket</span>
            </op-editable-attribute-field>
          </op-wp-full-view>
        </body>
      </html>
    `;
    const result = await scan(url, doc(html));
    expect(result).toEqual([]);
  });

  it("stops when the ticket title cannot be extracted", async () => {
    const html = `
      <html>
        <head>
          <title>Some other title #(666)</title>
        </head>
        <body>
          <op-wp-full-view>
            <op-editable-attribute-field>
              <span data-field-name="type">Feature</span>
            </op-editable-attribute-field>
            <op-editable-attribute-field>
              <span data-field-name="subject"></span>
            </op-editable-attribute-field>
          </op-wp-full-view>
        </body>
      </html>
    `;
    const result = await scan(url, doc(html));
    expect(result).toEqual([]);
  });

  it("falls back to type feature when the type cannot be extracted", async () => {
    const html = `
      <html>
        <head>
          <title>Some other title (#666)</title>
        </head>
        <body>
          <op-wp-full-view>
            <op-editable-attribute-field>
              <span data-field-name="type"> </span>
            </op-editable-attribute-field>
            <op-editable-attribute-field>
              <span data-field-name="subject">Some other ticket</span>
            </op-editable-attribute-field>
          </op-wp-full-view>
        </body>
      </html>
    `;
    const result = await scan(url, doc(html));
    expect(result).toEqual([
      {
        id: "666",
        title: "Some other ticket",
        type: "feature",
        url: "https://bitcrowd.openproject.net/wp/666",
      },
    ]);
  });
});
