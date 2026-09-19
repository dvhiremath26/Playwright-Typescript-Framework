# Custom Playwright Reporter

Use this folder as `./utils/custom-report` in your Playwright TypeScript framework.

## Folder Layout

- `reporter.ts` - core reporter logic
- `html.ts` - HTML assembly
- `styles.ts` - report styles
- `scripts.ts` - report browser scripts
- `logo.ts` - embedded logo asset
- `se_logo.png` - Schneider Electric logo source file
- `index.ts` - folder entry point

## Playwright Config

Add the reporter in `playwright.config.ts` like this:

```ts
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  reporter: [
    ['./utils/custom-report', {
      attach: {
        screenshot: 'on',
        video: 'on',
        trace: 'on',
      },
      branding: {
        name: 'SE Automation Report',
        subtitle: 'SE - Playwright Framework',
      },
      outputFolder: './reports/se-report',
    }],
  ],
};

export default config;
```

