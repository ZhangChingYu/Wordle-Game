export const fetchRandomWord = async():Promise<string> => {
    try {
        const res = await fetch("/answers.json");
        const data = await res.json();
        const wordList = data.words;
        const word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
        console.log(word);
        return word;
    } catch (error){
        console.error("Error loading answers.json", error);
        return "ERROR";
    }
}

export const fetchValidWordList = async():Promise<string[]> => {
    try {
        const res = await fetch("/allowedWords.json");
        const data = await res.json();
        const validWordList = data.words;
        return validWordList;
    } catch (error) {
        console.error("Error loading allowedWords.json", error);
        return [];
    }
}