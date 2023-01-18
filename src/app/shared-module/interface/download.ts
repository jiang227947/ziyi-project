export interface Download {
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  progress: number;
  content: Blob | null;
}
