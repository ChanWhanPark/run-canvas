// ol
import { Map as OlMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
// ol-ext
import Colorize from 'ol-ext/filter/Colorize';
import * as React from 'react';

import { DEFAULT_SRID } from '@/common/base-type';

export const useOlMap = (targetRef: React.RefObject<HTMLDivElement | null>) => {
  // Hook implementation goes here
  const mapRef = React.useRef<OlMap | null>(null);

  React.useEffect(() => {
    if (!targetRef.current || mapRef.current) return;

    // 1. Initialize the layer
    const osmLayer = new TileLayer({
      source: new OSM({ crossOrigin: 'anonymous' }),
    });
    osmLayer.addFilter(new Colorize({ operation: 'grayscale' }));

    // 2. Initialize the map (ID 대신 ref.current 사용)
    const map = new OlMap({
      target: targetRef.current,
      layers: [osmLayer],
      view: new View({
        projection: DEFAULT_SRID,
        zoom: 2,
      }),
    });
    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, [targetRef]);

  return {
    mapRef,
  };
};
