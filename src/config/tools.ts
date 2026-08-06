import React from 'react';
import { Activity, Fish, BarChart2, BarChart, Target, Scale, AlertOctagon, Network, RefreshCcw, Layers, GitMerge, CalendarDays, Map, Brain, UsersRound } from 'lucide-react';
import type { ToolId } from '../store/useRoadmapStore';

export type CategoryId = 'cat_root_cause' | 'cat_data_stats' | 'cat_strategy_decision_risk' | 'cat_process_project' | 'cat_productivity_docs';

export interface ToolDef {
  id: ToolId;
  icon: React.ComponentType<{ size?: number, className?: string }>;
  labelKey: string;
  descKey: string;
  category: CategoryId;
  // Kişisel araçlar projeye ait değildir; proje araç listelerinde gösterilmez,
  // üst bardaki kendi düğmesinden açılır. (Tanıtım sayfasında yine görünür.)
  personal?: boolean;
}


export const CATEGORY_ORDER: CategoryId[] = [
  'cat_productivity_docs',
  'cat_process_project',
  'cat_root_cause',
  'cat_strategy_decision_risk',
  'cat_data_stats'
];

export const TOOLS: ToolDef[] = [
  { id: '5whys', icon: Activity, labelKey: 'tool_5whys', descKey: 'whys_desc', category: 'cat_root_cause' },
  { id: 'ishikawa', icon: Fish, labelKey: 'tool_ishikawa', descKey: 'ishi_desc', category: 'cat_root_cause' },
  { id: 'pareto', icon: BarChart2, labelKey: 'tool_pareto', descKey: 'pareto_desc', category: 'cat_data_stats' },
  { id: 'histogram', icon: BarChart, labelKey: 'tool_histogram', descKey: 'histogram_desc', category: 'cat_data_stats' },
  { id: 'swot', icon: Target, labelKey: 'tool_swot', descKey: 'swot_desc', category: 'cat_strategy_decision_risk' },
  { id: 'decision', icon: Scale, labelKey: 'decision_title', descKey: 'decision_desc', category: 'cat_strategy_decision_risk' },
  { id: 'fta', icon: AlertOctagon, labelKey: 'fta_title', descKey: 'fta_desc', category: 'cat_strategy_decision_risk' },
  { id: 'mindmap', icon: Brain, labelKey: 'tool_mindmap', descKey: 'mindmap_desc', category: 'cat_productivity_docs' },
  { id: 'wbs', icon: Network, labelKey: 'tool_wbs', descKey: 'wbs_desc', category: 'cat_process_project' },
  { id: 'pdca', icon: RefreshCcw, labelKey: 'tool_pdca', descKey: 'pdca_desc', category: 'cat_process_project' },
  { id: 'waterfall', icon: Layers, labelKey: 'tool_waterfall', descKey: 'wf_desc', category: 'cat_process_project' },
  { id: 'flowchart', icon: GitMerge, labelKey: 'tool_flowchart', descKey: 'flowchart_desc', category: 'cat_process_project' },
  { id: 'orgchart', icon: UsersRound, labelKey: 'org_title', descKey: 'org_desc', category: 'cat_process_project' },
  { id: 'vsm', icon: Map, labelKey: 'tool_vsm', descKey: 'vsm_desc', category: 'cat_process_project' },
  { id: 'notepad', icon: CalendarDays, labelKey: 'notepad_title', descKey: 'notepad_desc', category: 'cat_productivity_docs', personal: true },
];

// Proje içinde listelenecek araçlar. Ajanda kişisel olduğu için burada yer almaz.
export const PROJECT_TOOLS: ToolDef[] = TOOLS.filter(tool => !tool.personal);
