import mqtt from 'mqtt';

// MQTT client setup
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('matchup/request');
});

const TournamentRound = {
    FIRST_ROUND: 'First Round',
    SECOND_ROUND: 'Second Round',
    SWEET_16: 'Sweet 16',
    ELITE_EIGHT: 'Elite Eight',
    FINAL_FOUR: 'Final Four',
    CHAMPIONSHIP: 'Championship Game'
};

const seedRules = {
    16: {
        maxRound: TournamentRound.FIRST_ROUND,
        message: '16 seed has never gotten passed the first round'
    },
    15: {
        maxRound: TournamentRound.SWEET_16,
        message: '15 seed has never made it to the elite eight'
    },
    14: {
        maxRound: TournamentRound.SWEET_16,
        message: '14 seed has never made it to the final four'
    },
    11: {
        maxRound: TournamentRound.ELITE_EIGHT,
        message: '11 seed has never made it to the championship'
    },
    9: {
        maxRound: TournamentRound.FINAL_FOUR,
        message: '9 seed has never won the championship'
    },
    5: {
        maxRound: TournamentRound.FINAL_FOUR,
        message: '5 seed has never won the championship'
    }
};

const roundOrder = [
    TournamentRound.FIRST_ROUND,
    TournamentRound.SECOND_ROUND,
    TournamentRound.SWEET_16,
    TournamentRound.ELITE_EIGHT,
    TournamentRound.FINAL_FOUR,
    TournamentRound.CHAMPIONSHIP
];

const checkSeedRules = (team1Stats, team2Stats, game_info) => {
    for (const [seed, rule] of Object.entries(seedRules)) {
        const currentRoundIndex = roundOrder.indexOf(game_info.round);
        const maxRoundIndex = roundOrder.indexOf(rule.maxRound);
        
        if (currentRoundIndex > maxRoundIndex) {
            if (team1Stats.seed == seed) {
                return {
                    winningTeam: game_info.team2,
                    losingTeam: game_info.team1,
                    winningReason: rule.message
                };
            }
            if (team2Stats.seed == seed) {
                return {
                    winningTeam: game_info.team1,
                    losingTeam: game_info.team2,
                    winningReason: rule.message
                };
            }
        }
    }
    return null;
};

client.on('message', async (topic, message) => {
    if (topic === 'matchup/request') {
        const data = JSON.parse(message.toString());
        console.log('Received matchup request:', data);
                
        const game_info = {
            'team1Seed': data.team1,
            'team2Seed': data.team2,
            'round': data.round,
            'region': data.region,
            'gameNumber': data.gameNumber,
            'year': data.year,  // Use provided year or default to current year
            'winningTeam': null,
            'losingTeam': null,
            'winningReason': null,
            'id': data.round + data.region + data.gameNumber
        }

        // Validate required fields
        if (!game_info.team1 || !game_info.team2) {
            console.error('Missing required team information');
            return;
        }

        // Validate round
        if (!Object.values(TournamentRound).includes(game_info.round)) {
            console.error('Invalid tournament round');
            return;
        }

        console.log('Processing game info:', game_info);
        
        try {
            let team1Stats = await getTeamStats(game_info.team1, game_info.year);
            let team2Stats = await getTeamStats(game_info.team2, game_info.year);
            console.log(`Team 1 Stats for ${game_info.year}:`, team1Stats);
            console.log(`Team 2 Stats for ${game_info.year}:`, team2Stats);

            // Replace all the if statements with a single check
            const ruleResult = checkSeedRules(team1Stats, team2Stats, game_info);
            if (ruleResult) {
                winningTeam = ruleResult.winningTeam;
                losingTeam = ruleResult.losingTeam;
                winningReason = ruleResult.winningReason;
            } else {
                // Get the game winner if no rules applied
                let gameWinner, gameLoser, reason;
                gameWinner, gameLoser, reason = await getGameWinner(game_info, team1Stats, team2Stats);
                winningTeam = gameWinner;
                losingTeam = gameLoser;
                winningReason = reason;
            }

            console.log(`Winner: ${winningTeam}, Loser: ${losingTeam}, Reason: ${winningReason}`);
            client.publish('matchup/response', JSON.stringify({
                team1: game_info.team1,
                team2: game_info.team2,
                winner: winningTeam,
                loser: losingTeam,
                reason: winningReason
            }));

        } catch (error) {
            console.error('Error getting team stats:', error);
        }
    }
});

