// ── GET /dados ──────────────────────────────────────────────

export interface PerfilDados {
  nome: string;
  renda_mensal: number;
  patrimonio_total: number;
  perfil_investidor: string;
  objetivo: string;
}

export interface MetricasDados {
  total_receita: number;
  total_gastos: number;
  saldo_mes: number;
  taxa_poupanca: number;
  mes_referencia?: string;
}

export interface GastoCategoria {
  cat: string;
  valor: number;
}

export interface HistoricoMensal {
  mes: string;
  gastos: number;
  receita: number;
}

export interface MetaDados {
  meta: string;
  necessario: number;
  prazo: string;
  progresso: number | null;
}

export interface ReservaDados {
  atual: number;
  necessaria: number;
  meses_cobertos: number;
  percentual: number;
}

export interface InvestimentoDados {
  nome: string;
  tipo: string;
  valor: number;
  rentabilidade: number;
  variacao_dia: number | null;
}

export interface IndiceMercado {
  valor: number;
  variacao: number | null;
  atualizado_em?: string;
}

export interface DadosResponse {
  perfil: PerfilDados;
  metricas: MetricasDados;
  gastos_categoria: GastoCategoria[];
  historico_mensal: HistoricoMensal[];
  metas: MetaDados[];
  reserva: ReservaDados;
  carteira: InvestimentoDados[];
  indices: Record<string, IndiceMercado>;
}

// ── Chat ────────────────────────────────────────────────────

export interface ChatRequest  { mensagem: string; }
export interface ChatResponse { resposta: string; }
export interface StreamToken  { token?: string; done?: boolean; session_id?: string; }

// ── Estado assíncrono ───────────────────────────────────────

export type RequestStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
}

export interface EvolucaoMensal {
  mes: string;
  patrimonio: number;
  receita: number;
  gastos: number;
  saldo: number;
}