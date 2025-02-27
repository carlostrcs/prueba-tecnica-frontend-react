import { test, expect } from '@playwright/test';

test('EditUser', async ({ page }) => {
    // 1. Navega a la URL de la aplicación
    await page.goto('http://localhost:5173/');

    // 2. Espera a que la tabla se renderice y tenga al menos una fila
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows).not.toHaveCount(0);          // La tabla debe tener filas
    const firstRow = tableRows.first();
    await expect(firstRow).toBeVisible();                // La primera fila es visible

    // 3. En la primera fila, esperar y hacer clic en el botón "Editar"
    const editButton = firstRow.getByRole('button', { name: 'Editar' });
    await expect(editButton).toBeVisible();              // El botón "Editar" está visible
    await editButton.click();

    // 4. Espera a que se abra el modal de edición
    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible();                   // El modal aparece en pantalla

    // 5. Localiza los inputs dentro del modal por su orden (nombre, apellido, email, país)
    const nombreInput = modal.locator('input[type="text"]').nth(0);
    const apellidoInput = modal.locator('input[type="text"]').nth(1);
    const emailInput = modal.locator('input[type="email"]').first();
    const paisInput = modal.locator('input[type="text"]').nth(2);
    await expect(nombreInput).toBeVisible();             // El campo Nombre está presente
    await expect(apellidoInput).toBeVisible();           // El campo Apellido está presente
    await expect(emailInput).toBeVisible();              // El campo Email está presente
    await expect(paisInput).toBeVisible();               // El campo País está presente

    // 6. Rellena los campos con nuevos valores
    await nombreInput.fill('NuevoNombre');
    await apellidoInput.fill('NuevoApellido');
    await emailInput.fill('nuevo.email@example.com');
    await paisInput.fill('NuevoPaís');

    // 7. Clic en el botón "Guardar" dentro del modal
    const guardarButton = modal.getByRole('button', { name: 'Guardar' });
    await expect(guardarButton).toBeEnabled();           // El botón "Guardar" está habilitado
    await guardarButton.click();

    // 8. Espera que el modal se cierre (desaparezca de la vista)
    await expect(modal).not.toBeVisible();               // El modal ya no debería ser visible

    // 9. Verifica que la primera fila de la tabla muestra los datos editados
    const updatedNameCell = firstRow.locator('td').nth(1);  // Columna de nombre completo (Nombre Apellido)
    const updatedEmailCell = firstRow.locator('td').nth(2); // Columna de email
    await expect(updatedNameCell).toHaveText(/NuevoNombre NuevoApellido/);
    await expect(updatedEmailCell).toHaveText(/nuevo\.email@example\.com/);
});