client.on('error', (error) => {
    console.error('Error:', error);
});

const getTeamStats = (team, year) => {
    return new Promise((resolve, reject) => {
        console.log(`Requesting stats for ${team} (${year})`);
        const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for team stats'));
        }, 5000);

        const messageHandler = (topic, message) => {
            console.log(`Received message on topic: ${topic}`);
            if (topic === `data/${year}/${team}`) {
                clearTimeout(timeout);
                client.removeListener('message', messageHandler);
                client.unsubscribe(`data/${year}/${team}`);
                try {
                    const data = JSON.parse(message.toString());
                    if (data === null) {
                        console.log(`No stats found for ${team} (${year})`);
                        resolve({}); // Return empty object instead of null
                    } else {
                        console.log(`Successfully retrieved stats for ${team} (${year})`);
                        resolve(data);
                    }
                } catch (error) {
                    console.error(`Error parsing stats for ${team}:`, error);
                    reject(error);
                }
            }
        };

        client.subscribe(`data/${year}/${team}`);
        client.on('message', messageHandler);
        client.publish(`get/${year}/${team}`, '');
    });
};

const validateAIResponse = (data, game_info) => {
    // Check if all required fields exist
    const requiredFields = ['Winning Team', 'Losing Team', 'Winning Reason'];
    const hasAllFields = requiredFields.every(field => 
        typeof data[field] === 'string' && data[field].trim() !== ''
    );
    if (!hasAllFields) {
        throw new Error('AI response missing required fields or contains empty values');
    }

    // Verify teams mentioned are actually the teams in the matchup
    const teams = [game_info.team1, game_info.team2];
    if (!teams.includes(data['Winning Team']) || !teams.includes(data['Losing Team'])) {
        throw new Error('AI response contains invalid team names');
    }

    // Verify winning and losing teams are different
    if (data['Winning Team'] === data['Losing Team']) {
        throw new Error('Winning and losing teams cannot be the same');
    }

    return {
        winningTeam: data['Winning Team'],
        losingTeam: data['Losing Team'],
        winningReason: data['Winning Reason']
    };
};

const MAX_RETRIES = 3;

const requestAIResponse = async (game_info, team1Stats, team2Stats, attempt = 1) => {
    return new Promise((resolve, reject) => {
        console.log(`Requesting game winner (attempt ${attempt}/${MAX_RETRIES}) for ${game_info.team1} vs ${game_info.team2}`);
        const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for game winner'));
        }, 5000);

        const messageHandler = (topic, message) => {
            if (topic === 'deepseek/response') {
                clearTimeout(timeout);
                client.removeListener('message', messageHandler);
                client.unsubscribe('deepseek/response');
                resolve(message);
            }
        };

        const message = {
            id: game_info.id,
            prompt: `Attempt ${attempt}/${MAX_RETRIES}: Who will win the matchup between ${game_info.team1} and ${game_info.team2}? 
            Your response MUST be a JSON object with EXACTLY these three fields:
            {
                "Winning Team": "${game_info.team1} or ${game_info.team2}",
                "Losing Team": "${game_info.team1} or ${game_info.team2}",
                "Winning Reason": "Your explanation here"
            }
            The team names must exactly match what was provided. No other format will be accepted.`,
            team1: team1Stats,
            team2: team2Stats
        };

        client.subscribe('deepseek/response');
        client.on('message', messageHandler);
        client.publish('deepseek/request', JSON.stringify(message));
    });
};

const getGameWinner = async (game_info, team1Stats, team2Stats) => {
    let attempt = 1;
    while (attempt <= MAX_RETRIES) {
        try {
            const message = await requestAIResponse(game_info, team1Stats, team2Stats, attempt);
            const data = JSON.parse(message.toString());
            const validatedResult = validateAIResponse(data, game_info);
            console.log(`Successfully validated game winner on attempt ${attempt}`);
            return [validatedResult.winningTeam, validatedResult.losingTeam, validatedResult.winningReason];
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            if (attempt === MAX_RETRIES) {
                throw new Error(`Failed to get valid AI response after ${MAX_RETRIES} attempts`);
            }
            attempt++;
        }
    }
};
