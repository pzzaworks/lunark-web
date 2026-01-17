export interface ITransaction {
    id: string;
    hash: string | null;
    status: string;
    type: string;
    data: {
        transaction: {
            to: string;
            value: string;
            data: string;
            chainId: number;
        };
        details?: Record<string, any>;
        buttonText: string;
        chainId: number;
    };
    userId: string;
    messageId: string;
    user?: {
        id: string;
        address: string;
    };
    message?: {
        id: string;
        content: string;
    };
    createdAt: Date;
    updatedAt: Date;
}