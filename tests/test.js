**
 * RosettaBOM Test Suite
 * Comprehensive tests for the Universal SBOM Translator
 */
const { RosettaBOM } = require('../src/index');

function runTests() {
    const rosetta = new RosettaBOM();
    let passed = 0;
    let total = 0;
    
    function test(description, testFunction) {
        total++;
        try {
            testFunction();
            console.log(`✅ ${description}`);
            passed++;
        } catch (error) {
            console.log(`❌ ${description}: ${error.message}`);
        }
    }
    
    console.log('🧪 Running RosettaBOM Test Suite\n');
    
    // Basic format tests
    test('Basic format decoding', () => {
        const result = rosetta.decode("log4j-core-2.14.1");
        if (result.component !== "log4j-core" || result.version !== "2.14.1" || result.format !== "basic") {
            throw new Error(`Expected log4j-core:2.14.1:basic, got ${result.component}:${result.version}:${result.format}`);
        }
    });
    
    // Maven format tests
    test('Maven format decoding', () => {
        const result = rosetta.decode("org.apache.logging.log4j:log4j-core:2.14.1");
        if (result.component !== "log4j-core" || result.version !== "2.14.1" || result.format !== "maven") {
            throw new Error(`Expected log4j-core:2.14.1:maven, got ${result.component}:${result.version}:${result.format}`);
        }
    });
    
    // PURL format tests
    test('PURL format decoding', () => {
        const result = rosetta.decode("pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1");
        if (result.component !== "log4j-core" || result.version !== "2.14.1" || result.format !== "PURL") {
            throw new Error(`Expected log4j-core:2.14.1:PURL, got ${result.component}:${result.version}:${result.format}`);
        }
    });
    
    // Cross-format matching tests (The Rosetta Stone functionality!)
    test('Cross-format matching - Basic to Maven', () => {
        const same = rosetta.areSameComponent(
            "log4j-core-2.14.1",
            "org.apache.logging.log4j:log4j-core:2.14.1"
        );
        if (!same) {
            throw new Error('Should detect same component across Basic and Maven formats');
        }
    });
    
    test('Cross-format matching - Maven to PURL', () => {
        const same = rosetta.areSameComponent(
            "org.apache.logging.log4j:log4j-core:2.14.1",
            "pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1"
        );
        if (!same) {
            throw new Error('Should detect same component across Maven and PURL formats');
        }
    });
    
    test('Cross-format matching - All three formats', () => {
        const basic = "log4j-core-2.14.1";
        const maven = "org.apache.logging.log4j:log4j-core:2.14.1";
        const purl = "pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1";
        
        const match1 = rosetta.areSameComponent(basic, maven);
        const match2 = rosetta.areSameComponent(maven, purl);
        const match3 = rosetta.areSameComponent(basic, purl);
        
        if (!match1 || !match2 || !match3) {
            throw new Error('All three formats should match the same component');
        }
    });
    
    test('Different component detection', () => {
        const same = rosetta.areSameComponent(
            "log4j-core-2.14.1",
            "spring-boot-2.5.0"
        );
        if (same) {
            throw new Error('Should detect different components');
        }
    });
    
    test('Different version detection', () => {
        const same = rosetta.areSameComponent(
            "log4j-core-2.14.1",
            "log4j-core-2.15.0"
        );
        if (same) {
            throw new Error('Should detect different versions');
        }
    });
    
    // Error handling tests
    test('Error handling - empty input', () => {
        try {
            rosetta.decode("");
            throw new Error('Should throw error for empty input');
        } catch (error) {
            if (!error.message.includes('non-empty string')) {
                throw error;
            }
        }
    });
    
    test('Error handling - null input', () => {
        try {
            rosetta.decode(null);
            throw new Error('Should throw error for null input');
        } catch (error) {
            if (!error.message.includes('non-empty string')) {
                throw error;
            }
        }
    });
    
    // Batch processing test
    test('Batch processing', () => {
        const inputs = [
            "log4j-core-2.14.1",
            "org.apache.logging.log4j:log4j-core:2.14.1",
            "pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1",
            "invalid-input"
        ];
        const results = rosetta.decodeBatch(inputs);
        if (results.length !== 4) {
            throw new Error('Should return result for each input');
        }
        if (!results[3].error) {
            throw new Error('Should handle invalid input in batch');
        }
        if (results[0].component !== results[1].component || results[1].component !== results[2].component) {
            throw new Error('Should decode same component from different formats');
        }
    });
    
    // SBOM processing test
    test('SPDX SBOM processing', () => {
        const mockSPDX = {
            spdxVersion: "SPDX-2.3",
            packages: [
                { name: "log4j-core-2.14.1", SPDXID: "SPDXRef-Package-1" },
                { name: "org.springframework:spring-core:5.3.21", SPDXID: "SPDXRef-Package-2" }
            ]
        };
        
        const result = rosetta.processSBOM(mockSPDX);
        if (result.totalPackages !== 2 || result.successfullyDecoded !== 2) {
            throw new Error('Should process all SPDX packages successfully');
        }
    });
    
    // Stats test
    test('RosettaBOM stats', () => {
        const stats = rosetta.getStats();
        if (stats.name !== "RosettaBOM" || !stats.supportedFormats.includes("basic")) {
            throw new Error('Should return correct stats');
        }
    });
    
    console.log(`\n📊 Test Results: ${passed}/${total} passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed! RosettaBOM is working perfectly.');
        console.log('🏛️  The Universal SBOM Translator is ready for production!');
    } else {
        console.log('💥 Some tests failed!');
        process.exit(1);
    }
}

if (require.main === module) {
    runTests();
}

module.exports = { runTests };