/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { countCharacters, Counter } from '../core/Count';

export type CountGetter = () => number;

interface CountGetters {
  getCharacterCount: CountGetter;
}

export interface WordCountApi {
  body: CountGetters;
}

const createBodyCounter = (editor: Editor, count: Counter): CountGetter => () => count(editor.getBody(), editor.schema);


const get = (editor: Editor): WordCountApi => ({
  body: {
    getCharacterCount: createBodyCounter(editor, countCharacters)
  }
});

export {
  get
};