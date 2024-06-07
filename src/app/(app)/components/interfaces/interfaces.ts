// Función para crear datos GeoJSON
export interface GeoJsonData {
    type: string;
    geometry: {
        type: string;
        coordinates: [number, number];
    };
    id: string;
}

export interface CoordPair {
    latitude: number;
    longitude: number;
}

export interface MapComponentProps {
    clientUbi:number[][]; // Array of tuples, each tuple contains two numbers (latitude, longitude)
    transpUbi: number[]; //Array of objects with latitude and longitude properties
    infoClient: Array<string> ; //Names of the clients
    infoTransp: Array<string> ; // Information of the driver
}
