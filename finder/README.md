# Finder plugin for Logi Actions

Node.js/TypeScript plugin for Logitech Actions devices. It provides Finder
new tabs, search, hidden-file toggling, Trash actions, copying
selected names and paths, and ZIP compression.

## Requirements

- macOS with Finder
- Logi Options+ 2.2 or later (Plugin API 6.3+)
- Node.js 22 or later

The Logi Actions Node.js SDK is currently in beta. The Node SDK's documented
macOS support begins with Plugin API 6.3.

## Install dependencies

From this directory, install dependencies once:

```sh
npm install
```

## Build and test locally

Run the watcher to build and load the plugin into Logi Plugin Service:

```sh
npm run watch
```

Open Logi Options+, select the Actions Ring customization view, and look for
Finder Plugin under **All Actions** / **Installed Plugins**. The watcher
rebuilds and reloads the plugin as files change. Stop it with Ctrl+C; it
unlinks the development plugin.

The default action icon background is `#00b9fa` with black icons and text.
Existing custom icon settings take precedence and may need to be reset in the
Logi Options+ icon editor to show the plugin's default.

Alternatively, build and link manually:

```sh
npm run build
npm run link
# Remove the development link when done:
npm run unlink
```

Grant macOS Automation and Accessibility permissions if prompted. Test each
action on the actual device, including no selection, multiple selected files,
existing archive names, and Finder confirmation dialogs before using it with
valuable data.

## Package for submission

Confirm the plugin's Marketplace metadata, license and support links, and
review the [EULA draft](EULA.md) before submission. The editable icon source is
`assets/plugin-icon.svg`. Then build and package:

```sh
npm run build:pack
```

Submit the resulting `.lplug4` at
[marketplace.logitech.com/contribute](https://marketplace.logitech.com/contribute).
Logitech requires proper testing on supported hardware, a final plugin icon,
compatible metadata, a Developer EULA, and acceptance of the Marketplace
Developer Agreement. Submission is reviewed and publication is subject to
Logitech approval.

## License

The Finder plugin is licensed under the [MIT License](LICENSE).
Third-party components have their own notices in
[`package/THIRD-PARTY-NOTICES.txt`](package/THIRD-PARTY-NOTICES.txt).
Before submission, check with Logitech whether the MIT license satisfies its
Developer EULA requirement. If a separate EULA is needed, review the draft for
compatibility with the MIT license before using it.

## macOS permissions

The tab, search, and hidden-files shortcuts are sent through System Events.
macOS may require Accessibility permission for Logi Plugin Service and
automation permission to control Finder. Copying names/paths and compression
read the current Finder selection. Empty Trash uses Finder's own command.

## Current limitations

- Compression creates the ZIP in the directory containing the first selected
  item. If the destination archive already exists, a numbered name is chosen.
- Multi-selection copy puts one name or path per line on the clipboard.
- The package metadata targets macOS-compatible Node Plugin API 6.3+.
- This is an early SDK beta integration and has not yet passed Marketplace
  review. Confirm that Logitech currently accepts Node.js SDK plugins.

Some action icons and symbols are from Tabler Icons; their license is included
in `package/THIRD-PARTY-NOTICES.txt`. Action symbols use black filled paths on
a transparent background so Logi Options+ can recolor the whole symbol. Convert
strokes to filled outlines when replacing a symbol.
