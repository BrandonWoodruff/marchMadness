// TODO Implement this library.import 'tournament_match.dart';

import '../widgets/flutter_tournament_bracket.dart';

/// A class representing a tournament.
///
/// The [Tournament] class contains a list of matches that are part of the tournament.
class Tournament {
  /// Creates a [Tournament] instance.
  ///
  /// The [matches] parameter must not be null.
  Tournament({required this.matches});

  factory Tournament.fromJson(Map<String, dynamic> json) {
    // Implement the JSON parsing logic here
    return Tournament(
      matches: (json['matches'] as List)
          .map((match) => TournamentMatch.fromJson(match))
          .toList(),
    );
  } 

      // Initialize fields from the JSON data
  //   );
  // }

  /// A list of matches in the tournament.
  final List<TournamentMatch> matches;
}
