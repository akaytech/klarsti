import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

/**
 * Context menüleri doğrudan document.body'ye render eder. Bu sayede
 * .react-flow / canvas ata zincirinde ileride eklenebilecek herhangi bir
 * transform/filter/will-change özelliği (position: fixed'in containing
 * block'unu değiştirebilecek özellikler) menü konumlamasını etkileyemez.
 */
export function MenuPortal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body);
}
