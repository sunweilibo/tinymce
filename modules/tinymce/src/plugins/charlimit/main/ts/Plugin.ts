/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import * as Api from './api/Api';
import * as CharLimit from './core/CharLimit';

export default function (delay: number = 300) {
  PluginManager.add('charlimit', (editor) => {
    const api = Api.get(editor);

    CharLimit.setup(editor, api, delay);
    return api;
  });
}
