export interface IDictionaryEntry {
  key: string;
  translation: {
    [language: string]: string; // Exemplo: 'en': 'good morning', 'pt': 'bom dia'
  };
  synonyms: string[];
  meanings: string[];
}
