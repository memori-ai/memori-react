/// <reference types="react" />
type Status = 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage' | undefined;
export interface Props {
    forceStatus?: Status;
    provider?: string;
}
declare const CompletionProviderStatus: ({ forceStatus, provider, }: Props) => JSX.Element | null;
export default CompletionProviderStatus;
