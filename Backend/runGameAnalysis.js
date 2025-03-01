import mqtt from 'mqtt';

// MQTT client setup
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('bracket/request');
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
    if (topic === 'bracket/request') {
        const data = JSON.parse(message.toString());
        console.log('Received bracket request:', data);

        // Collect all data for that year
        const bracket_info = {
            year: data.year
        }


                
        // Create a tournament bracket object for the ai to fill out
        // order is 1 = east, 2 = west, 3 = south, 4 = midwest
        const bracket = {
            year: data.year,
            round1: {
                name: TournamentRound.FIRST_ROUND,
                matchups: [
                    {
                        team1: `East/${data.year}/1`,
                        team2: `East/${data.year}/16`
                    },
                    {
                        team1: `East/${data.year}/8`,
                        team2: `East/${data.year}/9`
                    },
                    {
                        team1: `East/${data.year}/5`,
                        team2: `East/${data.year}/12`
                    },
                    {
                        team1: `East/${data.year}/4`,
                        team2: `East/${data.year}/13`
                    },
                    {
                        team1: `East/${data.year}/6`,
                        team2: `East/${data.year}/11`
                    },
                    {
                        team1: `East/${data.year}/3`,
                        team2: `East/${data.year}/14`
                    },
                    {
                        team1: `East/${data.year}/7`,
                        team2: `East/${data.year}/10`
                    },
                    {
                        team1: `East/${data.year}/2`,
                        team2: `East/${data.year}/15`
                    },
                    {
                        team1: `West/${data.year}/1`,
                        team2: `West/${data.year}/16`
                    },
                    {
                        team1: `West/${data.year}/8`,
                        team2: `West/${data.year}/9`
                    },
                    {
                        team1: `West/${data.year}/5`,
                        team2: `West/${data.year}/12`
                    },
                    {
                        team1: `West/${data.year}/4`,
                        team2: `West/${data.year}/13`
                    },
                    {
                        team1: `West/${data.year}/6`,
                        team2: `West/${data.year}/11`
                    },
                    {
                        team1: `West/${data.year}/3`,
                        team2: `West/${data.year}/14`
                    },
                    {
                        team1: `West/${data.year}/7`,
                        team2: `West/${data.year}/10`
                    },
                    {
                        team1: `West/${data.year}/2`,
                        team2: `West/${data.year}/15`
                    },
                    {
                        team1: `South/${data.year}/1`,
                        team2: `South/${data.year}/16`
                    },
                    {
                        team1: `South/${data.year}/8`,
                        team2: `South/${data.year}/9`
                    },
                    {
                        team1: `South/${data.year}/5`,
                        team2: `South/${data.year}/12`
                    },
                    {
                        team1: `South/${data.year}/4`,
                        team2: `South/${data.year}/13`
                    },
                    {
                        team1: `South/${data.year}/6`,
                        team2: `South/${data.year}/11`
                    },
                    {
                        team1: `South/${data.year}/3`,
                        team2: `South/${data.year}/14`
                    },
                    {
                        team1: `South/${data.year}/7`,
                        team2: `South/${data.year}/10`
                    },
                    {
                        team1: `South/${data.year}/2`,
                        team2: `South/${data.year}/15`
                    },
                    {
                        team1: `Midwest/${data.year}/1`,
                        team2: `Midwest/${data.year}/16`
                    },
                    {
                        team1: `Midwest/${data.year}/8`,
                        team2: `Midwest/${data.year}/9`
                    },
                    {
                        team1: `Midwest/${data.year}/5`,
                        team2: `Midwest/${data.year}/12`
                    },
                    {
                        team1: `Midwest/${data.year}/4`,
                        team2: `Midwest/${data.year}/13`
                    },
                    {
                        team1: `Midwest/${data.year}/6`,
                        team2: `Midwest/${data.year}/11`
                    },
                    {
                        team1: `Midwest/${data.year}/3`,
                        team2: `Midwest/${data.year}/14`
                    },
                    {
                        team1: `Midwest/${data.year}/7`,
                        team2: `Midwest/${data.year}/10`
                    },
                    {
                        team1: `Midwest/${data.year}/2`,
                        team2: `Midwest/${data.year}/15`
                    }
                ]
            },
            round2: {
                name: TournamentRound.SECOND_ROUND,
                matchups: [
                    {
                        team1: 'Winner of round1 match1',
                        team2: 'Winner of round1 match2'
                    },
                    {
                        team1: 'Winner of round1 match3',
                        team2: 'Winner of round1 match4'
                    },
                    {
                        team1: 'Winner of round1 match5',
                        team2: 'Winner of round1 match6'
                    },
                    {
                        team1: 'Winner of round1 match7',
                        team2: 'Winner of round1 match8'
                    },
                    {
                        team1: 'Winner of round1 match9',
                        team2: 'Winner of round1 match10'
                    },
                    {
                        team1: 'Winner of round1 match11',
                        team2: 'Winner of round1 match12'
                    },
                    {
                        team1: 'Winner of round1 match13',
                        team2: 'Winner of round1 match14'
                    },
                    {
                        team1: 'Winner of round1 match15',
                        team2: 'Winner of round1 match16'
                    },
                    {
                        team1: 'Winner of round1 match17',
                        team2: 'Winner of round1 match18'
                    },
                    {
                        team1: 'Winner of round1 match19',
                        team2: 'Winner of round1 match20'
                    },
                    {
                        team1: 'Winner of round1 match21',
                        team2: 'Winner of round1 match22'
                    },
                    {
                        team1: 'Winner of round1 match23',
                        team2: 'Winner of round1 match24'
                    },
                    {
                        team1: 'Winner of round1 match25',
                        team2: 'Winner of round1 match26'
                    },
                    {
                        team1: 'Winner of round1 match27',
                        team2: 'Winner of round1 match28'
                    },
                    {
                        team1: 'Winner of round1 match29',
                        team2: 'Winner of round1 match30'
                    },
                    {
                        team1: 'Winner of round1 match31',
                        team2: 'Winner of round1 match32'
                    }
                ]
            },
            round3: {
                name: TournamentRound.SWEET_16,
                matchups: [
                    {
                        team1: 'Winner of round2 match1',
                        team2: 'Winner of round2 match2'
                    },
                    {
                        team1: 'Winner of round2 match3',
                        team2: 'Winner of round2 match4'
                    },
                    {
                        team1: 'Winner of round2 match5',
                        team2: 'Winner of round2 match6'
                    },
                    {
                        team1: 'Winner of round2 match7',
                        team2: 'Winner of round2 match8'
                    },
                    {
                        team1: 'Winner of round2 match9',
                        team2: 'Winner of round2 match10'
                    },
                    {
                        team1: 'Winner of round2 match11',
                        team2: 'Winner of round2 match12'
                    },
                    {
                        team1: 'Winner of round2 match13',
                        team2: 'Winner of round2 match14'
                    },
                    {
                        team1: 'Winner of round2 match15',
                        team2: 'Winner of round2 match16'
                    }
                ]
            },
            round4: {
                name: TournamentRound.ELITE_EIGHT,
                matchups: [
                    {
                        team1: 'Winner of round3 match1',
                        team2: 'Winner of round3 match2'
                    },
                    {
                        team1: 'Winner of round3 match3',
                        team2: 'Winner of round3 match4'
                    },
                    {
                        team1: 'Winner of round3 match5',
                        team2: 'Winner of round3 match6'
                    },
                    {
                        team1: 'Winner of round3 match7',
                        team2: 'Winner of round3 match8'
                    }
                ]
            },
            round5: {
                name: TournamentRound.FINAL_FOUR,
                matchups: [
                    {
                        team1: 'Winner of round4 match1',
                        team2: 'Winner of round4 match2'
                    },
                    {
                        team1: 'Winner of round4 match3',
                        team2: 'Winner of round4 match4'
                    }
                ]
            },
            round6: {
                name: TournamentRound.CHAMPIONSHIP,
                matchups: [
                    {
                        team1: 'Winner of round5 match1',
                        team2: 'Winner of round5 match2'
                    }
                ]
            }
        };
        
        try {

            //Get the team stats for each team
            for (let i = 0; i < bracket.round1.matchups.length; i++) {
                let team1Stats = await getTeamStats(bracket.round1.matchups[i].team1, data.year);
                let team2Stats = await getTeamStats(bracket.round1.matchups[i].team2, data.year);
                console.log(`Team 1 Stats for ${bracket.year}:`, team1Stats);
                console.log(`Team 2 Stats for ${bracket.year}:`, team2Stats);

                // Update the bracket object with the stats
                bracket.round1.matchups[i].team1Stats = team1Stats;
                bracket.round1.matchups[i].team2Stats = team2Stats;
            }

            // Request AI response
            let aiResponse = await requestAIResponse(bracket);
            let bracketData = extractJsonFromResponse(aiResponse);
            // console.log('Bracket data:', bracketData);
            let validatedBracketData = validateAIResponse(bracketData, bracket);
            console.log('Validated bracket data:', validatedBracketData);
            // publish the bracket data back to user
            client.publish('bracket/response', JSON.stringify(validatedBracketData));


        } catch (error) {
            console.error('Error processing game:', error);
            return;
        }
    }
});

