/**
 * RosettaBOM - The Universal SBOM Tokenizer
 * Complete tokenizer with encode/decode functionality
 */

const { Vocabulary } = require('../core/vocabulary');

class RosettaTokenizer {
    constructor() {
        this.vocab = null;
        this.isLoaded = false;
    }
    
    /**
     * Train the tokenizer on a corpus
     */
    train(corpusText) {
        console.log('🏛️ Training RosettaBOM Tokenizer...');
        
        this.vocab = new Vocabulary();
        this.vocab.buildFromCorpus(corpusText);
        this.isLoaded = true;
        
        console.log(`✅ Training complete! Vocabulary size: ${this.vocab.getStats().totalTokens}`);
        return this;
    }
    
    /**
     * Load pre-trained vocabulary
     */
    loadVocabulary(vocabData) {
        this.vocab = new Vocabulary();
        this.vocab.load(vocabData);
        this.isLoaded = true;
        return this;
    }
    
    /**
     * Encode text to token IDs
     */
    encode(text) {
        if (!this.isLoaded) {
            throw new Error('Tokenizer not loaded. Please train() or loadVocabulary() first.');
        }
        
        const tokens = this.vocab.tokenize(text);
        const encoded = tokens.map(token => this.vocab.encode(token));
        
        return {
            input: text,
            tokens: tokens,
            ids: encoded,
            length: encoded.length
        };
    }
    
    /**
     * Decode token IDs back to text
     */
    decode(tokenIds) {
        if (!this.isLoaded) {
            throw new Error('Tokenizer not loaded. Please train() or loadVocabulary() first.');
        }
        
        const tokens = tokenIds.map(id => this.vocab.decode(id));
        const text = this.reconstructText(tokens);
        
        return {
            ids: tokenIds,
            tokens: tokens,
            text: text
        };
    }
    
    /**
     * Reconstruct text from tokens (simple joining)
     */
    reconstructText(tokens) {
        // Smart reconstruction based on token patterns
        let result = '';
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const nextToken = tokens[i + 1];
            
            result += token;
            
            // Add separators based on patterns
            if (nextToken) {
                if (this.needsSeparator(token, nextToken)) {
                    result += this.getSeparator(token, nextToken);
                }
            }
        }
        
        return result;
    }
    
    /**
     * Determine if we need a separator between tokens
     */
    needsSeparator(currentToken, nextToken) {
        // Don't separate if next token starts with separator
        if (nextToken.startsWith('-') || nextToken.startsWith('.') || nextToken.startsWith(':')) {
            return false;
        }
        
        // Don't separate numbers and dots
        if (this.isNumber(currentToken) && nextToken === '.') {
            return false;
        }
        if (currentToken === '.' && this.isNumber(nextToken)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Get appropriate separator between tokens
     */
    getSeparator(currentToken, nextToken) {
        // Maven format: group:artifact:version
        if (this.looksLikeGroupId(currentToken) || this.looksLikeArtifact(currentToken)) {
            return ':';
        }
        
        // Version numbers: 2.14.1
        if (this.isNumber(currentToken) && this.isNumber(nextToken)) {
            return '.';
        }
        
        // Default: hyphen for component names
        return '-';
    }
    
    /**
     * Utility functions
     */
    isNumber(token) {
        return /^\d+$/.test(token);
    }
    
    looksLikeGroupId(token) {
        return token.includes('org') || token.includes('com') || token.includes('io');
    }
    
    looksLikeArtifact(token) {
        // Common artifact patterns
        return ['core', 'api', 'boot', 'databind', 'lang3'].includes(token);
    }
    
    /**
     * Batch processing
     */
    encodeBatch(texts) {
        return texts.map(text => this.encode(text));
    }
    
    decodeBatch(tokenIdArrays) {
        return tokenIdArrays.map(ids => this.decode(ids));
    }
    
    /**
     * Get tokenizer statistics
     */
    getStats() {
        if (!this.isLoaded) {
            return { error: 'Tokenizer not loaded' };
        }
        
        return {
            ...this.vocab.getStats(),
            isLoaded: this.isLoaded,
            name: 'RosettaBOM Tokenizer',
            version: '2.0.0'
        };
    }
    
    /**
     * Test round-trip encoding/decoding
     */
    testRoundTrip(text) {
        const encoded = this.encode(text);
        const decoded = this.decode(encoded.ids);
        
        return {
            original: text,
            encoded: encoded,
            decoded: decoded,
            success: text === decoded.text,
            similarity: this.calculateSimilarity(text, decoded.text)
        };
    }
    
    /**
     * Calculate similarity between original and reconstructed text
     */
    calculateSimilarity(text1, text2) {
        if (text1 === text2) return 1.0;
        
        // Simple character-based similarity
        const maxLength = Math.max(text1.length, text2.length);
        const minLength = Math.min(text1.length, text2.length);
        
        let matches = 0;
        for (let i = 0; i < minLength; i++) {
            if (text1[i] === text2[i]) matches++;
        }
        
        return matches / maxLength;
    }
    
    /**
     * Save tokenizer (vocabulary + metadata)
     */
    save() {
        if (!this.isLoaded) {
            throw new Error('Cannot save unloaded tokenizer');
        }
        
        return {
            vocabulary: this.vocab.save(),
            metadata: {
                name: 'RosettaBOM',
                version: '2.0.0',
                type: 'cybersecurity-component-tokenizer',
                created: new Date().toISOString()
            }
        };
    }
}

module.exports = { RosettaTokenizer };