'use client'
import React,{useState, useEffect} from 'react';
//@ts-ignore
import { MapContainer, TileLayer, GeoJSON} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
//@ts-ignore
import { cellToBoundary, latLngToCell } from 'h3-js';
//Estilos de los hexagonos de los clientes
import {geoJsonStyleClients,geoJsonStyleClientsProblems} from '../elements/hexagonStiles'
import {LocationMarker} from '../elements/locationMarker'

//la funcion celltoBoundary convierte las coordenadas a un hexagono
const createGeoJsonData = (long: number,lat:number, index: number) => {
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

// Función para mostrar el popup de acuerdo al marcador presionado
function onEachFeature(feature: any, layer: any, infoPop:any, customer: boolean = false, problems: boolean = false): void {
  let popupContent = '';
    if (customer) {
      popupContent= `<p>Conductor: ${infoPop['Nombre'] +' ' + infoPop['Apellido']}<br/>ID: ${infoPop['IdEmpleado']}</p>`;
    } else {

      //Extrae de infoPop la fecha en formato dd/mm/yyyy
      const date = new Date(infoPop['Fecha']);

      if(!problems){
        popupContent = `
      <p class="">Fecha de recogida: ${date}</p>
      <p class="">Direccion: ${infoPop['Provincia']}, ${infoPop['Distrito']}, ${infoPop['Corregimiento']}, ${infoPop['Barriada']}</p>
      <p>Hora estimada de llegada <span class="font-semibold">${infoPop['HoraEstimadaDeLlegada']}</span></p>
      `;
      }else{
        popupContent = `
      <p class="">Fecha de recogida: ${date}</p>
      <p class="">Direccion: ${infoPop['Provincia']}, ${infoPop['Distrito']}, ${infoPop['Corregimiento']}, ${infoPop['Barriada']}</p>
      
      `;
      }
      
    }
    // vinculacion del popup al mapa
    layer.bindPopup(popupContent);
}

interface MapComponentProps {
  customersInfo: any; 
  recolectorInfo: any; 
}

export default function MapComponentClient({ customersInfo, recolectorInfo }: MapComponentProps) {

    //Ubicacion del conductor en tiempo real
    const [location, setLocation] = useState({ lat: 8.979956, lng: -79.536281 });

    useEffect(() => {
      const intervalId = setInterval( () => {
        navigator.geolocation.getCurrentPosition( (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          window.localStorage.setItem('lat', position.coords.latitude.toString())
          window.localStorage.setItem('lon', position.coords.longitude.toString())
        });
      }, 1000);
        return () => clearInterval(intervalId);
    }, []);


    return (
      <MapContainer center={[8.886153949494041, -79.7648399886817]} zoom={14} style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={location} infoDriver={recolectorInfo} />
    
        {customersInfo.docs.map((client: { [x: string]: number; }, index: number) => 
          index  === 3 ? (
            <GeoJSON 
              key={`geojson-${index}`} 
              data={createGeoJsonData(client['Longitud'], client['Latitud'], index)}
              onEachFeature={(feature: any, layer: any) => onEachFeature(feature, layer, client, false, false)}           
              style={geoJsonStyleClients}
            />
          ) : null
        )}
      </MapContainer>
    );
}