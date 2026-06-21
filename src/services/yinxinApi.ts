import { candidatesForScene } from '../data/mockCandidates';
import type { MockScenario, YinxinCandidate, YinxinDraft } from '../types/yinxin';

const wait = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));

export async function generateYinxinCandidates(
  draft: YinxinDraft,
  options: { scenario?: MockScenario; generation?: number; delay?: number } = {},
): Promise<YinxinCandidate[]> {
  await wait(options.delay ?? 1900);
  if (options.scenario === 'error') throw new Error('MOCK_GENERATION_ERROR');
  if (options.scenario === 'empty') return [];
  return candidatesForScene(draft.scene, options.generation ?? 0);
}
