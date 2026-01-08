// openlayers
import { Point } from 'ol/geom';
// react
import * as React from 'react';

import { BASE_CENTER, coordinate, DEFAULT_SOURCE_SRID, DEFAULT_SRID } from '@/common/base-type';
import { useOlInteraction } from '@/hooks/useOlInteraction';
// hooks
import { useOlMap } from '@/hooks/useOlMap';
import { useOlMapControl } from '@/hooks/useOlMapControl';
import { useOlVectorLayers } from '@/hooks/useOlVectorLayers';

interface MapViewerProps {
  sourceSRID?: string;
  center?: coordinate;
  initPosition?: coordinate;
}

const MapViewer = React.forwardRef<HTMLDivElement, MapViewerProps>((props, ref) => {
  const { sourceSRID = DEFAULT_SOURCE_SRID, center = BASE_CENTER, initPosition = BASE_CENTER } = props;

  // useRef
  const ref_canvas = React.useRef<HTMLDivElement | null>(null);
  const { mapRef } = useOlMap(ref_canvas);
  const { drawVectorSourceRef, cleanDrawLayer } = useOlVectorLayers({ mapRef });
  const { setDrawLineActive } = useOlInteraction({
    mapRef,
    drawVectorSource: drawVectorSourceRef,
  });
  useOlMapControl({
    mapRef,
    onCleanGeometry: cleanDrawLayer,
    onToggleNewLine: (active) => {
      setDrawLineActive(active);
    },
  });
  const moveCenter = React.useCallback(
    (coord: coordinate, srid: string) => {
      if (!mapRef.current) return;

      const p = new Point(coord);
      if (srid !== DEFAULT_SRID) p.transform(srid, DEFAULT_SRID);
      mapRef.current.getView().animate({ center: p.getCoordinates(), duration: 500 });
    },
    [mapRef],
  );

  React.useEffect(() => {
    moveCenter(initPosition, sourceSRID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, initPosition, moveCenter]);

  React.useEffect(() => {
    if (initPosition !== BASE_CENTER) {
      moveCenter(initPosition, sourceSRID);
    }
  }, [initPosition, moveCenter, sourceSRID]);

  React.useImperativeHandle(ref, () => ref_canvas.current as HTMLDivElement);

  return <div ref={ref_canvas} id="map-viewer" style={{ width: '100%', height: '100%' }} />;
});

export default MapViewer;
