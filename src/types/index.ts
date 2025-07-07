export interface EpicNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface AnalysisNote {
  id: string;
  weekOf: string;
  summary: string;
  createdAt: string;
}
