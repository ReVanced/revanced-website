/// Types

export interface Document {
	title: string;
	// HTML
	content: string;
}

export interface DocumentInfo {
	title: string;
	slug: string;
}

// A tree representing the `docs` folder.
export interface DocsTree {
	// index.whatever
	index: DocumentInfo;
	// Everything except index.whatever
	nodes: DocsTreeNode[];
}

export type DocsTreeNode = DocsTree | DocumentInfo;

/// Functions

export function is_tree(node: DocsTreeNode) {
	return Object.prototype.hasOwnProperty.call(node, 'nodes');
}

export function assert_is_info_node(v: DocsTreeNode) {
	if (!is_tree(v)) {
		throw new Error('Value is not a tree node.');
	}
	return v as DocumentInfo;
}
