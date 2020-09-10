declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'charlimit code paste',
  toolbar: 'charlimit',
  height: 600,
  paste_as_text: true,
  maxCharacterLength: 30
});

export {};