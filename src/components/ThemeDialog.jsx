import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, HelpCircle, Info } from 'lucide-react';
import Button3D from './Button3D';

const ThemeDialog = ({ config, onClose }) => {
  React.useEffect(() => {
    if (!config) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (config.type === 'confirm') {
          config.resolve(false);
        } else {
          config.resolve(true);
        }
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, onClose]);

  const handleAction = (confirmed) => {
    if (config) {
      config.resolve(confirmed);
    }
    onClose();
  };

  const getIconAndStyle = () => {
    if (!config) return null;
    const msgLower = config.message.toLowerCase();
    const isDelete = config.type === 'confirm' && (msgLower.includes('delete') || msgLower.includes('remove') || msgLower.includes('erase'));

    if (isDelete) {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-error animate-pulse" />,
        iconBg: 'bg-error-container/40 border border-error/20',
        primaryVariant: 'danger',
        primaryText: 'Delete'
      };
    } else if (config.type === 'confirm') {
      return {
        icon: <HelpCircle className="w-5 h-5 text-primary" />,
        iconBg: 'bg-primary-container/40 border border-primary/20',
        primaryVariant: 'primary',
        primaryText: 'Confirm'
      };
    } else {
      return {
        icon: <Info className="w-5 h-5 text-tertiary" />,
        iconBg: 'bg-tertiary-container/30 border border-tertiary/20',
        primaryVariant: 'primary',
        primaryText: 'OK'
      };
    }
  };

  const styling = getIconAndStyle();

  return (
    <AnimatePresence>
      {config && styling && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop glass */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleAction(config.type !== 'confirm')}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Sheet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            className="relative z-10 w-full max-w-sm bg-surface-bright rounded-3xl p-6 border border-outline/10 shadow-ambient overflow-hidden text-center"
          >
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none rounded-inherit"></div>

            <div className="relative z-10 flex flex-col items-center space-y-4">
              {/* Icon Container */}
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${styling.iconBg}`}>
                {styling.icon}
              </div>

              {/* Title & Message */}
              <div className="space-y-1.5 w-full">
                {config.title && (
                  <h3 className="font-h2 text-on-surface tracking-tight text-base font-bold">
                    {config.title}
                  </h3>
                )}
                <p className="font-body-md text-on-surface-variant leading-relaxed text-center px-1">
                  {config.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full pt-1">
                {config.type === 'confirm' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAction(false)}
                      className="w-1/2 py-3 bg-surface border border-outline/15 text-outline font-label-caps tracking-widest text-[11px] rounded-xl hover:bg-surface-container active:scale-[0.98] transition-all"
                    >
                      Cancel
                    </button>
                    <Button3D
                      variant={styling.primaryVariant}
                      className="w-1/2 py-3 text-[11px]"
                      onClick={() => handleAction(true)}
                    >
                      {styling.primaryText}
                    </Button3D>
                  </>
                ) : (
                  <Button3D
                    variant="primary"
                    className="w-full py-3 text-[11px]"
                    onClick={() => handleAction(true)}
                  >
                    OK
                  </Button3D>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ThemeDialog;
