import { useEffect, useState, useMemo, FC } from "react";
import { createPortal } from "react-dom";
import { Entity } from "cesium";

import { useCesium } from "../core";

// @noCesiumElement

/*
@summary
`EntityDescription` provides a way to render description of the entity with React.

Its children will be rendered to the container element specified by container prop (by default, rendered to the info box of the viewer) with React Portal. So you can use any event or dynamic state inside children of this component.
*/

/*
@scope
EntityDescription can be mounted only inside[Entity](/components/Entity) components,
and can not be mounted more than once or together with EntityStaticDescription component for each entity.
*/

export type EntityDescriptionProps = {
  container?: Element;
  resizeInfoBox?: boolean;
};

const EntityDescription: FC<EntityDescriptionProps> = ({
  children,
  container,
  resizeInfoBox = true,
}) => {
  const { viewer, entity } = useCesium();
  const [selected, setSelected] = useState(false);
  const c = useMemo(
    () => container ?? viewer?.infoBox.frame.contentDocument?.createElement("div"),
    [container, viewer?.infoBox?.frame?.contentDocument?.createElement],
  );

  // Update selected state
  useEffect(() => {
    if (!viewer || !entity) return;
    const ev = (e?: Entity) => {
      setSelected(!!e && e.id === entity.id);
    };
    viewer.selectedEntityChanged.addEventListener(ev);
    return () => {
      viewer.selectedEntityChanged.removeEventListener(ev);
    };
  }, [entity, viewer]);

  // Render content to info box
  useEffect(() => {
    if (container || !c || !viewer) return;
    const frame = viewer.infoBox?.frame;
    const parent = frame?.contentDocument?.querySelector(".cesium-infoBox-description");
    if (!frame || !parent) return;
    if (selected) {
      parent.appendChild(c);
      if (resizeInfoBox) {
        // auto resize
        frame.style.display = "block";
        frame.style.height = parent.getBoundingClientRect().height + "px";
        delete frame.style.display;
      }
    } else if (c.parentElement === parent) {
      parent.removeChild(c);
    }
  }, [c, container, resizeInfoBox, selected, viewer]);

  return c ? createPortal(!container || selected ? children : null, c) : null;
};

export default EntityDescription;
