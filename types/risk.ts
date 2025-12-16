export type RiskLevel = "Low" | "Medium" | "High";

export type RiskResult = {
  url: string;
  score: number;
  level: RiskLevel;
  reasons: string[];
};
