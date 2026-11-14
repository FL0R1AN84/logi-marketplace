import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function escapeAppleScriptString(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
}

export async function runAppleScript(script: string): Promise<void> {
  await execFileAsync('/usr/bin/osascript', ['-e', script], {
    maxBuffer: 1024 * 1024,
  });
}

export async function pressFinderShortcut(key: string, modifiers: string): Promise<void> {
  await runAppleScript(
    'tell application "Finder" to activate\n' +
      'tell application "System Events"\n' +
      '    tell process "Finder"\n' +
      `        keystroke "${escapeAppleScriptString(key)}" using {${modifiers}}\n` +
      '    end tell\n' +
      'end tell',
  );
}

export async function copySelectionToClipboard(usePaths: boolean): Promise<void> {
  const valueExpression = usePaths
    ? 'POSIX path of (selectedItem as alias)'
    : 'name of selectedItem';

  await runAppleScript(
    'tell application "Finder"\n' +
      '    activate\n' +
      '    set selectedItems to selection\n' +
      '    if (count of selectedItems) is 0 then error "Select at least one item in Finder first."\n' +
      '    set copiedValues to {}\n' +
      '    repeat with selectedItem in selectedItems\n' +
      `        set end of copiedValues to ${valueExpression}\n` +
      '    end repeat\n' +
      'end tell\n' +
      "set AppleScript's text item delimiters to linefeed\n" +
      'set the clipboard to copiedValues as text\n' +
      'set AppleScript\'s text item delimiters to ""',
  );
}

export async function compressSelection(): Promise<void> {
  await runAppleScript(
    'tell application "Finder"\n' +
      '    activate\n' +
      '    set selectedItems to selection as alias list\n' +
      '    if (count of selectedItems) is 0 then error "Select at least one item in Finder first."\n' +
      '    set firstItem to item 1 of selectedItems\n' +
      '    set destinationFolder to POSIX path of (container of firstItem as alias)\n' +
      '    if (count of selectedItems) is 1 then\n' +
      '        set archiveBaseName to name of firstItem\n' +
      '    else\n' +
      '        set archiveBaseName to "Archive"\n' +
      '    end if\n' +
      '    set archivePath to destinationFolder & archiveBaseName & ".zip"\n' +
      '    set suffix to 2\n' +
      '    repeat while (do shell script "if [ -e " & quoted form of archivePath & " ]; then echo yes; else echo no; fi") is "yes"\n' +
      '        set archivePath to destinationFolder & archiveBaseName & " " & suffix & ".zip"\n' +
      '        set suffix to suffix + 1\n' +
      '    end repeat\n' +
      '    set sourceArguments to ""\n' +
      '    repeat with selectedItem in selectedItems\n' +
      '        set sourceArguments to sourceArguments & quoted form of POSIX path of selectedItem & " "\n' +
      '    end repeat\n' +
      '    do shell script "/usr/bin/ditto -c -k --sequesterRsrc --keepParent " & sourceArguments & quoted form of archivePath\n' +
      'end tell',
  );
}
