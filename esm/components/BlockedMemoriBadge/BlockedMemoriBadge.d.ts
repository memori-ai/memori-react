/// <reference types="react" />
export interface Props {
    memoriName: string;
    blockedUntil?: string;
    notEnoughCredits?: boolean;
    showGiverInfo?: boolean;
    showTitle?: boolean;
    marginLeft?: boolean;
}
declare const BlockedMemoriBadge: ({ memoriName, blockedUntil, notEnoughCredits, showGiverInfo, showTitle, marginLeft, }: Props) => JSX.Element | null;
export default BlockedMemoriBadge;
