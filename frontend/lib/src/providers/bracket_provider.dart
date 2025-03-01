import 'package:flutter_riverpod/flutter_riverpod.dart';
//import 'dart:math';
import '../models/matchup.dart';
import 'package:frontend/src/models/team.dart';


class BracketNotifier extends StateNotifier<List<Matchup>> {
  BracketNotifier() : super([]);


  /// Initializes the bracket with placeholder matchups for a single-elimination tournament.
  /// For a given [numberOfTeams], there will be (numberOfTeams - 1) matchups.
  void initializeBracket(int numberOfTeams) {
    final int numberOfMatchups = numberOfTeams - 1;
    final placeholderTeam = Team(name: 'TBD', seed: '0', region: 'TBD');

    // Generate placeholder matchups.
    List<Matchup> matchups = List.generate(numberOfMatchups, (index) {
      return Matchup(team1: placeholderTeam, team2: placeholderTeam, preview: 'Coming soon');
    });

    state = matchups;
  }
}

final bracketProvider = StateNotifierProvider<BracketNotifier, List<Matchup>>((ref) {
  return BracketNotifier();
});
