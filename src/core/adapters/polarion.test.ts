/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";

import scan from "./polarion";

const url = new URL(
  "https://polarion.company-url.com/polarion/#/project/test_project/workitem?id=RC-654",
);

const htmlSnippet = `
<div class="polarion-WorkItem-TitleSection" id="DOM_2870"></div>
<div>
  <table>
    <tbody>
      <tr>
        <td class="polarion-WorkItem-Title">
          <table>
            <tbody>
              <tr>
                <td class="polarion-WorkitemTitleIcons">
                  <span class="polarion-no-style-cleanup">
                    <a target="_top" class="polarion-Hyperlink" href="#/project/test_project/workitem?id=RC-654">
                      <span>
                        <img src="/polarion/icons/group/task.png" class="polarion-Icons">
                      </span>
                      <span>RC-654</span> - <span>Update Sha.js</span>
                    </a>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- type field preview as in real Polarion preview -->
  <table>
    <tbody>
      <tr>
        <td class="polarion-NameCell" id="LABEL_type">Type:</td>
        <td class="polarion-SectionLayouterContentCell" id="FIELD_type">
          <span class="polarion-JSEnumOption" title="Task">Task</span>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- description preview -->
  <div id="FIELD_description">
    <div class="polarion-WorkItemPreview-DescriptionPreview">
      <span class="polarion-TextField polarion-RichTextFieldValue">
        Use new versions of sha.js to address security issues.
      </span>
    </div>
  </div>

</div>
`;

describe("polarion adapter", () => {
  function doc(body = "") {
    const { window } = new JSDOM(
      `<html><head><title>Title</title></head><body>${body}</body></html>`,
    );
    return window.document;
  }

  it("returns an empty array when page does not contain a valid workitem", async () => {
    const result = await scan(url, doc("<div>Invalid content</div>"));

    expect(result).toEqual([]);
  });

  it("extracts ticket from Polarion workitem page", async () => {
    const result = await scan(url, doc(htmlSnippet));

    expect(result).toEqual([
      {
        id: "RC-654",
        title: "Update Sha.js",
        type: "feature",
        url: url.toString(),
        description: "Use new versions of sha.js to address security issues.",
      },
    ]);
  });

  it("extracts ticket with type 'bug' when type field is 'Bug'", async () => {
    const bugHtml = htmlSnippet.replace('title="Task">Task', 'title="Bug">Bug');
    const result = await scan(url, doc(bugHtml));

    expect(result[0].type).toBe("bug");
  });
});
