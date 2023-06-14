declare namespace JSX {
    import type ChatBot from '@yugasun/chatbot';
    interface IntrinsicElements {
        'chat-bot': React.DetailedHTMLProps<ChatBot>;
    }
}
