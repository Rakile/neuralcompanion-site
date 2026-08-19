# Google Search Console production checklist

1. Add a **Domain property** for `neuralcompanion.app` in Google Search Console. Copy Google's TXT value into the domain's DNS provider, publish it, then select **Verify**. A domain property covers HTTPS and any future subdomains.
2. Open **Sitemaps**, submit `https://neuralcompanion.app/sitemap-index.xml`, and wait for a successful fetch. The generated sitemap contains only canonical production URLs.
3. Use **URL Inspection** on the homepage, `/addons/`, key provider pages, and newly published addon pages. Confirm the live test can fetch the page, canonical selection matches, and indexing is allowed.
4. Use **Request indexing** for a small number of important new or substantially changed pages. A sitemap remains the scalable discovery mechanism.
5. Review **Page indexing** for excluded, duplicate, soft-404, redirect, and server-error groups. Fix the underlying route or content issue before requesting another crawl.
6. In **Performance → Search results**, inspect queries, pages, countries, devices, clicks, impressions, click-through rate, and average position. Compare date ranges after meaningful releases.
7. Use real query data to improve pages that already earn impressions but answer intent poorly. Do not add a list of keywords merely because a phrase appears in the report.

Also monitor Core Web Vitals and HTTPS reports after deployment. Search Console reports are delayed and are not a real-time release test.
