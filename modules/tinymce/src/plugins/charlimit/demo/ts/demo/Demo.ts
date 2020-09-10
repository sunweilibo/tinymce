declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'charlimit code',
  toolbar: 'charlimit',
  height: 600,
  paste_as_text: true,
  maxCharacterLength: 20
});

export {};