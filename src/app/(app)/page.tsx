import React from 'react'
import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('./components/MapComponent'),
  { ssr: false }
);


export default function page() {

  //Información de los clientes y transportista temporal
  const clientUbicacion = [[8.886979, -79.766596], [8.885919, -79.769384], [8.885500, -79.762283]]
  const infoClient = ["Karla Martinez", "Max Perez", "Elba Montes"]
  const infoTransp = ["Camion de la empresa", "Conductor: Mario Perez", "Placa: 1234-5678"]
  const transpUbicacion = [8.887084, -79.770615]

  //Solo se necesita enviar los valores de lat y long del conductor el mapa se actualiza solo

  return (
    <MapComponent clientUbi={clientUbicacion} transpUbi={transpUbicacion} infoClient={infoClient} infoTransp={infoTransp} />
  )
}