client.on('error', (error) => {
    console.error('Error:', error);
});

const getTeamStats = (team, year) => {
    return new Promise((resolve, reject) => {
        console.log(`Requesting stats for ${team}`);
        const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for team stats'));
        }, 5000);

        const messageHandler = (topic, message) => {
            console.log(`Received message on topic: ${topic}`);
            if (topic === `data/${team}`) {
                clearTimeout(timeout);
                client.removeListener('message', messageHandler);
                client.unsubscribe(`data/${team}`);
                try {
                    const data = JSON.parse(message.toString());
                    if (data === null) {
                        console.log(`No stats found for ${team} (${year})`);
                        resolve({}); // Return empty object instead of null
                    } else {
                        // Log full data structure for debugging
                        console.log(`Successfully retrieved stats for ${team} (${year}):`);
                        console.log(`Stats keys: ${Object.keys(data).join(', ')}`);
                        console.log(`Team name: ${data.team_name || 'undefined'}`);
                        console.log(`Stats complete: ${data.team_name && data.seed ? 'Yes' : 'No'}`);
                        resolve(data);
                    }
                } catch (error) {
                    console.error(`Error parsing stats for ${team}:`, error);
                    reject(error);
                }
            }
        };

        client.subscribe(`data/${team}`);
        client.on('message', messageHandler);
        client.publish(`get/${team}`, '');
    });
};

