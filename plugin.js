/**
 * @file
 * Spellchecker plugin for Ckeditor.
 */

let checkerFunction;
let thaiSpellcheckerReady = false;

let contentToCheck;

import('./checker.js').then(function (module) {
  module.loadThaiSpellchecker().then(function (r) {
    checkerFunction = r;
    thaiSpellcheckerReady = true;
  });
});

CKEDITOR.plugins.add('spellchecker', {
  icons: 'spellchecker',
  init: function (editor) {

    editor.addCommand('spellCheck', {
      exec: function (editor) {
        if (!thaiSpellcheckerReady) {
          alert("not ready");
          return;
        }

        let selection = editor.getSelection();

        let checkResult = checkerFunction(selection.getSelectedText());

        if (checkResult.length > 0) {
          alert("mistake(s) found");

          for (let i = 0; i < checkResult.length; i++) {
            alert("incorrectly spelled word: " + selection.getSelectedText().slice(checkResult[i][0], checkResult[i][1]));
          }
          return;
        }
        else {
          alert("no mistake!");
        }
      }
    });

    if (editor.ui.addButton) {
      editor.ui.addButton('spellchecker', {
        label: 'In-Trend Spell Checker',
        id: 'spellchecker',
        command: 'spellCheck',
        toolbar: 'format,100'
      });
    }
  }
})
;
