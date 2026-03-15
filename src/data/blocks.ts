export interface Block {
  id: string;
  nome: string;
  descricao?: string;
  contato?: string;
  foto?: string;
  localLat?: number | null;
  localLng?: number | null;
  cidade?: string;
  estado?: string;
  endereco?: string;
  vertenteFeminista?: string;
  formacao?: string;
  proximosEventos?: Array<any>;
  imagens?: string[];
  videos?: string[];
  redesSociais?: any | null;
  cache?: string;
  historia?: string;
  estilo?: string;
  ownerId?: string;
  eventos?: Array<any>;
}

// helper: previously mocked data was here; now data comes from the API via react-query
export default null as unknown as Block[]