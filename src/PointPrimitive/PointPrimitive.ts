import { PointPrimitive as CesiumPointPrimitive } from "cesium";

import {
  createCesiumComponent,
  EventProps,
  PickCesiumProps,
  UnusedCesiumProps,
  AssertNever,
} from "../core";

/*
@summary
`PointPrimitive` is a point primitive in the `PointPrimitiveCollection`.

Primitive is a low layer API for geographical visualization.
[Entity](/components/entity) is more recommended unless performance issues.
*/

/*
@scope
Only inside [PointPrimitiveCollection](/components/PointPrimitiveCollection) component.
A point object will be attached to the parent PointPrimitiveCollection.
*/

export type PointPrimitiveCesiumProps = PickCesiumProps<CesiumPointPrimitive, typeof cesiumProps>;

export type PointPrimitiveOtherProps = EventProps<CesiumPointPrimitive>;

export type PointPrimitiveProps = PointPrimitiveCesiumProps & PointPrimitiveOtherProps;

const cesiumProps = [
  "color",
  "disableDepthTestDistance",
  "distanceDisplayCondition",
  "id",
  "outlineColor",
  "outlineWidth",
  "pixelSize",
  "position",
  "scaleByDistance",
  "show",
  "translucencyByDistance",
] as const;

const PointPrimitive = createCesiumComponent<CesiumPointPrimitive, PointPrimitiveProps>({
  name: "PointPrimitive",
  create: (context, props) => context.pointPrimitiveCollection?.add(props),
  destroy(element, context) {
    if (context.pointPrimitiveCollection && !context.pointPrimitiveCollection.isDestroyed()) {
      context.pointPrimitiveCollection.remove(element);
    }
  },
  cesiumProps,
  useCommonEvent: true,
});

export default PointPrimitive;

// Unused prop check
type IgnoredProps = never;
type UnusedProps = UnusedCesiumProps<CesiumPointPrimitive, keyof PointPrimitiveProps>;
type AssertUnusedProps = AssertNever<Exclude<UnusedProps, IgnoredProps>>;
