import { is_tree } from './documentation.shared';
import type { Document, DocsTree, DocsTreeNode, DocumentInfo } from './documentation.shared';

import { browser, prerendering } from '$app/environment';

import fs, { existsSync as exists } from 'fs';
import path from 'path';


import { parse as parse_md } from 'marked';
import AsciiDocProcessor from 'asciidoctor'

// This file does not work in a browser.
if (browser) {
  throw Error('SvelteKit has skill issues');
}

/// Constants

const supported_formats: Map<string,  (markup: string) => Document> = new Map();

supported_formats.set("md", markup => {
  let lines = markup.split('\n');

  // Get and remove the first line.
  const first_line = lines.splice(0, 1)[0];
  // Remove `# `.
  const title = first_line.substring(2);

  // Convert the rest to html
  const content = parse_md(lines.join('\n'));

  return { title, content };
});

const asciidoctor = AsciiDocProcessor();
const adoc_fn = markup => {
  // Get first line.
  const first_line = markup.split('\n')[0];
  // Remove `= `.
  const title = first_line.substring(2);

  // Convert it to html. Unlike markdown, we do not need to remove the first title heading.
  // NOTE: Maybe consider change the safe mode value.
  const content = asciidoctor.convert(markup, { doctype: "book" })

  return { title, content };
}

supported_formats.set("adoc", adoc_fn)
supported_formats.set("asciidoc", adoc_fn)

const supported_filetypes = [...supported_formats.keys()];

let docs_folder = process.env.REVANCED_DOCS_FOLDER;
if (docs_folder === undefined) {
  if (prerendering) { console.warn("Using testing docs in production build") }
  docs_folder = "testing-docs";
}

const ignored_items = ["assets", "README.md"];

/// Utility functions

function is_directory(item: string) {
  return fs.lstatSync(item).isDirectory();
}

function get_ext(fname: string) {
  // Get extname and remove the first dot.
  return path.extname(fname).substring(1);
}

function get_slug_of_node(node: DocsTreeNode): string {
  if (is_tree(node)) {
    return node.index.slug;
  }

  return node.slug;
}

/// Important functions

// Get a document. Returns null if it does not exist.
export function get(slug: string): Document|null {
  let target = path.join(docs_folder, slug);
  // Handle index file for folder.
  if (exists(target) && is_directory(target)) {
    target += "/index";
  }

  const dir = path.dirname(target);
  if (!exists(dir)) {
    return null;
  }

  let full_path, ext, found = false;
  // We are looking for the file `${target}.(any_supported_extension)`. Try to find it.
  for (const item of fs.readdirSync(dir)) {
    full_path = path.join(dir, item);
    // Get file extension
    ext = get_ext(item);

    // Unsupported/unrelated file.
    if (!supported_formats.has(ext)) {
      continue;
    }

    const desired_path = `${target}.${ext}`; // Don't grab some other random supported file.
    if (!is_directory(full_path) && desired_path == full_path) {
      // We found it.
      found = true;
      break;
    }
  }

  if (!found) {
    return null;
  }

  // Process the file and return.
  return supported_formats.get(ext)(fs.readFileSync(full_path, 'utf-8'));
}

// Get file information
function process_file(fname: string): DocumentInfo {
  // Remove docs folder prefix and file extension suffix, then split it.
  const parts = fname
    .substring(`${docs_folder}/`.length, fname.length - (get_ext(fname).length + 1))
    .split("/");

  // Remove `index` suffix if present.
  const last_index = parts.length - 1;
  if (parts[last_index] == "index") {
    parts.pop();
  }

  const slug = parts.join("/");
  const title = get(slug).title;

  return { slug, title };
}

// Returns a document tree.
function process_folder(dir: string): DocsTree {
  let tree: DocsTree = {
    index: null,
    nodes: []
  };

  // List everything in the directory.
  const items = fs.readdirSync(dir);

  for (const item of items) {
    if (ignored_items.includes(item) || [".", "_"].includes(item[0])) {
      continue;
    }

    const itemPath = path.join(dir, item);

    const is_dir = is_directory(itemPath);
    let is_index_file = false;

    if (!is_dir) {
      // Ignore files we cannot process.
      if (!supported_formats.has(get_ext(item))) {
        continue;
      }

      for (const ext of supported_filetypes) {
        if (item == `index.${ext}`) {
          is_index_file = true;
        }
      }
    }

    const node = is_dir ? process_folder(itemPath) : process_file(itemPath);

    if (is_index_file) {
      tree.index = node;
    } else {
      tree.nodes.push(node);
    }
  }

  if (tree.index === null) {
    throw Error(`${dir} has no index file.`);
  }

  // `numeric: true` because we want to be able to specify
  // the order if necessary by prepending a number to the file name.
  tree.nodes.sort(
    (a, b) => get_slug_of_node(a).localeCompare(get_slug_of_node(b), "en", { numeric: true })
  );

  return tree;
}

// Returns the document tree.
export function index_content(): DocsTree {
  return process_folder(docs_folder);
}
