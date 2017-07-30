<template>
    <textarea :id="id" ref="editor">
    </textarea>
</template>

<script>
    export default {
        name: 'p-editor',
        props: {
            value: {
                type: String,
            },
            options: Object,
            id: {
                type: String,
                default: 'editor'
            }
        },
        data () {
            return {
                isInit: false,
                isAssigned: false,
            }
        },
        mounted() {
            if (!window.tinymce) {
                return
            }

            let self = this;

            let options = Object.assign({}, {
                selector: `#${this.id}`,
                height: 200,
                language: 'zh_CN',
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor textcolor colorpicker',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table contextmenu paste code'
                ],
                toolbar: 'undo redo | insert | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | imageSelector',

                setup: function (editor) {

                    // function toTimeHtml(date) {
                    //     return '<time datetime="' + date.toString() + '">' + date.toDateString() + '</time>';
                    // }
                    // function insertDate() {
                    //     var html = toTimeHtml(new Date());
                    //     editor.insertContent(html);
                    // }

                    editor.addButton('imageSelector', {
                        icon: 'image',
                        tooltip: "上传/选取图片",
                        onclick: function () {
                            self.$emit('upload');
                        }
                    });
                }

            }, this.options)

            const editor = this.editor = tinymce.EditorManager.createEditor(this.id, options)

            editor.on('change keyup nodechange', (e) => {
                const val = editor.getContent()
                this.$emit('change', val)
                this.$emit('input', val)
                this.$parent.$emit('el.form.change', val)
            })
            editor.on('blur', (e) => {
                this.$emit('blur', e)
                this.$parent.$emit('el.form.blur', editor.getContent())
            })
            editor.on('init', (e) => {
                console.log('------------->编辑器init.');
                this.isInit = true;
                editor.setContent(this.value)
            })
            editor.render();
        },
        watch: {
            
        },
        methods: {
            setContent(val) {
                if (!this.isInit) {
                    return;
                }
                this.editor.setContent(val)
            },

            getContent() {
                this.editor.getContent()
            },

            //插入图片
            insertImage(url, alt, w, h) {
                this.editor.execCommand('mceInsertContent', false, '<img alt="' + alt + '" height="' + h + '" width=" ' + w + '" src="' + url + '"/>');
            }
        },

        beforeDestory() {
            tinymce && tinymce.execCommand('mceRemoveEditor', false, this.id)
        }
    }

</script>