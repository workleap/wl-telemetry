import type { Attributes, AttributeValue, Span } from "@opentelemetry/api";
import type { SpanProcessor } from "@opentelemetry/sdk-trace-web";

export class GlobalAttributeSpanProcessor implements SpanProcessor {
    // This member is protected so it can be accessed when this class is extended.
    protected _attributes: Attributes = {};

    onStart(span: Span) {
        if (Object.keys(this._attributes).length > 0) {
            span.setAttributes(this._attributes);
        }
    }

    onEnd() {}

    forceFlush() {
        return Promise.resolve();
    }

    shutdown() {
        return Promise.resolve();
    }

    setAttribute(key: string, value: AttributeValue) {
        this._attributes[key] = value;
    }

    setAttributes(attributes: Attributes) {
        this._attributes = {
            ...this._attributes,
            ...attributes
        };
    }
}
