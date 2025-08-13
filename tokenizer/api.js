/**
 * RosettaBOM Tokenizer API
 * Simple interface for external use
 */

const fs = require('fs');
const { RosettaTokenizer } = require('./utils/tokenizer');

class RosettaBOMAPI {
    constructor() {
        this.tokenizer = new RosettaTokenizer();
        this.loadTokenizer();
    }
    
    loadTokenizer() {
        try {
            const tokenizerData = JSON.parse(fs.readFileSync('./data/tokenizer.json', 'utf8'));
            this.tokenizer.loadVocabulary(tokenizerData.vocabulary);
            console.log('✅ RosettaBOM tokenizer loaded successfully');
        } catch (error) {
            console.log('⚠️  Pre-trained tokenizer not found. Please run training first.');
        }
    }
    
    encode(text) {
        return this.tokenizer.encode(text);
    }
    
    decode(tokenIds) {
        return this.tokenizer.decode(tokenIds);
    }
    
    tokenize(text) {
        const result = this.tokenizer.encode(text);
        return result.tokens;
    }
    
    getStats() {
        return this.tokenizer.getStats();
    }
    
    testComponent(componentName) {
        return this.tokenizer.testRoundTrip(componentName);
    }
}

// Export for use
module.exports = { RosettaBOMAPI };

// CLI usage
if (require.main === module) {
    const api = new RosettaBOMAPI();
    
    if (process.argv.length < 4) {
        console.log('Usage: node api.js <command> <input>');
        console.log('Commands: encode, decode, tokenize, test');
        console.log('Example: node api.js encode "log4j-core-2.14.1"');
        process.exit(1);
    }
    
    const command = process.argv[2];
    const input = process.argv[3];
    
    switch (command) {
        case 'encode':
            console.log(JSON.stringify(api.encode(input), null, 2));
            break;
        case 'decode':
            const ids = JSON.parse(input);
            console.log(JSON.stringify(api.decode(ids), null, 2));
            break;
        case 'tokenize':
            console.log(api.tokenize(input));
            break;
        case 'test':
            console.log(JSON.stringify(api.testComponent(input), null, 2));
            break;
        case 'stats':
            console.log(JSON.stringify(api.getStats(), null, 2));
            break;
        default:
            console.log('Unknown command:', command);
    }
}