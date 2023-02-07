declare namespace NodeJS {
    interface Process {
        env: ProcessEnv
    }
    interface ProcessEnv {
        [key: string]: string | undefined
    }
}