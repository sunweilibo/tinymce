/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import {
  AddEventsBehaviour, AlloyEvents, Behaviour, Button, GuiFactory, Replacing, Representing, SimpleSpec, Tabstopping
} from '@ephox/alloy';
import Editor from 'tinymce/core/api/Editor';
import { UiFactoryBackstageProviders } from '../../backstage/Backstage';
import * as ReadOnly from '../../ReadOnly';
import { DisablingConfigs } from '../alien/DisablingConfigs';

const enum WordCountMode {
  Characters = 'characters'
}

export const renderCharLimit = (editor: Editor, providersBackstage: UiFactoryBackstageProviders): SimpleSpec => {
  const maxCharacterLength = editor.getParam('maxCharacterLength', 20, 'number');
  const replaceCountText = (comp, count, mode) => Replacing.set(comp, [ GuiFactory.text(providersBackstage.translate([ '{0}/{1} ' + mode, count[mode], maxCharacterLength ])) ]);

  return Button.sketch({
    dom: {
      // The tag for word count was changed to 'button' as Jaws does not read out spans.
      // Word count is just a toggle and changes modes between words and characters.
      tag: 'p',
      classes: [ 'tox-statusbar__wordcount' ]
    },
    components: [ ],
    buttonBehaviours: Behaviour.derive([
      DisablingConfigs.button(providersBackstage.isReadOnly),
      ReadOnly.receivingConfig(),
      Tabstopping.config({ }),
      Replacing.config({ }),
      Representing.config({
        store: {
          mode: 'memory',
          initialValue: {
            mode: WordCountMode.Characters,
            count: { words: 0, characters: 0 }
          }
        }
      }),
      AddEventsBehaviour.config('wordcount-events', [
        AlloyEvents.runOnExecute((comp) => {
          const currentVal = Representing.getValue(comp);
          const newMode = WordCountMode.Characters;
          Representing.setValue(comp, { mode: newMode, count: currentVal.count });
          replaceCountText(comp, currentVal.count, newMode);
        }),
        AlloyEvents.runOnAttached((comp) => {
          editor.on('wordCountUpdate', (e) => {
            const { mode } = Representing.getValue(comp);
            Representing.setValue(comp, { mode, count: e.wordCount });
            replaceCountText(comp, e.wordCount, mode);
          });
        })
      ])
    ]),
    eventOrder: {
      'alloy.execute': [ 'disabling', 'alloy.base.behaviour', 'wordcount-events' ]
    }
  });
};
