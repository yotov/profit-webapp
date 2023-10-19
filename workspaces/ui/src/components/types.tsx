type RequestError = {
    message: string,
    fields?: Record<string, string>,
}

type RequestState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success', data: any }
    | { status: 'error', error: RequestError };

type FormState = {
    startTime: string | undefined,
    endTime: string | undefined,
    investAmount?: number | null
}