import { Check } from 'lucide-react';

export function Toast({ message }: { message?: string }) {
  return message ? <div className="toast" role="status"><Check size={15} />{message}</div> : null;
}
