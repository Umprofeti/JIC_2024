import React from 'react';
//@ts-ignore
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
//Estilos de los hexagonos de los clientes
import {svgIcon} from '../elements/hexagonStiles'
import {useMapEvents} from 'react-leaflet';

const LocationMarker = ({position, infoDriver}: {position: L.LatLngExpression, infoDriver: any}) => {
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
  
        map.flyTo(e.latlng, map.getZoom())
      },
     })
    if (position){
      return (
          <Marker position={position} icon={svgIcon}>
            <Popup >
              <p>Conductor: {infoDriver['Nombre'] +' ' + infoDriver['Apellido']}<br/>ID: {infoDriver['IdEmpleado']}</p>
            </Popup>
          </Marker>
      );
    }
  };

export {LocationMarker}