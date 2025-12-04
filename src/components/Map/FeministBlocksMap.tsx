import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blocksApi } from '@/lib/api';
import mapPinIcon from '@/assets/map-pin-block.png';

interface BlockData {
  id: string;
  nome: string;
  descricao?: string;
  contato?: string;
  foto?: string;
  localLat?: number;
  localLng?: number;
  cidade?: string;
  estado?: string;
  endereco?: string;
  vertenteFeminista?: string;
  formacao?: string;
}

interface FeministBlocksMapProps {
  onBlockSelect?: (block: BlockData) => void;
  selectedBlockId?: string;
  searchTerm?: string;
  stateFilter?: string;
}

const FeministBlocksMap: React.FC<FeministBlocksMapProps> = ({ 
  onBlockSelect,
  selectedBlockId,
  searchTerm = '',
  stateFilter = 'all'
}) => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Fetch blocks from API
  const { data: blocks = [], isLoading } = useQuery({
    queryKey: ['blocks'],
    queryFn: blocksApi.list
  });

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with Brazil center
    map.current = L.map(mapContainer.current).setView([-14.235, -51.9253], 4);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when blocks change
  useEffect(() => {
    if (!map.current || isLoading) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      map.current?.removeLayer(marker);
    });
    markersRef.current = {};

    // Create custom icon
    const customIcon = L.icon({
      iconUrl: mapPinIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Filter blocks based on search and state
    const filteredBlocks = (blocks as BlockData[]).filter((block) => {
      const matchesSearch = (block.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (block.cidade || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (block.vertenteFeminista || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = stateFilter === 'all' || block.estado === stateFilter;
      return matchesSearch && matchesState;
    });

    // Add markers for blocks with valid coordinates
    const blocksWithCoordinates = filteredBlocks.filter(
      (block: BlockData) => block.localLat && block.localLng
    );

    blocksWithCoordinates.forEach((block: BlockData) => {
      if (!block.localLat || !block.localLng) return;

      const marker = L.marker([block.localLat, block.localLng], { icon: customIcon })
        .addTo(map.current!);

      // Add click event to marker
      marker.on('click', () => {
        navigate(`/bloco/${block.id}`);
        onBlockSelect?.(block);
      });

      // Add popup with block info
      marker.bindPopup(`
        <div class="p-3 max-w-xs">
          ${block.foto ? `<img src="${block.foto}" alt="${block.nome}" class="w-full h-20 object-cover rounded-md mb-2">` : ''}
          <h3 class="font-bold text-base mb-1 text-primary">${block.nome}</h3>
          ${block.descricao ? `<p class="text-xs text-muted-foreground mb-2 line-clamp-2">${block.descricao}</p>` : ''}
          <div class="space-y-0.5 text-xs">
            ${block.cidade ? `<p><strong>📍</strong> ${block.cidade}${block.estado ? ', ' + block.estado : ''}</p>` : ''}
            ${block.formacao ? `<p><strong>👥</strong> ${block.formacao}</p>` : ''}
            ${block.contato ? `<p><strong>📧</strong> ${block.contato}</p>` : ''}
          </div>
          <div class="mt-2 pt-2 border-t border-gray-200">
            <p class="text-xs text-center text-primary font-medium cursor-pointer hover:underline">Ver perfil completo</p>
          </div>
        </div>
      `);

      markersRef.current[block.id] = marker;
    });

    // Fit bounds if there are markers
    if (Object.keys(markersRef.current).length > 0) {
      const group = new L.FeatureGroup(Object.values(markersRef.current));
      map.current.fitBounds(group.getBounds().pad(0.1));
    } else {
      // If no markers match filter, reset to Brazil view
      map.current.setView([-14.235, -51.9253], 4);
    }
  }, [blocks, isLoading, navigate, onBlockSelect, searchTerm, stateFilter]);

  // Highlight selected block
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([blockId, marker]) => {
      if (blockId === selectedBlockId) {
        marker.setIcon(L.icon({
          iconUrl: mapPinIcon,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          className: 'selected-marker animate-bounce'
        }));
        marker.openPopup();
      } else {
        marker.setIcon(L.icon({
          iconUrl: mapPinIcon,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        }));
      }
    });
  }, [selectedBlockId]);

  return (
    <div className="w-full px-4 md:px-8">
      <div className="relative w-full h-[40vh] md:h-[60vh] rounded-xl overflow-hidden shadow-carnival z-0">
        <div ref={mapContainer} className="w-full h-full" />
        <div className="absolute top-16 md:top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-soft z-10">
          <h3 className="font-semibold text-primary mb-1">Blocos Feministas</h3>
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Carregando...' : `${Object.keys(markersRef.current).length}/${blocks.length} blocos no mapa`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeministBlocksMap;