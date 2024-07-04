export interface Card {
    id: string;
    holderName: string,
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
    cardColor: string;
}

export interface CardState {
    cards: Card[];
}
