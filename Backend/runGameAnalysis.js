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
            team1Seed: data.team1,  // Changed from data.team1Seed
            team2Seed: data.team2,  // Changed from data.team2Seed
            round: data.round,
            team1Region: data.team1Region,
            team2Region: data.team2Region,
            gameNumber: data.gameNumber,
            year: data.year,
            id: data.round + data.region + data.gameNumber,
            team1Preference: data.team1Preference || null,
            team2Preference: data.team2Preference || null
        }

        // Validate required fields
        if (!game_info.team1Seed || !game_info.team2Seed) {
            console.error('Missing required team information');
            return;
        }

        // Move preference check after game_info is created
        if (game_info.team1Preference || game_info.team2Preference) {
            if (game_info.team1Preference === 'Positive') {
                game_info.team1Preference = 'I have a positive preference for this team. Add a positive preference for this team, and have them win if it makes sense.';
            } else if (game_info.team1Preference === 'Negative') {
                game_info.team1Preference = 'I have a negative preference for this team. Add a negative preference for this team, and have them lose if it makes sense.';
            }
            
            if (game_info.team2Preference === 'Positive') {
                game_info.team2Preference = 'I have a positive preference for this team. Add a positive preference for this team, and have them win if it makes sense.';
            } else if (game_info.team2Preference === 'Negative') {
                game_info.team2Preference = 'I have a negative preference for this team. Add a negative preference for this team, and have them lose if it makes sense.';
            }
        }

        // Validate round
        if (!Object.values(TournamentRound).includes(game_info.round)) {
            console.error('Invalid tournament round');
            return;
        }

        console.log('Processing game info:', game_info);
        
        try {
            let team1Stats = await getTeamStats(game_info.team1Seed, game_info.year, game_info.team1Region);
            let team2Stats = await getTeamStats(game_info.team2Seed, game_info.year, game_info.team2Region);
            console.log(`Team 1 Stats for ${game_info.year}:`, team1Stats);
            console.log(`Team 2 Stats for ${game_info.year}:`, team2Stats);

            if (!team1Stats.TeamName || !team2Stats.TeamName) {
                throw new Error('Missing team information in stats');
            }

            // Update game_info with actual team names
            game_info.team1 = team1Stats.TeamName;
            game_info.team2 = team2Stats.TeamName;

            let winningTeam, losingTeam, winningReason, winPercentage;

            // Fix the preference check to use game_info properties
            const ruleResult = (!game_info.team1Preference && !game_info.team2Preference) 
                ? checkSeedRules(team1Stats, team2Stats, game_info)
                : null;

            if (ruleResult) {
                ({winningTeam, losingTeam, winningReason} = ruleResult);
                winPercentage = 100; // Always 100% for seed rules
            } else {
                const result = await getGameWinner(game_info, team1Stats, team2Stats);
                [winningTeam, losingTeam, winningReason, winPercentage] = result;
            }

            console.log(`Winner: ${winningTeam}, Loser: ${losingTeam}, Win%: ${winPercentage}%, Reason: ${winningReason}`);
            client.publish('matchup/response', JSON.stringify({
                team1: game_info.team1,
                team2: game_info.team2,
                winner: winningTeam,
                loser: losingTeam,
                reason: winningReason,
                winPercentage: winPercentage
            }));

        } catch (error) {
            console.error('Error processing game:', error);
            return;
        }
    }
});

client.on('error', (error) => {
    console.error('Error:', error);
});

const getTeamStats = (team, year, region) => {
    return new Promise((resolve, reject) => {
        console.log(`Requesting stats for ${team} (${year})`);
        const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for team stats'));
        }, 5000);

        const messageHandler = (topic, message) => {
            console.log(`Received message on topic: ${topic}`);
            if (topic === `data/${region}/${year}/${team}`) {
                clearTimeout(timeout);
                client.removeListener('message', messageHandler);
                client.unsubscribe(`data/${region}/${year}/${team}`);
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

        client.subscribe(`data/${region}/${year}/${team}`);
        client.on('message', messageHandler);
        client.publish(`get/${region}/${year}/${team}`, '');
    });
};

