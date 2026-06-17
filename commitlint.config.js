export default {
    extends: ['@conventional'],
    defaultIgnores: true, 
    ignores: [
        (message) => message.startsWith('Merge branch'),
        (message) => message.startsWith('Merge pull request')
    ],
};