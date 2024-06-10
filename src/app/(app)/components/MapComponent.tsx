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
  html: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.1" fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM14.149 15.1848C13.4576 17.1053 10.6665 16.8584 10.323 14.8464C10.2169 14.2248 9.72996 13.7379 9.10837 13.6318C7.09631 13.2882 6.84941 10.4971 8.76993 9.80572L12.6761 8.39948C14.4674 7.75462 16.2001 9.48732 15.5553 11.2786L14.149 15.1848Z" fill="#000000"></path> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2"></path> <path d="M13.9137 15.1001L15.32 11.1939C15.8932 9.60167 14.353 8.06149 12.7608 8.6347L8.85455 10.0409C7.1758 10.6453 7.39162 13.085 9.15038 13.3853C9.87655 13.5093 10.4454 14.0781 10.5694 14.8043C10.8696 16.5631 13.3094 16.7789 13.9137 15.1001Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
  iconSize: [38, 95], 
  

});

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
      //Contenedor generar del mapa
      <MapContainer center={[8.948251, -79.651752]} zoom={12} style={{ height: "100vh", width: "100vw", overflow: "hidden" }} >
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
          {/* Determina la ubicacion del conductor */}
          <LocationMarker position={location} infoDriver={recolectorInfo} />
      </MapContainer>
    )
}