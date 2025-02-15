import React, { useRef } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Viewer as CesiumViewer } from "cesium";

import { CesiumComponentRef } from "../core";
import Viewer from "../Viewer";
import Cesium3DTileset from "./Cesium3DTileset";

storiesOf("Cesium3DTileset", module).add("Basic", () => {
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);
  return (
    <Viewer full ref={ref}>
      <Cesium3DTileset
        url="./tileset/tileset.json"
        onAllTilesLoad={action("onAllTilesLoad")}
        onInitialTilesLoad={action("onInitialTilesLoad")}
        onTileFailed={action("onTileFailed")}
        onTileLoad={action("onTileLoad")}
        onTileUnload={action("onTileUnload")}
        onReady={tileset => {
          ref.current?.cesiumElement?.zoomTo(tileset);
        }}
        onClick={action("onClick")}
      />
    </Viewer>
  );
});
