// ol
import { Map as OlMap, View } from 'ol';
import { Point } from 'ol/geom';
import LayerGroup from 'ol/layer/Group';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
// ol-ext
import Colorize from 'ol-ext/filter/Colorize';
// react
import * as React from 'react';

import { BASE_CENTER, coordinate, DEFAULT_SOURCE_SRID, DEFAULT_SRID } from '@/common/base-type';
import { Center } from '@/common/ol-type';

interface MapViewerProps {
  sourceSRID?: string;
  center?: coordinate;
  initPosition?: coordinate;
}

const MapViewer = React.forwardRef<HTMLDivElement, MapViewerProps>((props, ref) => {
  const { sourceSRID = DEFAULT_SOURCE_SRID, center = BASE_CENTER, initPosition = BASE_CENTER } = props;
  const ref_canvas = React.useRef<HTMLDivElement | null>(null);
  const ref_mainMap = React.useRef<OlMap | null>(null);
  const ref_mainLayers = React.useRef<Array<Layer | LayerGroup>>([]);
  const ref_osm = React.useRef<TileLayer<OSM> | null>(null);

  const [st_center, set_center] = React.useState<Center>({ srid: sourceSRID, coordinate: center });

  React.useEffect(() => {
    if (ref_mainMap.current) return;
    InitLayer();
    InitMapObject();
    UpdateLayers();
  }, []);

  React.useEffect(() => {
    set_center({
      srid: sourceSRID,
      coordinate: center,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(center)]);

  React.useEffect(() => {
    set_center({
      srid: sourceSRID,
      coordinate: initPosition,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initPosition)]);

  React.useEffect(() => {
    if (st_center && ref_mainMap.current) {
      console.log(st_center);
      const { srid, coordinate } = st_center;
      const transform = srid !== DEFAULT_SRID;
      const p = new Point(coordinate);
      if (transform) p.transform(sourceSRID, DEFAULT_SRID);
      const coord = p.getCoordinates();
      ref_mainMap.current.getView().setCenter(coord);
    }
  }, [st_center, sourceSRID]);

  const InitLayer = () => {
    ref_osm.current = new TileLayer({
      source: new OSM({
        crossOrigin: 'anonymous',
      }),
    });
    ref_osm.current.addFilter(new Colorize({ operation: 'grayscale' }));
  };
  /**
   * For Generate Map Object
   */
  const InitMapObject = () => {
    const map = new OlMap({
      target: 'map-viewer',
      layers: [],
      view: new View({
        projection: DEFAULT_SRID,
        zoom: 2,
      }),
    });
    ref_mainMap.current = map;
  };

  const UpdateLayers = () => {
    const updateLayer: Array<Layer | LayerGroup> = [];
    if (ref_osm.current) updateLayer.push(ref_osm.current);
    ref_mainLayers.current = updateLayer;
    if (ref_mainMap.current) {
      ref_mainMap.current.getLayers().clear();
      for (const layer of updateLayer) {
        ref_mainMap.current.addLayer(layer);
      }
    }
  };

  return <div ref={ref_canvas} id="map-viewer" style={{ width: '100%', height: '100%' }} />;
});

export default MapViewer;
