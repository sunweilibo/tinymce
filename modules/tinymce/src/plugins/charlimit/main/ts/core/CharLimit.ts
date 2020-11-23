/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */
import Delay from 'tinymce/core/api/util/Delay';
import * as Events from '../api/Events';
import Editor from 'tinymce/core/api/Editor';
import { WordCountApi } from '../api/Api';
import { getMaxCharacterLength } from '../api/Settings';
const updateCount = (editor: Editor, api: WordCountApi) => {
  Events.fireWordCountUpdate(editor, api);
};

const setup = (editor: Editor, api: WordCountApi, delay: number) => {
  const debouncedUpdate = Delay.debounce(() => updateCount(editor, api), delay);
  const maxCharLength = getMaxCharacterLength(editor);

  editor.on('init', () => {
    if (!editor.plugins.paste) {
      editor.notificationManager.open({
        text: '请使用 paste 插件，否则无法限制粘贴字符'
      });
    }
    updateCount(editor, api);
    Delay.setEditorTimeout(editor, () => {
      editor.on('SetContent BeforeAddUndo Undo Redo keyup', debouncedUpdate);
    }, 0);
  });
  editor.on('keydown', (e) => {
    const keycode: Number = e.keyCode;
    // 删除键可以使用
    if (api.body.getCharacterCount() >= maxCharLength && keycode !== 8 && keycode!==46) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  editor.on('compositionend', (e) => {
    const input = e.data;
    const inputLength = e.data.length;
    const rng = editor.selection.getRng();
    const node = rng.startContainer;
    const curOffset = rng.startOffset;
    let replaceContent;
    if (inputLength + api.body.getCharacterCount() > maxCharLength) {
      const remainLen = api.body.getCharacterCount() - maxCharLength;
      replaceContent = input.substring(0, remainLen);
      const rng: Range = editor.dom.createRng();
      rng.setStart(node, curOffset - inputLength);
      rng.setEnd(node, curOffset);
      editor.selection.setRng(rng);
      editor.selection.setContent(replaceContent);
    }
  });

  // 使用 paste 插件事件
  editor.on('PastePreProcess', function (args) {
    const currentCharacterCount = api.body.getCharacterCount();
    const extraSpace = maxCharLength - currentCharacterCount;
    args.content = extraSpace > 0 ? args.content.slice(0, extraSpace) : '';
  });
};

export {
  setup,
  updateCount
};
