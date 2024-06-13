'use client'
import React,{useState, useEffect} from 'react';
//@ts-ignore
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Popup, CircleMarker, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
//@ts-ignore
import { cellToBoundary, latLngToCell } from 'h3-js';
//@ts-ignore
import L from 'leaflet';

// Icono del conductor personalizado
const svgIcon = L.divIcon({
  className: 'shadow-2xl',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-truck-front-fill" viewBox="0 0 16 16">
  <path d="M3.5 0A2.5 2.5 0 0 0 1 2.5v9c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2v-9A2.5 2.5 0 0 0 12.5 0zM3 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.9c0 .625-.562 1.092-1.17.994C10.925 7.747 9.208 7.5 8 7.5s-2.925.247-3.83.394A1.008 1.008 0 0 1 3 6.9zm1 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2m8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2m-5-2h2a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2"/>
</svg>`,
  iconSize: [38, 38], 
  

});

// Estilo de los hexágonos de los clientes
const geoJsonStyleClients= {
    color: 'white',
    fillColor: '#007E02',
    fillOpacity: 0.8,
    opacity: 1,
    weight: 2
  };


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
function onEachFeature(feature: any, layer: any, infoPop:any, customer: boolean = false): void {
  let popupContent = '';
    if (customer) {
      popupContent= `<p>Conductor: ${infoPop['Nombre'] +' ' + infoPop['Apellido']}<br/>ID: ${infoPop['IdEmpleado']}</p>`;
    } else {

      //Extrae de infoPop la fecha en formato dd/mm/yyyy
      const date = new Date(infoPop['Fecha']);


      popupContent = `
      <p class="">Fecha de recogida: ${date}</p>
      <p class="">Direccion: ${infoPop['Provincia']}, ${infoPop['Distrito']}, ${infoPop['Corregimiento']}, ${infoPop['Barriada']}</p>
      <p>Hora estimada de llegada <span class="font-semibold">${infoPop['HoraEstimadaDeLlegada']}</span></p>
      `;
    }
    // vinculacion del popup al mapa
    layer.bindPopup(popupContent);
}



//Marcador de ubicación del conductor
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

interface MapComponentProps {
  customersInfo: any; 
  recolectorInfo: any; 
}

export default function MapComponent({ customersInfo, recolectorInfo }: MapComponentProps) {

    //Ubicacion del conductor en tiempo real
    const [location, setLocation] = useState(null);
    useEffect(() => {
      const intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }, 1000);
        return () => clearInterval(intervalId);
    }, []);

  return(
    <MapContainer center={[8.886153949494041, -79.7648399886817]} zoom={14} style={{ height: "100vh", width: "100vw", overflow: "hidden" }} >
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
      {/* Determina la ubicacion del conductor */}
      <LocationMarker position={location} infoDriver={recolectorInfo} />
    </MapContainer>
  )
}