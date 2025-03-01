import 'package:frontend/models/team.dart';

class Matchup {
  final Team team1;
  final Team team2;
  final String preview;
  final String? scoreTeam1;
  final String? scoreTeam2;
  


  Matchup({required this.team1, required this.team2, required this.preview, this.scoreTeam1, this.scoreTeam2});
}

