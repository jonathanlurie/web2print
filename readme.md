Converts HTML+CSS into PDF, with @page and all the print styling rules. Uses Puppeteer under the hood.

Motivation: create print ready multipage documents without having to rely on heavy press software such as Adobe InDesign or Scribus. Since the release of CSS3, all the necessary rules for print are available and Puppeteer (aka. headless Chromium) provides a very nice pdf export.

**Usage**

- install: `npm install web2print -g` *(sudo may be necessary)*
- run: `web2print -in=path/to/inputfile.html -out=/path/to/output.pdf`
- watch: `web2print -in=path/to/inputfile.html -out=/path/to/output.pdf -watch` to keep creating the output pdf whenever the input is modified and saved.

*Note* that the input HTML file can import (link) CSS files that contain all the formatting rules, including the *print* rules.
