sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, History) {
        "use strict";

        const sPatternEmailList = "^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,}(\s*;?\s*)*)+$";

        return Controller.extend("zpcsac.controller.Email", {
            _oRichTextEditor: null,
            onInit: function () {
                this.getView().setModel(new JSONModel({
                    Email: ""
                }));

                this._initRichTextEditor();
            },
            onEnviarEmailButtonPress: function (oEvent) {
                let sCc = this.getView().getModel().getProperty("/Cc");
                this._sendEmail(sCc, this._oRichTextEditor.getContent());
            },
            onButtonCancelPress: function (oEvent) {
                this._navBack();
            },
            _navBack: function () {
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteList", {}, {}, true);
                }
            },
            _initRichTextEditor: function () {
                var that = this,
                    sHtmlValue = "";
                // sHtmlValue = '<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">Lorem ipsum dolor sit amet</span></strong>' +
                //     '<span style="font-size: 10.5pt; font-family: sans-serif; color: black;">, consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate. ' +
                //     'Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue. </span></p> ' +
                //     '<p style="margin: 0in 0in 11.25pt; text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><img style="float: left; padding-right: 1em;" src="http://monliban.org/images/1473838236_274706_l_srgb_s_gl_465881_large.jpg" width="304" height="181">' +
                //     '<span style="font-size: 10.5pt; font-family: sans-serif; color: #0070c0;">Phasellus imperdiet metus est, in luctus erat fringilla ut. In commodo magna justo, sit amet ultrices ipsum egestas quis.</span><span style="font-size: 10.5pt; font-family: sans-serif; color: black;"> ' +
                //     'Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. <strong>Aenean quam libero</strong>, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. <strong><em>Aliquam semper neque eu aliquam dictum</em></strong>. ' +
                //     'Nulla in convallis diam. Fusce molestie risus nec posuere ullamcorper. Fusce ut sodales tortor. <u>Morbi eget odio a augue viverra semper.</u></span></p>' +
                //     '<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Fusce dapibus sodales ornare. ' +
                //     'Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. Aenean quam libero, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. Nullam laoreet metus ac enim placerat, nec tempor arcu finibus. ' +
                //     'Curabitur nec pretium odio, sed auctor felis. Nam eu neque faucibus, pharetra purus id, congue elit. Phasellus neque lectus, gravida at cursus at, pretium eu lorem. </span></p>' +
                //     '<ul>' +
                //     '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Nulla non elit hendrerit, auctor arcu sit amet, tempor nisl.</span></li>' +
                //     '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Morbi sed libero pulvinar, maximus orci et, hendrerit orci.</span></li>' +
                //     '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Phasellus sodales enim nec sapien commodo mattis.</span></li>' +
                //     '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Integer laoreet eros placerat pharetra euismod.</span></li>' +
                //     '</ul>' +
                //     '<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #c00000;">Ut vitae commodo ante. Morbi nibh dolor, ullamcorper sed interdum id, molestie vel libero. ' +
                //     'Proin volutpat dui eget ipsum scelerisque, a ullamcorper ipsum mattis. Cras sed elit sit amet diam convallis vehicula vitae ut nisl. Ut ornare dui ligula, id euismod lectus eleifend at. Nulla facilisi. In pharetra lectus et augue consequat vestibulum.</span></p>' +
                //     '<ol>' +
                //     '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Proin id eros vel libero maximus dignissim ac et velit.</span></li>' +
                //     '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">In non odio pharetra, dapibus augue quis, laoreet felis.</span></li>' +
                //     '</ol>' +
                //     '<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Donec a consectetur libero. Donec ut massa justo. Duis euismod varius odio in rhoncus. Nullam sagittis enim vel massa tempor, ' +
                //     'ut malesuada libero mollis. Vivamus dictum diam diam, quis rhoncus ex congue vel.</span></p>' +
                //     '<p style="text-align: center; font-size: 10pt; font-family: Calibri, sans-serif;" align="center"><em><span style="font-family: sans-serif; color: #a6a6a6;">"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."</span></em></p>' +
                //     '<p style="text-align: right; font-size: 10pt; font-family: Calibri, sans-serif;" align="right"><span style="font-family: sans-serif; color: #353535;">-</span> <strong><span style="font-family: sans-serif; color: #353535;">Sed in lacus dolor.</span></strong></p>';
                sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/library"],
                    function (RTE, library) {
                        var EditorType = library.EditorType;
                        that._oRichTextEditor = new RTE("idRTE", {
                            editorType: EditorType.TinyMCE6,
                            width: "100%",
                            height: "400px",
                            customToolbar: true,
                            showGroupFont: true,
                            showGroupLink: true,
                            showGroupInsert: true,
                            value: sHtmlValue,
                            ready: function () {
                                this.addButtonGroup("styles").addButtonGroup("table");
                            }
                        });

                        that.getView().byId("idVerticalLayout").addContent(that._oRichTextEditor);
                    });
            },
            _sendEmail: function (sCc, sBody) {
                var that = this;

                if (this._validateCc(sCc)) {
                    var oDataModel = this.getOwnerComponent().getModel();

                    try {
                        oDataModel.callFunction("/CreateNf", {
                            method: "GET",
                            urlParameters: {
                                Cc: sCc,
                                Body: sBody
                            },
                            success: function (oData, response) {
                                MessageBox.success("Mensagem enviada com sucesso!", {
                                    onClose: function () {
                                        that._navBack();
                                    }
                                });
                                // var aMessages = [];

                                // for (let index = 0; index < oData.results.length; index++) {
                                //     let element = oData.results[index];
                                //     let sType;

                                //     switch (element.Type) {
                                //         case "S":
                                //             sType = "Success";
                                //             break;

                                //         case "E":
                                //             sType = "Error";
                                //             break;

                                //         case "W":
                                //             sType = "Warning";
                                //             break;

                                //         case "I":
                                //             sType = "Information";
                                //             break;

                                //         default:
                                //             break;
                                //     }

                                //     aMessages.push({
                                //         type: sType,
                                //         title: element.Message,
                                //         description: ""
                                //     });
                                // }

                                // that.oMessageView.getModel().setData(aMessages);
                                // that.oMessageView.navigateBack();
                                // that.oDialog.open();
                            },
                            error: function (e) {
                                MessageBox.error("Erro interno do servidor!");
                            }
                        });
                    } catch (e) {
                        MessageBox.error("Erro ao comunicar com o servidor!");
                    }
                } else {
                    MessageBox.error("Digite endereços de e-mails validos\nseparados por \";\"");
                }
            },
            _validateCc: function (sCc) {
                return new RegExp(sPatternEmailList).test(sCc);
            }
        });
    });
