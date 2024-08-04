import { crawlPage } from './crawl.js';
import { printReport } from './report.js';

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('missing url');
    printUsage();
    process.exit(1);
  }
  if (args.length > 1) {
    console.error('only one url allowed');
    printUsage();
    process.exit(1);
  }
  const baseURL = args[0];

  console.log(`Crawling ${baseURL}`);
  const pages = await crawlPage(baseURL);
  printReport(pages);
}

function printUsage() {
  console.error('Usage: node main.js <url>');
}

await main();
