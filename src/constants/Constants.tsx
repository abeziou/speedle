import WordData from '../words/words.json'

const wordLists: Record<string, string[]> = WordData

export const WORD_LENGTH = 5
export const COUNTDOWN_TIME_SECONDS = 90
export const ERROR_MESSAGE_SHOW_LENGTH = 1000
export const INCREASE_SHOW_LENGTH = 1000

export const ValidChoiceList = WordData['chosen_word_list']
export const ValidGuessSet = new Set<string>()
wordLists['valid_guess_list'].forEach(word => ValidGuessSet.add(word))
ValidChoiceList.forEach(word => ValidGuessSet.add(word))