
export const sunlightOptions = ['LIGHT_EXPOSURE', 'PARTIAL_SHADE', 'SHADE'];
export const sunExposureOptions = ['DIRECT_SUN', 'NO_DIRECT_SUN'];
export const seasonOptions = ['Spring', 'Summer', 'Autumn', 'Winter'];

interface LanguageMap {
  [key: string]: string;
}

export const languages: LanguageMap = {
    'EN': 'English',
    'FR': 'French',
}

export const getLanguageIcon = (language: string) => {
    switch (language) {
        case 'EN':
            return '🇬🇧';
        case 'FR':
            return '🇫🇷';
        default:
            return '🌐';
    }
}
