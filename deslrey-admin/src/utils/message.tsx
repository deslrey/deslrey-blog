import React from 'react';
import { useSnackbar } from 'notistack';
import type { SnackbarKey } from 'notistack';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

import '../styles/message/message.scss'

let useSnackbarRef: any;
export const SnackbarUtilsConfigurator: React.FC = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

const baseOptions = {
  autoHideDuration: 2000,
  anchorOrigin: { vertical: 'top', horizontal: 'right' } as const,
};

export const Message = {
  success(msg: string) {
    useSnackbarRef.enqueueSnackbar(msg, {
      ...baseOptions,
      variant: 'success',
      content: (key: SnackbarKey) => (
        <div key={key} className="snackbar snackbar--success">
          <CheckCircle size={20} />
          <span>{msg}</span>
        </div>
      ),
    });
  },

  warning(msg: string) {
    useSnackbarRef.enqueueSnackbar(msg, {
      ...baseOptions,
      variant: 'warning',
      content: (key: SnackbarKey) => (
        <div key={key} className="snackbar snackbar--warning">
          <AlertTriangle size={20} />
          <span>{msg}</span>
        </div>
      ),
    });
  },

  error(msg: string) {
    useSnackbarRef.enqueueSnackbar(msg, {
      ...baseOptions,
      variant: 'error',
      content: (key: SnackbarKey) => (
        <div key={key} className="snackbar snackbar--error">
          <XCircle size={20} />
          <span>{msg}</span>
        </div>
      ),
    });
  },

  info(msg: string) {
    useSnackbarRef.enqueueSnackbar(msg, {
      ...baseOptions,
      variant: 'info',
      content: (key: SnackbarKey) => (
        <div key={key} className="snackbar snackbar--info">
          <Info size={20} />
          <span>{msg}</span>
        </div>
      ),
    });
  },
};
