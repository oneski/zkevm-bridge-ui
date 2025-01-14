import { FC, useEffect } from "react";

import { ReactComponent as ErrorIcon } from "src/assets/icons/error.svg";
import { ReactComponent as SuccessIcon } from "src/assets/icons/success.svg";
import { ReactComponent as CloseIcon } from "src/assets/icons/xmark.svg";
import { SNACKBAR_AUTO_HIDE_DURATION } from "src/constants";
import { Message } from "src/domain";
import { useSnackbarStyles } from "src/views/shared/snackbar/snackbar.styles";

interface SnackbarProps {
  message: Message;
  onClose: () => void;
  onReport: (error: string) => void;
}

export const Snackbar: FC<SnackbarProps> = ({ message, onClose, onReport }) => {
  const classes = useSnackbarStyles();

  const Icon = ({ message }: { message: Message }): JSX.Element => {
    switch (message.type) {
      case "error":
      case "error-msg": {
        return <ErrorIcon className={classes.messageIcon} />;
      }
      case "success-msg": {
        return <SuccessIcon className={classes.messageIcon} />;
      }
    }
  };

  useEffect(() => {
    if (message.type !== "error") {
      const closingTimeoutId = setTimeout(onClose, SNACKBAR_AUTO_HIDE_DURATION);
      return () => clearTimeout(closingTimeoutId);
    }
  }, [message.type, onClose]);

  if (message.type !== "error") {
    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Icon message={message} />
          <p className={classes.message}>{message.text}</p>
        </div>
      </div>
    );
  } else {
    const { parsed, text = "An error occurred. Would you mind reporting it?" } = message;
    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Icon message={message} />
          <p className={classes.message}>{text}</p>
          <button
            className={classes.reportButton}
            onClick={() => {
              onReport(parsed);
            }}
          >
            Report
          </button>
          <button className={classes.closeButton} onClick={onClose}>
            <CloseIcon className={classes.closeIcon} />
          </button>
        </div>
      </div>
    );
  }
};
