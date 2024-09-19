export interface IDictionaryEntryResponse {
  translation: string;
  synonyms: string[];
  meanings: string[];
  error?: string;
}
