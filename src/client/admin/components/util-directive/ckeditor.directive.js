'use strict';

angular.module('travelAdmin')
    .directive('ckEditor', [ function () {
        return {
            require: '?ngModel',
            scope: true,
            link: function (scope, element, attr, ngModel) {
                if (!ngModel) return;
                var config = {
                    height: 200,
                    //skin : 'bootstrapck,/assets/ckeditor-theme/bootstrapck/',
                    //filebrowserBrowseUrl: '/fileBrowser.html',
                    //filebrowserUploadUrl: '/v1/api/images/upload',
                    extraPlugins: 'font,colorbutton,iframe',
                    font_names: 'Arial/Arial, Helvetica, sans-serif;' +
                    'Comic Sans MS/Comic Sans MS, cursive;' +
                    'Satisfy/Satisfy, cursive;' +
                    'Helvetica Neue/Helvetica Neue, Helvetica, Arial, sans-serif;' +
                    'Courier New/Courier New, Courier, monospace;' +
                    'Georgia/Georgia, serif;' +
                    'Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;' +
                    'Open Sans/Open Sans;' +
                    'Monotype Corsiva;' +
                    'Tahoma/Tahoma, Geneva, sans-serif;' +
                    'Times New Roman/Times New Roman, Times, serif;' +
                    'Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;' +
                    'Verdana/Verdana, Geneva, sans-serif',
                    font_defaultLabel: 'Open Sans',
                    fontSize_defaultLabel: '13px',
                    language :scope.lang || 'sv'
                };
                config.colorButton_colors =
                    '000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,' +
                    'B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,' +
                    'F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,' +
                    'FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,' +
                    'FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF';

                config.toolbar = [
                    { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                    { name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ] },
                    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
                    { name: 'insert', items: [ 'Image','Table','Iframe','SpecialChar','HorizontalRule','Smiley'] },
                    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
                    { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                    { name: 'paragraph', items: [ 'Font', 'FontSize', 'TextColor'] },
                    { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source' ] },
                    {name: 'styles', items: [ 'Styles']},
                    { name: 'others', items: [ '-' ] }
                ]

                config.image_previewText = " ";
                var ck = CKEDITOR.replace(element[0], config);
                CKEDITOR.on('dialogDefinition', function (ev) {
                    var editor=ev.editor;
                    var dialogName = ev.data.name;
                    var dialogDefinition = ev.data.definition;
                    if (dialogName == 'image') {
                        var uploadTab = dialogDefinition.getContents('Upload');
                        var uploadButton = uploadTab.get('uploadButton');
                        dialogDefinition.dialog.on('show', function () {
                            this.selectPage('Upload');
                        });
                        uploadButton['onClick'] = function (object) {
                            var elem = object.sender.domId;
                            var content = $("#" + elem).parent().parent().prev().find("iframe").contents().find("input:file")[0];
                            if (typeof (content.files) != "undefined") {
                                if (content.files[0]) {
                                    var size = parseFloat(content.files[0].size / (1024 * 1024)).toFixed(2);
                                    if (size > 2) {
                                        alert("Image can't be greater than  2 MB");
                                        return false;
                                    } else {
                                        editor._.filebrowserSe = this;
                                    }
                                }
                                else {
                                    alert("Please Select Image");
                                    return false;
                                }
                            }
                            else {
                                //No HTML5 Browser Support
                            }
                        }
                    }

                });
                ck.on('instanceReady', function () {
                    ck.setData(ngModel.$viewValue);
                });

                function updateModel() {
                    scope.$apply(function () {
                        ngModel.$setViewValue(ck.getData());
                    });
                }
                ck.on('pasteState', updateModel);
                ck.on('change', updateModel);
                ck.on('key', updateModel);
                //ck.on('dataReady', updateModel);

                ngModel.$render = function () {
                    ck.setData(ngModel.$modelValue);
                };
            },
            controller:function($scope,localStorageService){
                $scope.lang=localStorageService.get('NG_TRANSLATE_LANG_KEY');
            }
        };
    }]);
