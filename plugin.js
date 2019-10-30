/**
 * @file
 * Spellchecker plugin for CKEditor.
 *
 * This plugin basically wraps the library provided by wishawa/thai-spell-check
 *   which uses LibThai to break words and find spelling mistakes.
 *   @author Sushil Gupta <sushil@appsynth.net>
 *   @see https://github.com/wishawa/thai-spell-check
 */

let checkerFunction;
let thaiSpellcheckerReady = false;

import('./checker.js').then(function (module) {
    module.loadThaiSpellchecker().then(function (r) {
        checkerFunction = r;
        thaiSpellcheckerReady = true;
    });
});

CKEDITOR.plugins.add('spellchecker', {
    icons: 'spellchecker',
    init: function (editor) {
        editor.addContentsCss('/libraries/spellchecker/styles/style.css');
        editor.addCommand('spellCheck', {
            exec: function (editor) {
                if (!thaiSpellcheckerReady) {
                    return;
                }

                let selection = editor.getSelection();
                let textToCheck = selection.getSelectedText();

                if (!textToCheck.length) {
                    return;
                }

                let checkResult = checkerFunction(textToCheck);

                if (checkResult.length > 0) {
                    let editor_data = editor.getData();
                    for (let i = 0; i < checkResult.length; i++) {
                        let wrongWord = selection.getSelectedText().slice(checkResult[i][0], checkResult[i][1]);
                        wrongWord = wrongWord.replace(/(\r\n|\n|\r)/gm, "");
                        editor_data = editor_data.replace(wrongWord, '<span class="wrongWord">' + wrongWord + '</span>');
                    }
                    editor.setData(editor_data);
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
});