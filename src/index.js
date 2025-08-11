/**
 * RosettaBOM - Main entry point
 */
const { RosettaBOM } = require('./rosettaBOM');

module.exports = { RosettaBOM };

// Demo - just like your original tests
if (require.main === module) {
    const rosetta = new RosettaBOM();
    
    console.log('🏛️ RosettaBOM - The Universal SBOM Translator\n');
    
    // Your original test cases
    console.log('=== Individual Extractions ===');
    const testCases = [
        "log4j-core-2.14.1",
        "org.apache.logging.log4j:log4j-core:2.14.1",
        "pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1"
    ];
    
    testCases.forEach(test => {
        const result = rosetta.extractComponent(test);
        console.log(`Input: ${test}`);
        console.log(`Component: ${result.component}, Version: ${result.version}, Format: ${result.format}\n`);
    });
    
    console.log('=== Same Component Detection ===');
    console.log('log4j-core formats same?', rosetta.sameComponent(
        "log4j-core-2.14.1", 
        "org.apache.logging.log4j:log4j-core:2.14.1"
    ));
}