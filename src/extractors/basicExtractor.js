/**
 * RosettaBOM - Basic Format Extractor
 * Extracts component and version from basic format
 * Example: "log4j-core-2.14.1"
 */
function extractBasicFormat(input) {
    const splittedArray = input.split('-');
    const len = splittedArray.length;
    let componentName = "";
    const versionName = splittedArray[len - 1];
    
    // Build component name with hyphens
    for (let i = 0; i < len - 1; i++) {
        componentName += splittedArray[i];
        if (i < len - 2) {
            componentName += "-";
        }
    }
    
    return {
        component: componentName,
        version: versionName,
        format: "basic",
        originalInput: input
    };
}

module.exports = { extractBasicFormat };