const validateAIResponse = (data, game_info) => {
    // Check if all required fields exist
    const requiredFields = ['Winning Team', 'Losing Team', 'Winning Reason', 'Win Percentage'];
    const hasAllFields = requiredFields.every(field => {
        if (field === 'Win Percentage') {
            return typeof data[field] === 'number' && 
                   data[field] >= 0 && 
                   data[field] <= 100;
        }
        return typeof data[field] === 'string' && data[field].trim() !== '';
    });
    
    if (!hasAllFields) {
        throw new Error('AI response missing required fields, contains empty values, or invalid win percentage');
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
        winningReason: data['Winning Reason'],
        winPercentage: data['Win Percentage']
    };
};

const MAX_RETRIES = 3;

const requestAIResponse = async (game_info, team1Stats, team2Stats, attempt = 1) => {
    return new Promise((resolve, reject) => {
        console.log(`Requesting game winner (attempt ${attempt}/${MAX_RETRIES}) for ${game_info.team1} vs ${game_info.team2}`);
        const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for game winner'));
        }, 30000); // Increased timeout to 30 seconds

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
            ${game_info.team1Preference ? `Note for ${game_info.team1}: ${game_info.team1Preference}` : ''}
            ${game_info.team2Preference ? `Note for ${game_info.team2}: ${game_info.team2Preference}` : ''}
            Your response MUST be a JSON object with EXACTLY these four fields:
            {
                "Winning Team": "${game_info.team1} or ${game_info.team2}",
                "Losing Team": "${game_info.team1} or ${game_info.team2}",
                "Winning Reason": "Your explanation here",
                "Win Percentage": number between 0 and 100
            }
            The team names must exactly match what was provided. Win Percentage must be a number. No other format will be accepted.`,
            team1: team1Stats,
            team2: team2Stats
        };

        client.subscribe('deepseek/response');
        client.on('message', messageHandler);
        client.publish('deepseek/request', JSON.stringify(message));
    });
};

// Add this new function
const extractJsonFromResponse = (response) => {
    try {
        const parsed = JSON.parse(response);
        if (parsed.content) {
            // Extract JSON from markdown code block
            const match = parsed.content.match(/```json\n([\s\S]*?)\n```/);
            if (match && match[1]) {
                return JSON.parse(match[1]);
            }
        }
        return parsed; // fallback to original parse if no markdown wrapper
    } catch (error) {
        console.error('Error extracting JSON from response:', error);
        console.debug('Raw response:', response);
        throw error;
    }
};

const calculateUpset = (validatedResult) => {
    const roll = Math.floor(Math.random() * 100) + 1; // 1-100
    console.log(`Win Percentage: ${validatedResult.winPercentage}%, Rolled: ${roll}`);
    
    if (roll > validatedResult.winPercentage) {
        // Upset occurs
        return {
            winningTeam: validatedResult.losingTeam,
            losingTeam: validatedResult.winningTeam,
            winningReason: `UPSET! ${validatedResult.losingTeam} defied the ${validatedResult.winPercentage}% odds against them!`,
            winPercentage: 100 - validatedResult.winPercentage // Invert the win percentage for upsets
        };
    }
    
    return validatedResult;
};

const getGameWinner = async (game_info, team1Stats, team2Stats) => {
    let attempt = 1;
    while (attempt <= MAX_RETRIES) {
        try {
            const message = await requestAIResponse(game_info, team1Stats, team2Stats, attempt);
            console.debug('Raw AI response:', message.toString()); // Add debug logging
            const rawData = extractJsonFromResponse(message.toString());
            const validatedResult = validateAIResponse(rawData, game_info);
            console.log(`Successfully validated game winner on attempt ${attempt}`);
            
            // Calculate potential upset
            const finalResult = calculateUpset(validatedResult);
            return [
                finalResult.winningTeam, 
                finalResult.losingTeam, 
                finalResult.winningReason,
                finalResult.winPercentage // Add win percentage to return array
            ];
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            if (attempt === MAX_RETRIES) {
                throw new Error(`Failed to get valid AI response after ${MAX_RETRIES} attempts`);
            }
            attempt++;
        }
    }
};
