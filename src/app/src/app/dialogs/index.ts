import { ConfirmDialog } from './confirm';
import { EditorDialogs } from './editors';

export const Dialogs = [
  ConfirmDialog,
  ...EditorDialogs
];

export * from './confirm';
export * from './editors';
