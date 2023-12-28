import React, { useEffect, useState} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import "leaflet-dvf";

const Map = (props) => {
  const postalCodes = [];

  for (const [codigoPostal, poblacion] of Object.entries(props.info)) {
    postalCodes.push({
      postalCode: codigoPostal,
      population: poblacion
    });
  }

    const [map, setMap] = useState(null); 

    const getLatLngFromPostalCode = async (postalCode) => {
      const apiKey = 'c4a477ce0a2c47eeadf547b39f033faa';
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${postalCode}&key=${apiKey}`,
        );
    
        if (!response.ok) {
          throw new Error(`Error al opostalCodesbtener datos para el código postal ${postalCode}`);
        }
    
        const data = await response.json();
        const resultadosEspaña = data.results.filter(resultado => {
          return resultado.components.country === 'España' || resultado.components["ISO_3166-1_alpha-2"] === 'ES';
        });
        if (resultadosEspaña.length > 0) {
          const coordinates = resultadosEspaña.map((resultado) => {
            const latitud = resultado.geometry.lat;
            const longitud = resultado.geometry.lng;
            return { lat: latitud, lng: longitud };
          });
          if (coordinates.length > 0) {
            return coordinates;
          } else return [];
        } else console.log('error global funcion coordenadas');
    
      } catch (error) {
        console.error(`Error al geocodificar el código postal ${postalCode}:`, error);
        return { lat: undefined, lng: undefined };
      }
    };
      

    useEffect(() => {
        // Crear el mapa solo la primera vez
        if (!map) {
          const newMap = L.map("map").setView([40, -4], 6);
    
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© OpenStreetMap contributors'
          }).addTo(newMap);
    
          setMap(newMap);
        }
    
        // Limpieza del mapa cuando el componente se desmonta
        return () => {
          if (map) {
            map.remove();
            setMap(null); // Importante limpiar la referencia del mapa al desmontar el componente
          }
        };
      }, [map]);


      const fetchUbi = async () => {
        try {
          const coords = await Promise.all(
            postalCodes.map(async ({ postalCode, population }) => {
              const c = await getLatLngFromPostalCode(postalCode);
              if (c[0].lat !== undefined && c[0].lng !== undefined) {
                return L.marker([c[0].lat, c[0].lng, population], {
                  icon: L.divIcon({
                    className: "custom-pin",
                    html: `<div class="top-circle"></div><div class="bottom-triangle"></div><div class="population">${population}</div>`,
                  }),
                }).bindPopup(`Postal Code: ${postalCode}<br>Population: ${population}`);
              } else {
                console.log(`No se pudieron obtener coordenadas para el código postal ${postalCode}`);
                return null;
              }
            })
          );
      
          const markerClusterGroup = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
              let totalPopulation = 0;
      
              cluster.getAllChildMarkers().forEach((marker) => {
                totalPopulation += marker._latlng.alt;
              });
      
              return L.divIcon({
                html: `<div class="cluster-population">${totalPopulation}</div>`,
                className: 'custom-cluster-icon',
                iconSize: L.point(40, 40, true),
              });
            },
          });
      
          coords.forEach((marker) => {
            if (marker) {
              markerClusterGroup.addLayer(marker);
            }
          });
      
          map.addLayer(markerClusterGroup);
        } catch (error) {
          console.error("Error al obtener ubicaciones:", error);
        }
      };
      

      useEffect( () =>  {
        fetchUbi();
      }, [map, postalCodes]);

  return <div id="map" style={{ height: "400px" }} />;
};

export default Map;

