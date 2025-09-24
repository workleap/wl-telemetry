export class HasExecutedGuard {
    #hasExecuted: boolean = false;

    throw(message: string) {
        if (this.#hasExecuted) {
            throw new Error(message);
        }

        this.#hasExecuted = true;
    }

    get hasExecuted() {
        return this.#hasExecuted;
    }

    reset() {
        this.#hasExecuted = false;
    }
}
