# Page Actions Usage Guide

## BasePage

`BasePage` creates a single `Actions` object that every page inherits.

``` ts
export abstract class BasePage {

    protected readonly actions: Actions;

    constructor(protected readonly page: Page) {
        this.actions = new Actions(page);
    }
}
```

------------------------------------------------------------------------

## HomePage Example

`actions` is **not** created again in the page. It is inherited from
`BasePage`.

``` ts
export class HomePage extends BasePage {

    readonly locators: HomeLocators;
    readonly linkedTables: LinkedTablesActions;

    constructor(page: Page) {
        super(page);

        this.locators = new HomeLocators(page);

        this.linkedTables = new LinkedTablesActions(page, {
            employeeTable: this.locators.employeeTable,
            addressTable: this.locators.addressTable
        });
    }

    async login(username: string, password: string): Promise<void> {

        await this.actions.textbox.fill(
            this.locators.username,
            username
        );

        await this.actions.textbox.fill(
            this.locators.password,
            password
        );

        await this.actions.page.click(
            this.locators.loginButton
        );

        await this.actions.validation.expectVisible(
            this.locators.dashboardLogo
        );
    }
}
```

------------------------------------------------------------------------

## Why `LinkedTablesActions` is different

`Actions` is generic and reusable across all pages.

`LinkedTablesActions` depends on page-specific table definitions, so it
must be created inside the page that owns those tables.

``` ts
this.linkedTables = new LinkedTablesActions(page, {
    employeeTable: this.locators.employeeTable,
    addressTable: this.locators.addressTable
});
```

------------------------------------------------------------------------

## Standard Action Usage

``` ts
await this.actions.page.click(locator);

await this.actions.textbox.fill(locator, "Deepak");

await this.actions.dropdown.selectByText(locator, "India");

await this.actions.checkbox.check(locator);

await this.actions.table.getRowCount(this.locators.employeeTable);

await this.actions.validation.expectVisible(locator);
```

------------------------------------------------------------------------

## Linked Tables Usage

``` ts
const rowIndex = await this.linkedTables.findRow(
    "employeeTable",
    "Employee Id",
    "100001"
);

await this.linkedTables.clickCell(
    "addressTable",
    rowIndex,
    "City"
);
```

------------------------------------------------------------------------

## Best Practices

-   Extend only `BasePage`.
-   Never instantiate `Actions` inside page classes.
-   Use `this.actions` inherited from `BasePage`.
-   Instantiate `LinkedTablesActions` only in pages that require linked
    tables.
-   Keep business logic in page classes.
-   Keep reusable interactions in action classes.
-   Keep synchronization in `WaitActions`.
-   Keep assertions in `ValidationActions`.
-   Store locators in `*.locators.ts`.
-   Decorate every public action method with `@Step()`.
