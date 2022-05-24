import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";

const App = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc: "/files/PDFTRON_about.pdf",
        fullAPI: true,
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      instance.UI.disableElements([
        "leftPanel",
        "leftPanelButton",
        "viewControls",
        "toolbarGroup-Annotate",
        "toolbarGroup-Insert",
        "toolbarGroup-Edit",
        "toolbarGroup-Shapes",
        "toolbarGroup-FillAndSign",
        "signatureFieldToolGroupButton",
        "radioButtonFieldToolGroupButton",
        "listBoxFieldToolGroupButton",
        "comboBoxFieldToolGroupButton",
        "toolsOverlay",
        "viewControlsButton",
      ]);

      //Styling Checkbox
      Annotations.WidgetAnnotation.getCustomStyles = (widget) => {
        if (widget instanceof Annotations.CheckButtonWidgetAnnotation) {
          return {
            "background-color": "blue",
            color: "white",
            opacity: 0.8,
          };
        }
      };
    });
  }, []);

  return (
    <div className="App">
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
