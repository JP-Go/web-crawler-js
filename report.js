export function printReport(pages) {
  console.log(`====================`);
  console.log(`REPORT`);
  console.log(`====================`);
  const sorted = sortKeysByCount(pages);
  for (const [page, count] of sorted) {
    console.log(`Found ${count} internal links to: ${page}`);
  }
}

export function sortKeysByCount(object) {
  return Object.keys(object)
    .sort((a, b) => object[b] - object[a])
    .reduce((acc, key) => {
      return [...acc, [key, object[key]]];
    }, []);
}
