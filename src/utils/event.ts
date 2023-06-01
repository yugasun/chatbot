export function waitForEvent(el: HTMLElement, eventName: string) {
    return new Promise<void>((resolve) => {
        function done(event: Event) {
            if (event.target === el) {
                el.removeEventListener(eventName, done);
                resolve();
            }
        }

        el.addEventListener(eventName, done);
    });
}
