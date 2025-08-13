/**
 * RosettaBOM Vocabulary Builder
 * Simple word-based tokenization for cybersecurity components
 */

class Vocabulary {
    constructor() {
        this.tokenToId = new Map();
        this.idToToken = new Map();
        this.tokenFreq = new Map();
        this.nextId = 0;
        
        // Add special tokens
        this.addSpecialTokens();
    }
    
    addSpecialTokens() {
        const specialTokens = ['[UNK]', '[START]', '[END]', '[PAD]'];
        specialTokens.forEach(token => {
            this.addToken(token);
        });
    }
    
    addToken(token) {
        if (!this.tokenToId.has(token)) {
            this.tokenToId.set(token, this.nextId);
            this.idToToken.set(this.nextId, token);
            this.nextId++;
        }
        
        // Update frequency
        this.tokenFreq.set(token, (this.tokenFreq.get(token) || 0) + 1);
    }
    
    buildFromCorpus(corpusText) {
        const lines = corpusText.split('\n').filter(line => line.trim());
        
        lines.forEach(line => {
            const tokens = this.tokenize(line);
            tokens.forEach(token => this.addToken(token));
        });
        
        console.log(`Built vocabulary with ${this.tokenToId.size} tokens`);
        return this;
    }
    
    tokenize(text) {
        // Simple tokenization: split on common separators
        return text
            .split(/[\s\-:\.@\/]+/)
            .filter(token => token.length > 0);
    }
    
    encode(token) {
        return this.tokenToId.get(token) || this.tokenToId.get('[UNK]');
    }
    
    decode(id) {
        return this.idToToken.get(id) || '[UNK]';
    }
    
    getStats() {
        return {
            totalTokens: this.tokenToId.size,
            mostFrequent: this.getMostFrequent(10),
            vocabularySize: this.nextId
        };
    }
    
    getMostFrequent(count = 10) {
        return Array.from(this.tokenFreq.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, count);
    }
    
    save() {
        return {
            tokenToId: Object.fromEntries(this.tokenToId),
            idToToken: Object.fromEntries(this.idToToken),
            tokenFreq: Object.fromEntries(this.tokenFreq),
            nextId: this.nextId
        };
    }
    
    load(vocabData) {
        this.tokenToId = new Map(Object.entries(vocabData.tokenToId));
        this.idToToken = new Map(Object.entries(vocabData.idToToken).map(([k, v]) => [parseInt(k), v]));
        this.tokenFreq = new Map(Object.entries(vocabData.tokenFreq));
        this.nextId = vocabData.nextId;
        return this;
    }
}

module.exports = { Vocabulary };