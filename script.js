let counter = 0;
let bestScore = -Infinity; 
let bestScoreData; 
let bestIteration;
let bestSingleScore = [{adaptation: -Infinity}]; 
let timeoutRange = 1000; 

let params = prompt("Podaj paramtery A, B, C, D dla f(x) = Ax^3 + Bx^2 +Cx + D:");
params = params.split(' ').map(p => parseInt(p));

let pk = prompt("Podaj współczynnik prawdopodobieństwa krzyżowania (od 0 do 1)");
let pm = prompt("Podaj współczynnik prawdopodobieństwa mutacji (od 0 do 1)");

const generateChromosomes = (amount, length) => {
    return chromosomes = Array(amount).fill(0).map((chromosome, i) => {
        return { name: 'ch' + i, chromosome: Array(length).fill(0).map(() => Math.floor(Math.random() * 2)).join('') }
    });
};

const calcFenotypes = (chromosomes) => {
    return chromosomes.map(ch => {
        return { ...ch, fenotype: parseInt(ch.chromosome, 2) }
    });
};

const calcAdaptation = (chromosomes) => {
    return chromosomes.map(ch => {
        return { ...ch, adaptation: (params[0] * ch.fenotype * ch.fenotype * ch.fenotype) + (params[1] * ch.fenotype * ch.fenotype) + (params[2] * ch.fenotype) + params[3] }
    });
};

const calcParticipation = (chromosomes) => {
    const sum = chromosomes.map(a => a.adaptation).reduce((a, b) => a + b);
    chromosomes = chromosomes.map(ch => {
        return { ...ch, participation: +(ch.adaptation / sum * 100).toFixed(1) }
    });
    return sortedChromosomes = [...chromosomes].sort((a, b) => a.participation - b.participation);
};

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
            });
        };
    });
    return ranges;
};

const generateShoots = (amount) => {
    return shoots = Array(amount).fill(0).map(shoot => {
        return Math.floor(Math.random() * 99) + 1;
    });
};

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
};

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
        let isCrossing = Math.random() < pk;
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
        ]
    })
};

const crossing2 = (pairedChromosomes) => {
    return crossed = pairedChromosomes.map(pair => {
        const isCrossing = Math.random() < pk;
        const crossingIndex = Math.floor(Math.random() * 4) + 1;
        if (!isCrossing) {
            return pair;
        }
        return [
            { ...pair[0], chromosome: 
                pair[0].chromosome.slice(0, crossingIndex) + pair[1].chromosome.slice(crossingIndex)
            },
            { ...pair[1], 
                chromosome: pair[1].chromosome.slice(0, crossingIndex) + pair[0].chromosome.slice(crossingIndex)
            }
        ]
    })
};

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
        const isMutating = Math.random() < pm;
        const mutatingIndex = Math.floor(Math.random() * 4) + 1;
        const newItem = ch.chromosome.split('');
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

const trimResult = (result) => {
    return result.map(ch => {
        return {
            name: ch.name,
            chromosome: ch.chromosome,
            fenotype: ch.fenotype,
            adaptation: ch.adaptation
        }
    })
}

const checkFinalAdaptation = (chromosomes) => {
    const chWithFenotypes = calcFenotypes(chromosomes);
    const chWithAdaptation = calcAdaptation(chWithFenotypes);
    const sum = chWithAdaptation.map(a => a.adaptation).reduce((a, b) => a + b);

    const sortedChromosomes = chWithAdaptation.slice().sort((a, b) => b.adaptation - a.adaptation); 
    if (sortedChromosomes[0].adaptation > bestSingleScore[0].adaptation) {
        bestSingleScore = [{...sortedChromosomes[0], iteration: counter }]; 
    }
    
    if (sum > bestScore) {
        bestIteration = counter; 
        bestScore = sum; 
        bestScoreData = chWithAdaptation.sort((a, b) => a.participation - b.participation);
    }
    if (counter < 10000) {
        counter += 1
        if (counter === timeoutRange) {
            timeoutRange = timeoutRange + 1000; 
            setTimeout( function() {
                run(chWithAdaptation);
            }, 0);
        } else {
            run(chWithAdaptation);
        }
    } else {
        //console.log('Iteration ' + counter + '. Result with sum ' + sum + ':');
        //console.table(trimResult(chWithAdaptation));
        console.log('Best result at iteration ' + bestIteration + ' with sum ' + bestScore + ':');
        console.table(trimResult(bestScoreData.sort((a, b) => b.adaptation - a.adaptation))); 
        console.log('Best candidate:');
        console.table(trimResult(bestSingleScore))
    }
}

const run = (chromosomes) => {
    const chWithFenotypes = calcFenotypes(chromosomes);
    const chWithAdaptation = calcAdaptation(chWithFenotypes);
    const sortedChromosomes = chWithAdaptation.slice().sort((a, b) => b.adaptation - a.adaptation); 
    if (sortedChromosomes[0].adaptation > bestSingleScore[0].adaptation) {
        bestSingleScore = [{...sortedChromosomes[0], iteration: counter }]; 
    }
    const chWithParicipation = calcParticipation(chWithAdaptation);
    const ranges = calcRanges(chWithParicipation);
    const shooted = shooting(ranges);
    const paired = pairChromosomes(shooted);
    const crossed = crossing(paired);
    const unpaired = unpair(crossed);
    const mutated = mutate(unpaired);
    checkFinalAdaptation(mutated);
}

const startingChromosomes = calcAdaptation(calcFenotypes(generateChromosomes(6, 5)));
const startingSum = startingChromosomes.map(a => a.adaptation).reduce((a, b) => a + b)
console.log('Starting chromosomes with sum: ' + startingSum + ':');
console.table(startingChromosomes);
run(chromosomes); 


