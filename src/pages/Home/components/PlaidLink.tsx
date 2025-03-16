import React, { useEffect, useRef } from "react";

interface PlaidLinkProps {
  linkToken: string;
  onSuccess: (publicToken: string, metadata: any) => void;
}

export const PlaidLink: React.FC<PlaidLinkProps> = ({
  linkToken,
  onSuccess,
}) => {
  const plaidRef = useRef<PlaidLinkInstance | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    script.async = true;
    script.onload = () => {
      if (window.Plaid) {
        console.log("Link token:", linkToken);
        plaidRef.current = window.Plaid.create({
          token: linkToken,
          onSuccess: (public_token, metadata) => {
            onSuccess(public_token, metadata);
          },
          onExit: (error) => {
            if (error) {
              console.error("Plaid Error:", error);
            }
          },
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [linkToken, onSuccess]);

  return (
    <button onClick={() => plaidRef.current?.open()}>Link Bank Account</button>
  );
};
