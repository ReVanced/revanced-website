export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface Repository {
  name: string;
  contributors: Contributor[];
}

export interface Patch {
  name:               string;
  description:        string;
  version:            string;
  excluded:           boolean;
  deprecated:         boolean;
  dependencies:       string[];
  options:            PatchOption[];
  compatiblePackages: CompatiblePackage[];
}

export interface CompatiblePackage {
  name:     string;
  versions: string[];
}

export interface PatchOption {
  key:         string;
  title:       string;
  description: string;
  required:    boolean;
  choices:     string[];
}

export interface Asset {
  name: string;
  size: string|null;
  url: string;
  content_type: string;
};

export interface Tool {
  repository: string;
  version: string;
  timestamp: string;
  assets: Asset[];
};

