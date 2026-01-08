// ol
import { Map as OlMap } from 'ol';
import { Draw } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import * as React from 'react';

interface UseOlInteractionProps {
  mapRef: React.RefObject<OlMap | null>;
  drawVectorSource: React.RefObject<VectorSource | null>;
  onDrawLineEnd?: (event: any) => void;
}

export const useOlInteraction = ({ mapRef, drawVectorSource, onDrawLineEnd }: UseOlInteractionProps) => {
  // Hook implementation goes here
  // You can add refs and effects related to map interactions here
  const drawNewLineRef = React.useRef<Draw | null>(null);
  React.useEffect(() => {
    if (mapRef.current == null) return;
    const drawNewLine = new Draw({
      type: 'LineString',
      source: drawVectorSource.current!,
    });

    if (onDrawLineEnd) {
      drawNewLine.on('drawend', onDrawLineEnd);
    }

    mapRef.current?.addInteraction(drawNewLine);

    drawNewLine.setActive(false);

    drawNewLineRef.current = drawNewLine;

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mapRef.current?.removeInteraction(drawNewLine);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, drawVectorSource]);

  const setDrawLineActive = (active: boolean) => {
    if (drawNewLineRef.current) {
      drawNewLineRef.current.setActive(active);
    }
  };

  return {
    drawNewLineRef,
    setDrawLineActive,
  };
};
