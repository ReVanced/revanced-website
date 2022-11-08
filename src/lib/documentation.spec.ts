import { describe, it } from 'vitest';
import { expect } from 'chai';

import * as docs from './documentation.server';
import { is_tree, DocsTree, Document } from './documentation.shared';

// Find a tree specific tree node immediately below the provided one.
function find_tree_node(tree: DocsTree, target_title: string): DocsTree {
  const target = tree.nodes.find(node => is_tree(node) && (node as DocsTree).index.title == target_title);
  expect(target).to.not.be.undefined;
  return target as DocsTree;
}

// Get a document and ensure it is not null
function get_doc(slug: string) {
  const target = docs.get(slug);
  expect(target).to.not.be.null;
  return target as Document;
}

describe("Documentation", () => {
  it("should properly extract the title", () => {
    expect(get_doc('').title).to.equal("Prerequisites");
  })

  // The result will only contain this if it actually managed to convert the markup to html.
  const html_str = "<strong>Bold text";

  it("should support markdown", () => {
    expect(get_doc('markdown-format').content).to.contain(html_str);
  })

  it("should support asciidoc", () => {
    expect(get_doc('adoc-format').content).to.contain(html_str);
  })

  const tree = docs.index_content();

  it("should index recursively", () => {
    const expected = {
      index: {
        slug: "deeply",
        title: "Nesting sample"
      },
      nodes: [
        {
          slug: "deeply/another-page",
          title: "Another Page"
        },
        {
          index: {
            slug: "deeply/nested",
            title: "Nesting sample"
          },
          nodes: [
            {
              index: {
                slug: "deeply/nested/content",
                title: "Nesting sample"
              },
              nodes: []
            }
          ]
        }
      ]
    };

    expect(find_tree_node(tree, "Nesting sample")).to.deep.equal(expected);
  })

  it("should sort numerically", () => {
    const expected = [
      { title: "First", slug: "order/1-c" },
      { title: "Second", slug: "order/2-b" },
      { title: "Third", slug: "order/3-a" },
    ];

    expect(find_tree_node(tree, "Order").nodes).to.deep.equal(expected);
  })
})
