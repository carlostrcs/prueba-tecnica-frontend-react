import { test, expect } from '@playwright/test';

test('DeleteUser', async ({ page }) => {
    // 1. Navigate to the application URL
    await page.goto('http://localhost:5173/');

    // 2. Wait for the table to render and have at least one row
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows).not.toHaveCount(0);

    // 3. Count the number of rows before deletion
    const initialRowCount = await tableRows.count();

    // 4. Get text from the first row to later verify it's gone
    const firstRowText = await tableRows.first().textContent();

    // 5. Click on the first delete button
    const deleteButton = tableRows.first().getByRole('button', { name: 'Eliminar' });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // 6. Verify the row count decreased by 1
    await expect(tableRows).toHaveCount(initialRowCount - 1);

    // 7. Verify the deleted row is no longer visible
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain(firstRowText);

    // 8. Optional: Verify other rows still exist
    if (initialRowCount > 1) {
        await expect(tableRows).not.toHaveCount(0);
    }
});