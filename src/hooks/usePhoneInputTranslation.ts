import { useEffect, useState, RefObject } from 'react';
import { loadTranslations, applyCountryTranslations } from '../services/translationService';

// Interface para el objeto de traducciones
interface CountryTranslations {
    [countryCode: string]: string;
}
export function usePhoneInputTranslation(
    containerRef: RefObject<HTMLElement | null>,
    language: string
) {
    const [translations, setTranslations] = useState<CountryTranslations>({});

    // Cargar las traducciones
    useEffect(() => {
        const fetchTranslations = async () => {
            const loadedTranslations = await loadTranslations(language);
            setTranslations(loadedTranslations);
        };

        fetchTranslations();
    }, [language]);

    // Aplicar las traducciones al dropdown
    useEffect(() => {
        const container = containerRef.current;
        if (!container || !Object.keys(translations).length) return;

        const translateDropdown = () => {
            // Método 1: Usar MutationObserver
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        const dropdown = containerRef.current?.querySelector(
                            '.react-international-phone-country-selector-dropdown'
                        );

                        if (dropdown) {
                            applyCountryTranslations(dropdown, translations);
                        }
                    }
                });
            });

            observer.observe(container, {
                childList: true,
                subtree: true
            });

            // Método 2: Escuchar clics en el botón selector
            const selectorButton = container.querySelector(
                '.react-international-phone-country-selector-button'
            );

            if (selectorButton) {
                const clickHandler = () => {
                    setTimeout(() => {
                        const dropdown = containerRef.current?.querySelector(
                            '.react-international-phone-country-selector-dropdown'
                        );

                        if (dropdown) {
                            applyCountryTranslations(dropdown, translations);
                        }
                    }, 50);
                };

                selectorButton.addEventListener('click', clickHandler);

                return () => {
                    selectorButton.removeEventListener('click', clickHandler);
                    observer.disconnect();
                };
            }

            return () => observer.disconnect();
        };

        const timeoutId = setTimeout(translateDropdown, 100);
        return () => clearTimeout(timeoutId);
    }, [containerRef, translations]);

    return translations;
}