export interface FormData {
  nome: string;
  email: string;
  duracao_dias: string;
  data_inicio: string;
  bairro_hospedagem: string;
  tipo_hospedagem: string;
  composicao_grupo: string[];
  idade_minima: string;
  idade_maxima: string;
  acessibilidade_pcd: string;
  interesses_principais: string[];
  ritmo_viagem: string;
  orcamento_diario: string;
  meio_transporte: string[];
  fazer_refeicoes_em_casa: string;
  refeicoes_em_casa_frequencia: string[];
  otimizar_tempo: string;
  passagem_comprada?: string;
  horario_chegada?: string;
  horario_voo_volta?: string;
  tipo_transporte_principal?: string;
  tem_bebe?: string;
  horario_sono_bebe?: string;
  criar_roteiro_conforme_bebe?: string;
}
