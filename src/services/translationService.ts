// Interfaz para las traducciones
export interface CountryTranslations {
    [countryCode: string]: string;
}

// Función para cargar traducciones dinámicamente
export async function loadTranslations(language: string): Promise<CountryTranslations> {
    try {
        // Importar dinámicamente el archivo de traducciones según el idioma
        const translationModule = await import(`../locales/${language}.json`);
        return translationModule.default || translationModule;
    } catch (error) {
        console.error(`Error loading translations for language: ${language}`, error);

        // Intentar cargar las traducciones por defecto si falla
        try {
            const defaultModule = await import('../locales/es.json');
            return defaultModule.default || defaultModule;
        } catch (fallbackError) {
            console.error('Failed to load default translations', fallbackError);
            return {};
        }
    }
}

// Función para aplicar traducciones a elementos del dropdown
export function applyCountryTranslations(
    dropdown: Element,
    translations: CountryTranslations
): void {
    const countryItems = dropdown.querySelectorAll('.react-international-phone-country-selector-dropdown__list-item');

    countryItems.forEach((item) => {
        const countryElement = item as HTMLElement;
        const countryCode = countryElement.getAttribute('data-country');

        if (countryCode && translations[countryCode]) {
            // Encontrar el elemento del nombre del país
            const countryNameElement = countryElement.querySelector(
                '.react-international-phone-country-selector-dropdown__list-item-country-name'
            );

            if (countryNameElement) {
                countryNameElement.textContent = translations[countryCode];

                // Actualizar también el title para el tooltip
                countryElement.setAttribute('title', translations[countryCode]);

                // Actualizar el aria-label que incluye código de país
                const dialCode = countryElement.querySelector(
                    '.react-international-phone-country-selector-dropdown__list-item-dial-code'
                )?.textContent;

                if (dialCode) {
                    countryElement.setAttribute('aria-label', `${translations[countryCode]} ${dialCode}`);
                }
            }
        }
    });
}