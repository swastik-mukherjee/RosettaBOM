/**
 * RosettaBOM - Your original tokenizer logic with new name
 */
const { detectFormat } = require('./formatDetector');
const { extractBasicFormat } = require('./extractors/basicExtractor');
const { extractMavenFormat } = require('./extractors/mavenExtractor');
const { extractPURLFormat } = require('./extractors/purlExtractor');

class RosettaBOM {
    /**
     * Extract component - your original extractComponent method
     */
    extractComponent(input) {
        if (!input || typeof input !== 'string') {
            throw new Error('Input must be a non-empty string');
        }

        const format = detectFormat(input);
        
        switch (format) {
            case "basic":
                return extractBasicFormat(input);
            case "maven":
                return extractMavenFormat(input);
            case "PURL":
                return extractPURLFormat(input);
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    /**
     * Check if same component - your original sameComponent method
     */
    sameComponent(input1, input2) {
        try {
            const comp1 = this.extractComponent(input1);
            const comp2 = this.extractComponent(input2);
            
            return comp1.component === comp2.component && 
                   comp1.version === comp2.version;
        } catch (error) {
            return false;
        }
    }

    /**
     * Batch processing - your original extractBatch method
     */
    extractBatch(inputs) {
        return inputs.map(input => {
            try {
                return this.extractComponent(input);
            } catch (error) {
                return {
                    input: input,
                    error: error.message
                };
            }
        });
    }
}

module.exports = { RosettaBOM };