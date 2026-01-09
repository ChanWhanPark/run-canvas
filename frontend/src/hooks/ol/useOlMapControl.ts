// ol
import { Map as OlMap } from 'ol';
// ol-ext
import Bar from 'ol-ext/control/Bar';
import Button from 'ol-ext/control/Button';
import Toggle from 'ol-ext/control/Toggle';
// react
import * as React from 'react';

// ol-ext CSS
import 'ol-ext/control/Bar.css';

interface UseMapControlProps {
  mapRef: React.RefObject<OlMap | null>;
  onCleanGeometry?: () => void;
  onToggleNewLine?: (active: boolean) => void;
}

export const useOlMapControl = ({ mapRef, onCleanGeometry, onToggleNewLine }: UseMapControlProps) => {
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
            if (onToggleNewLine) onToggleNewLine(active);
          },
        }),
        new Button({
          html: 'X',
          title: 'Clear Geometries',
          handleClick: onCleanGeometry,
        }),
      ],
    });
    barNewGeom.setActive(false);

    barMain.addControl(barNewGeom);

    mapRef.current.addControl(barMain);
    barMainRef.current = barMain;
    barNewGeomRef.current = barNewGeom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef]);

  return { barMainRef, barNewGeomRef };
};
