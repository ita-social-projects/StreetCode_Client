import React, { useRef, useEffect } from "react";

interface Props {
    children: React.ReactNode;
    copyrightText: string;
}

const CopyWithCopyright = ({ children, copyrightText } : Props) => {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleCopy = (event: ClipboardEvent) => {
            event.preventDefault();
            if (!event.clipboardData) return;
      
            const copiedText = window.getSelection()?.toString();
            if (copiedText) {
                event.clipboardData.setData(
                  'text/plain',
                  `${copiedText} \n${copyrightText}`
                );
            }
        }

        if (textRef.current) {
            textRef.current.addEventListener('copy', handleCopy);
        }

        return () => {
            if (textRef.current) {
              textRef.current.removeEventListener('copy', handleCopy);
            }
        };
    }, [copyrightText]);
      
    return <div ref={textRef}>{children}</div>;
}

export default CopyWithCopyright;