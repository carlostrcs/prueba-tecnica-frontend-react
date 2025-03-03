import { test, expect } from '@playwright/test';

test('RestoreUsers', async ({ page }) => {
    // 1. Navigate to the application URL
    await page.goto('http://localhost:5173/');

    // 2. Wait for the table to render and have rows
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows).not.toHaveCount(0);

    // 3. Count the initial number of rows
    const initialRowCount = await tableRows.count();

    // 4. Delete multiple users (first 3 if available)
    const deleteCount = Math.min(3, initialRowCount);
    for (let i = 0; i < deleteCount; i++) {
        const deleteButton = page.locator('table tbody tr').first().getByRole('button', { name: 'Eliminar' });
        await deleteButton.click();

        // Short pause to allow state updates
        await page.waitForTimeout(300);
    }

    // 5. Verify rows were deleted
    await expect(tableRows).toHaveCount(initialRowCount - deleteCount);

    // 6. Click the Restore button
    await page.getByRole('button', { name: 'Restaurar' }).click();

    // 7. Verify all rows are restored
    await expect(tableRows).toHaveCount(initialRowCount);

    // 8. Optional: Add a custom user first, then delete a few users, then restore
    // This validates the original set is restored, not just refetching from API

    // Add a new user with a distinctive name
    await page.getByRole('button', { name: 'Añadir' }).click();
    await page.locator('input[type="text"]').nth(0).fill('Distinctive');
    await page.locator('input[type="text"]').nth(1).fill('TestUser');
    await page.locator('input[type="email"]').fill('distinctive.test@example.com');
    await page.locator('input[type="text"]').nth(2).fill('TestCountry');
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify the new user was added
    const newRowCount = await tableRows.count();
    expect(newRowCount).toBe(initialRowCount + 1);

    // Verify the distinctive user exists
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Distinctive TestUser');

    // Delete a user (not the distinctive one)
    const lastRowDeleteButton = page.locator('table tbody tr').last().getByRole('button', { name: 'Eliminar' });
    await lastRowDeleteButton.click();

    // Verify a row was deleted
    await expect(tableRows).toHaveCount(newRowCount - 1);

    // Now restore and verify the distinctive user is still there
    // but the original count is restored (API data doesn't include our distinctive user)
    await page.getByRole('button', { name: 'Restaurar' }).click();

    // Verify original count is restored
    await expect(tableRows).toHaveCount(initialRowCount);

    // Verify distinctive user is no longer there (because it wasn't in the original set)
    const finalPageContent = await page.textContent('body');
    expect(finalPageContent).not.toContain('Distinctive TestUser');
});