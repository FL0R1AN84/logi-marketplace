import { CommandAction } from '@logitech/plugin-sdk';
import {
  compressSelection,
  copySelectionToClipboard,
  pressFinderShortcut,
  runAppleScript,
} from './finder-automation.js';

type ActionHandler = () => Promise<void>;

class FinderCommandAction extends CommandAction {
  override readonly groupName: string;

  get name(): string {
    return this.configuration.name;
  }

  get displayName(): string {
    return this.configuration.displayName;
  }

  get description(): string {
    return this.configuration.description;
  }

  constructor(
    private readonly configuration: {
      name: string;
      displayName: string;
      description: string;
      groupName: string;
    },
    private readonly execute: ActionHandler,
  ) {
    super();
    this.groupName = configuration.groupName;
  }

  async onKeyDown(): Promise<void> {
    try {
      await this.execute();
    } catch (error) {
      console.error(`Finder action "${this.displayName}" failed:`, error);
      throw error;
    }
  }
}

export const finderActions = [
  new FinderCommandAction(
    {
      name: 'new_finder_tab',
      displayName: 'New Tab',
      description: 'Open a new Finder tab',
      groupName: 'Windows and Tabs',
    },
    () => pressFinderShortcut('t', 'command down'),
  ),
  new FinderCommandAction(
    {
      name: 'find_in_finder',
      displayName: 'Find',
      description: 'Start a search in Finder',
      groupName: 'Search',
    },
    () => pressFinderShortcut('f', 'command down'),
  ),
  new FinderCommandAction(
    {
      name: 'toggle_hidden_files',
      displayName: 'Toggle Hidden Files',
      description: 'Show or hide hidden files in Finder',
      groupName: 'View',
    },
    () => pressFinderShortcut('.', 'command down, shift down'),
  ),
  new FinderCommandAction(
    {
      name: 'open_trash',
      displayName: 'Open Trash',
      description: 'Open the macOS Trash in Finder',
      groupName: 'Trash',
    },
    () =>
      runAppleScript(
        'tell application "Finder"\n' +
          '    activate\n' +
          '    if (count of Finder windows) is 0 then make new Finder window\n' +
          '    set target of front Finder window to trash\n' +
          'end tell',
      ),
  ),
  new FinderCommandAction(
    {
      name: 'empty_trash',
      displayName: 'Empty Trash',
      description: 'Empty the Trash through Finder',
      groupName: 'Trash',
    },
    () =>
      runAppleScript(
        'tell application "Finder"\n' +
          '    activate\n' +
          '    empty trash\n' +
          'end tell',
      ),
  ),
  new FinderCommandAction(
    {
      name: 'copy_file_names',
      displayName: 'Copy File Name',
      description: 'Copy the selected Finder item names',
      groupName: 'Selection',
    },
    () => copySelectionToClipboard(false),
  ),
  new FinderCommandAction(
    {
      name: 'copy_file_paths',
      displayName: 'Copy File Path',
      description: 'Copy the selected Finder item paths',
      groupName: 'Selection',
    },
    () => copySelectionToClipboard(true),
  ),
  new FinderCommandAction(
    {
      name: 'compress_selection',
      displayName: 'Compress Selection',
      description: 'Create a ZIP archive from the selected Finder items',
      groupName: 'Selection',
    },
    compressSelection,
  ),
];
