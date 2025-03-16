interface PlaidLinkInstance {
  open: () => void;
}

interface Plaid {
  create: (config: {
    token: string;
    onSuccess: (publicToken: string, metadata: any) => void;
    onExit: (error: any, metadata: any) => void;
  }) => PlaidLinkInstance;
}

interface Window {
  Plaid?: Plaid;
}
