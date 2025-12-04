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
  redesSociais?: {
    instagram?: string;
    facebook?: string;
    site?: string;
    tiktok?: string;
  } | null;
}

// helper: previously mocked data was here; now data comes from the API via react-query
export default null as unknown as Block[]