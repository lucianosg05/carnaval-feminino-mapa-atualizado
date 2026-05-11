// Componente de mapa interativo dos blocos carnavalescos feministas
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet'; // Biblioteca para mapas interativos
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Hook para carregar dados com cache
import { blocksApi } from '@/lib/api';
import mapPinIcon from '@/assets/map-pin-block.png';

// Interface que define a estrutura de dados de um bloco
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

// Props do componente: callbacks e filters
interface FeministBlocksMapProps {
  onBlockSelect?: (block: BlockData) => void; // Callback quando usuário seleciona um bloco
  selectedBlockId?: string; // ID do bloco selecionado para destaque
  searchTerm?: string; // Termo para filtrar blocos por nome/cidade
  stateFilter?: string; // Filtro por estado (UF)
}

// Componente funcional do mapa
const FeministBlocksMap: React.FC<FeministBlocksMapProps> = ({ 
  onBlockSelect,
  selectedBlockId,
  searchTerm = '',
  stateFilter = 'all'
}) => {
  const navigate = useNavigate();
  // Refs para persistir o mapa e os marcadores entre renderizações
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({}); // Armazena marcadores do mapa indexados por ID do bloco

  // Carrega lista de blocos da API com React Query (cache de 5 minutos)
  const { data: blocks = [], isLoading, error } = useQuery({
    queryKey: ['blocks'],
    queryFn: blocksApi.list,
    retry: 3, // Tenta novamente até 3 vezes em caso de erro
    staleTime: 1000 * 60 * 5 // 5 minutos de cache
  });
  
  // Log para debug
  React.useEffect(() => {
    console.log('Mapa: Blocos carregados:', blocks.length);
    if (error) console.error('Mapa: Erro ao carregar blocos:', error);
  }, [blocks, error])

  // Inicializa o mapa uma única vez ao montar o componente
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Cria mapa com centro no Brasil e zoom inicial 4
    map.current = L.map(mapContainer.current).setView([-14.235, -51.9253], 4);

    // Adiciona camada de tiles do OpenStreetMap (mapa de fundo)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map.current);

    // Cleanup: remove mapa quando componente é desmontado
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Atualiza marcadores no mapa quando blocos, filtros ou termo de busca mudam
  useEffect(() => {
    if (!map.current || isLoading) return;

    // Remove todos os marcadores antigos
    Object.values(markersRef.current).forEach(marker => {
      map.current?.removeLayer(marker);
    });
    markersRef.current = {};

    // Define ícone customizado para os marcadores
    const customIcon = L.icon({
      iconUrl: mapPinIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 32], // Ponto de âncora no topo do ícone
      popupAnchor: [0, -32], // Posição do popup acima do ícone
    });

    // Filtra blocos com base no termo de busca (nome, cidade, vertente) e estado
    const filteredBlocks = (blocks as BlockData[]).filter((block) => {
      const matchesSearch = (block.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (block.cidade || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (block.vertenteFeminista || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = stateFilter === 'all' || block.estado === stateFilter;
      return matchesSearch && matchesState;
    });

    // Filtra apenas blocos com coordenadas válidas
    const blocksWithCoordinates = filteredBlocks.filter(
      (block: BlockData) => block.localLat && block.localLng
    );

    // Cria e posiciona marcadores no mapa
    blocksWithCoordinates.forEach((block: BlockData) => {
      if (!block.localLat || !block.localLng) return;

      // Cria marcador com as coordenadas do bloco
      const marker = L.marker([block.localLat, block.localLng], { icon: customIcon })
        .addTo(map.current!);

      // Evento: ao clicar no marcador, navega para página do bloco
      marker.on('click', () => {
        navigate(`/bloco/${block.id}`);
        onBlockSelect?.(block);
      });

      // Cria popup com informações resumidas do bloco
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

    // Ajusta zoom do mapa para mostrar todos os marcadores
    if (Object.keys(markersRef.current).length > 0) {
      const group = new L.FeatureGroup(Object.values(markersRef.current));
      map.current.fitBounds(group.getBounds().pad(0.1));
    } else {
      // Se nenhum bloco corresponde aos filtros, volta à visão do Brasil
      map.current.setView([-14.235, -51.9253], 4);
    }
  }, [blocks, isLoading, navigate, onBlockSelect, searchTerm, stateFilter]);

  // Destaca bloco selecionado: aumenta ícone e abre popup
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([blockId, marker]) => {
      if (blockId === selectedBlockId) {
        // Ícone maior e animado para bloco selecionado
        marker.setIcon(L.icon({
          iconUrl: mapPinIcon,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          className: 'selected-marker animate-bounce'
        }));
        marker.openPopup();
      } else {
        // Ícone padrão para blocos não selecionados
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
      {/* Container do mapa com altura responsiva */}
      <div className="relative w-full h-[40vh] md:h-[60vh] rounded-xl overflow-hidden shadow-carnival z-0">
        <div ref={mapContainer} className="w-full h-full" />
        {/* Widget de informação do mapa: mostra quantidade de blocos carregados */}
        <div className="absolute top-12 md:top-4 left-3 md:left-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 md:p-3 shadow-soft z-10 max-w-xs">
          <h3 className="font-semibold text-primary mb-1">Blocos Feministas</h3>
          {error ? (
            <p className="text-sm text-destructive font-semibold">Erro ao carregar mapa</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Carregando...' : `${Object.keys(markersRef.current).length}/${blocks.length} blocos no mapa`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeministBlocksMap;