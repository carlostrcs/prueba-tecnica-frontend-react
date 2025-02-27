import { test, expect } from '@playwright/test';


test('AddUser', async ({ page }) => {
    
    // 1. Navegar a la URL de la aplicación
    await page.goto('http://localhost:5173/');


    // 2. Hacer click en el botón "Añadir" para abrir el modal
    await page.getByRole('button', { name: 'Añadir' }).click();

    // Espera a que el modal se abra y que aparezca el heading "Añadir Usuario"
    const modalHeading = page.getByRole('heading', { name: 'Añadir Usuario' });
    await expect(modalHeading).toBeVisible();

    // 3. Ubicar los inputs del modal usando sus etiquetas
    const nombreInput = page.locator('div').filter({ hasText: /^Nombre:$/ }).getByRole('textbox');
    const apellidoInput = page.locator('div').filter({ hasText: /^Apellido:$/ }).getByRole('textbox');
    const emailInput = page.locator('input[type="email"]');
    const paisInput = page.locator('div').filter({ hasText: /^País:$/ }).getByRole('textbox');
    
    // Comprobar que los campos están vacíos
    await expect(nombreInput).toHaveValue('');
    await expect(apellidoInput).toHaveValue('');
    await expect(emailInput).toHaveValue('');
    await expect(paisInput).toHaveValue('');

    // 4. Rellenar los campos con los datos deseados
    await nombreInput.fill('Usuario');
    await apellidoInput.fill('Apellido');
    await emailInput.fill('usuario.apellido@gmail.com');
    await paisInput.fill('UK');

    // Comprobar que los campos se han rellenado correctamente
    await expect(nombreInput).toHaveValue('Usuario');
    await expect(apellidoInput).toHaveValue('Apellido');
    await expect(emailInput).toHaveValue('usuario.apellido@gmail.com');
    await expect(paisInput).toHaveValue('UK');

    // 5. Hacer click en el botón "Guardar"
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Opcional: Esperar a que el modal desaparezca (puedes buscar que el heading "Añadir Usuario" no sea visible)
    await expect(modalHeading).not.toBeVisible();

    // 6. Comprobar que el usuario aparece en la lista
    await expect(page.getByRole('cell', { name: 'Mr Usuario Apellido' })).toBeVisible();
    
});