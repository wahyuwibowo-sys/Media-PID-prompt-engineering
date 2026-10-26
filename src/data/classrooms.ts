import { JurusanSMK } from '../types/classroom';

export const SMK_CLASSES = [
  'X APHPi 1',
  'X APHPi 2',
  'X TKJ 1',
  'X TKJ 2',
  'X TKJ 3',
  'X TITL 1',
  'X TITL 2',
  'X TKR 1',
  'X TKR 2',
  'X TKR 3',
  'X TKR 4'
] as const;

export type SMKClassName = typeof SMK_CLASSES[number];

export function getJurusanFromClass(className: string): JurusanSMK {
  const upper = className.toUpperCase();
  if (upper.includes('APHPI')) return 'APHPi';
  if (upper.includes('TKJ')) return 'TKJ';
  if (upper.includes('TITL')) return 'TITL';
  if (upper.includes('TKR')) return 'TKR';
  return 'Umum / P5';
}
