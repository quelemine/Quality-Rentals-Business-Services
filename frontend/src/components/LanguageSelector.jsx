import React, { useEffect, useState } from 'react';
import { Globe2 } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English (US)' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' },
];

const LanguageSelector = ({ mobile = false }) => {
  const [language, setLanguage] = useState('en');
  const [translatorReady, setTranslatorReady] = useState(false);
  const translatorElementId = mobile ? 'google_translate_element_mobile' : 'google_translate_element_desktop';

  useEffect(() => {
    document.documentElement.lang = 'en-US';
    document.documentElement.dir = 'ltr';

    const initialiseTranslator = () => {
      if (!window.google?.translate || document.getElementById(translatorElementId)?.children.length) {
        setTranslatorReady(Boolean(window.google?.translate));
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: languages.map((entry) => entry.code).join(','),
          autoDisplay: false,
        },
        translatorElementId
      );
      setTranslatorReady(true);
    };

    window.qrsInitialiseGoogleTranslate = initialiseTranslator;
    if (window.google?.translate) {
      initialiseTranslator();
      return undefined;
    }

    const existingScript = document.getElementById('qrs-google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'qrs-google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=qrsInitialiseGoogleTranslate';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      delete window.qrsInitialiseGoogleTranslate;
    };
  }, []);

  const changeLanguage = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage === 'en' ? 'en-US' : nextLanguage;
    document.documentElement.dir = nextLanguage === 'ar' ? 'rtl' : 'ltr';

    const translatorSelect = document.querySelector('.goog-te-combo');
    if (translatorReady && translatorSelect) {
      translatorSelect.value = nextLanguage;
      translatorSelect.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div className={mobile ? 'w-full' : 'shrink-0'}>
      <label className="sr-only" htmlFor={mobile ? 'mobile-language-selector' : 'language-selector'}>Website language</label>
      <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white">
        <Globe2 className="h-4 w-4 shrink-0 text-gold" />
        <select
          id={mobile ? 'mobile-language-selector' : 'language-selector'}
          value={language}
          onChange={changeLanguage}
          className="min-w-0 flex-1 appearance-none bg-transparent text-sm font-medium text-white outline-none [&>option]:text-navy"
        >
          {languages.map((entry) => <option key={entry.code} value={entry.code}>{entry.label}</option>)}
        </select>
      </div>
      <div id={translatorElementId} className="hidden" aria-hidden="true" />
    </div>
  );
};

export default LanguageSelector;
