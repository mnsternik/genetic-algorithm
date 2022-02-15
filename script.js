let counter = 0;
const params = input("Podaj parametry a, b, c, d dla funkcji").split(' ');

const generateChromosomes = (amount, length) => {
    return chromosomes = Array(amount).fill(0).map((chromosome, i) => {
        return { name: 'ch' + i, chromosome: Array(length).fill(0).map(() => Math.floor(Math.random() * 2)).join('') }
    })
}

const calcFenotypes = (chromosomes) => {
    return chromosomes.map(ch => {
        return { ...ch, fenotype: parseInt(ch.chromosome, 2) }
    })
}

const calcAdaptation = (chromosomes) => {
    return chromosomes.map(ch => {
        return { ...ch, adaptation: params[0] * ch.fenotype * ch.fenotype * ch.fenotype + params[1] * ch.fenotype * ch.fenotype + params[2] * ch.fenotype + params[3] }
    })
}

const calcParticipation = (chromosomes) => {
    const sum = chromosomes.map(a => a.adaptation).reduce((a, b) => a + b);
    chromosomes = chromosomes.map(ch => {
        return { ...ch, participation: +(ch.adaptation / sum * 100).toFixed(1) }
    })
    return sortedChromosomes = [...chromosomes].sort((a, b) => a.participation - b.participation);
}

const calcRanges = (chromosomes) => {
    const ranges = [];
    chromosomes.forEach((ch, i) => {
        if (i === 0) {
            ranges.push({
                ...ch,
                lowerRange: 0,
                upperRange: ch.participation
            });
        } else {
            ranges.push({
                ...ch,
                lowerRange: +(ranges[i - 1].upperRange + 0.1).toFixed(1),
                upperRange: +(ranges[i - 1].upperRange + ch.participation).toFixed(1),
            })
        }
    })
    return ranges;
}

const generateShoots = (amount) => {
    return shoots = Array(amount).fill(0).map(shoot => {
        return Math.floor(Math.random() * 99) + 1;
    })
}

const shooting = (chromosomes) => {
    const hitted = [];
    const shoots = generateShoots(chromosomes.length);
    shoots.forEach(shoot => {
        if (shoot <= chromosomes[0].upperRange) {
            hitted.push(chromosomes[0]);
        }
        else if (shoot > chromosomes[0].lowerRange && shoot <= chromosomes[1].upperRange) {
            hitted.push(chromosomes[1]);
        }
        else if (shoot > chromosomes[1].lowerRange && shoot <= chromosomes[2].upperRange) {
            hitted.push(chromosomes[2]);
        }
        else if (shoot > chromosomes[2].lowerRange && shoot <= chromosomes[3].upperRange) {
            hitted.push(chromosomes[3]);
        }
        else if (shoot > chromosomes[3].lowerRange && shoot <= chromosomes[4].upperRange) {
            hitted.push(chromosomes[4]);
        }
        else {
            hitted.push(chromosomes[5]);
        }
    })
    return hitted;
}

const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

const pairChromosomes = (chromosomes) => {
    const withPair = [];
    const withoutPair = shuffle(chromosomes.slice());
    let i = 0;
    while (i < chromosomes.length) {
        withPair.push([withoutPair[i], withoutPair[i + 1]]);
        i = i + 2;
    }
    return withPair;
}

const crossing = (pairedChromosomes) => {
    return crossed = pairedChromosomes.map(pair => {
        let isCrossing = Math.random() < 0.8;
        let crossingIndex = Math.floor(Math.random() * 4) + 1;
        if (!isCrossing) {
            return pair;
        }
        let prefix1 = pair[0].chromosome.slice(0, crossingIndex);
        let prefix2 = pair[1].chromosome.slice(0, crossingIndex);
        let postfix1 = pair[0].chromosome.slice(crossingIndex);
        let postfix2 = pair[1].chromosome.slice(crossingIndex);
        return [
            { ...pair[0], chromosome: prefix1 + postfix2 },
            { ...pair[1], chromosome: prefix2 + postfix1 }
        ];
    });
}

const unpair = (chromosomes) => {
    const unpaired = [];
    chromosomes.forEach(ch => {
        unpaired.push(ch[0]);
        unpaired.push(ch[1]);
    })
    return unpaired;
}

const mutate = (chromosomes) => {
    return chromosomes.map((ch, i) => {
        let isMutating = Math.random() < 0.2;
        let mutatingIndex = Math.floor(Math.random() * 4) + 1;
        let newItem = ch.chromosome.split('');
        if (isMutating) {
            if (newItem[mutatingIndex] === '0') {
                newItem[mutatingIndex] = '1';
            }
            else {
                newItem[mutatingIndex] = '0';
            }
        }
        return { ...ch, chromosome: newItem.join('') }
    })
}

const checkFinalAdaptation = (chromosomes) => {
    const chWithFenotypes = calcFenotypes(chromosomes);
    const chWithAdaptation = calcAdaptation(chWithFenotypes);
    const sum = chWithAdaptation.map(a => a.adaptation).reduce((a, b) => a + b);
    console.log('Iteration: ' + counter + '. Adaptation function sum: ' + sum);
    if (counter < 5000) {
        counter += 1
        run(chWithAdaptation);
    }
}

const startingChromosomes = generateChromosomes(6, 5);
console.log('Starting chromosomes:');
console.log(startingChromosomes);

const run = (chromosomes) => {
    const chWithFenotypes = calcFenotypes(chromosomes);
    const chWithAdaptation = calcAdaptation(chWithFenotypes);
    const chWithParicipation = calcParticipation(chWithAdaptation);
    const ranges = calcRanges(chWithParicipation);
    const shooted = shooting(ranges);
    const paired = pairChromosomes(shooted);
    const crossed = crossing(paired);
    const unpaired = unpair(crossed);
    const mutated = mutate(unpaired);
    console.log('Chromosomes after crossing and mutation: ');
    console.log(mutated);
    checkFinalAdaptation(mutated);
}


//run(chromosomes); 


