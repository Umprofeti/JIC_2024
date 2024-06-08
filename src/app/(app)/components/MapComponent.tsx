'use client'
import React,{useState} from 'react';
// @ts-ignore
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// @ts-ignore
import { cellToBoundary, latLngToCell } from 'h3-js';
import { GeoJsonData } from './interfaces/interfaces';

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
//la funcion celltoBoundary convierte las coordenadas a un hexagono
const createGeoJsonData = (long: number,lat:number, index: number): GeoJsonData => {
    //Usar valores entre 11 - 12 para la resolucion ( 11 es mas detallado 12 es menos detallado)
    lat = parseFloat(lat.toString())
    long = parseFloat(long.toString())

    const indexHex = latLngToCell(lat, long, 11);
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
function onEachFeature(feature: any, layer: any, infoPop:any, empresa: boolean = false): void {
  let popupContent = '';
    if (empresa) {
      popupContent= `<p>Conductor: ${infoPop['Nombre'] +' ' + infoPop['Apellido']}<br/>ID: ${infoPop['IdEmpleado']}</p>`;
    } else {
        popupContent = `<p>Cliente: ${infoPop['Nombre'] +' ' + infoPop['Apellido'] +'<br/>NIC: ' + infoPop['NIC']}</p><p>Direccion:${infoPop['LugarDeResidencia']}</p>`;
    }
    // vinculacion del popup al mapa
    layer.bindPopup(popupContent);
}




// Función para detectar la ubicación en tiempo real, por lo menos a mi no me funciona
function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e: { latlng: React.SetStateAction<null>; }) {
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

interface MapComponentProps {
  recolectorInfo: any;
  customersInfo: any;
}

export default function MapComponent({ customersInfo, recolectorInfo }: MapComponentProps) {
    return(
        //Contenedor generar del mapa
        <MapContainer center={[8.886615, -79.765621]} zoom={16} style={{ height: "100vh", width: "100vw" }} >
            {/* Importante la atribuccion, si no se agrega el mapa no se va a mostrar */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Se genera un GeoJSON (hexagono) por cada ubicacion de cliente */}
            {customersInfo.docs.map((client: { [x: string]: number; }, index: number) => (
                <GeoJSON 
                    key={`geojson-${index}`} 
                    data={createGeoJsonData(client['Longitud'], client['Latitud'], index)}
                    onEachFeature={(feature: any, layer: any) => onEachFeature(feature, layer, client, false)}           
                    style={geoJsonStyleClients}
                /> )
            )}
            {/* Se genera un GeoJSON (hexagono) por cada ubicacion de conductor */}
            <GeoJSON 
                data={createGeoJsonData(recolectorInfo['Longitud'],recolectorInfo['Latitud'], recolectorInfo['id'])} 
                style={geoJsonStyleDriver} 
                onEachFeature={(feature: any, layer: any) => onEachFeature(feature, layer, recolectorInfo, true)}          
                className={''}
            /> 

            {/* Detecta la ubicacion en tiempo real */}
            {/* <LocationMarker /> */}

        </MapContainer>

    )
}