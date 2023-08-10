// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const siteUrl = "https://revanced.app"

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ReVanced',
  tagline: 'Continuing the legacy of Vanced.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: siteUrl,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/revanced/revanced-website/tree/dev/docusaurus',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      navbar: {
        logo: {
          alt: 'ReVanced Logo',
          target: '_self',
          href: siteUrl,
          src: 'img/logo.svg',
          height: 22,
          width: 22
        },
        items: [
          {
            to: siteUrl,
            label: 'Home',
            target: '_self'
          },
          {
            to: `${siteUrl}/download`,
            label: 'Download',
            target: '_self'
          },
          {
            to: `${siteUrl}/patches`,
            label: 'Patches',
            target: '_self'
          },
          {
            to: `${siteUrl}/contributors`,
            label: 'Contributors',
            target: '_self'
          },
          {
            to: `${siteUrl}/donate`,
            label: 'Donate',
            target: '_self'
          },
          {
            to: "/docs/",
            items: [
              {
                to: '/category/revanced-manager',
                label: 'Guide',
              },
              {
                to: '/development/revanced-patches/apis',
                label: 'FAQ',
              },
              {
                to: '/development/revanced-patches/skeleton',
                label: 'Troubleshooting',
              },
            ],
            label: 'Docs'
          },
        ],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['kotlin'],
      },
    }),
};

module.exports = config;
