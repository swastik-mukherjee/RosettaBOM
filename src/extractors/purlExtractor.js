/**
 * RosettaBOM - PURL Format Extractor
 * Extracts component and version from PURL format
 * Example: "pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1"
 */
function extractPURLFormat(input) {
    const arr = input.split("/");
    const len = arr.length;
    const arr2 = arr[len - 1].split("@");
    const component = arr2[0];
    const version = arr2[1];
    
    // Extract additional PURL info
    const ecosystem = arr[0].split(":")[1]; // "maven"
    const namespace = len > 2 ? arr[len - 2] : null; // "org.apache.logging.log4j"
    
    return {
        component: component,
        version: version,
        format: "PURL",
        ecosystem: ecosystem,
        namespace: namespace,
        originalInput: input
    };
}

module.exports = { extractPURLFormat };