const validateAIResponse = (data, bracket_info) => {
    // Check if data is a valid object
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format: not a valid JSON object');
    }
    
    // Initialize validated result
    const validatedResult = {};
    
    // Check each round
    for (const round in data) {
        if (!data[round] || typeof data[round] !== 'object') {
            throw new Error(`Invalid format for round ${round}`);
        }
        
        validatedResult[round] = { matchups: {} };
        
        // Check each matchup in the round
        for (const matchup in data[round].matchups) {
            const match = data[round].matchups[matchup];
            
            // Validate required fields
            if (!match || typeof match !== 'object') {
                throw new Error(`Invalid format for ${round} ${matchup}`);
            }
            
            if (!match["Winning Team"] || typeof match["Winning Team"] !== 'string') {
                throw new Error(`Missing or invalid Winning Team for ${round} ${matchup}`);
            }
            
            if (!match["Losing Team"] || typeof match["Losing Team"] !== 'string') {
                throw new Error(`Missing or invalid Losing Team for ${round} ${matchup}`);
            }
            
            if (!match["Winning Reason"] || typeof match["Winning Reason"] !== 'string') {
                throw new Error(`Missing or invalid Winning Reason for ${round} ${matchup}`);
            }
            
            // Check win percentage is a number between 0 and 100
            if (match["Win Percentage"] === undefined || 
                typeof match["Win Percentage"] !== 'number' || 
                match["Win Percentage"] < 0 || 
                match["Win Percentage"] > 100) {
                throw new Error(`Invalid Win Percentage for ${round} ${matchup} - must be a number between 0 and 100`);
            }
            
            // Store validated matchup
            validatedResult[round].matchups[matchup] = {
                "Winning Team": match["Winning Team"],
                "Losing Team": match["Losing Team"],
                "Winning Reason": match["Winning Reason"],
                "Win Percentage": match["Win Percentage"]
            };
        }
    }
    
    return validatedResult;
};

const MAX_RETRIES = 3;

