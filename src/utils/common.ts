import { perguntas } from '@data/data';

// Funções auxiliares de tokenização e processamento de texto
export const tokenize = (text: string) => text.toLowerCase().split(' ');

// Função para construir o vocabulário
export const buildVocab = (sentences: string[]) => {
  const vocab: { [key: string]: number } = {};
  let index = 1;
  sentences.forEach((sentence) => {
    tokenize(sentence).forEach((word) => {
      if (!vocab[word]) vocab[word] = index++;
    });
  });
  return vocab;
};

// Função para converter as frases em sequências de números com base no vocabulário
export const convertToSequence = (sentences: string[], vocab: { [key: string]: number }) =>
  sentences.map((sentence) => tokenize(sentence).map((word) => vocab[word] || 0));

// Função para padronizar o comprimento das sequências (padding)
export const padSequences = (sequences: number[][], maxLen: number) =>
  sequences.map((seq) => {
    if (seq.length < maxLen) {
      return [...seq, ...Array(maxLen - seq.length).fill(0)]; // Preenche com zeros
    }
    return seq.slice(0, maxLen); // Limita se a sequência for maior
  });

// Construindo o vocabulário a partir das perguntas
export const vocab = buildVocab(perguntas);

// Comprimento máximo da sequência
export const maxSequenceLength = Math.max(
  ...convertToSequence(perguntas, vocab).map((seq) => seq.length),
);
