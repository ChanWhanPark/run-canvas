// ol
import { Map as OlMap } from 'ol';
// ol-ext
import Bar from 'ol-ext/control/Bar';
import Toggle from 'ol-ext/control/Toggle';
import * as React from 'react';

interface UseMapControlProps {
  mapRef: React.RefObject<OlMap | null>;
}

export const useOlMapControl = ({ mapRef }: UseMapControlProps) => {
  // Hook implementation goes here
  // You can add refs and effects related to map controls here
  const barMainRef = React.useRef<Bar | null>(null);
  const barNewGeomRef = React.useRef<Bar | null>(null);

  React.useEffect(() => {
    if (mapRef.current == null) return;
    const barMain = new Bar();
    barMain.setPosition('bottom-left');
    const barNewGeom = new Bar({
      group: true,
      controls: [
        new Toggle({
          html: 'LN',
          title: 'Polyline',
          onToggle: (active) => {
            console.log('LN Active:', active);
          },
        }),
      ],
    });
    barNewGeom.setActive(false);

    barMain.addControl(barNewGeom);

    mapRef.current.addControl(barMain);
    barMainRef.current = barMain;
    barNewGeomRef.current = barNewGeom;
  }, [mapRef]);

  return { barMainRef, barNewGeomRef };
};
