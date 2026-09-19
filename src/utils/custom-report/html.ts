export function getReportHtml(
  browserName: string,
  platform: string,
  options: {
    styles: string
    scripts: string
    logoDataUri: string
    statsSection: string
    metaSection: string
    runStatusSection: string
    filtersSection: string
    testTableSection: string
    reportName: string
    reportSubtitle: string
  },
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.reportName}</title>
    <!-- Browser: ${browserName} | Platform: ${platform} -->
    <style>
        ${options.styles}
    </style>
</head>
<body>
    <div class="header">
        <div class="header-brand">
            <img class="header-logo" src="${options.logoDataUri}" alt="Playwright Standalone HTML Report">
        </div>
        <div class="header-copy">
            <h1>&#127917; ${options.reportName}</h1>
            <p class="header-subtitle">${options.reportSubtitle}</p>
        </div>
    </div>

    <div class="container">
        ${options.statsSection}
        ${options.metaSection}
        ${options.runStatusSection}
        ${options.filtersSection}
        ${options.testTableSection}
    </div>

    <div id="screenshotModal" class="modal">
        <span class="modal-close">&times;</span>
        <img id="modalImage" class="modal-content" src="" alt="Screenshot">
    </div>

    <div id="videoModal" class="modal">
        <span class="modal-close">&times;</span>
        <video id="modalVideo" class="modal-content" controls></video>
    </div>

    <footer class="report-footer">
        <p>Custom Playwright HTML Report</p>
    </footer>

    <script>
        ${options.scripts}
    </script>
</body>
</html>`
}
