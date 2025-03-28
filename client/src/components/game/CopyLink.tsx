// components/CopyLinkButton.tsx
import { useState } from "react";
import { IconCopy } from "@tabler/icons-react";
import { IconChecks } from "@tabler/icons-react";

interface CopyLinkButtonProps {
  link: string;
  className?: string;
  iconSize?: number;
}

export const CopyLinkButton = ({ link, className = "", iconSize = 16 }: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`${className}`}
      aria-label="Copy link"
      title="Copy link"
    >
      {copied ? <IconChecks size={iconSize} /> : <IconCopy size={iconSize} />}
      {link}
    </button>
  );
};
