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
      instance.UI.setToolbarGroup("toolbarGroup-Forms");
      instance.UI.disableElements([
        "leftPanel",
        "leftPanelButton",
        "viewControls",
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
        "toolbarGroup-Annotate",
        "toolbarGroup-View",
      ]);

      const renderButton = () => {
        const button = document.createElement("button");
        button.type = "button";
        button.innerHTML = "Save and upload";
        button.onclick = async () => {
          const doc = documentViewer.getDocument();
          const xfdfString = await annotationManager.exportAnnotations();
          const data = await doc.getFileData({
            // saves the document with annotations in it
            xfdfString,
          });
          const arr = new Uint8Array(data);
          const blob = new Blob([arr], { type: "application/pdf" });
          fetch(
            `https://www.filestackapi.com/api/store/S3?key=AK86diKTkS12U7nD8X5hHz`,
            {
              method: "POST",
              body: blob,
            }
          ).then((response) => console.log(response.text()));
        };
        return button;
      };

      const newCustomElement = {
        type: "customElement",
        render: renderButton,
      };

      instance.UI.setHeaderItems(function(header) {
        header.getHeader("ribbons").push(newCustomElement);
      });

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
