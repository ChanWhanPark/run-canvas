// ol
import { Map as OlMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
// ol-ext
import Bar from 'ol-ext/control/Bar';
import Toggle from 'ol-ext/control/Toggle';
import Colorize from 'ol-ext/filter/Colorize';
import * as React from 'react';

import { DEFAULT_SRID } from '@/common/base-type';

export const useOlMap = (targetRef: React.RefObject<HTMLDivElement | null>) => {
  // Hook implementation goes here
  const mapRef = React.useRef<OlMap | null>(null);
  const barMainRef = React.useRef<Bar>(new Bar());
  const barNewGeomRef = React.useRef<Bar>(new Bar({ group: true }));

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

    // 3. control
    barMainRef.current.setPosition('bottom-left');
    const lnToggle = new Toggle({
      html: 'LN',
      title: 'Polyline',
      onToggle(active) {
        console.log('LN Active:', active);
      },
    });

    barNewGeomRef.current.addControl(lnToggle);
    barMainRef.current.addControl(barNewGeomRef.current);
    map.addControl(barMainRef.current);

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, [targetRef]);

  return {
    mapRef,
    barMainRef,
    barNewGeomRef,
  };
};