// Format bracket for AI consumption
const formatBracketForAI = (bracket) => {
    let formattedBracket = '';
    
    // Format each round
    for (let roundNum = 1; roundNum <= 6; roundNum++) {
        const roundKey = `round${roundNum}`;
        if (bracket[roundKey]) {
            formattedBracket += `\n${bracket[roundKey].name}:\n`;
            
            // Format each matchup in the round
            bracket[roundKey].matchups.forEach((matchup, index) => {
                let team1 = matchup.team1;
                let team2 = matchup.team2;
                
                // Extract seed and team name for first round
                if (roundNum === 1) {
                    // Format: "Region/Year/Seed" -> "#Seed TeamName"
                    if (matchup.team1Stats && matchup.team1Stats.team_name) {
                        const seed1 = team1.split('/')[2]; // Extract seed from path
                        team1 = `#${seed1} ${matchup.team1Stats.team_name}`;
                    }
                    
                    if (matchup.team2Stats && matchup.team2Stats.team_name) {
                        const seed2 = team2.split('/')[2]; // Extract seed from path
                        team2 = `#${seed2} ${matchup.team2Stats.team_name}`;
                    }
                }
                
                formattedBracket += `- Matchup ${index + 1}: ${team1} vs ${team2}\n`;
            });
        }
    }
    
    return formattedBracket;
};

const requestAIResponse = async (bracket, attempt = 1) => {
    return new Promise((resolve, reject) => {
        console.log(`Requesting bracket (attempt ${attempt}/${MAX_RETRIES})`);
        const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for Bracket AI response'));
        }, 60000); // Increased timeout to 60 seconds

        const messageHandler = (topic, message) => {
            if (topic === 'chatgpt/response') {
                clearTimeout(timeout);
                client.removeListener('message', messageHandler);
                client.unsubscribe('chatgpt/response');
                resolve(message);
            }
        };

        // Format seed rules for the AI
        let seedRulesInfo = "Historical Seed Performance Rules:\n";
        for (const [seed, rule] of Object.entries(seedRules)) {
            seedRulesInfo += `- #${seed} Seeds: ${rule.message} (Maximum round: ${rule.maxRound})\n`;
        }
        
        // Create tournament round information
        let roundInfo = "Tournament Rounds in Order:\n";
        roundOrder.forEach((round, index) => {
            roundInfo += `${index + 1}. ${round}\n`;
        });
        
        // Format the bracket for AI consumption
        const formattedBracket = formatBracketForAI(bracket);

        // Create a JSON structure template
        const jsonTemplate = {
            "round1": {
                "matchups": {
                    "match1": {
                        "Winning Team": "Team Name",
                        "Losing Team": "Team Name",
                        "Winning Reason": "Explanation",
                        "Win Percentage": 75
                    }
                    // Add more matchups as needed
                }
            }
            // Similar structure for other rounds
        };

        const message = {
            prompt: `Attempt ${attempt}/${MAX_RETRIES}: You MUST respond with ONLY a valid JSON object for a March Madness bracket for ${bracket.year}.

CRITICAL: Your entire response must be a valid, parseable JSON object with no additional text, explanations, or markdown. 

The JSON must follow this exact structure (with actual team names and data):
\`\`\`json
{
  "round1": {
    "matchups": {
      "match1": {
        "Winning Team": "Exact team name as provided",
        "Losing Team": "Exact team name as provided",
        "Winning Reason": "Brief explanation",
        "Win Percentage": 75
      },
      "match2": { ... and so on for all matches ... }
    }
  },
  "round2": {
    "matchups": { ... similar structure ... }
  }
  ... continue for all 6 rounds ...
}
\`\`\`

${seedRulesInfo}
${roundInfo}

Use these historical seed performance rules when making predictions.

BRACKET STRUCTURE TO FILL OUT:
${formattedBracket}

DO NOT include any explanatory text outside the JSON structure. The JSON must be the ONLY content of your response.`,
            id: "bracket-" + Date.now()
        };

        client.subscribe('chatgpt/response');
        client.on('message', messageHandler);
        client.publish('chatgpt/request', JSON.stringify(message));
    });
};

const extractJsonFromResponse = (response) => {
    try {
        const parsed = JSON.parse(response);
        if (parsed.content) {
            // First try to find JSON object in the content
            try {
                const jsonStart = parsed.content.indexOf('{');
                const jsonEnd = parsed.content.lastIndexOf('}');
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    const jsonString = parsed.content.substring(jsonStart, jsonEnd + 1);
                    return JSON.parse(jsonString);
                }
                
                // Try extracting JSON from markdown code block
                const match = parsed.content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                if (match && match[1]) {
                    return JSON.parse(match[1]);
                }
            } catch (innerError) {
                console.error('Error parsing JSON content:', innerError);
                throw new Error('Could not extract valid JSON from response');
            }
        }
        return parsed; // fallback to original parse if no content field
    } catch (error) {
        console.error('Error extracting JSON from response:', error);
        console.debug('Raw response:', response.toString().substring(0, 500) + '...');
        throw error;
    }
};


