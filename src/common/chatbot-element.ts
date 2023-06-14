import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
// radio group
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
// radio button
import '@shoelace-style/shoelace/dist/components/radio-button/radio-button.js';
// switch
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
// tooltip
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
// spinner
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';

type EventTypeRequiresDetail<T> = T extends keyof GlobalEventHandlersEventMap
    ? GlobalEventHandlersEventMap[T] extends CustomEvent<
          Record<PropertyKey, unknown>
      >
        ? GlobalEventHandlersEventMap[T] extends CustomEvent<
              Record<PropertyKey, never>
          >
            ? never
            : Partial<
                  GlobalEventHandlersEventMap[T]['detail']
              > extends GlobalEventHandlersEventMap[T]['detail']
            ? never
            : T
        : never
    : never;

type EventTypeDoesNotRequireDetail<T> =
    T extends keyof GlobalEventHandlersEventMap
        ? GlobalEventHandlersEventMap[T] extends CustomEvent<
              Record<PropertyKey, unknown>
          >
            ? GlobalEventHandlersEventMap[T] extends CustomEvent<
                  Record<PropertyKey, never>
              >
                ? T
                : Partial<
                      GlobalEventHandlersEventMap[T]['detail']
                  > extends GlobalEventHandlersEventMap[T]['detail']
                ? T
                : never
            : T
        : T;

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type EventOptions<T> = T extends keyof GlobalEventHandlersEventMap
    ? GlobalEventHandlersEventMap[T] extends CustomEvent<
          Record<PropertyKey, unknown>
      >
        ? GlobalEventHandlersEventMap[T] extends CustomEvent<
              Record<PropertyKey, never>
          >
            ? CustomEventInit<GlobalEventHandlersEventMap[T]['detail']>
            : Partial<
                  GlobalEventHandlersEventMap[T]['detail']
              > extends GlobalEventHandlersEventMap[T]['detail']
            ? CustomEventInit<GlobalEventHandlersEventMap[T]['detail']>
            : WithRequired<
                  CustomEventInit<GlobalEventHandlersEventMap[T]['detail']>,
                  'detail'
              >
        : CustomEventInit
    : CustomEventInit;

type GetCustomEventType<T> = T extends keyof GlobalEventHandlersEventMap
    ? GlobalEventHandlersEventMap[T] extends CustomEvent<unknown>
        ? GlobalEventHandlersEventMap[T]
        : CustomEvent<unknown>
    : CustomEvent<unknown>;

export class ChatbotElement extends LitElement {
    @property({ type: String })
    lang = 'en';

    emit<T extends string>(
        name: EventTypeDoesNotRequireDetail<T>,
        options?: EventOptions<T> | undefined,
    ): GetCustomEventType<T>;
    emit<T extends string>(
        name: EventTypeRequiresDetail<T>,
        options: EventOptions<T>,
    ): GetCustomEventType<T>;
    emit<T extends string>(
        name: T,
        options?: EventOptions<T> | undefined,
    ): GetCustomEventType<T> {
        const event = new CustomEvent(name, {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {},
            ...options,
        });

        this.dispatchEvent(event);

        return event as GetCustomEventType<T>;
    }
}
