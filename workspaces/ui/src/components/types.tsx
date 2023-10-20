type RequestError = {
    message: string,
    fields?: Record<string, string>,
}

type RequestStateSuccess = { status: 'success', data: any };

type RequestState =
    | { status: 'idle' }
    | { status: 'loading' }
    | RequestStateSuccess
    | { status: 'error', error: RequestError };

type FormState = {
    startTime: string | undefined,
    endTime: string | undefined,
    investAmount?: number | null
}

type TimeRange = {
    from: Date | undefined,
    to: Date | undefined,
}