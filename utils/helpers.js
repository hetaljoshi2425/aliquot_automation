import("@playwright/test")

export async function switchTab(context, index) {
    const pages = context.pages();
    if (index < pages.length) {
        const targetPage = pages[index];
        await targetPage.bringToFront();
        return targetPage;
    } else {
        throw new Error(`Tab index ${index} is out of bounds. There are only ${pages.length} tabs.`);
    }
}

export async function waitForSec(time) {
    await new Promise(res => setTimeout(res, time));
}

export async function clearCacheAndReload(page) {
    await page.context().clearCookies();
    const client = await page.context().newCDPSession(page);
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    await page.reload();
}

export async function extractVariablesAndOperators(formulaText) {
    const variables = Array.from(new Set(formulaText.match(/[A-Z]/g))) || [];
    const operators = Array.from(new Set(formulaText.match(/[\+\-\*\/]/g))) || [];
    const representation = formulaText.replace(/\s+/g, '');
    return { variables, operators, representation };
}

// export async function clickOnSvgUsingXpath(xpathSelector) {
//     const result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//     const svgElement = result.singleNodeValue;
//     if (svgElement) {
//         console.log(svgElement);
//         svgElement.click();
//     } else {
//         console.log('Element not found');
//     }
// }
export async function clickOnSvgUsingXpath(page, xpathSelector) {
    await page.evaluate((xpath) => {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const svgElement = result.singleNodeValue;
        if (svgElement) {
            svgElement.click();
        } else {
            console.log('Element not found');
        }
    }, xpathSelector);
}


