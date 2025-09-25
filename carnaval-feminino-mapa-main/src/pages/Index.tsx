import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, MapPin } from 'lucide-react';
import Header from '@/components/Navigation/Header';
import FeministBlocksMap from '@/components/Map/FeministBlocksMap';
import BlockCard from '@/components/Blocks/BlockCard';
import { mockBlocks, Block } from '@/data/blocks';
import heroImage from '@/assets/hero-carnival.jpg';

const Index = () => {
  const navigate = useNavigate();
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');

  const states = ['all', ...new Set(mockBlocks.map(block => block.estado))].sort();
  
  const filteredBlocks = mockBlocks.filter(block => {
    const matchesSearch = block.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.vertenteFeminista.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === 'all' || block.estado === stateFilter;
    return matchesSearch && matchesState;
  });

  const handleBlockSelect = (block: Block) => {
    setSelectedBlockId(block.id);
  };

  const handleViewProfile = (blockId: string) => {
    navigate(`/bloco/${blockId}`);
  };

  const handleSelectOnMap = (blockId: string) => {
    setSelectedBlockId(blockId);
    // Scroll to map section
    document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-float">
            Blocos Carnavalescos
            <span className="block gradient-text text-transparent bg-clip-text bg-gradient-hero">
              Feministas
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Mapeando, conectando e fortalecendo a resistência cultural feminista pelo Brasil
          </p>
          <div className="flex justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="animate-glow"
              onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Explorar Mapa
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <Card className="mb-8 bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, cidade ou vertente feminista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">Todos os Estados</option>
                  {states.slice(1).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Section */}
        <section id="map-section" className="mb-12">
          <h2 className="text-3xl font-bold gradient-text mb-6 text-center">
            Mapa dos Blocos Feministas
          </h2>
          <FeministBlocksMap 
            blocks={filteredBlocks}
            onBlockSelect={handleBlockSelect}
            selectedBlockId={selectedBlockId}
          />
        </section>

        {/* Blocks Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text">
              Nossos Blocos
            </h2>
            <p className="text-muted-foreground">
              {filteredBlocks.length} bloco{filteredBlocks.length !== 1 ? 's' : ''} encontrado{filteredBlocks.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                onViewProfile={handleViewProfile}
                onSelectOnMap={handleSelectOnMap}
                isSelected={selectedBlockId === block.id}
              />
            ))}
          </div>
          
          {filteredBlocks.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum bloco encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou termo de busca
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
