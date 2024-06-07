'use client'
import React,{useState} from 'react';
// @ts-ignore
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// @ts-ignore
import { cellToBoundary, latLngToCell } from 'h3-js';
import { GeoJsonData, MapComponentProps } from './interfaces/interfaces';

// Estilo de los hexágonos de los clientes
const geoJsonStyleClients= {
    color: 'white',
    fillColor: '#007E02',
    fillOpacity: 0.8,
    opacity: 1,
    weight: 2
  };
  
// Estilo de los hexágonos del conductor
const geoJsonStyleDriver= {
color: '#001449',
fillColor: '#002485',
fillOpacity: 0.9,
opacity: 1,
weight: 2
};




// Función para crear datos GeoJSON
//la funcion celltoBoundary convierte las coordenadas de un hexagono en un poligono
const createGeoJsonData = (hexIndex: number[], index: number): GeoJsonData => {
    //Usar valores entre 11 - 12 para la resolucion ( 11 es mas detallado 12 es menos detallado)
    const indexHex = latLngToCell(hexIndex[0], hexIndex[1], 11);
    return {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [cellToBoundary(indexHex, true)]
        },
        id: `hex${index}`
    };
};

// Función para mostrar el popup
function onEachFeature(feature: any, layer: any, mensaje: string | string[], empresa: boolean = false): void {
    if (empresa) {
        var popupContent = `<p className={'text-sky-400'}>${mensaje[0]}<hr/><br/>${mensaje[1]}<br/>${mensaje[2]}</p><br/>llegada en 4-8min`;
    } else {
        var popupContent = `<p>Cliente: ${mensaje}</p>`;
    }
    // vinculacion del popup al mapa
    layer.bindPopup(popupContent);
}




// Función para detectar la ubicación en tiempo real
function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

export default function MapComponent({ clientUbi, transpUbi, infoClient, infoTransp }: MapComponentProps) {
    return(
        //Contenedor generar del mapa
        <MapContainer center={[8.886615, -79.765621]} zoom={16} style={{ height: "100vh", width: "100vw" }} >
            {/* Importante la atribuccion, si no se agrega el mapa no se va a mostrar */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Se genera un GeoJSON (hexagono) por cada ubicacion de cliente */}
            {clientUbi.map((hexIndex, index) => (
                <GeoJSON 
                    key={`geojson-${index}`} 
                    data={createGeoJsonData(hexIndex, index)}
                    onEachFeature={(feature, layer) => onEachFeature(feature, layer, infoClient[index], false)}           
                    style={geoJsonStyleClients}
                /> )
            )}
            {/* Se genera un GeoJSON (hexagono) por cada ubicacion de conductor */}
            <GeoJSON 
                key={`geojson-${transpUbi}`} 
                data={createGeoJsonData(transpUbi, transpUbi)} 
                style={geoJsonStyleDriver} 
                onEachFeature={(feature, layer) => onEachFeature(feature, layer, infoTransp, true)}          
                className={''}
            /> 

            {/* Detecta la ubicacion en tiempo real */}
            {/* <LocationMarker /> */}

        </MapContainer>

    )
}