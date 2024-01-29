/*global QUnit*/

sap.ui.define([
	"zpcsac/controller/Email.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Email Controller");

	QUnit.test("I should test the Email controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
