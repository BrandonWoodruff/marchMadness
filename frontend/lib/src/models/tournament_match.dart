// TODO Implement this library.import 'team.dart';


import 'package:frontend/src/models/team.dart';

/// A class representing a match in a tournament.
///
/// The [TournamentMatch] class contains information about a single match,
/// including the teams involved, the date of the match, and the scores.
class TournamentMatch {
  /// Creates a [TournamentMatch] instance.
  ///
  /// The [id] parameter must not be null.
  TournamentMatch({required this.id, this.teamA, this.teamB, this.matchDate, this.scoreTeamA, this.scoreTeamB});

  /// The unique identifier for the match.
  final String id;

  /// The name of team A.
  final Team? teamA;

  /// The name of team B.
  final Team? teamB;

  /// The date and time when the match is scheduled to occur.
  final DateTime? matchDate;

  /// The score of team A.
  final String? scoreTeamA;

  /// The score of team B.
  final String? scoreTeamB;


  factory TournamentMatch.fromJson(Map<String, dynamic> json) {
    // Implement the JSON parsing logic here
    return TournamentMatch(
      id: json['id'], 
      teamA: json['teamA'] != null ? Team.fromJson(json['teamA']) : null,
      teamB: json['teamB'] != null ? Team.fromJson(json['teamB']) : null,
      matchDate: json['matchDate'] != null ? DateTime.parse(json['matchDate']) : null,
      scoreTeamA: json['scoreTeamA'],
      scoreTeamB: json['scoreTeamB'],
    );
  }
      // Initialize fields from the JSON data
    //);

}
