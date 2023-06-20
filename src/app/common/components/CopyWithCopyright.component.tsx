import React, { useRef } from "react";
import FRONTEND_ROUTES from "../constants/frontend-routes.constants";

interface Props {
  children: React.ReactNode;
  copyrightText: string;
}

const MIN_LENGTH = 20;

const CopyWithCopyright = ({ children, copyrightText }: Props) => {
  const textRef = useRef<HTMLDivElement>(null);

  const handleCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (!window.location.pathname.startsWith(FRONTEND_ROUTES.ADMIN.BASE)) {
        if (!event.clipboardData) return;

        const copiedText = window.getSelection()?.toString();
        if (copiedText && copiedText.length >= MIN_LENGTH) {
            event.preventDefault();
            event.clipboardData.setData(
                'text/plain',
                `${copiedText} \n${copyrightText}`
            );
        }
    }
  };

  return (
    <div ref={textRef} onCopy={handleCopy}>
      {children}
    </div>
  );
};

export default CopyWithCopyright;