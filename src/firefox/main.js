var data = require("sdk/self").data;
var clipBoard = require("sdk/clipboard");
var activeTab = null;

var popupPanel = require("sdk/panel").Panel({
  width: 270,
  height: 240,
  contentURL: data.url("popup/popup.html"),
  contentScriptFile: [
    data.url("bowser.js"),
    data.url("dist/jquery.js"),
    data.url("popup/popup.js")
  ],
  onHide: handleHide
});

popupPanel.on("show", function() {
  popupPanel.port.emit("show");
});

popupPanel.port.on("set-clipboard", function(text) {
  clipBoard.set(text);
});

popupPanel.port.on("close", function() {
  popupPanel.hide();
});

// Messages between content script and popupPanel
popupPanel.port.on("get-tickets", function() {
  activeTab.port.emit("get-tickets");
});

function handleHide() {
  toggleButton.state('window', {checked: false});
}

var toggleButton = require("sdk/ui/button/toggle").ToggleButton({
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "16": "./icon16.png",
    "32": "./icon32.png",
    "64": "./icon64.png"
  },
  onClick: handleChange
});

function handleChange(state) {
  if (state.checked) {
    var tab = require("sdk/tabs").activeTab.attach({
      contentScriptFile: [
        data.url("bowser.js"),
        data.url("dist/jquery.js"),
        data.url("content.js")
      ]
    });
    popupPanel.show({
      position: toggleButton
    });
    activeTab = tab;
    tab.port.on("tickets", function(tickets) {
      popupPanel.port.emit("tickets", tickets);
    });
  }
}
