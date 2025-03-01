import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'flutter_tournament_bracket/lib/flutter_tournament_bracket.dart';
import 'models/team.dart';
import 'widgets/bracket_widget.dart';
import 'widgets/match_prediction_panel.dart';
import 'widgets/top_bottom_teams_panel.dart';
//import 'widgets/tournament_bracket.dart';



// I think this will need to be a future?? It will be change and is filled by the backend. 
final List<Tournament> _tournaments = [
  Tournament(matches: [
    TournamentMatch(
      id: "3",
      teamB: Team(name: "Juventus", seed: '1', region: "Europe"),
      teamA: Team(name: "Juventus", seed: '1', region: "Europe"),
      scoreTeamA: "0",
      scoreTeamB: "2",
    ),

    TournamentMatch(
      id: "3",
      teamA: Team(name: "Juventus", seed: '1', region: "Europe"),
      teamB: Team(name: "Juventus", seed: '1', region: "Europe"),
      scoreTeamA: "0",
      scoreTeamB: "2",
    ),

    TournamentMatch(
      id: "3",
      teamB: Team(name: "Juventus", seed: '1', region: "Europe"),
      teamA: Team(name: "Juventus", seed: '1', region: "Europe"),
      scoreTeamA: "0",
      scoreTeamB: "2",
    ),

    TournamentMatch(
      id: "3",
      teamA: Team(name: "Juventus", seed: '1', region: "Europe"),
      teamB: Team(name: "Juventus", seed: '1', region: "Europe"),
      scoreTeamA: "0",
      scoreTeamB: "2",
    ),
  ]),
  Tournament(matches: [
    TournamentMatch(
      id: "3",
      teamA: Team(name: "Juventus", seed: '1', region: "Europe"),
      teamB: Team(name: "Juventus", seed: '1', region: "Europe"),
      scoreTeamA: "0",
      scoreTeamB: "2",
      ),
      TournamentMatch(
        id: "3",
        teamB: Team(name: "Juventus", seed: '1', region: "Europe"),
        teamA: Team(name: "Juventus", seed: '1', region: "Europe"),
        scoreTeamA: "0",
        scoreTeamB: "2",
      ),
    ]
  ),
  Tournament(matches: [
    TournamentMatch(
      id: "3",
      teamA: Team(name: "Juventus", seed: '1', region: "Europe"),
      teamB: Team(name: "Juventus", seed: '1', region: "Europe"),
      scoreTeamA: "0",
      scoreTeamB: "2",
      )
    ]),

];





class HomePage extends ConsumerWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    
    // Placeholder data for top and bottom teams 
    //These will be changed by the actual data from what the user selects in the dropdown menu that is filled with team names.
    // The positioning of the teams will dictate how much of a weight they have added to their score in in the calculation. 
    
    final topTeams = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'];
    final bottomTeams = ['Team V', 'Team W', 'Team X', 'Team Y', 'Team Z'];

    return Scaffold(
      
      appBar: AppBar(
        centerTitle: false,
        title: const Text('March Madness')),
      body: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left Panel
          SizedBox(
            width: 150, // TODO: might want to change this to a more flexible value for smaller screens
            child: SingleChildScrollView(
              child: Column(
                children: [
                  const MatchPredictionPanel(),
                  const SizedBox(height: 16),
                  TopBottomTeamsPanel(topTeams: topTeams, bottomTeams: bottomTeams),
                ],
              ),
            ),
          ),

          // Bracket (Right Panel)
          Expanded(child: TournamentBracket(
            list: _tournaments,
            card: (item) => customMatchCard(item),
            itemsMarginVertical: 20.0,
            cardWidth: 130.0,
            cardHeight: 72,
            lineWidth: 80,
            lineThickness: 5,
            lineBorderRadius: 12,
            lineColor: Colors.green,
          ),),
        ],
      ),
    );
  }


    /// Custom widget to display match details.
  Container customMatchCard(TournamentMatch item) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      decoration: BoxDecoration(color: Colors.blue, borderRadius: BorderRadius.circular(12)),
      // Using IntrinsicWidth to let the card shrink wrap its content.
      child: IntrinsicWidth(
        child: Column(
          mainAxisSize: MainAxisSize.min, // Shrink to fit the content
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            // Display teamA's details in a row that only takes as much space as needed
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(width: 4),
                Text(
                  item.teamA?.seed ?? "0",
                  style: const TextStyle(fontSize: 16, color: Colors.black),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(width: 4), // Reduced gap here
                Text(
                  item.teamA?.name ?? "No Info",
                  style: const TextStyle(fontSize: 16, color: Colors.black),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
            const SizedBox(height: 4),
            // Display teamB's details in a similar way
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(width: 4),
                Text(
                  item.teamB?.seed ?? "0",
                  style: const TextStyle(fontSize: 16, color: Colors.black),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(width: 4),
                Text(
                  item.teamB?.name ?? "No Info",
                  style: const TextStyle(fontSize: 16, color: Colors.black),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
            const SizedBox(height: 4),
          ],
        ),
      ),
    );
  }





}




