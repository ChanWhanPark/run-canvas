// ol
import { Map as OlMap } from 'ol';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
// react
import * as React from 'react';

interface UseVectorLayersProps {
  mapRef: React.RefObject<OlMap | null>;
}

export const useOlVectorLayers = ({ mapRef }: UseVectorLayersProps) => {
  // Sources
  const drawVectorSourceRef = React.useRef<VectorSource>(new VectorSource());
  const selectSourceRef = React.useRef<VectorSource>(new VectorSource());
  // Layers
  const drawVectorLayerRef = React.useRef<VectorLayer<VectorSource> | null>(null);
  const selectLayerRef = React.useRef<VectorLayer<VectorSource> | null>(null);

  React.useEffect(() => {
    if (!mapRef.current) return;

    const newDrawVectorLayer = new VectorLayer({
      properties: { title: 'New Geometry Layer' },
      source: drawVectorSourceRef.current,
      zIndex: 100000,
    });
    newDrawVectorLayer.set('unselect', true);
    newDrawVectorLayer.set('defaultLayer', true);

    const selectLayer = new VectorLayer({
      properties: { title: 'Multi Select Layer' },
      source: selectSourceRef.current,
      zIndex: 100001,
    });
    selectLayer.set('unselect', true);
    selectLayer.set('defaultLayer', true);

    const defaultLayerGroup = new LayerGroup({
      properties: { title: 'Default Layers' },
    });
    defaultLayerGroup.getLayers().push(newDrawVectorLayer);
    defaultLayerGroup.getLayers().push(selectLayer);

    mapRef.current.addLayer(defaultLayerGroup);

    drawVectorLayerRef.current = newDrawVectorLayer;
    selectLayerRef.current = selectLayer;

    return () => {
      if (mapRef.current && defaultLayerGroup) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mapRef.current.removeLayer(defaultLayerGroup);
      }
    };
  }, [mapRef]);

  const cleanDrawLayer = () => {
    drawVectorSourceRef.current.clear();
  };

  const clearSelectLayer = () => {
    selectSourceRef.current.clear();
  };

  return {
    // Source
    drawVectorSourceRef,
    selectSourceRef,
    // Layer
    drawVectorLayerRef,
    selectLayerRef,
    cleanDrawLayer,
    clearSelectLayer,
  };
};
