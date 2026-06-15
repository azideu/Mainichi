import React, { createContext, useContext, useState } from 'react';

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialogConfig, setDialogConfig] = useState(null);

  const showAlert = (message, title = "Notice") => {
    return new Promise((resolve) => {
      setDialogConfig({
        type: 'alert',
        title,
        message,
        resolve
      });
    });
  };

  const showConfirm = (message, title = "Confirm") => {
    return new Promise((resolve) => {
      setDialogConfig({
        type: 'confirm',
        title,
        message,
        resolve
      });
    });
  };

  const closeDialog = () => {
    setDialogConfig(null);
  };

  return (
    <DialogContext.Provider value={{ dialogConfig, showAlert, showConfirm, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);
